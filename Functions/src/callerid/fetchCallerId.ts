import { functionValidator as FunctionTokenValidator } from 'twilio-flex-token-validator'
import fetch from 'node-fetch'
import { Context, ServerlessCallback } from '@twilio-labs/serverless-runtime-types/types';
const utils = require(Runtime.getFunctions()['helpers/utils'].path);

type MyContext = {
  COUNTRY: string
  FLEXMANAGER_API_URL: string
  FLEXMANAGER_API_KEY: string
}

type MyEvent = {
  Token: string
  queueSid?: string
}

type CountryAttributes = {
  SFBusinessISOAlpha2: string|null
  language: string|null
  secondaryLanguage: string|null
  label: string|null
  errorTTS: string|null
  emergencyShutdown: boolean
  emergencyShutdownMessage: string|null
  timezone: string
  offlineMessage: string|null
  defaultQueue: string|null
}

type CallerIdAttributes = {
  queue: string
  ddi: string
}

type ItemResponse<T> = {
  type: string
  id: string
  attributes: T
}

type SingleResponse<T> = {
  data: T
}
type CollectionResponse<T> = {
  data: T[]
}

type CountryResponse = {
  data: ItemResponse<CountryAttributes>
}

type JsonApiMeta = {
  page: {
    currentPage: number
    from: number
    lastPage: number
    perPage: number
    to: number
    total: number
  }
}
type CallerIdsResponse = {
  meta: JsonApiMeta
  data: Array<ItemResponse<CallerIdAttributes>>
}

//@ts-ignore
exports.handler = FunctionTokenValidator(async function (
  context: Context<MyContext>,
  event: MyEvent,
  callback: ServerlessCallback
) {
  const PAGE_SIZE = 150
  const {
    Token
  } = event;

  let callerId, count = 0;
  let queueSid = event.queueSid ?? undefined;
  try {
    const country = utils.countryToIso2(context.COUNTRY);

    //context.COUNTRY = 'esp';
    try {
      const countryResponse: CountryResponse = await fetch(`${context.FLEXMANAGER_API_URL}/countries/${context.COUNTRY}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/vnd.api+json',
          'Authorization': `Bearer ${context.FLEXMANAGER_API_KEY}`
        }
      })
        .then(async (res) => {
          return await res.json()
        })
      
      const defaultQueue = countryResponse.data.attributes.defaultQueue
      const queryQueue = event.queueSid || defaultQueue
      const callerIdsResponse: CallerIdsResponse = await fetch(`${context.FLEXMANAGER_API_URL}/caller-id-pools?filter[country]=${context.COUNTRY}&filter[queue]=${queryQueue}&page[size]=${PAGE_SIZE}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/vnd.api+json',
          'Authorization': `Bearer ${context.FLEXMANAGER_API_KEY}`
        }
      })
        .then(async (res) => {
          return await res.json()
        })
      
      
      count = await utils.getRRCounter(queryQueue, context) || 0;
      if (count >= callerIdsResponse.meta.page.total) {
        count = 0;
      }
      callerId = callerIdsResponse.data.at(count)?.attributes.ddi || null;
      //console.log(`CALLERID COUNTER: ${count}, TOTAL: ${callerIdsResponse.data.length}, FROM: ${context.FLEXMANAGER_API_URL}/caller-id-pools?filter[country]=${context.COUNTRY}&filter[queue]=${queryQueue}&page[size]=${PAGE_SIZE}`)

      count++
      utils.updateRRCounter(queueSid, count, context)
      if (callerId === null) {
        console.log(`CALLERID NULL FOR: ${queueSid}`)
      }
    } catch (err) {
      console.log(err)
      callerId = null;
    }

    const response = new Twilio.Response();
    response.appendHeader("Access-Control-Allow-Origin", "*");
    response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
    response.appendHeader("Access-Control-Allow-Headers", "Content-Type");

    response.appendHeader("Content-Type", "application/json");
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
