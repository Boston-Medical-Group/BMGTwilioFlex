import { useCallback } from "react";

const useApi = ({ token }) => {

  async function loadHubspotData(data, newToken) {
    let bodytoSend = {};
    if (data.contact_id) {
      bodytoSend = {
        contact_id: data.contact_id,
        Token: token
      }
    } else if (data.deal_id) {
      bodytoSend = {
        deal_id: data.deal_id,
        Token: newToken ?? token
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

  const getDataByContactId = useCallback(async ({ contact_id, newToken }) => {
    const request = await fetch(`${process.env.FLEX_APP_TWILIO_SERVERLESS_DOMAIN}/fetchHubspotContact`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contact_id : contact_id,
        Token: newToken ?? token
      })
    });

    return await request.json();

  }, [token]);

  const getDataByDealId = useCallback(async ({ deal_id, newToken }) => {
    const request = await fetch(`${process.env.FLEX_APP_TWILIO_SERVERLESS_DOMAIN}/fetchHubspotContact`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        deal_id: deal_id,
        Token: newToken ?? token
      })
    });

    return await request.json();

  }, [token]);

  const getTemplates = useCallback(async (data, newToken) => {

    const request = await fetch(`${process.env.FLEX_APP_TWILIO_SERVERLESS_DOMAIN}/fetchTemplate`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data,
        Token: newToken ?? token
      })
    });

    return await request.json();

  }, [token]);

  const getContents = useCallback(async (data, newToken) => {

    const request = await fetch(`${process.env.FLEX_APP_TWILIO_SERVERLESS_DOMAIN}/fetchContent`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data,
        Token: newToken ?? token
      })
    });

    return await request.json();

  }, [token]);

  const getTemplate = useCallback(async (data, newToken) => {

    const request = await fetch(`${process.env.FLEX_APP_TWILIO_SERVERLESS_DOMAIN}/fetchTemplate`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data,
        Token: newToken ?? token
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

  const sendMessage = useCallback(async (contentSid, contentVariables, conversationSid) => {

    const request = await fetch(`${process.env.FLEX_APP_TWILIO_SERVERLESS_DOMAIN}/sendMessage`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contentSid,
        contentVariables,
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
    getContents,
    sendOutboundMessage,
    startOutboundConversation,
    getMessageErrors,
    sendMessage
  }
}

export default useApi;