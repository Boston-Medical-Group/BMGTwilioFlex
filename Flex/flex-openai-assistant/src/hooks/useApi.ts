import { useCallback } from "react";
import { Manager } from "@twilio/flex-ui";

type CreateRunPayload = {
  conversation_sid: string
}

const useApi = ({ token } : { token: string }) => {

  const createRun = useCallback(async (data : CreateRunPayload) => {
    const request = await fetch(`${process.env.FLEX_APP_TWILIO_SERVERLESS_DOMAIN}/ai/threadRunCreate`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        conversation_sid: data.conversation_sid,
        Token: token
      })
    });

    return await request.json();
  }, [token]);

  const getRunStatus = useCallback(async (data) => {
    const request = await fetch(`${process.env.FLEX_APP_TWILIO_SERVERLESS_DOMAIN}/ai/threadRunStatus`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        thread_id: data.thread_id,
        run_id: data.run_id,
        Token: token
      })
    });

    return await request.json();

  }, [token]);

  const fetchOpenAIResponse = useCallback(async (input, requestType, context = "") => {

    const response = await fetch(`${process.env.FLEX_APP_TWILIO_SERVERLESS_DOMAIN}/ai/gpt`, {
      method: 'POST',
      body: new URLSearchParams(
        {
          input: input,
          requestType: requestType,
          Token: token,//This is the important one, you need to pass the flex token
          context: context // Add context 
        }
      ),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
    })


    if (response.status == 431) {
      return "431";
    }

    if (!response.ok) {
      console.error(`Failed to retrieve ${requestType} response: ${response.status}`);
      return null;
    }

    const data = await response.json();

    return data.summary;
  }, [token])

  return {
    createRun,
    getRunStatus,
    fetchOpenAIResponse
  }
}

export default useApi;