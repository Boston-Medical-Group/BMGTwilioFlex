"use strict";

const axios = require('axios');

exports.handler = function (context, event, callback) {
    var url = `${context.FLEXMANAGER_API_URL}/countries/${context.COUNTRY}?include=inboundConfig`;

    axios({
        method: 'get',
        url: url,
        headers: {
            'Authorization': `Bearer ${context.FLEXMANAGER_API_KEY}`,
            'Content-Type': 'application/vnd.api+json'
        }
    }).then(({ data }) => {
        var dataResponse = data.data.attributes
        dataResponse.inboundConfig = {};

        if (!data.included) {
            return callback(null, dataResponse);
        }

        let inboundConfigs = data.included.find((element) => element.type === 'inbound-configs');
        if (inboundConfigs && inboundConfigs.attributes) {
            dataResponse.inboundConfig = inboundConfigs.attributes;
        }

        return callback(null, dataResponse);
        
    }).catch(function () {
        return callback('Error loading Country configuration');
    });
};
