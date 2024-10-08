# Changelog

## 01/10/2024
* Modifica carga de IA en Flex.

## 12/09/2024
* Fix para formatear un telefono correctamente

## 09/09/2024
* Fix para obtener las conversaciones de MX con prefijos 521 y 52

## 04/09/2024
* Optimiza carga de notificaciones

## 29/08/2024
* Agrega log a fetchHubspotContact
* Actualiza SDK OpenAI para assistant v2

## 27/08/2024
* Corrige bug en telefonos cuando vienen como enteros y no string
* Implementa Assistants para PE, MX, EC

## 22/08/2024
* Actualiza version twilio cli para despligues

## 27/06/2024
* Agrega tarea para nobody

## 26/06/2024
* Implementa idiomas
* Actualización de dependencias

## 17/06/2024
* Upgrade a plantillas de content template builder
* Corrige fetch de contactos hubspot

## 17/05/2024
* cambios de GeoPermission

## 07/05/2024
* Fuerza despliegue perú

## 23/04/2024
* Fuerza despliegue

## 22/04/2024
* Log en grabación de llamada
* Agrgega variables y fuerza deploy
* Quita resumen hubspot de conversaciones cortas

## 18/04/2024
* Corrige nota call
* Ajusta UI Interacción
* Agrega log SMS

## 15/04/2023
* Agrega variables PER y ARG
* Fuerza deploy

## 01/04/2023
* Fuerza deploy

## 22/03/2023
* Limpieza
* Optimiza prompt resumen
* Fuerza despliegue
* Update versiones

## 21/03/2023
* Agrega funcion para envío de SMS desde Hubspot

## 20/03/2023
* Agrega nueva tarjeta de contacto
* Agrega nuevos resumenes AI de conversaciones
* Agrega nueva sugerencia de respuesta AI a conversacions
* Corrige nota hubspot
* Agrega terser a plugin

## 13/03/2023
* Corrige nota resumen

## 09/03/2023
* Agrega funciones para optout
* Modifica funcion de studio para optin
* Actualiza plugin de interacciones para optout de whatsapp

## 08/03/2023
* Agrega summary a log de chat en hubspot

## 07/03/2023
* Agrega summary gpt

## 06/03/2023
* Ajustes de optout y agrega keywords

## 05/03/2024
* Agrega optout/in whatsapp

## 01/02/2024
* Seleccion de telefono a llamar
* Correccion seguridad

## 29/02/2024
* Optout de llamada

## 22/02/2024
* Correcciones en historial de chat
* Agrega códigos de error

## 08/02/2024
* Log chat history

## 07/02/2024
* Autoriza IA
* Corrige bindingAddress
* Fuerza deploy
* Deploy de functions
* Fuerza redeploy
* Update de plugins correcciones y envvars

## 06/02/2024
* Agrega log y ajusta token hubspot ECU

## 05/02/2024
* Busca contactos por telefono sin código país

## 02/02/2024
* Agrega quick call desde chat

## 01/02/2024
* Fuerza deploy

## 31/01/2024
* Prueba webhook por url
* Reemplaza parametros ts
* Corrige bug
* Expira conversaciones en 24H

## 30/01/2024
* Actualiza log de IVR
* Corrige bug
* Agrega funcion de mensaje directo workflow hubspot
* Force deploy
* Corrige creación de participante
* Corrige flujo de studio
* Force deploy
* Logs callerid COL
* Mas log
* Corrige caller ids

## 26/01/2024
* Force deploy

## 25/01/2024
* Corrige variables de entorno
* Corrige polling
* Implementa ReactQuery
* Corrige env var
* Agrega funciones para insights de IVR
* Update de variables de despliegue
* Corrige el size de paginacion de pools de callerid de 15 a 150

## 24/01/2024
* Agrega funcion IA
* Modifica comportamiento IA

## 23/01/2024
* Agrega log a fetchCallerId

## 22/01/2024
* Modifica comportamiento de tarjeta de interacción
* Corrige problema de CRMID en log

## 19/01/2024
* Quita loop de notificación de mensaje

## 18/01/2024
* Upgrade de versiones FlexUI
* Corrección de token agentes

## 17/01/2024
* Corrige access token
* Update de carga de crmid
* Mejoras en api de fetchHubspotContact
* Correccion en carga de datos hubspot

## 16/01/2024
* Modificacion en pool ddi
* correccion en logs
* ajustes en funciones

## 12/01/2024
* Agrega poll de URL calendario de contactos para actualizarla en caso que aún no exista
* Rewrite del flujo en contactación whatsapp con reporte de error
* Agrega plantillas de whatspp
* Pasos a TS
* Correcciones, etc.

## 03/01/2024
* Corrige deploy
* Corrección dependencia Twilio

## 21/12/2023
* Implementa pools para callerIds

## 05/12/2023
* Corrige URL calendario cita desde contacto.
* Corrige leads con deal vacio

## 04/12/2023
* Outcomes automaticos
* Corrige log y agrega log de llamadas canceladas
* Ajusta callback para usar idiomas
* Creación de leads en su país
* Corrige propiedades obtenidas para un deal
* Corrige URI api call
* Crea y carga plantillas de WA desde asset para cada país
* Corrige contexto

## 29/11/2023
* Nuevos deploys
* Reescribe callback
* Corrige log

## 28/11/2023
* Actualiza dependencias de funciones calling (momentjs)
* Actualiza URL Servicio Manager de Flex
* Corrige paths de funciones serverless
* Corrige path de funciones en directorios
* Corrige url de assets
* Agrega traducciones
* Ajuste en logs
* Correccion en condicion
* Corrige env vars

## 27/11/2023
* Agrega funciones de Admin y plugin Admin
* Agrega funciones de calling
* Agrega ctd a paquete

## 24/11/2023
* Agrega identificación de agente en Flex y en log de Llamadas/Chat

## 23/11/2023
* Deploy DEV y ECU
    