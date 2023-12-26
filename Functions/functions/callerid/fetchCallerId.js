const FunctionTokenValidator = require('twilio-flex-token-validator').functionValidator;
const fetch = require("node-fetch");
/** @type {import('../helpers/utils.private.js')} */
const utils = require(Runtime.getFunctions()['helpers/utils'].path);

exports.handler = FunctionTokenValidator(async function (context, event, callback) {
//exports.handler = async function (context, event, callback) {
  const {
    Token
  } = event;

  let callerId, count = 0;
  let queueSid = event.queueSid ?? undefined;
  try {
    const country = utils.countryToIso2(context.COUNTRY);

    try {
      /** @type {{default: object, [key?: string] : string}} */
      const openPools = require(Runtime.getAssets()[`/callerIdPools/${country}.js`].path);
      const pool = openPools.hasOwnProperty('country') ? openPools.country : openPools.default;

      queueSid = pool.hasOwnProperty(queueSid) ? queueSid : pool.defaultQueue;
      /** @type {Array<Number, string>} */
      const poolConfig = pool[queueSid];
      
      count = await utils.getRRCounter(queueSid, context) || 0;
      if (count >= poolConfig.length) {
        count = 0;
      }
        
      callerId = poolConfig.at(count) || null;

      count++
      utils.updateRRCounter(queueSid, count, context)
    } catch (err) {
      callerId = null;
    }

    const response = new Twilio.Response();
    response.appendHeader("Access-Control-Allow-Origin", "*");
    response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
    response.appendHeader("Access-Control-Allow-Headers", "Content-Type");

    response.appendHeader("Content-Type", "application/json");
    response.setCookie(`${queueSid}_count`, (count).toString());
    response.setBody({ callerId });
    // Return a success response using the callback function.
    callback(null, response);


  } catch (err) {

    if (err instanceof Error) {
      const response = new Twilio.Response();
      response.appendHeader("Access-Control-Allow-Origin", "*");
      response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
      response.appendHeader("Access-Control-Allow-Headers", "Content-Type");

      response.appendHeader("Content-Type", "plain/text");
      response.setBody(err.message);
      response.setStatusCode(500);
      // If there's an error, send an error response
      // Keep using the response object for CORS purposes
      console.error(err);
      callback(null, response);
    } else {
      callback(null, {});
    }

  }
})
//}