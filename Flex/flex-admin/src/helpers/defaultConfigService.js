import moment from 'moment-timezone';
const { FLEX_APP_TWILIO_SERVERLESS_DOMAIN } = process.env;

export const fetchTimezoneList = async ()=>{
   
    return await fetch(`${FLEX_APP_TWILIO_SERVERLESS_DOMAIN}/timezone-options.json`).then(d=>d.json()).catch(e=>moment.tz.names())
   
}