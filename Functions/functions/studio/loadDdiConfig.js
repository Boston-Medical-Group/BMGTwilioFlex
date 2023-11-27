"use strict";

const axios = require('axios');

exports.handler = function (context, event, callback) {
    if (!event.ddi) {
        return callback('DDI Required');
    }
    
    var ddi = event.ddi.replace(/\D/g, '');
    var url = `${context.FLEXMANAGER_API_URL}/ddis/${ddi}?filter[country]=${context.COUNTRY}`;

    axios({
        method: 'get',
        url: url,
        headers: {
            'Authorization': `Bearer ${context.FLEXMANAGER_API_KEY}`,
            'Content-Type': 'application/vnd.api+json'
        }
    }).then(({data}) => {
        return callback(null, data.data.attributes ?? {});
    }).catch(function () {
        return callback('Error loading DDI configuration');
    });
};
