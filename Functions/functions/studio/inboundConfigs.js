"use strict";

const axios = require('axios');

exports.handler = function (context, event, callback) {
    if (!event.country) {
        return callback(null, null);
    }
    
    var url = `${context.FLEXMANAGER_API_URL}/inbound-configs/${event.country}`;

    axios({
        method: 'get',
        url: url,
        headers: {
            'Authorization': `Bearer ${context.FLEXMANAGER_API_KEY}`,
            'Content-Type': 'application/vnd.api+json'
        }
    }).then(({data}) => {
        return callback(null, data.data.attributes );
    }).catch(function () {
        return callback(null, null );
    });
};
