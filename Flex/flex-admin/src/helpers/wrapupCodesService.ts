import * as Flex from '@twilio/flex-ui';
import { ApiService } from "../Types";
import axios, { Axios, AxiosError, AxiosResponse } from 'axios';

const manager = Flex.Manager.getInstance();
const accountCountry = manager.serviceConfiguration.attributes.account_country;

export const loadWrapupCodes = async (): Promise<Array<ApiService.WrapupCodes>> => {
    return new Promise(async (resolve, reject) => {
        let data : Array<ApiService.WrapupCodes> = [];
        let res: Array<ApiService.WrapupCodesResponse> = await axios.get(`wrapup-codes?filter[country]=${accountCountry}`)
            .then(result => result.data.data)
            .catch((err) => {
                reject(err);
            })
        
        res.forEach(wrapupCode => {
            data.push({
                value: +wrapupCode.id,
                label: wrapupCode.attributes.name
            })
        })

        resolve(data)
    })
}

export const saveWrapupCodes = async (queue: string, wrapupCodes: ApiService.WrapupCodeTmp): Promise<Axios> => {
    let body: { data: ApiService.WrapupCodeRequest } = {
        data: {
            type: 'wrapup-codes',
            attributes: wrapupCodes,
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
    
    return axios.post(`wrapup-codes`, body)    
}
// TODO Implementar o no implementar: Puede romper flex
export const deleteWrapupCode = async (id: number) => {
    // ...
}

export const loadQueueWrapupCodes = async (queue: string): Promise<Array<ApiService.WrapupCodes>> => {
    return new Promise(async (resolve, reject) => {
        let data: Array<ApiService.WrapupCodes> = [];
        let res: Array<ApiService.WrapupCodesResponse> = await axios.get(`queues/${queue}/wrapup-codes?filter[country]=${accountCountry}`)
            .then(result => result.data.data)
            .catch((err) => {
                reject(err);
            })
        
        res.forEach(wrapupCode => {
            data.push({
                value: +wrapupCode.id,
                label: wrapupCode.attributes.name
            })
        })

        resolve(data)
    })
}

export const saveQueueWrapupCodes = async (queue: string, wrapupCodes: ApiService.QueueWrapupCodesTmp) : Promise<Axios> => {
    let body: { data : Array<ApiService.QueueWrapupCodesRequest> } = {
        data: []
    }

    let keys = Object.keys(wrapupCodes)
    keys.forEach((key, index) => {
        if (wrapupCodes[+key] === true) {
            body.data.push({
                type: 'wrapup-codes',
                id: key
            })
        }
    })
    
    return axios.patch(`queues/${queue}/relationships/wrapup-codes?filter[country]=${accountCountry}`, body)
}