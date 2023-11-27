import * as Flex from '@twilio/flex-ui';
import { request } from './request';
import axios, { Axios, AxiosError, AxiosResponse } from 'axios';
import { formatReturnDate, formatReturnTime } from '@twilio-paste/core';
import { ApiService, Days, HoopRows, HolidayObject, DowntimeManagerConfig } from '../Types';

const manager = Flex.Manager.getInstance();
const accountCountry = manager.serviceConfiguration.attributes.account_country;

export const createDowntimeConfigMutex = async ()=>{

   return  request('create-downtime-config-mutex',manager,{})

}

export const releaseDowntimeConfigMutex = async ()=>{
  const manager = Flex.Manager.getInstance();
 
    return  request('release-downtime-config-mutex',manager,{})
 
 }

 export const updateDowntimeConfig = async (downtimeConfig : any)=>{
  const manager = Flex.Manager.getInstance();
 
    return  request('update-downtime-config',manager,{downtimeConfig:JSON.stringify(downtimeConfig)})
 
 }
 export const hasCreatedDowntimeConfigMutex = async ()=>{
  const manager = Flex.Manager.getInstance();
 
    return  request('check-downtime-config-mutex',manager,{})
 
 }




type ResponseDataSchedulingIncludedRegularHour = {
    type: string
    id: string
    attributes: {
        country_code: string
        queue: string
        day: Days
        begin: string
        end: string
    },
    links: { self: string }
}

type ApiResponse = {
    jsonapi: { version: string }
    links? : ApiResponseLinks
    data: RegularHourResponse
}
type ApiResponseCollection = {
    jsonapi: { version: string }
    links? : ApiResponseLinks
    data: RegularHourResponse[]
}
type ApiResponseLinks = {
    self: string
    related?: string
}
export type RegularHoursAttributes = {
    queue: string | null
    day: Days
    begin: string
    end: string
}
type RegularHoursRelationships = {
    country: { links: ApiResponseLinks }
}
type RegularHourResponse = {
    type: 'regular-hours'
    id: number
    attributes: RegularHoursAttributes
    relationships?: RegularHoursRelationships
    links? : ApiResponseLinks
}
type CountryAttributes = {
    SFBusinessISOAlpha2: string,
    language: string,
    secondaryLanguage: string,
    label: string,
    errorTTS: string,
    emergencyShutdown: boolean,
    emergencyShutdownMessage: string,
    timezone: string,
    offlineMessage: string
}
type CountryResponse = {
    type: 'countries'
    id: string
    attributes: CountryAttributes
    relationships?: {
        [key: string] : any
    }
    links?: ApiResponseLinks
    included: Array<RegularHourResponse>
}
type DowntimeManagerConfigWeeklyTimings = {
    [key: string] : {
        [key: string]: Array<{
            id?: number
            begin: string
            end: string
        }>
    }
}
export type DowntimeManagerConfigRegularHours = {
    weeklyTimings: DowntimeManagerConfigWeeklyTimings
    offlineMessage?: string
}

export const loadRemoteConfig = async () : Promise<DowntimeManagerConfig> => {
    let data : DowntimeManagerConfig | any = {};
    await axios.get(`countries/${accountCountry}?include=regularHours`)
        .then(result => {
            data = result.data
        })
        
    data.generalSettings = {
        timezone: data.data.attributes.timezone
    }

    data.partialDays = {}
    data.emergencySettings = {
        emergencyShutdown: data.data.attributes.emergencyShutdown,
        emergencyShutdownMessage: data.data.attributes.emergencyShutdownMessage
    }

    data.holidays = {}
    

    return data
}

export const loadRemoteConfigCountry = async () : Promise<ApiService.CountryResponse> => {
    return await axios.get(`countries/${accountCountry}`)
        .then(result => result.data.data)
}

export const saveRemoteConfigCountry = (country: ApiService.CountryResponse, values: any): Promise<AxiosResponse> => {
    let body : any = {
        data: {
            type: 'countries',
            id: country.id,
            attributes: values
        }
    }
    
    return axios.patch(`countries/${country.id}`, body)
}


export const loadRemoteConfigRegularHours = async (queue: string): Promise<DowntimeManagerConfigRegularHours> => {
    return new Promise(async (resolve, reject) => {
        let data: any = { weeklyTimings: {} };
        let res: Array<RegularHourResponse> = await axios.get(`regular-hours?filter[country]=${accountCountry}&filter[queue]=${queue}`)
            .then(result => result.data.data)
            .catch((err) => {
                reject(err);
            })
        
        res.forEach(regularHour => {
            let currentQueue = regularHour.attributes.queue == '' ? '_all' : regularHour.attributes.queue as string;
            
            if (!data.weeklyTimings[currentQueue]) {
                data.weeklyTimings[currentQueue] = {};
            }

            if (!data.weeklyTimings[currentQueue][regularHour.attributes.day]) {
                data.weeklyTimings[currentQueue][regularHour.attributes.day] = []
            }

            data.weeklyTimings[currentQueue][regularHour.attributes.day].push({
                id: regularHour.id,
                begin: formatReturnTime(regularHour.attributes.begin, 'HH:mm'),
                end: formatReturnTime(regularHour.attributes.end, 'HH:mm')
            })
        })

        resolve(data as DowntimeManagerConfigRegularHours)
    })
}

