module.exports = {
    sayOptions: { voice: 'Google.es-US-Neural2-A', language: 'es-ES' },
    holdMusicUrl: '/audio_bmg.mp3',
    // Enable Estimated Waiting Time in voice prompt
    getEwt: true,
    //  Time interval (minutes) for Estimated Waiting Time stats
    statPeriod: 2,
    // Enable Queue Position in voice prompt
    getQueuePosition: true,
    // Priority for the Task generatared by the VoiceMail
    VoiceMailTaskPriority: 50,
    // Agent audible alert sound file for voice mail
    VoiceMailAlertTone: '/alertTone.mp3',
    // Priority for the Task generatared by the VoiceMail
    CallbackTaskPriority: 50,
    // Agent audible alert sound file for callback call
    CallbackAlertTone: '/alertTone.mp3',
    // Timezone configuration
    TimeZone: 'America/Bogota',
};
