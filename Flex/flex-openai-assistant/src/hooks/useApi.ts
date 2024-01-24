import { useCallback } from "react";

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

  return {
    createRun,
    getRunStatus
  }
}

export default useApi;