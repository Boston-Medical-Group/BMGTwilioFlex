"use strict";

const axios = require('axios');

exports.handler = function (context, event, callback) {
    if (!event.callerID) {
        return callback(null, { blacklisted: false });
    }
    
    var callerID = event.callerID.replace(/\D/g, '');
    var url = `${context.FLEXMANAGER_API_URL}/inbound-blacklists/${callerID}?filter[country]=${context.COUNTRY}`;

    axios({
        method: 'get',
        url: url,
        headers: {
            'Authorization': `Bearer ${context.FLEXMANAGER_API_KEY}`,
            'Content-Type': 'application/vnd.api+json'
        }
    }).then(({data}) => {
        return callback(null, { blacklisted: true });
    }).catch(function () {
        return callback(null, { blacklisted: false });
    });
};
