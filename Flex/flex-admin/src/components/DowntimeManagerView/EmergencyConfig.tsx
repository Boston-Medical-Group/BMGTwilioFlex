import { useState, useEffect, ChangeEvent, ChangeEventHandler } from 'react';
import { ApiService } from '../../Types'
import { Button, Radio, RadioGroup, Stack, TextArea, Box, Label, useToaster, Toaster } from '@twilio-paste/core';
import { AxiosResponse } from 'axios';

type Props = { country: ApiService.CountryResponse, saveHandler: (values: any) => Promise<AxiosResponse<any, any>> }
const EmergencyConfig = ({ country, saveHandler } : Props) => {
    const [unplannedShutdownFlag, setUnplannedShutdownFlag] = useState(false);
    const [unplannedShutdownMessage, setUnplannedShutdownMessage] = useState('');
    const [isSaving, setIsSaving] = useState(false)
    const toaster = useToaster()

    useEffect(() => {
        initFields()
    }, [country]);

    const initFields = () => {
        if (country !== undefined) {
            setUnplannedShutdownFlag((og) => country.attributes.emergencyShutdown || og);
            setUnplannedShutdownMessage((og) => country.attributes.emergencyShutdownMessage || og);
        }
    }

    useEffect(() => {
        if (unplannedShutdownFlag === false) {
            setUnplannedShutdownMessage('');
        }
    }, [unplannedShutdownFlag]);

    const handleUnplannedShutdownFlagChange = (e : string) => {
        setUnplannedShutdownFlag((orig) => !orig);
    };

    const handleUnplannedShutdownMessageChange = (e : ChangeEvent<HTMLTextAreaElement> & ChangeEventHandler<HTMLTextAreaElement>) => {
        setUnplannedShutdownMessage(e.target.value);
    };

    const save = () => {
        setIsSaving(true);
        saveHandler({
            emergencyShutdown: unplannedShutdownFlag,
            emergencyShutdownMessage: unplannedShutdownMessage
        })
            .then(() => {
                toaster.push({
                    message: 'Emergency downtime settings saved!',
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
            <Toaster {...toaster} />

            <Box>
                <RadioGroup
                    value={`${unplannedShutdownFlag}`}
                    legend="Emergency Downtime:"
                    helpText="This will setup an automatic response for all incoming communications"
                    name="emergency-switch"
                    onChange={handleUnplannedShutdownFlagChange}
                >
                    <Radio name="emergency-switch" id={'true'} value={'true'}>
                        Enabled
                    </Radio>
                    <Radio name="emergency-switch" id={'false'} value={'false'}>
                        Disabled
                    </Radio>
                </RadioGroup>
            </Box>

            {unplannedShutdownFlag === true && (
                <Box>
                    <Label htmlFor='offline_message'>Offline Message:</Label>
                    <TextArea
                        name='offline_message'     
                        placeholder="Offline Message"
                        value={unplannedShutdownMessage}
                        onChange={handleUnplannedShutdownMessageChange}
                    />
                </Box>
            )}

            <Stack orientation="horizontal" spacing="space60">
                <Button variant="primary" loading={isSaving} onClick={save}>Save</Button>
                <Button variant="reset" disabled={isSaving} onClick={cancel}>Cancel</Button>
            </Stack>
        </Stack>
    );
}

export default EmergencyConfig;