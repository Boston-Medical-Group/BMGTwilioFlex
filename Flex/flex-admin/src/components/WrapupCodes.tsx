import { useState, useEffect, ChangeEvent, ChangeEventHandler } from 'react';
import { Button } from '@twilio-paste/core/button';
import { Label } from '@twilio-paste/core/label';
import { Stack } from '@twilio-paste/core/stack';
import { PlusIcon } from '@twilio-paste/icons/esm/PlusIcon';
import { Box } from '@twilio-paste/core/box';
import { useUID } from '@twilio-paste/core/uid-library';
import {
    Flex as FlexView, Text, Modal, ModalHeader, ModalHeading, ModalBody, ModalFooter, ModalFooterActions,
    Option, Select, Alert, Spinner, useToaster, Toaster, Input, Paragraph, Heading, Card, Switch
} from '@twilio-paste/core';
import { Table, THead, TBody, Tr, Td, Th } from '@twilio-paste/core';
import { loadWrapupCodes, loadQueueWrapupCodes, saveWrapupCodes, loadQueues, saveQueueWrapupCodes } from '../helpers';
import { AxiosError } from 'axios';
import { ApiService } from '../Types';
import * as Flex from '@twilio/flex-ui';
import { Theme } from '@twilio-paste/core/dist/theme';

type Props = {
    manager: Flex.Manager
}

