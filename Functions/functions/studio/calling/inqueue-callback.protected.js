/*
 *Synopsis:  This function provide complete handling of Flex In-Queue Callback capabilities to include:
 *    1. Immediate call-back request to originating ANI ( Press 1), and
 *    2. Request a callback to separate number
 *
 *Callback task are created and linked to the originating call (Flex Insights reporting). The flex plugin provides
 *a UI for management of the callback request including a re-queueing capability.capability
 *
 *name: util_InQueueCallBackMenu
 *path: /inqueue-callback
 *private: CHECKED
 *
 *Function Methods (mode)
 * - main             => main entry point for callback flow
 * - mainProcess      => process main menu DTMF selection
 * - newNumber        => menu initiating new number capture
 * - submitCallback   => initiate callback creation ( getTask, cancelTask, createCallback)
 *
 *Customization:
 * - Set TTS voice option
 * - Set initial priority of callback task (default: 50)
 * - Set timezone configuration ( server_tz )
 *
 *Install/Config: See documentation
 *
 *Last Updated: 07/05/2021
 */

const TaskOperations = require(Runtime.getFunctions()['twilio-wrappers/taskrouter'].path);
const helpersPath = Runtime.getFunctions()['studio/calling/helpers'].path;
const { getTask, handleError, getTime, cancelTask, urlBuilder } = require(helpersPath);
const optionsPath = Runtime.getFunctions()['studio/calling/options'].path;
const options = require(optionsPath);

const i18n = require(Runtime.getFunctions()['helpers/i18n'].path);

// Create the callback task
async function createCallbackTask(context, phoneNumber, taskInfo, ringback) {
    const taskAttributes = JSON.parse(taskInfo.data.attributes);
    const timezone = taskAttributes.timezone ?? options.TimeZone
    const time = getTime(timezone);

    const timeout = taskInfo.timeout || 86400;
    const priority = taskInfo.priority || options.CallbackTaskPriority;
    const attempts = 1;
    const taskChannel = 'voice';
    const conversation_id = taskInfo.sid;

    const workflowSid = taskInfo.workflowSid || process.env.TWILIO_FLEX_CALLBACK_WORKFLOW_SID;
    
    console.log('NumbertoCall', phoneNumber);
    const attributes = {
        taskType: 'callback',
        name: `Callback (${phoneNumber})`,
        flow_execution_sid: undefined,
        message: null,
        callBackData: {
            numberToCall: phoneNumber || taskAttributes.caller,
            numberToCallFrom: taskAttributes.called,
            attempts,
            mainTimeZone: timezone,
            utcDateTimeReceived: time,
            RecordingSid: null,
            RecordingUrl: null,
            TranscriptionSid: null,
            TranscriptionText: null,
            isDeleted: false,
        },
        crmid: taskAttributes.crmid,
        hubspot_id: taskAttributes.crmid,
        hubspot_contact_id: taskAttributes.crmid,
        direction: 'inbound',
        conversations: {
            conversation_id,
        },
    };
    
    try {
        return await TaskOperations.createTask({
            context,
            workflowSid,
            taskChannel,
            attributes,
            priority,
            timeout,
            attempts: 0,
        });
    } catch (error) {
        console.log('createCallBackTask error');
        handleError(error);
    }
}

function formatPhoneNumber(phoneNumber) {
    if (phoneNumber.startsWith('+')) {
        phoneNumber = phoneNumber.slice(1);
    }
    return phoneNumber.split('').join('...');
}

