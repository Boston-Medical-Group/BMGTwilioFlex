# FlexLogHubsportServerless

## Env
El token de hubspot debe tener los scopes necesarios para crear communications en Hubspot

ACCOUNT_SID=<SID de la cuenta>
AUTH_TOKEN=<Token de la cuenta>
HUBSPOT_TOKEN=<HUBSPOT Api Token>


# HubspotFetchContact

Funcion serverless de Twilio para obtener detalles de un contacto o crearlo en hubspot.

## Usar Funciones Studio
### Campos > FetchHubspotContact
```js
  let result = {
    crmid: '',
    firstname: '',
    lastname: '',
    fullname: '',
    lifecyclestage: 'lead'
  };
  ```

### Campos > CreateHubspotContact
```js
{
      properties: {
        firstname: 'Anonymous',
        lastname: 'Contact',
        phone: from,
        hs_lead_status: 'NEW',
        tipo_de_lead: 'Llamada',
      }
    }
```

## @todo
* Hacer dinamicos los parametros con los que se crea el contacto