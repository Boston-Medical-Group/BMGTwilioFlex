const request = async (path, manager, params) =>{
    const body = {
        ...params,
        Token: manager.store.getState().flex.session.ssoTokenPayload.token
    };

    const options = {
        method: 'POST',
        body: new URLSearchParams(body),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
    };

    const { FLEX_APP_TWILIO_SERVERLESS_DOMAIN } = process.env;
    console.log('REQUEST BASE URL: ', FLEX_APP_TWILIO_SERVERLESS_DOMAIN, ' PATH:', path);
    return await fetch(`${FLEX_APP_TWILIO_SERVERLESS_DOMAIN}/${path}`, options).then(d=>d.json()).catch(e=>{return {statusCode:"500"}})
    return (await resp.json())
}

export {
    request
}