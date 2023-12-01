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
const { getTask, handleError, urlBuilder } = require(helpersPath);
const optionsPath = Runtime.getFunctions()['studio/calling/options'].path;
/**
 * @type {{sayOptions: {voice: string, language: string}, holdMusicUrl: string, statPeriod: number, getEwt: boolean, getQueuePosition: boolean}}
 */
const options = require(optionsPath);

const i18n = require(Runtime.getFunctions()['helpers/i18n'].path);

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
    const language = event.language || options.sayOptions.language || 'es'; // Default es es-EC solamente porque es el primer idioma que trabajamos
    const voice = event.voice || options.sayOptions.voice;
    const _ = i18n.init(language);

    // Retrieve options
    const { sayOptions, holdMusicUrl, statPeriod, getEwt, getQueuePosition } = options;
    sayOptions.language = language;
    sayOptions.voice = voice;

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

    let queries;
    queries = {
        language,
        voice,
        mode: 'main'
    }

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
                    context.TASK_ROUTER_WORKSPACE_SID,
                    taskInfo.workflowSid,
                    statPeriod,
                );
                //  Get max, avg, min wait times for the workflow
                const t = workflowStats.data.waitDurationUntilAccepted;
                const ewt = getAverageWaitTime(t).minutes;

                let waitTts = '';
                switch (ewt) {
                    case 0:
                        waitTts = _.t('queue_menu:least_than_a_minute');
                        break;
                    case 4:
                        waitTts = _.t('queue_menu:more_than_x_minutes', { minutes: 4 });
                        break;
                    default:
                        waitTts = _.t('queue_menu:less_than_x_minutes', { minutes: ewt + 1 });
                }

                waitMsg += _.t('queue_menu:estimated_wait_time', { wait: waitTts });
            }

            //  Logic for Position in Queue
            if (getQueuePosition && taskInfo.status === 'success') {
                const taskPositionInfo = await getTaskPositionInQueue(client, taskInfo);
                switch (taskPositionInfo.position) {
                    case 0:
                        posQueueMsg = _.t('queue_menu:your_call_is_next_in_queue');
                        break;
                    case 1:
                        posQueueMsg = _.t('queue_menu:just_one_call_before_you');
                        break;
                    case -1:
                        posQueueMsg = _.t('queue_menu:more_than_x_calls_before_you', { calls: 20 });
                        break;
                    default:
                        posQueueMsg = _.t('queue_menu:x_calls_before_you', { calls: taskPositionInfo.position });
                        break;
                }
            }

            if (event.skipGreeting !== 'true') {
                let initGreeting = waitMsg + posQueueMsg;
                initGreeting += _.t('queue_menu:wait_for_an_agent');
                twiml.say(sayOptions, initGreeting);
            }
            message = _.t('queue_menu:press_one_and_callback_option', { option: 1 });

            if (taskSid) {
                queries.taskSid = taskSid;
            }
            queries.mode = 'menuProcess';
            gather = twiml.gather({
                input: 'dtmf',
                timeout: '2',
                action: urlBuilder(`${domain}/studio/calling/queue-menu`, queries),
            });
            gather.say(sayOptions, message);
            gather.play(domain + holdMusicUrl);
            queries.mode = 'main';
            twiml.redirect(urlBuilder(`${domain}/studio/calling/queue-menu`, queries));
            return callback(null, twiml);
            break;
        case 'mainProcess':
            if (taskSid) {
                queries.taskSid = taskSid
            }

            if (event.Digits === '1') {
                // message = 'Las siguientes opciones están disponibles...';
                // message += 'Presione 1 para mantenerse en espera...';
                // message += 'Presione 2 y lo llamaremos en cuanto un agente se encuentre disponible...';
                // message += 'Presione asterisco para escuchar esta lista de opciones nuevamente...';
                message = _.t('queue_menu:press_one_and_callback', {option: 1});

                queries.mode = 'menuProcess';
                gather = twiml.gather({
                    input: 'dtmf',
                    timeout: '2',
                    action: urlBuilder(`${domain}/studio/calling/queue-menu`, queries),
                });
                gather.say(sayOptions, message);
                gather.play(domain + holdMusicUrl);
                queries.mode = 'main';
                twiml.redirect(urlBuilder(`${domain}/studio/calling/queue-menu`, queries));
                return callback(null, twiml);
            }
            twiml.say(sayOptions, _.t('queue_menu:invalid_option'));

            queries.skipGreeting = 'true';
            twiml.redirect(urlBuilder(`${domain}/studio/calling/queue-menu`, queries));
            return callback(null, twiml);
            break;
        case 'menuProcess':
            if (taskSid) {
                queries.taskSid = taskSid
            }

            switch (event.Digits) {
                //  stay in queue
                // case '1':
                    /*
                     *   stay in queue
                     * twiml.say(sayOptions, 'Please wait for the next available agent');
                     */
                    // twiml.redirect(`${domain}/studio/calling/queue-menu?mode=main&skipGreeting=true${taskSid ? `&taskSid=${taskSid}` : ''}`);
                    // return callback(null, twiml);
                    // break;
                //  request a callback
                // case '2':
                case '1':
                    twiml.redirect(urlBuilder(`${domain}/studio/calling/inqueue-callback`, queries));
                    return callback(null, twiml);
                    break;

                // listen options menu again
                case '*':
                    queries.mode = 'mainProcess';
                    queries.Digits = '1';
                    twiml.redirect(urlBuilder(`${domain}/studio/calling/queue-menu`, queries));
                    return callback(null, twiml);
                    break;

                //  listen to menu again
                default:
                    twiml.say(sayOptions, _.t('queue_menu:invalid_option'));
                    queries.mode = 'mainProcess';
                    queries.Digits = '1';
                    twiml.redirect(urlBuilder(`${domain}/studio/calling/queue-menu`, queries));
                    return callback(null, twiml);
                    break;
            }
            break;
        default:
            return callback(500, null);
            break;
    }
};
