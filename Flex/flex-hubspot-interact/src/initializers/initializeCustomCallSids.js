import * as Flex from "@twilio/flex-ui";

export const initializeCustomCallSids = (flex, manager) => {

    Flex.Actions.replaceAction("StartOutboundCall", (payload, original) => {
        if (payload.callerId) {
            original(payload);
        } else {
            fetch(`${process.env.FLEX_APP_TWILIO_SERVERLESS_DOMAIN}/callerid/fetchCallerId`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    queueSid: payload.queueSid ?? null,
                    Token: manager.store.getState().flex.session.ssoTokenPayload.token
                })
            })
            .then((response) => response.json())
            .then((data) => {
                // Obtener el número de teléfono dinámico
                const dynamicNumber = data.callerId;

                // Actualizar el destino de la llamada saliente con el número de teléfono dinámico
                payload.callerId = dynamicNumber;
                // Invocar la acción original con el payload actualizado
                original(payload);
            })
            .catch((error) => {
                original(payload);
            });
        }
    });
}