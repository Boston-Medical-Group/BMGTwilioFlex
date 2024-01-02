import { useCallback } from "react";

const useApi = ({ token }) => {

  //console.log('JRUMEAU', 'useApi')
  const getCalendarUrl = useCallback(async (task) => {
    const request = await fetch(`${process.env.FLEX_APP_TWILIO_SERVERLESS_DOMAIN}/getCalendarUrl`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        calendar_url_field: process.env.FLEX_APP_CALENDAR_URL_FIELD,
        contact_id: task?.attributes?.hubspot_contact_id,
        deal_id: task?.attributes?.hubspot_deal_id,
        Token: token
      })
    });

    return await request.json();

  }, [token]);

  return {
    getCalendarUrl,
  }
}

export default useApi;