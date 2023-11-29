import urlJoin from 'url-join';

export const buildUrl = (...uris) => {
  const baseUrl = process.env.FLEX_APP_TWILIO_SERVERLESS_DOMAIN;
  return urlJoin(baseUrl, ...uris);
};
