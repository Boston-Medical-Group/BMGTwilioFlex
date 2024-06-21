export type HubspotContact = {
    firstname?: string
    lastname?: string
    phone?: string
    hs_object_id?: string
    email?: string
    reservar_cita?: string
    donotcall?: boolean | string
    numero_de_telefono_adicional?: string
    numero_de_telefono_adicional_?: string
    whatsappoptout?: boolean | string
    country?: string
    createdate?: string
    lastmodifieddate?: string
    [key: string]: any
}

export type HubpostContactType = undefined |{
    contact?: HubspotContact,
    deal?: HubspotDeal
}

export type HubspotContactRaw = {
    id: string
    properties: HubspotContact
    createdAt?: string
    updatedAt?: string
    archived?: boolean
    deal?: HubspotDeal
}