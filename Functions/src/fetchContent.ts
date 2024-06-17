import { Context, ServerlessCallback } from '@twilio-labs/serverless-runtime-types/types';
import { functionValidator as FunctionTokenValidator } from 'twilio-flex-token-validator'

type MyContext = {}

type MyEvent = {
  prefix?: string
  Token: string
}

//@ts-ignore
exports.handler = FunctionTokenValidator(async function (
  context: Context<MyContext>,
  event: MyEvent,
  callback: ServerlessCallback
) {
  // Process the templates here
  const response = new Twilio.Response();
  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
  response.appendHeader("Access-Control-Allow-Headers", "Content-Type");

  response.appendHeader("Content-Type", "application/json");

  try {

    const client = context.getTwilioClient();

    // Obtiene plantillas del Template Builder
    //@ts-ignore
    const templates = await client.content.v1.contentAndApprovals.list({
      limit: 100,
      pageSize: 100
    })

    // @todo Filtramos por algún prefijo?

    // Filter templates to get only those with property approvalRequests.status = 'approved'
    const approvedTemplates = templates.filter((template: any) => {
      if (event.prefix && event.prefix !== '') {
        return template.approvalRequests?.status === 'approved' && template.friendlyName.startWtith(event.prefix)
      }

      return template.approvalRequests?.status === 'approved'
    })
  
    response.setBody(approvedTemplates);

  } catch (err) {
    if (err instanceof Error) {
      response.setBody(err.message);
      response.setStatusCode(500);
      // If there's an error, send an error response
      // Keep using the response object for CORS purposes
      console.error(err);
    }
  }

  // Return a success response using the callback function.
  callback(null, response);
})