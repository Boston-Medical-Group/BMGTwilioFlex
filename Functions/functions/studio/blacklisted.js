"use strict";

const axios = require('axios');

exports.handler = function (context, event, callback) {
    console.log('CALLERID BLACKLISTED TEST', event.callerID)
    if (!event.callerID) {
        console.log('NO CALLERID')
        return callback(null, { blacklisted: false });
    }
    
    var callerID = event.callerID.replace(/\D/g, '');
    console.log('PARSED CALLERID', callerID, context.COUNTRY)
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
