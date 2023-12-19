export const initializeCustomCallSids = (manager) => {

    flex.Actions.replaceAction("StartOutboundCall", async (payload, original) => {
        console.log('CALLERIDREPLACE', payload, original);
        return new Promise(async (resolve, reject) => {
            if (payload.callerId) {
                resolve(payload.callerId);
                return;
            }

            try {
                // Obtiene el callerId desde el pool
                const request = await fetch(`${process.env.FLEX_APP_TWILIO_SERVERLESS_DOMAIN}/callerid/fetchCallerId`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        queueSid: payload.queueSid ?? null,
                        Token: manager.store.getState().flex.session.ssoTokenPayload.token
                    })
                });

                // NOT Failsafe
                const result = await request.json();
                console.log('CALLERIDRESULT', result);
                resolve(result.callerId);
            } catch (error) {
                reject(error);
            }
        }).then((callerId) => {
            console.log('CALLERIDTOUSE', callerId);
            original({ ...payload, callerId: callerId });
        }).catch((error) => {
            console.log('CALLERIDDEFAULT');
            original(payload);
        });
    });
}