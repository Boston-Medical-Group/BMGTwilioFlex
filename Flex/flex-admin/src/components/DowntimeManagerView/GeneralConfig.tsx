import moment from 'moment-timezone';
import { useState, useEffect } from 'react';
import { Combobox, TextArea, Text, Button, useToaster } from '@twilio-paste/core';

import {fetchTimezoneList} from '../../helpers'
import { Stack } from '@twilio-paste/core';
import { ApiService } from '../../Types';
import { AxiosResponse } from 'axios';

type Props = { country: ApiService.CountryResponse, saveHandler: (values: any) => Promise<AxiosResponse<any, any>> }
const GeneralConfig = ({ country, saveHandler } : Props) => {
    const [timezoneDictionary, setTimezoneDictionary] = useState<string[]>([]);
    const [timezone, setTimezone] = useState(moment.tz.guess());
    const [timezoneFilteredOptions, setTimezoneFilteredOptions] = useState<string[]>([]);
    const [offlineMessage, setOfflineMessage] = useState('')
    
    const loadTimezoneDictionary= async ()=>{
        const allTimezones = await fetchTimezoneList();
        setTimezoneDictionary(allTimezones);
        setTimezoneFilteredOptions(allTimezones);
    }
  
    useEffect(() => {
        loadTimezoneDictionary();
    }, []);
    
    useEffect(() => {
        initFields();
    }, [country]);

    useEffect(() => {
    }, [timezoneDictionary]);

    const initFields = () => {
        setTimezone((og) => country?.attributes.timezone || og);
        setOfflineMessage((og) => country !== undefined ? country.attributes.offlineMessage : og );
    }

    const [isSaving, setIsSaving] = useState(false)
    const toaster = useToaster()

    const save = () => {
        setIsSaving(true);
        saveHandler({
            timezone,
            offlineMessage
        })
            .then(() => {
                toaster.push({
                    message: 'General settings saved!',
                    variant: 'success',
                    dismissAfter: 3000
                })
            })
            .catch((err) => {
                toaster.push({
                    message: err.message,
                    variant: 'error',
                    dismissAfter: 3000
                })
            })
            .finally(() => {
                setIsSaving(false);
            })
    }

    const cancel = () => {
        initFields()
    }

    return (
        <Stack orientation="vertical" spacing="space60">
            <Combobox
                autocomplete
                items={timezoneFilteredOptions}
                labelText="Select a Timezone"
                selectedItem={timezone}
                onSelectedItemChange={(changes) => {
                    setTimezone(changes.selectedItem);
                }}
                onInputValueChange={({ inputValue }) => {
                    if (inputValue === undefined) {
                        setTimezoneFilteredOptions(timezoneDictionary);
                        return;
                    }

                    setTimezoneFilteredOptions(
                        timezoneDictionary.filter((item) => {
                            return item.toLowerCase().indexOf(inputValue.toLowerCase())>=0;
                        }),
                    );
                }}
            />

            <Stack orientation="vertical" spacing="space60">
                <Text as="label">Offline Message</Text>
                <TextArea value={offlineMessage} onChange={(changes) => {
                    setOfflineMessage(changes.target.value)
                }} />
            </Stack>

            <Stack orientation="horizontal" spacing="space60">
                <Button variant="primary" loading={isSaving} onClick={save}>Save</Button>
                <Button variant="reset" disabled={isSaving} onClick={cancel}>Cancel</Button>
            </Stack>
                
        </Stack>
    );
}

export default GeneralConfig;