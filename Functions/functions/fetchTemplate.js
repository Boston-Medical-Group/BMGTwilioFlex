const FunctionTokenValidator = require('twilio-flex-token-validator').functionValidator;
const TokenValidator = require('twilio-flex-token-validator').validator;
const { replaceTemplate } = require(Runtime.getFunctions()['helpers/template-replacer'].path);
const fetch = require("node-fetch");

//exports.handler = FunctionTokenValidator(async function (context, event, callback) {
exports.handler = async function (context, event, callback) {
  const {
    hubspot_id,
    deal_id,
    Token
  } = event;

  try {

    let defaultCountry = 'EC';
    const validCountries = ['EC','CA','ES','MX','CO','AR','PE','DE'];
    if (event.hasOwnProperty('country') && validCountries.includes(event.country)) {
      defaultCountry = event.country;
    }

    const templatesFileName = `templates_${defaultCountry}.json`;
    let template;
    try {
      const openTemplateFile = Runtime.getAssets()[`/templates/${templatesFileName}`].open;
      const templateRaw = JSON.parse(openTemplateFile());

      const client = context.getTwilioClient();

      // todo obtener datos del deal o cita (futuro?) y formatear de una manera que la plantilla entienda
      if (hubspot_id && templateRaw?.length > 0) {
        const request = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${hubspot_id}`, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${context.HUBSPOT_TOKEN}`
          }
        });

        if (!request.ok) {
          throw new Error('Error while retrieving data from hubspot');
        }

        const contactInformation = await request.json();
        const tokenInformation = await TokenValidator(Token, context.ACCOUNT_SID || '', context.AUTH_TOKEN || '');
        const workerInformation = await client.conversations.v1.users(tokenInformation.identity).fetch();

        template = templateRaw.map(item => {

          let formattedItem = item.replace(/{{customerFirstName}}/, contactInformation.properties.firstname);
          formattedItem = formattedItem.replace(/{{customerLastName}}/, contactInformation.properties.lastname);
          formattedItem = formattedItem.replace(/{{agentName}}/, workerInformation.friendlyName);

          return formattedItem;
        });
      } else {
        template = templateRaw;
      }
    } catch (err) {
      template = [];
    }

    const response = new Twilio.Response();
    response.appendHeader("Access-Control-Allow-Origin", "*");
    response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
    response.appendHeader("Access-Control-Allow-Headers", "Content-Type");

    response.appendHeader("Content-Type", "application/json");
    response.setBody(template);
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
//})
}