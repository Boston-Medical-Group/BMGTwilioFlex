import { Context, ServerlessCallback } from '@twilio-labs/serverless-runtime-types/types';
import { functionValidator as FunctionTokenValidator, validator as TokenValidator } from 'twilio-flex-token-validator'
const { iso2ToCountry } = require(Runtime.getFunctions()['helpers/utils'].path);
const { replaceTemplate } = require(Runtime.getFunctions()['helpers/template-replacer'].path);
import fetch from 'node-fetch';
import { Client as HubspotClient } from '@hubspot/api-client';

type MyContext = {
  FLEXMANAGER_API_URL: string
  FLEXMANAGER_API_KEY: string
  COUNTRY: string
  COUNTRY_CODE: string
  HUBSPOT_TOKEN: string
}

type MyEvent = {
  hubspot_id: string
  deal_id: string
  Token: string
  data: {
    from: string
  }
}

//@ts-ignore
exports.handler = FunctionTokenValidator(async function (
  context: Context<MyContext>,
  event: MyEvent,
  callback: ServerlessCallback
) {
  try {

    let defaultCountry : string = context.COUNTRY === 'dev' ? 'DEV' : context.COUNTRY.substring(0, 2).toUpperCase();

    if (defaultCountry === 'ME') {
      defaultCountry = 'MX';
    } else if (defaultCountry === 'AL' || defaultCountry === 'ALE') {
      defaultCountry = 'DE';
    }

    const countryCode = iso2ToCountry(defaultCountry);

    const templates = await getTemplatesFromManager(countryCode, context, event.data);

    // Process the templates here
    const response = new Twilio.Response();
    response.appendHeader("Access-Control-Allow-Origin", "*");
    response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
    response.appendHeader("Access-Control-Allow-Headers", "Content-Type");

    response.appendHeader("Content-Type", "application/json");
    response.setBody(templates);
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

const getTemplatesFromManager = async function (
  countryCode: string,
  context: Context<MyContext>,
  parameters: {}
) {
  //countryCode = 'esp';

  type TemplateObject = {
    message: string
    template_name: string
  }
  type TemplatesResponse = {
    attributes: TemplateObject
  }

  type ApiResult = {
    data: Array<TemplatesResponse>
  }

  const result : ApiResult = await fetch(`${context.FLEXMANAGER_API_URL}//messaging-templates?filter[country]=${countryCode}&filter[message_type]=whatsapp`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/vnd.api+json',
      'Authorization': `Bearer ${context.FLEXMANAGER_API_KEY}`
    }
  })
    .then(async res => await res.json())

  const templates = [];

  
  if (result.data && result.data.length > 0) {
    // loop object
    for (let i = 0; i < result.data.length; i++) {
      const element = result.data[i];

      const templateMessage : string = replaceTemplateVariables(element.attributes.message.replaceAll('\\n', '\n'), parameters)
      // convert \n to line breaks on element
      templates.push({
        name: element.attributes.template_name,
        message: templateMessage
      });
    }
  }

  return templates;
}

/**
 * Replaces template variables in a message with corresponding values from parameters.
 */
const replaceTemplateVariables = (message: string, parameters: {[key: string] : string}) => {
  const extractedParameters = extractTemplateParameters(message)
  let replacedMessage = message
  extractedParameters.forEach(parameter => {
    let paremeterValue = data_get(parameters, parameter, false)
    if (paremeterValue) {
      replacedMessage = replacedMessage.replaceAll(`{{${parameter}}}`, paremeterValue);
    }
  })
  for (const [key, value] of Object.entries(parameters)) {
    replacedMessage = replacedMessage.replaceAll(`{{${key}}}`, value);
  }
  return replacedMessage;
}

/**
 * Extracts template parameters from a given message.
 */
const extractTemplateParameters = (message : string) => {
  const extractedParameters = [];
  const regex = /{{(.*?)}}/g;
  let match;
  while ((match = regex.exec(message)) !== null) {
    extractedParameters.push(match[1]);
  }

  return Array.from(new Set(extractedParameters));
}

/**
 * Retrieves a value from an object using a key or a nested key path.
 *
 * @param {Object} obj - The object to retrieve the value from.
 * @param {string|array} key - The key or nested key path to retrieve the value from the object.
 * @param {any} default_value - The default value to return if the key or key path is not found in the object.
 * @return {any} The value associated with the key or key path in the object, or the default value if not found.
 */
const data_get = (obj: {[key: string]: any}, key: string|Array<string>, default_value: any) => {
  if (typeof key === 'string') {
    key = key.split('.');
  }
  for (var i = 0; i < key.length; i++) {
    if (obj === null || typeof obj !== 'object') {
      return default_value;
    }
    obj = obj[key[i]];
  }
  return obj || default_value;
}

/*
const getTemplatesFromFiles = async function (
  defaultCountry: string,
  context: Context<MyContext>,
  event: MyEvent
) {
  const {
    hubspot_id,
    deal_id,
    Token
  } = event;

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
}
*/