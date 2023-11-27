
export type SectionItemElement = {
    label: string
    component?: string
    childrens?: Array<SectionItemElement>
}

export type Hours = { begin: string, end: string }
export type HoopRows = { id?: number, dayOfWeek: string, key: string, begin: string, end: string }

export type Days = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export namespace ApiService {
    export type ResponseLinks = {
        self: string
        related?: string
    }

    export type RegularHoursAttributes = {
        queue: string | null
        day: Days
        begin: string
        end: string
    }
    export type RegularHoursRelationships = {
        country: { links: ResponseLinks }
    }

    export type RegularHourResponse = {
        type: 'regular-hours'
        id: number
        attributes: RegularHoursAttributes
        relationships?: RegularHoursRelationships
        links?: ResponseLinks
    }

    export type CountryAttributes = {
        SFBusinessISOAlpha2: string
        language: string
        secondaryLanguage: string
        label: string
        errorTTS: string
        emergencyShutdown: boolean
        emergencyShutdownMessage: string
        timezone: string,
        offlineMessage: string
    }

    export type CountryResponse = {
        type: 'countries'
        id: string
        attributes: CountryAttributes
        relationships?: {
            [key: string]: any
        }
        links?: ResponseLinks
        included: Array<RegularHourResponse>
    }

    export type HolidaysAttributes = {
        country_code: string
        date: string
        offlineMessage: string
        description: string
    }

    export type HolidaysResponse = {
        type: 'holidays'
        id: string
        attributes: HolidaysAttributes
        relationships?: {
            [key: string]: any
        }
        links?: ResponseLinks
    }

    export type PartialDaysAttributes = {
        country_code: string
        date: string
        begin: string
        end: string
        queue: string
        offlineMessage: string
        description: string
    }

    export type PartialDaysResponse = {
        type: 'partial-days'
        id: number
        attributes: PartialDaysAttributes
        relationships?: {
            [key: string]: any
        }
        links?: ResponseLinks
    }

    export type PartialDayTmp = {
        id?: number,
        key: string,
        date: string
        begin: string
        end: string
        offlineMessage: string
        description: string
    }

    export type PartialDaysRequest = {
        type: 'partial-days'
        id?: number
        attributes: {
            date: string
            begin: string
            end: string
            queue: string
            offlineMessage: string
            description: string
        }
        relationships?: {
            [key: string]: any
        }
    }

    export type PartialDay = {
        id?: number
        queue?: string
        end: string
        begin: string
        offlineMessage: string
        description: string
    }

    export type PartialDays = {
        [key: string]: {
            [key: string | number]: PartialDay
        }
    }

    export type DowntimeManagerHoliday = {
        id: number,
        offlineMessage: string,
        description: string
    }

    export type DowntimeManagerHolidays = {
        [key: string]: DowntimeManagerHoliday
    }

    export type WrapupCodes = {
        value: number,
        label: string
    }

    export type WrapupCodesResponse = {
        type: 'wrapup-codes'
        id: number
        attributes: WrapupCodesAttributes
        relationships: {
            country: {
                links: ResponseLinks
            }
        }
        links?: ResponseLinks
    }

    export type WrapupCodesAttributes = {
        name: string
    }

    export type WrapupCodeRequest = {
        type: 'wrapup-codes'
        attributes: WrapupCodesAttributes
        relationships?: {
            [key: string]: any
        }
    }

    export type QueueWrapupCodesRequest = {
        type: 'wrapup-codes',
        id: string,
    }

    export type WrapupCodeTmp = {
        name: string
    }

    export type QueueWrapupCodesTmp = {
        [key: number]: boolean
    }
}

export type HolidayObject = { id?: number, date: string, offlineMessage: string, key: string, description: string }

export type DowntimeManagerTime = { end: string, begin: string }
export type DowntimeManagerPartialDaysConfig = { [key: string]: { [key: string]: DowntimeManagerTime & { offlineMessage: string, description?: string } } }
export type DowntimeManagerEmergencyConfig = { emergencyShutdown: boolean, emergencyShutdownMessage: string }
export type DowntimeManagerRegularHoursConfig = { weeklyTimings: { [key: string]: { [key: string]: DowntimeManagerTime[] } }, offlineMessage: string }
export type DowntimeManagerHolidaysConfig = { [key: string]: { offlineMessage: string, description: string } }
export type DowntimeManagerConfig = {
    generalSettings: { timezone: string }
    partialDays: DowntimeManagerPartialDaysConfig
    emergencySettings: DowntimeManagerEmergencyConfig
    regularHours: DowntimeManagerRegularHoursConfig,
    holidays: DowntimeManagerHolidaysConfig
}