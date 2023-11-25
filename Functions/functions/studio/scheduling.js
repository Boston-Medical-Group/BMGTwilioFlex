const moment = require('moment-timezone');
const axios = require('axios');
const _ = require('lodash');

/*
read sync document for downtime manager configuration created by plugin
*/
const fetchTeamSchedule = async (ctx, client, event) => {
    return fetchCountryConfig(ctx, event.country)
        .then(async ({ data }) => {
            const jsonResponse = buildJsonResponse(data);

            const queue = await getQueue(ctx, client, event.queue);
            buildPartialDays(jsonResponse, data, queue);
            buildWeeklyTimings(jsonResponse, data, queue);
            buildHolidays(jsonResponse, data);

            return jsonResponse
        }).catch((error) => {
            console.log(error);
            return null;
        });
}

const getQueue = async (ctx, client, queue) => {
    if (_.isEmpty(queue)) {
        queue = '_all';
    }

    if (!_.startsWith('WQ', queue)) {
        await client.taskrouter.v1.workspaces(ctx.TASK_ROUTER_WORKSPACE_SID)
            .taskQueues
            .list({ FriendlyName: queue })
            .then(taskQueues => {
                taskQueues.every(t => {
                    if (t.friendlyName === queue) {
                        queue = t.sid;
                        return false;
                    }

                    return true;
                })
            })
            .catch(() => {
                queue = '_all'
            });
    }

    return queue;
}

const fetchCountryConfig = (context, country) => {
    let url = `${context.FLEXMANAGER_API_URL}/countries/${country}?include=partialDays,regularHours,holidays`;
    console.log(url);
    return axios({
        method: 'get',
        url,
        headers: {
            'Authorization': `Bearer ${context.FLEXMANAGER_API_KEY}`,
            'Content-Type': 'application/vnd.api+json'
        }
    });
}

const buildJsonResponse = (data) => {
    return {
        generalSettings: {
            timezone: data.data.attributes.timezone
        },
        partialDays: {},
        emergencySettings: {
            emergencyShutdown: data.data.attributes.emergencyShutdown == '1' ? true : false,
            emergencyShutdownMessage: data.data.attributes.emergencyShutdownMessage || ''
        },
        regularHours: {
            weeklyTimings: {},
            offlineMessage: data.data.attributes.offlineMessage || ''
        },
        holidays: {}
    }
}

const buildPartialDays = (jr, data, queue) => {
    const included = data.included || [];
    const includedPartialDays = _.filter(included, i => i.type === 'partial-days' && i.attributes.queue === queue);

    _.forEach(includedPartialDays, (element) => {
        let d = moment.tz(element.attributes.date, "YYYY-MM-DD", jr.generalSettings.timezone)
        let b = moment.tz(`${element.attributes.date} ${element.attributes.begin}`, 'YYYY-MM-DD HH:mm:ss', jr.generalSettings.timezone);
        let e = moment.tz(`${element.attributes.date} ${element.attributes.end}`, 'YYYY-MM-DD HH:mm:ss', jr.generalSettings.timezone)
        jr.partialDays[d.format('MM-DD-YYYY')] = {
            end: e.format('HH:mm'),
            begin: b.format('HH:mm'),
            offlineMessage: element.attributes.offlineMessage,
            description: element.attributes.description
        }
    })
}

const buildWeeklyTimings = (jr, data, queue) => {
    const included = data.included || [];
    const includedRegularHours = _.filter(included, i => i.type === 'regular-hours' && i.attributes.queue === queue);

    _.forEach(includedRegularHours, (element) => {
        if (jr.regularHours.weeklyTimings[element.attributes.day] === undefined) {
            jr.regularHours.weeklyTimings[element.attributes.day] = []
        }

        let b = moment.tz(element.attributes.begin, 'HH:mm:ss', jr.generalSettings.timezone);
        let e = moment.tz(element.attributes.end, 'HH:mm:ss', jr.generalSettings.timezone);
        jr.regularHours.weeklyTimings[element.attributes.day].push({
            begin: b.format('HH:mm'),
            end: e.format('HH:mm')
        });
    })
}