export const saveRegularHour = async (queue: string, hoopData: HoopRows) : Promise<void> => {
    let body : any = {
        data: {
            type: 'regular-hours',
            attributes: {
                queue: queue,
                day: hoopData?.dayOfWeek,
                begin: formatReturnTime(hoopData?.begin, 'HH:mm'),
                end: formatReturnTime(hoopData?.end, 'HH:mm')
            },
            relationships: {
                'country': {
                    data: {
                        type: 'countries',
                        id: accountCountry
                    }
                }
            }
        }
    }
    
    if (hoopData.id === undefined) {
        await axios.post(`regular-hours`, body)
    } else {
        body.data.id = hoopData.id
        await axios.patch(`regular-hours/${hoopData.id}`, body)
    }
}

export const deleteRegularHour = async (id: number): Promise<AxiosResponse<Axios, AxiosError>> => {
    return axios.delete(`regular-hours/${id}`)
}

export const loadRemoteHolidays = async () : Promise<ApiService.DowntimeManagerHolidays> => {
    return new Promise(async (resolve, reject) => {
        let data: any = {};
        let res: Array<ApiService.HolidaysResponse> = await axios.get(`holidays?filter[country]=${accountCountry}`)
            .then(result => result.data.data)
            .catch((err) => {
                reject(err);
            })
        
        res.forEach(holiday => {
            let newDate = formatReturnDate(holiday.attributes.date, 'MM/dd/yyyy')
            data[newDate] = {
                id: holiday.id,
                offlineMessage: holiday.attributes.offlineMessage,
                description: holiday.attributes.description
            }
        })

        resolve(data as ApiService.DowntimeManagerHolidays)
    })
}

export const saveRemoteHoliday = async (holiday: HolidayObject) : Promise<void> => {
    let body : any = {
        data: {
            type: 'holidays',
            attributes: {
                date: holiday?.date,
                offlineMessage: holiday.offlineMessage,
                description: holiday.description,
            },
            relationships: {
                'country': {
                    data: {
                        type: 'countries',
                        id: accountCountry
                    }
                }
            }
        }
    }
    
    if (holiday.id === undefined) {
        await axios.post(`holidays`, body)
    } else {
        body.data.id = holiday.id
        await axios.patch(`holidays/${holiday.id}`, body)
    }
}

export const deleteRemoteHoliday = async (id: number): Promise<AxiosResponse<Axios, AxiosError>> => {
    return axios.delete(`holidays/${id}`)
}


export const loadPartialDays = async (queue: string): Promise<ApiService.PartialDays> => {
    return new Promise(async (resolve, reject) => {
        let data: ApiService.PartialDays = { };
        let res: Array<ApiService.PartialDaysResponse> = await axios.get(`partial-days?filter[country]=${accountCountry}&filter[queue]=${queue}`)
            .then(result => result.data.data)
            .catch((err) => {
                reject(err);
            })
        
        res.forEach(partialDay => {
            let currentQueue = partialDay.attributes.queue == '' ? '_all' : partialDay.attributes.queue as string;
            
            if (!data[currentQueue]) {
                data[currentQueue] = {};
            }

            data[currentQueue][formatReturnDate(partialDay.attributes.date, 'MM/dd/yyyy')] = {
                id: partialDay.id,
                end: formatReturnTime(partialDay.attributes.end, 'HH:mm'),
                begin: formatReturnTime(partialDay.attributes.begin, 'HH:mm'),
                offlineMessage: partialDay.attributes.offlineMessage,
                description: partialDay.attributes.description
            }
        })

        resolve(data)
    })
}

export const savePartialDay = async (queue: string, partialDay: ApiService.PartialDayTmp) : Promise<Axios> => {
    let body: { data : ApiService.PartialDaysRequest } = {
        data: {
            type: 'partial-days',
            attributes: {
                queue: queue,
                date: partialDay.date,
                begin: formatReturnTime(partialDay?.begin, 'HH:mm'),
                end: formatReturnTime(partialDay?.end, 'HH:mm'),
                offlineMessage: partialDay.offlineMessage,
                description: partialDay.description
            },
            relationships: {
                'country': {
                    data: {
                        type: 'countries',
                        id: accountCountry
                    }
                }
            }
        }
    }
    
    if (partialDay.id === undefined) {
        return axios.post(`partial-days`, body)
    } else {
        body.data.id = partialDay.id
        return axios.patch(`partial-days/${partialDay.id}`, body)
    }
}

export const deletePartialDay = async (id: number): Promise<AxiosResponse<Axios, AxiosError>> => {
    return axios.delete(`partial-days/${id}`)
}