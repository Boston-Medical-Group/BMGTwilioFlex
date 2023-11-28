/*
 *Synopsis:  This function provides complete handling of Flex In-Queue Voicemail capabilities to include:
 *    1. request to leave a voicemail with callback to originating ANI
 *
 *Voicemail tasks are created and linked to the originating call (Flex Insights reporting). The flex plugin provides
 *a UI for management of the voicemail request including a re-queueing capability.
 *
 *name: util_inQueueMenuMain
 *path: /queue-menu
 *private: CHECKED
 *
 *Function Methods (mode)
 * - main                 => present menu for in-queue main menu options
 * - mainProcess          => present menu for main menu options (1=>Stay Queue; 2=>Callback; 3=>Voicemail)
 * - menuProcess          => process DTMF for redirect to supporting functions (Callback, voicemail)
 *
 *Customization:
 * - Set TTS voice option
 * - Set hold music path to ASSET resource (trimmed 30 seconds source)
 *
 *Install/Config: See documentation
 *
 *Last Updated: 03/27/2020
 */
const axios = require('axios');
const moment = require('moment');

const helpersPath = Runtime.getFunctions()['studio/calling/helpers'].path;
const { getTask, handleError } = require(helpersPath);
const optionsPath = Runtime.getFunctions()['studio/calling/options'].path;
const options = require(optionsPath);

//  retrieve workflow cummulative statistics for Estimated wait time
async function getWorkflowCummStats(client, workspaceSid, workflowSid, statPeriod) {
    return client.taskrouter
        .workspaces(workspaceSid)
        .workflows(workflowSid)
        .cumulativeStatistics({
            Minutes: statPeriod,
        })
        .fetch()
        .then((workflowStatistics) => {
            return {
                status: 'success',
                topic: 'getWorkflowCummStats',
                action: 'getWorkflowCummStats',
                data: workflowStatistics,
            };
        })
        .catch((error) => {
            handleError(error);
            return {
                status: 'error',
                topic: 'getWorkflowCummStats',
                action: 'getWorkflowCummStats',
                data: error,
            };
        });
}

function getTaskPositionInQueue(client, taskInfo) {
    return client.taskrouter
        .workspaces(taskInfo.workspaceSid)
        .tasks.list({
            assignmentStatus: 'pending, reserved',
            taskQueueName: taskInfo.taskQueueName,
            ordering: 'DateCreated:asc,Priority:desc',
            limit: 20,
        })
        .then((taskList) => {
            const taskPosition = taskList.findIndex((task) => task.sid === taskInfo.taskSid);
            console.log(taskPosition, taskList);
            return {
                status: 'success',
                topic: 'getTaskList',
                action: 'getTaskList',
                position: taskPosition,
                data: taskList,
            };
        })
        .catch((error) => {
            console.log(error);
            handleError(error);
            return {
                status: 'error',
                topic: 'getTaskList',
                action: 'getTaskList',
                data: error,
            };
        });
}

function getAverageWaitTime(t) {
    const durationInSeconds = moment.duration(t.avg, 'seconds');
    return {
        type: 'avgWaitTime',
        hours: durationInSeconds._data.hours,
        minutes: durationInSeconds._data.minutes,
        seconds: durationInSeconds._data.seconds,
    };
}

