import { useCallback } from "react";

const useApi = ({ token } : { token: string }) => {

  const getActiveConversations = useCallback(async (page: null | string) => {
    let params = {};
    if (page !== undefined && page !== '') {
      console.log('SETTING PAGE: ' + page)
      params = {
        page
      }
    }
    const request = await fetch(`${process.env.FLEX_APP_TWILIO_SERVERLESS_DOMAIN}/getActiveConversations`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...params,
        Token: token
      })
    });

    return await request.json();

  }, [token]);

  const getConversation = useCallback(async (conversationSid : string) => {
    const request = await fetch(`${process.env.FLEX_APP_TWILIO_SERVERLESS_DOMAIN}/getConversation`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        conversationSid,
        Token: token
      })
    });

    return await request.json();

  }, [token]);

  return {
    getActiveConversations,
    getConversation
  }
}

export default useApi;