const WrapupCodes = ({ manager } : Props) => {
    const [isLoadingWrapupCodes, setIsLoadingWrapupCodes] = useState(false);
    const [wrapupCodes, setWrapupCodes] = useState<Array<ApiService.WrapupCodes>>([])
    const [value, setValue] = useState<{ [key: number]: boolean }>({});
    const [queue, setQueue] = useState<string>();
    const [showNewWrapupCodeModal, setShowNewWrapupCodeModal] = useState(false);
    const toaster = useToaster()

    useEffect(() => {
        loadQueuesIntoArray()
        loadWrapupCodes()
            .then(async (dataA: Array<ApiService.WrapupCodes>) => {
                setWrapupCodes(dataA)

            })
            .catch((err: AxiosError) => {
                toaster.push({
                    message: err.message,
                    variant: 'error',
                    dismissAfter: 3000
                })
            })
            .finally(() => {

            })
    }, [])

    // Load queues
    const loadQueuesIntoArray = async () => {
        let loadedQueues = await loadQueues();   
        
        setQueues(loadedQueues);
    }

    const initQueueWrapupCodes = () => {
        if (queue === null || queue === "" || queue === undefined) {
            return;
        }
        
        setIsLoadingWrapupCodes(true)
        loadQueueWrapupCodes(queue)
            .then((dataB: Array<ApiService.WrapupCodes>) => {
                let values : { [key: string] : boolean } = {};
                wrapupCodes.forEach((wc, i) => {
                    values[wc.value] = dataB.findIndex((dwc) => +dwc.value === +wc.value) >= 0
                });
                setValue(values)
            })
            .catch((err: AxiosError) => {
                toaster.push({
                    message: err.message,
                    variant: 'error',
                    dismissAfter: 3000
                })
            })
            .finally(() => {
                setIsLoadingWrapupCodes(false)
            })
    }

    useEffect(() => {
        initQueueWrapupCodes()
    }, [queue])
    
    // Maneja el cambio de cola
    const handleChangeQueue = (e: ChangeEvent<HTMLSelectElement>) => {
        setQueue(e.target.value);
    };

    const [isSaving, setIsSaving] = useState(false)
    const [newWrapupCodeTmp, setNewWrapupCodeTmp] = useState<ApiService.WrapupCodeTmp>()
    const handleOpen = () => {
        setNewWrapupCodeTmp({
            name: '',
        })
        setShowNewWrapupCodeModal(true);
    }
    const handleClose = () => setShowNewWrapupCodeModal(false);
    const modalHeadingID = useUID();

    const handleChangeItem = (evt : any) => {
        setNewWrapupCodeTmp((prev: any) => ({ ...prev, name: evt.target.value }))
    }

    const handleSaveWrapupCode = () => {
        setIsSaving(true)
        saveWrapupCodes(queue as string, newWrapupCodeTmp as ApiService.WrapupCodeTmp).then(() => {
            loadWrapupCodes()
                .then((data) => {
                    setWrapupCodes(data)
                    data.forEach((wc) => {
                        if (value[wc.value] === undefined) {
                            setValue((prev) => ({...prev, [wc.value] : false}))
                        }
                    })
                    setIsSaving(false)
                })
                .catch((err: AxiosError) => {
                    toaster.push({
                        message: err.message,
                        variant: 'neutral',
                        dismissAfter: 3000
                    })
                })
                .finally(() => {
                    handleClose()
                })
        })
    }

    const handleSaveQueueWrapupCode = (id: number) => { 
        setIsSaving(true)
        saveWrapupCodes(queue as string, newWrapupCodeTmp as ApiService.WrapupCodeTmp)
        loadWrapupCodes()
            .then(() => {
                setIsSaving(false)
            })
            .catch((err: AxiosError) => {
                toaster.push({
                    message: err.message,
                    variant: 'neutral',
                    dismissAfter: 3000
                })
            })
            .finally(() => {
                handleClose()
            })
    }
    
    const [queues, setQueues] = useState<Array<any>>([])
        
    const [selectedWrapupCodes, setSelectedWrapupCodes] = useState<Array<ApiService.WrapupCodes>>([]);
    const setChecked = (id: number, val: boolean) => {
        setIsSaving(true)
        let newV = ({ ...value, [id]: val })
        setValue((v) => ({ ...v, [id]: val }))
        saveQueueWrapupCodes(queue as string, newV as ApiService.QueueWrapupCodesTmp)
            .then(() => {
            })
            .catch((err: AxiosError) => {
                toaster.push({
                    message: err.message,
                    variant: 'neutral',
                    dismissAfter: 3000
                })
            })
            .finally(() => {
                setIsSaving(false)
            })
    }
    /*
    const handleChangeSelectedWrapupCodes = (evt: any) => {
        console.log(value)

        let newValues = value != undefined ? value : {}
        newValues[+evt.target.value] = true;  //evt.target.checked

        setValue(newValues)
        console.log(newValues, value)
    }
    */

    const handleChangeValueWrapupCodes = (evt: any) => {
        
    }

    const isQueueSelected = () => queues.findIndex((i) => i.queue_sid === queue) >= 0

    return (
        <Theme.Provider theme="flex">
            {showNewWrapupCodeModal &&
                <Modal ariaLabelledby={modalHeadingID} isOpen={showNewWrapupCodeModal} onDismiss={handleClose} size="default">
                    <ModalHeader>
                        <ModalHeading as="h3" id={modalHeadingID}>
                            New wrapup code
                        </ModalHeading>
                    </ModalHeader>

                    <ModalBody>
                        <Stack orientation="horizontal" spacing="space60">
                            <Stack orientation="vertical" spacing="space20">
                                <Label htmlFor=''>Wrapup Code name</Label>
                                <Input
                                    type='text'
                                    placeholder='Wrapup code name'
                                    onChange={handleChangeItem}
                                />
                            </Stack>

                        </Stack>
                    </ModalBody>

                    <ModalFooter>
                        <ModalFooterActions>
                            <Button variant="secondary" onClick={handleClose} disabled={isSaving}>
                            Cancel
                            </Button>
                            <Button variant="primary" onClick={handleSaveWrapupCode} loading={isSaving}>Save</Button>
                        </ModalFooterActions>
                    </ModalFooter>
                </Modal>
            }

            <FlexView grow padding="space50">
                <Card style={{ width: '100%' }}>
                    <Heading as="h2" variant="heading20">Wrapup Codes</Heading>
                    
                    <Stack orientation="vertical" spacing="space60">

                        <Toaster {...toaster} />

                        {isLoadingWrapupCodes &&
                            <Alert variant="neutral">
                                <Stack orientation="horizontal" spacing="space60">
                                    <Spinner decorative={true} title="Loading" size="sizeIcon30" />
                                    <Text as="span">Wrapup codes are being loaded</Text>
                                </Stack>
                            </Alert>
                        }
                            
                        <Box>
                            <FlexView hAlignContent="between">
                                <Stack orientation="horizontal" spacing="space60" >
                                    <Label htmlFor=''>Wrapup codes:</Label>
                                    
                                    <Button variant="secondary" onClick={() => handleOpen()} disabled={isSaving}>
                                        {' '}
                                        <PlusIcon decorative={false} title="Add Row" /> Add code
                                    </Button>

                                </Stack>

                                <Stack orientation="horizontal" spacing="space60">
                                    <Label htmlFor=''>&nbsp;</Label>
                                    <Select onChange={handleChangeQueue} value={queue || ""} disabled={isSaving}>
                                        <Option value="">-- Select a queue --</Option>
                                        {
                                            queues.map(q => (
                                                <Option value={q.queue_sid} key={q.queue_sid}>{q.queue_name}</Option>
                                            ))
                                        }
                                    </Select>
                                </Stack>
                            </FlexView>
                            <br />

                            {!isQueueSelected() &&
                                <Paragraph>
                                    <Text textAlign="center" as="span">Select a queue to continue</Text>
                                </Paragraph>
                            }

                            {isQueueSelected() && wrapupCodes.length === 0 && <Paragraph>No wrapup codes yet.</Paragraph>}

                            {isQueueSelected() && wrapupCodes.length > 0 && isLoadingWrapupCodes && (
                                <Spinner decorative={true} />
                            )}

                            {isQueueSelected() && wrapupCodes.length > 0 && !isLoadingWrapupCodes && value && (
                                <Box padding="space0">
                                    <Paragraph>Puede activar los códigos que deseé habilitar para la cola seleccionada</Paragraph>
                                    <Table>
                                        <THead>
                                            <Tr>
                                                <Th>Wrapup Code</Th>
                                            </Tr>
                                        </THead>
                                        <TBody>
                                            {wrapupCodes.map((wrapupCode: ApiService.WrapupCodes, iter) => (
                                            <Tr key={wrapupCode.value}>
                                                <Td>
                                                        <Switch
                                                            value={wrapupCode.value}
                                                            checked={value[wrapupCode.value] ?? false}
                                                            onChange={() => setChecked(wrapupCode.value, !value[wrapupCode.value])}
                                                            disabled={isSaving}>{wrapupCode.label}</Switch>
                                                </Td>
                                            </Tr>
                                            ))}
                                        </TBody>
                                    </Table>
                                    </Box>
                            
                            )}
                        </Box>
                    </Stack>
                </Card>
            </FlexView>
            </Theme.Provider>
    );
}

export default WrapupCodes;