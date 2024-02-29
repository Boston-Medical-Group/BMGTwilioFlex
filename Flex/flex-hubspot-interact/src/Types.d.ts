export type HubspotContact = {
    firstname?: string
    lastname?: string
    phone?: string
    hs_object_id?: string
    email?: string
    reservar_cita?: string
    donotcall?: boolean|string
    [key: string]: any
}

export type HubspotDeal = {
    dealname?: string
    dealstage?: string
    hs_object_id?: string
    reservar_cita?: string
    [key: string]: any
}

export type CallCardType = {
    contact?: HubspotContact,
    deal?: HubspotDeal
}