// eslint-disable-next-line sonarjs/cognitive-complexity
exports.handler = async function (context, event, callback) {
    const client = context.getTwilioClient();
    const twiml = new Twilio.twiml.VoiceResponse();
    const language = event.language || options.sayOptions.language || 'es'; // Default es es-EC solamente porque es el primer idioma que trabajamos
    const voice = event.voice || options.sayOptions.voice;
    const _ = i18n.init(language);

    const domain = `https://${context.DOMAIN_NAME}`;

    // Load options
    const { sayOptions, CallbackAlertTone } = options;
    sayOptions.language = language;
    sayOptions.voice = voice;

    const { mode } = event;
    const PhoneNumberFrom = event.From;
    const { CallSid } = event;
    const CallbackNumber = event.cbphone;
    const { taskSid } = event;
    let message = '';
    let queries = {
        mode: 'main',
        language,
        voice
    };

    // main logic for callback methods
    switch (mode) {
        //  present main menu options
        case 'main':
            // main menu
            message = _.t('callback_menu:confirm_number', { number: formatPhoneNumber(PhoneNumberFrom) });
            message += _.t('callback_menu:press_to_confirm', {option: 1});
            message += _.t('callback_menu:press_to_change_number', {option: 2});

            queries.mode = 'mainProcess';
            if (taskSid) {
                queries.taskSid = taskSid;
            }
            const gatherConfirmation = twiml.gather({
                input: 'dtmf',
                timeout: '2',
                action: urlBuilder(`${domain}/studio/calling/inqueue-callback`, {
                    ...queries,
                    CallSid,
                    cbphone: encodeURI(PhoneNumberFrom),
                }),
            });
            gatherConfirmation.say(sayOptions, message);
            queries.mode = 'main'
            twiml.redirect(urlBuilder(`${domain}/studio/calling/queue-menu`, queries));
            return callback(null, twiml);
            break;

        //  process main menu selections
        case 'mainProcess':
            switch (event.Digits) {
                //  existing number
                case '1':
                    // redirect to submitCalBack
                    queries.mode = 'submitCallback';
                    queries.CallSid = CallSid;
                    queries.cbphone = encodeURI(CallbackNumber);
                    if (taskSid) {
                        queries.taskSid = taskSid;
                    }
                    twiml.redirect(urlBuilder(`${domain}/studio/calling/inqueue-callback`, queries));
                    return callback(null, twiml);
                    break;
                //  new number
                case '2':
                    message = _.t('callback_menu:use_keypad_to_change_number');
                    message += _.t('callback_menu:press_to_end');

                    queries.mode = 'newNumber';
                    queries.CallSid = CallSid;
                    queries.cbphone = encodeURI(CallbackNumber);
                    if (taskSid) {
                        queries.taskSid = taskSid;
                    }
                    const GatherNewNumber = twiml.gather({
                        input: 'dtmf',
                        timeout: '10',
                        finishOnKey: '#',
                        action: urlBuilder(`${domain}/studio/calling/inqueue-callback`, queries),
                    });
                    GatherNewNumber.say(sayOptions, message);

                    queries.mode = 'main';
                    twiml.redirect(urlBuilder(`${domain}/studio/calling/inqueue-callback`, queries));
                    return callback(null, twiml);
                    break;
                case '*':
                    queries.CallSid = CallSid;
                    queries.skipGreeting = true;
                    if (taskSid) {
                        queries.taskSid = taskSid;
                    }
                    twiml.redirect(urlBuilder(`${domain}/studio/calling/inqueue-callback`, queries));
                    return callback(null, twiml);
                    break;
                default:
                    if (taskSid) {
                        queries.taskSid = taskSid;
                    }
                    twiml.say(sayOptions, _.t('callback_menu:invalid_option'));
                    twiml.redirect(urlBuilder(`${domain}/studio/calling/inqueue-callback`, queries));
                    return callback(null, twiml);
                    break;
            }
            break;

        //  present new number menu selections
        case 'newNumber':
            const NewPhoneNumber = event.Digits;
            // TODO: Handle country code in new number

            message = _.t('callback_menu:confirm_new_number', {number: formatPhoneNumber(NewPhoneNumber)});
            message += _.t('callback_menu:press_to_confirm_new_number', { option: 1 });
            message += _.t('callback_menu:press_to_change_new_number', { option: 2 });
            message += _.t('callback_menu:press_to_home');

            queries.mode = 'mainProcess';
            queries.CallSid = CallSid;
            queries.cbphone = encodeURI(NewPhoneNumber);
            if (taskSid) {
                queries.taskSid = taskSid;
            }
            const GatherConfirmNewNumber = twiml.gather({
                input: 'dtmf',
                timeout: '5',
                finishOnKey: '#',
                action: urlBuilder(`${domain}/studio/calling/inqueue-callback`, queries),
            });
            GatherConfirmNewNumber.say(sayOptions, message);

            queries.mode = 'main';
            twiml.redirect(urlBuilder(`${domain}/studio/calling/inqueue-callback`, queries));
            return callback(null, twiml);
            break;

        //  handler to submit the callback
        case 'submitCallback':
            /*
             *  Steps
             *  1. Fetch TaskSid ( read task w/ attribute of call_sid);
             *  2. Update existing task (assignmentStatus==>'canceled'; reason==>'callback requested' )
             *  3. Create new task ( callback );
             *  4. Hangup callback
             *
             *  main callback logic
             *  get taskSid based on callSid
             *  taskInfo = { "sid" : <taskSid>, "queueTargetName" : <taskQueueName>, "queueTargetSid" : <taskQueueSid> };
             */
            const taskInfo = await getTask(context, taskSid || CallSid);

            // Cancel current Task
            //await cancelTask(client, context.TASK_ROUTER_WORKSPACE_SID, taskInfo.taskSid);
            // Create the callback task
            const ringBackUrl = CallbackAlertTone.startsWith('https://') ? CallbackAlertTone : domain + CallbackAlertTone;
            await createCallbackTask(context, CallbackNumber, taskInfo, ringBackUrl);

            //  hangup the call
            twiml.say(sayOptions, _.t('callback_menu:request_received'));
            twiml.say(sayOptions, _.t('callback_menu:agent_will_contact_soon'));
            twiml.say(sayOptions, _.t('callback_menu:goodbye'));
            twiml.hangup();
            return callback(null, twiml);
            break;
        default:
            return callback(500, 'Mode not specified');
            break;
    }
};
