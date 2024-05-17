import { useCallback } from "react";

const useApi = ({ token }) => {
    async function loaddialingPermissions(data, newToken) {
    const request = await fetch(`${process.env.FLEX_APP_TWILIO_SERVERLESS_DOMAIN}/studio/loadDialingPermissions`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({Token: newToken ?? token})
      });
      return await request.json();
    }

    async function updateDialingPermissions(data, newToken) {
    const request = await fetch(`${process.env.FLEX_APP_TWILIO_SERVERLESS_DOMAIN}/studio/updateDialingPermissions`, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({Token: newToken ?? token, data: data})
      });
      return await request.json();
    }
  
    return {
        loaddialingPermissions,
        updateDialingPermissions
    }   
}

export default useApi;