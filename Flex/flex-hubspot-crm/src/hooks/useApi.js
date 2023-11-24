import { useCallback } from "react";

const useApi = ({ token }) => {

  const getHubspotUserByEmail = useCallback(async ({ email }) => {
    const request = await fetch(`${process.env.FLEX_APP_TWILIO_SERVERLESS_DOMAIN}/fetchHubspotUser`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        Token: token
      })
    });

    return await request.json();

  }, [token]);

  return {
    getHubspotUserByEmail
  }
}

export default useApi;