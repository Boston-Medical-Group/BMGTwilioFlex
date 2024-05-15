import { useCallback } from "react";

const useApi = ({ token }) => {

  const getHubspotUserByEmail = useCallback(async (email) => {
    const request = await fetch(`${process.env.FLEX_APP_TWILIO_SERVERLESS_DOMAIN}/fetchHubspotOwner`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        by: 'email',
        email,
        Token: token
      })
    });

    return await request.json();

  }, [token]);

  /**
   * Obtiene el OWNERID por el ID de usuario de hubspot
   */
  const getHubspotUserByUserId = useCallback(async (userId) => {
    const request = await fetch(`${process.env.FLEX_APP_TWILIO_SERVERLESS_DOMAIN}/fetchHubspotOwner`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        by: 'userId',
        userId,
        Token: token
      })
    });

    return await request.json();

  }, [token]);

  /**
   * Obtiene el UserID por el OwnerID de Hubspot
   */
  const getHubspotUserByOwnerId = useCallback(async (id) => {
    const request = await fetch(`${process.env.FLEX_APP_TWILIO_SERVERLESS_DOMAIN}/fetchHubspotOwner`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        by: 'id',
        id,
        Token: token
      })
    });

    return await request.json();

  }, [token]);

  return {
    getHubspotUserByEmail,
    getHubspotUserByUserId,
    getHubspotUserByOwnerId
  }
}

export default useApi;