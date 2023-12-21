export type HubspotContact = {
    firstname?: string
    lastname?: string
    phone?: string
    hs_object_id?: string
}

export type CallCardType = {
    data?: HubspotContact,
    dealId?: string | null
}