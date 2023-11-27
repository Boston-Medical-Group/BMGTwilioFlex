import moment from 'moment-timezone';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
    Flex, Stack,
    Alert,
    Spinner,
    Text, Paragraph,
    Toaster,
    Button, Input, Label, TextArea,
    DatePicker, formatReturnDate,
    useToaster,
    Table, THead, TBody, Th, Tr, Td, Box
} from '@twilio-paste/core';
import { Modal, ModalBody, ModalHeading, ModalHeader, ModalFooter, ModalFooterActions } from '@twilio-paste/core/modal';
import '../../styles/styledTable.css';
import { deleteRemoteHoliday, loadRemoteHolidays, saveRemoteHoliday } from '../../helpers';
import { ApiService, HolidayObject } from '../../Types';
import { AxiosError } from 'axios';
import { useUID } from '@twilio-paste/core/dist/uid-library';
import { PlusIcon } from '@twilio-paste/icons/esm/PlusIcon';
import { DeleteIcon } from '@twilio-paste/icons/esm/DeleteIcon';
import { EditIcon } from '@twilio-paste/icons/esm/EditIcon';

const HolidayConfig = () => {
    const [holidayList, setHolidayList] = useState<Array<HolidayObject>>([]);
    const [isLoadingHolidays, setIsLoadingHolidays] = useState(false)
    const toaster = useToaster()

    // Carga horas según la cola
    useEffect(() => {
        loadHolidays()
    }, [])

    const loadHolidays = async () => {
        setIsLoadingHolidays(true)
        await loadRemoteHolidays()
            .then((data: ApiService.DowntimeManagerHolidays) => {
                setHolidayList(convertHolidayMapToList(data));
            })
            .catch((err: AxiosError) => {
                toaster.push({
                    message: err.message,
                    variant: 'error',
                    dismissAfter: 3000
                })
            })
            .finally(() => {
                setIsLoadingHolidays(false)
            })
    }

    const convertHolidayMapToList = (holidayMap: ApiService.DowntimeManagerHolidays) => {
        const tempHolidayList : Array<HolidayObject> = Object.keys(holidayMap).map((k : string) : HolidayObject => {
            const mapValue = holidayMap[k];
            return {
                id: mapValue.id,
                date: moment(k, 'MM/DD/yyyy').format('yyyy-MM-DD'),
                offlineMessage: mapValue.offlineMessage,
                description: mapValue.description,
                key: uuidv4(),
            };
        })

        tempHolidayList.sort((a: any, b : any) => a.date - b.date);
        return tempHolidayList;
    };

    const [newHoliday, setNewHoliday] = useState<any>()
    const [showNewHolidayModal, setShowNewHolidayModal] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const handleOpen = (holiday?: HolidayObject) => {
        if (holiday !== undefined) {
            setNewHoliday({
                id: holiday?.id,
                date: holiday.date,
                offlineMessage: holiday.offlineMessage,
                description: holiday.description,
                key: uuidv4()
            })
        } else {
            setNewHoliday({
                date: '',
                offlineMessage: '',
                description: '',
                key: uuidv4()
            })
        }
        setShowNewHolidayModal(true);
    }

    const handleClose = () => setShowNewHolidayModal(false);
    const modalHeadingID = useUID();

    const handleChangeItem = (fieldName: string) => {
        return (evt: any) => {
            if (fieldName === 'date') {
                setNewHoliday((prev: any) => ({ ...prev, date: evt.target.value }))
            } else if (fieldName === 'offlineMessage') {
                setNewHoliday((prev: any) => ({ ...prev, offlineMessage: evt.target.value }))
            } else if (fieldName === 'description') {
                setNewHoliday((prev: any) => ({ ...prev, description: evt.target.value }))
            }
        }
    }

    const handleSaveHoliday = () => {
        setIsSaving(true)
        saveRemoteHoliday(newHoliday).then(() => {
            setIsSaving(false)
            handleClose()
            loadHolidays()
                .catch((err: AxiosError) => {
                    toaster.push({
                        message: err.message,
                        variant: 'neutral',
                        dismissAfter: 3000
                    })
                })
        })
    }

    const [isDeleting, setIsDeleting] = useState(false)
    const handleDeleteHoliday = (id: number) => {
        setIsDeleting(true)
        deleteRemoteHoliday(id)
            .then(() => {
                setIsDeleting(false)
                loadHolidays()
            })
            .catch((err: AxiosError) => {
                toaster.push({
                    message: err.message,
                    variant: 'neutral',
                    dismissAfter: 3000
                })
                setIsDeleting(false)
            })
    }


    return (
        <>
            {showNewHolidayModal &&
                <Modal ariaLabelledby={modalHeadingID} isOpen={showNewHolidayModal} onDismiss={handleClose} size="default">
                    <ModalHeader>
                        <ModalHeading as="h3" id={modalHeadingID}>
                            New working hour
                        </ModalHeading>
                    </ModalHeader>

                    <ModalBody>
                        <Stack orientation="vertical" spacing="space60">
                            <Stack orientation="vertical" spacing="space20">
                                <Label htmlFor=''>Date</Label>
                                <DatePicker value={newHoliday.date} onChange={handleChangeItem('date')} />
                            </Stack>

                            <Stack orientation="vertical" spacing="space20">
                                <Label htmlFor=''>Title/Description</Label>
                                <Input
                                    type="text"
                                    value={newHoliday.description}
                                    onChange={handleChangeItem('description')}
                                    placeholder="Holiday Name"
                                />
                            </Stack>

                            <Stack orientation="vertical" spacing="space20">
                                <Label htmlFor=''>Offline Message</Label>
                                <TextArea
                                    value={newHoliday.offlineMessage}
                                    onChange={handleChangeItem('offlineMessage')}
                                    placeholder="Offline Message"
                                />
                            </Stack>

                        </Stack>
                    </ModalBody>

                    <ModalFooter>
                        <ModalFooterActions>
                            <Button variant="secondary" onClick={handleClose} disabled={isSaving}>
                            Cancel
                            </Button>
                            <Button variant="primary" onClick={handleSaveHoliday} loading={isSaving}>Save</Button>
                        </ModalFooterActions>
                    </ModalFooter>
                </Modal>
            }

            <Stack orientation="vertical" spacing="space60">

                <Toaster {...toaster} />

                {isDeleting &&
                    <Alert variant="neutral">
                        <Stack orientation="horizontal" spacing="space60">
                            <Spinner decorative={true} title="Deleting" size="sizeIcon30" />
                            <Text as="span">Deleting</Text>
                        </Stack>
                    </Alert>
                }

                {isLoadingHolidays &&
                    <Alert variant="neutral">
                        <Stack orientation="horizontal" spacing="space60">
                            <Spinner decorative={true} title="Loading" size="sizeIcon30" />
                            <Text as="span">Holidays are being loaded</Text>
                        </Stack>
                    </Alert>
                }

                <Stack orientation="horizontal" spacing="space60">
                    <Label htmlFor="">Holidays:</Label>
                    
                    <Button variant="secondary" onClick={() => handleOpen()}>
                        {' '}
                        <PlusIcon decorative={false} title="Add New Holiday" /> Add New
                    </Button>
                </Stack>

                {holidayList.length === 0 && <Paragraph>No Holidays Configured</Paragraph>}

                {holidayList.length > 0 && (
                    <Box>
                        <Table>
                            <THead>
                                <Tr>
                                    <Th>Sr No</Th>
                                    <Th>Date</Th>
                                    <Th>Description</Th>
                                    <Th>Offline Message</Th>
                                    <Th>Actions</Th>
                                </Tr>
                            </THead>

                            <TBody>
                                {holidayList.map((holiday, holidayIter) => (
                                    <Tr key={holiday.key}>
                                        <Td>{holidayIter + 1}</Td>
                                        <Td>
                                            <Text as="span">{formatReturnDate(holiday.date, 'dd/MM/yyyy')}</Text>
                                        </Td>
                                        <Td>
                                            <Text as="span">{holiday.description}</Text>
                                        </Td>
                                        <Td>
                                            <Text as="span">{holiday.offlineMessage}</Text>
                                        </Td>
                                        
                                        <Td>
                                            <Button variant="secondary_icon" size="small" onClick={() => handleOpen(holiday)} disabled={isDeleting}>
                                                <EditIcon decorative={false} title="Edit holiday" />
                                            </Button>
                                            <Button variant="destructive_icon" size="small" onClick={() => handleDeleteHoliday(holiday.id as number)} disabled={isDeleting} >
                                                <DeleteIcon decorative={false} title="Delete holiday" />
                                            </Button>
                                        </Td>
                                    </Tr>
                                ))}
                            </TBody>
                        </Table>
                    </Box>
                )}

            </Stack>
        </>
        
  );
}

export default HolidayConfig;