const buildHolidays = (jr, data) => {
    const included = data.included || [];
    const includedHolidays = _.filter(included, i => i.type === 'holidays');

    _.forEach(includedHolidays, (element) => {
        let d = moment.tz(element.attributes.date, 'YYYY-MM-DD', jr.generalSettings.timezone).format('MM/DD/YYYY');
        jr.holidays[d] = {
            offlineMessage: element.attributes.offlineMessage,
            description: element.attributes.description
        }
    })
}

const getCurrentTimeDetails = (timezone) => {
    const currentTimeZone = timezone || moment.tz.guess();
    const ccTime =  moment(moment.tz(currentTimeZone).format('MM-DD-YYYY kk:mm'),'MM-DD-YYYY kk:mm');
    
    const ccFormattedDay = ccTime.format("MM/DD/YYYY");
    const ccDayOfWeek = ccTime.format("dddd");
    return {ccTime,ccFormattedDay,ccDayOfWeek}
}


/*
check if supplied moment object lies within range of supplied time stamps in format(HH:mm)
*/

const checkIfTimeInRange = (currentTime, begin, end) => {
    if ( currentTime == null || begin == null || end == null ) {
       return false;
    }
    
    try {
        const dayConfigStart =   moment(`${currentTime.format("MM-DD-YYYY")} ${begin}`,'MM-DD-YYYY kk:mm')
        const dayConfigEnd =   moment(`${currentTime.format("MM-DD-YYYY")} ${end}`,'MM-DD-YYYY kk:mm');
        if(currentTime.isSameOrAfter(dayConfigStart) && currentTime.isSameOrBefore(dayConfigEnd)){
            return true;
        }
      }catch(e){}
      return false;
}

/*
check if supplied moment object lies within list of ranges of supplied time stamps in format(HH:mm)
*/

const checkIfTimeInListOfRanges=(currentTime,list)=>{
  if(currentTime==null || list==null || !Array.isArray(list)){
   return false;
  }
  let isInRangeList = false;
  for(listItem of list){
    isInRangeList = isInRangeList ||  checkIfTimeInRange(currentTime,listItem.begin,listItem.end)
  }
  return isInRangeList;
}


const buildAllowThroughResponse = () => {
    return {
        "allowThrough": "yes"
    };
}

const buildBlockResponse = (message) => {
    return {
        "allowThrough": "no",
        "offlineMessage": message || ""
    }
}

exports.handler = async function (context, event, callback) {
    event.country = 'esp';
    event.queue = '_all';

    const client = context.getTwilioClient();
    const teamSchedule = await fetchTeamSchedule(context, client, event);

    if(teamSchedule == null){
        // allow through if team schedule is not configured
        return callback(null,buildAllowThroughResponse())
    }

    try{
        //get contact center time according to configured timezone
        const { ccTime, ccFormattedDay, ccDayOfWeek } = getCurrentTimeDetails(teamSchedule.generalSettings.timezone);

        // check if contact center is shut because of an emergency
        if ( true == teamSchedule["emergencySettings"]["emergencyShutdown"] ) {
            const emergencyOfflineMessage = teamSchedule["emergencySettings"]["emergencyShutdownMessage"];
            return callback(null,buildBlockResponse(emergencyOfflineMessage))
        }

        // check if contact center is observing a holiday
        if ( null != teamSchedule["holidays"][ccFormattedDay] ) {
            const holidayOfflineMessage = teamSchedule["holidays"][ccFormattedDay]["offlineMessage"];
            return callback(null,buildBlockResponse(holidayOfflineMessage))
        }

        // check if contact center is partially working
        const partialDayLookup = teamSchedule["partialDays"][ccFormattedDay];
        if(partialDayLookup!=null && !checkIfTimeInRange(ccTime,partialDayLookup["begin"],partialDayLookup["end"])){
            const partialDayOfflineMessage = partialDayLookup["offlineMessage"];
            return callback(null,buildBlockResponse(partialDayOfflineMessage))
        }

        // check regular hours for contact center
        const regularDayLookup = teamSchedule["regularHours"]["weeklyTimings"][ccDayOfWeek];
        if(regularDayLookup!=null && !checkIfTimeInListOfRanges(ccTime,regularDayLookup)){
            const outsideRegularHoursOfflineMessage =  teamSchedule["regularHours"]["offlineMessage"];
            return callback(null,buildBlockResponse(outsideRegularHoursOfflineMessage))
        }
    }catch(e){
        console.error(e);
    }

    return callback(null,buildAllowThroughResponse())
};