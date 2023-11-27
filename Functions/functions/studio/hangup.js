exports.handler = function(context, event, callback) {
    let twiml = new Twilio.twiml.VoiceResponse();
    twiml.hangup();
    callback(null, twiml);
};