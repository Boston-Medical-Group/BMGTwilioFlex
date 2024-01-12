import { useCallback } from "react";

const useApi = ({ token }) => {

  async function loadHubspotData(data) {
    let bodytoSend = {};
    if (data.contact_id) {
      bodytoSend = {
        crmid: data.contact_id,
        Token: manager.store.getState().flex.session.ssoTokenPayload.token
      }
    } else if (data.deal_id) {
      bodytoSend = {
        deal_id: data.deal_id,
        Token: manager.store.getState().flex.session.ssoTokenPayload.token
      }
    } else {
      return;
    }

    const request = await fetch(`${process.env.FLEX_APP_TWILIO_SERVERLESS_DOMAIN}/fetchHubspotContact`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodytoSend)
    });

    return await request.json();
  }

  const getDataByContactId = useCallback(async ({ contact_id }) => {
    const request = await fetch(`${process.env.FLEX_APP_TWILIO_SERVERLESS_DOMAIN}/fetchHubspotContact`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        crmid : contact_id,
        Token: token
      })
    });

    return await request.json();

  }, [token]);

  const getDataByDealId = useCallback(async ({ deal_id }) => {
    const request = await fetch(`${process.env.FLEX_APP_TWILIO_SERVERLESS_DOMAIN}/fetchHubspotContact`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        deal_id: deal_id,
        Token: token
      })
    });

    return await request.json();

  }, [token]);

  const getTemplates = useCallback(async (data) => {

    const request = await fetch(`${process.env.FLEX_APP_TWILIO_SERVERLESS_DOMAIN}/fetchTemplate`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data,
        Token: token
      })
    });

    return await request.json();

  }, [token]);

  const getTemplate = useCallback(async (data) => {

    const request = await fetch(`${process.env.FLEX_APP_TWILIO_SERVERLESS_DOMAIN}/fetchTemplate`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data,
        Token: token
      })
    });

    return await request.json();

  }, [token]);

  const sendOutboundMessage = useCallback(async ({ To, customerName, Body, WorkerFriendlyName, KnownAgentRoutingFlag, OpenChatFlag, hubspot_contact_id, hubspot_deal_id }) => {

    const request = await fetch(`${process.env.FLEX_APP_TWILIO_SERVERLESS_DOMAIN}/sendOutboundMessage`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        To,
        Body,
        customerName,
        WorkerFriendlyName,
        KnownAgentRoutingFlag,
        OpenChatFlag,
        hubspot_contact_id,
        hubspot_deal_id,
        Token: token
      })
    });

    return await request.json();

  }, [token]);

  const startOutboundConversation = useCallback(async ({ To, customerName, WorkerFriendlyName, KnownAgentRoutingFlag, OpenChatFlag, hubspotContact, hubspot_contact_id, hubspot_deal_id }) => {

    const request = await fetch(`${process.env.FLEX_APP_TWILIO_SERVERLESS_DOMAIN}/startOutboundConversation`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        To,
        customerName,
        WorkerFriendlyName,
        KnownAgentRoutingFlag,
        OpenChatFlag,
        hubspotContact,
        hubspot_contact_id,
        hubspot_deal_id,
        Token: token
      })
    });

    return await request.json();

  }, [token]);

  const getMessageErrors = useCallback(async (conversationSid) => {

    const request = await fetch(`${process.env.FLEX_APP_TWILIO_SERVERLESS_DOMAIN}/getMessageErrors`, {
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
    getDataByContactId,
    getDataByDealId,
    getTemplate,
    getTemplates,
    sendOutboundMessage,
    startOutboundConversation,
    getMessageErrors
  }
}

export default useApi;