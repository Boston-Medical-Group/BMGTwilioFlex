"use strict";

const axios = require('axios');

exports.handler = function (context, event, callback) {
    var ddiConfig = event.ddiConfig;
    var countryConfig = event.countryConfig;
    var inboundConfig = event.inboundConfig;

    return {
        ...countryConfig,
        ...inboundConfig,
        ...ddiConfig
    };
};