// eslint-disable-next-line complexity, sonarjs/cognitive-complexity, func-names
exports.handler = async function (context, event, callback) {
    const client = context.getTwilioClient();
    const domain = `https://${context.DOMAIN_NAME}`;
    const twiml = new Twilio.twiml.VoiceResponse();

    // Retrieve options
    const { sayOptions, holdMusicUrl, statPeriod, getEwt, getQueuePosition } = options;

    // Retrieve event arguments
    const CallSid = event.CallSid || '';
    let { taskSid } = event;

    // Variables initialization
    const { mode } = event;
    let message = '';

    // Variables for EWT/PostionInQueue
    let waitMsg = '';
    let posQueueMsg = '';
    let gather;

    /*
     *  ==========================
     *  BEGIN:  Main logic
     */
    switch (mode) {
        case 'main':
            //  logic for retrieval of Estimated Wait Time
            let taskInfo;
            if (getEwt || getQueuePosition) {
                taskInfo = await getTask(context, taskSid || CallSid);
                if (!taskSid) {
                    ({ taskSid } = taskInfo);
                }
            }

            if (getEwt && taskInfo.status === 'success') {
                const workflowStats = await getWorkflowCummStats(
                    client,
                    context.TWILIO_WORKSPACE_SID,
                    taskInfo.workflowSid,
                    statPeriod,
                );
                //  Get max, avg, min wait times for the workflow
                const t = workflowStats.data.waitDurationUntilAccepted;
                const ewt = getAverageWaitTime(t).minutes;

                let waitTts = '';
                switch (ewt) {
                    case 0:
                        waitTts = 'menos de un minuto...';
                        break;
                    case 4:
                        waitTts = 'mas de 4 minutos...';
                        break;
                    default:
                        waitTts = `menos de ${ewt + 1} minutos...`;
                }

                waitMsg += `El tiempo estimado de espera es de ${waitTts} ....`;
            }

            //  Logic for Position in Queue
            if (getQueuePosition && taskInfo.status === 'success') {
                const taskPositionInfo = await getTaskPositionInQueue(client, taskInfo);
                switch (taskPositionInfo.position) {
                    case 0:
                        posQueueMsg = 'Su llamada es la siguiente en la cola.... ';
                        break;
                    case 1:
                        posQueueMsg = 'Hay solo una llamada antes de usted....';
                        break;
                    case -1:
                        posQueueMsg = 'Has mas de 20 llamadas antes de usted...';
                        break;
                    default:
                        posQueueMsg = `Hay ${taskPositionInfo.position} llamadas antes de usted...`;
                        break;
                }
            }

            if (event.skipGreeting !== 'true') {
                let initGreeting = waitMsg + posQueueMsg;
                initGreeting += '...Por favor espere mientras encontramos un agente disponible...';
                twiml.say(sayOptions, initGreeting);
            }
            message = 'Para escuchar una lista de opciones mientras espera, presione 1 en cualquier momento.';
            gather = twiml.gather({
                input: 'dtmf',
                timeout: '2',
                action: `${domain}/queue-menu?mode=mainProcess${taskSid ? `&taskSid=${taskSid}` : ''}`,
            });
            gather.say(sayOptions, message);
            gather.play(domain + holdMusicUrl);
            twiml.redirect(`${domain}/queue-menu?mode=main${taskSid ? `&taskSid=${taskSid}` : ''}`);
            return callback(null, twiml);
            break;
        case 'mainProcess':
            if (event.Digits === '1') {
                message = 'Las siguientes opciones están disponibles...';
                message += 'Presione 1 para mantenerse en espera...';
                message += 'Presione 2 y lo llamaremos en cuanto un agente se encuentre disponible...';
                message += 'Presione asterisco para escuhar esta lista de opciones nuevamente...';

                gather = twiml.gather({
                    input: 'dtmf',
                    timeout: '1',
                    action: `${domain}/queue-menu?mode=menuProcess${taskSid ? `&taskSid=${taskSid}` : ''}`,
                });
                gather.say(sayOptions, message);
                gather.play(domain + holdMusicUrl);
                twiml.redirect(`${domain}/queue-menu?mode=main${taskSid ? `&taskSid=${taskSid}` : ''}`);
                return callback(null, twiml);
            }
            twiml.say(sayOptions, 'Lo siento. No entendí la opción seleccionada.');
            twiml.redirect(`${domain}/queue-menu?mode=main&skipGreeting=true${taskSid ? `&taskSid=${taskSid}` : ''}`);
            return callback(null, twiml);
            break;
        case 'menuProcess':
            switch (event.Digits) {
                //  stay in queue
                case '1':
                    /*
                     *   stay in queue
                     * twiml.say(sayOptions, 'Please wait for the next available agent');
                     */
                    twiml.redirect(`${domain}/queue-menu?mode=main&skipGreeting=true${taskSid ? `&taskSid=${taskSid}` : ''}`);
                    return callback(null, twiml);
                    break;
                //  request a callback
                case '2':
                    twiml.redirect(`${domain}/inqueue-callback?mode=main${taskSid ? `&taskSid=${taskSid}` : ''}`);
                    return callback(null, twiml);
                    break;

                // listen options menu again
                case '*':
                    twiml.redirect(`${domain}/queue-menu?mode=mainProcess&Digits=1${taskSid ? `&taskSid=${taskSid}` : ''}`);
                    return callback(null, twiml);
                    break;

                //  listen to menu again
                default:
                    twiml.say(sayOptions, 'Lo siento. No entendí la opción seleccionada.');
                    twiml.redirect(`${domain}/queue-menu?mode=mainProcess&Digits=1${taskSid ? `&taskSid=${taskSid}` : ''}`);
                    return callback(null, twiml);
                    break;
            }
            break;
        default:
            return callback(500, null);
            break;
    }
};
