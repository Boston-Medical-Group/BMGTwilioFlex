const axios = require('axios');

exports.handler = function (context, event, callback) {
    
    let result = {
        crmid: '',
        firstname: '',
        lastname: '',
        fullname: '',
        lifecyclestage: 'lead'
    };
    let from = event.from;

    //if the string from contains a whatsapp prefix we need to remove it
    from = from.replace('whatsapp:', '');
    const url = 'https://api.hubapi.com/contacts/v1/search/query?q=' + from;
    axios({
        method: 'get',
        url: url,
        headers: { Authorization: `Bearer ` + context.HUBSPOT_TOKEN, 'content-type': 'application/x-www-form-urlencoded;charset=utf-8' }
    })
        .then(function (response) {
            console.log('FOUND CONTACTS', response.data.contacts.length);
            if (response.data.contacts.length > 0) {

                // handle success - first record found is going to be used for screen pop
                let contact = response.data.contacts[0];
                //the result object stores the data you need from hubspot. In this example we're returning the CRM ID, first name and last name only.
                result.crmid = `${contact.vid}`; //required for screenpop
                result.firstname = `${contact.properties.firstname.value}`;
                result.lastname = `${contact.properties.lastname.value}`;
                result.fullname = `${contact.properties.firstname.value ?? ''} ${contact.properties.lastname.value ?? ''}`;
                result.lifecyclestage = `${contact.properties?.lifecyclestage?.value ?? 'lead'}`;
                if (result.fullname.trim() == '') {
                    result.fullname = 'Customer'
                }
            }

            callback(null, result);
        })
        .catch(function (error) {
            // handle error
            console.log(`Error: ${error}`);
            callback(null, error);
        });
};