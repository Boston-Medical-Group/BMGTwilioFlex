import moment from 'moment-timezone';
import { useState, useEffect, ChangeEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
    Box, Flex, Stack,
    Toaster,
    Alert,
    Spinner,
    Text, Paragraph,
    Button, Select, Option, Label, Input, TextArea,
    Modal, ModalHeader, ModalHeading, ModalBody, ModalFooter, ModalFooterActions,
    useToaster,
    Table, THead, TBody, Tr, Th, Td
} from '@twilio-paste/core';
import { DatePicker, formatReturnDate } from '@twilio-paste/core/date-picker';
import { TimePicker, formatReturnTime } from '@twilio-paste/core/time-picker';
import '../../styles/styledTable.css';
import { ApiService } from '../../Types';
import { deletePartialDay, loadPartialDays, savePartialDay } from '../../helpers';
import { AxiosError } from 'axios';
import { PlusIcon } from '@twilio-paste/icons/esm/PlusIcon';
import { DeleteIcon } from '@twilio-paste/icons/esm/DeleteIcon';
import { EditIcon } from '@twilio-paste/icons/esm/EditIcon';
import { useUID } from '@twilio-paste/core/dist/uid-library';

type Props = { queues: Array<any> }
const PartialDayConfig = ({ queues } : Props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [partialdayList, setPartialdayList] = useState<Array<ApiService.PartialDayTmp>>([]);
    const [queue, setQueue] = useState<string>('_all');
    const [showNewModal, setShowNewModal] = useState(false)
    const modalHeadingID = useUID();
    const [newPartialDayTmp, setNewPartialDayTmp] = useState<ApiService.PartialDayTmp | any>()
    const toaster = useToaster()

    // Carga horas según la cola
    useEffect(() => {
        init(queue)
    }, [queue])

    const init = async (queue: string) => {
        setIsLoading(true)
        await loadPartialDays(queue)
            .then((data: ApiService.PartialDays ) => {
                setPartialdayList(convertPartialdayMapToList(data));
            })
            .catch((err: AxiosError) => {
                toaster.push({
                    message: err.message,
                    variant: 'error',
                    dismissAfter: 3000
                })
            })
            .finally(() => {
                setIsLoading(false)
            })
    }
    
    // Maneja el cambio de cola
    const handleChangeQueue = (e: ChangeEvent<HTMLSelectElement>) => {
        console.log(e.target.value, queues)
        setQueue(e.target.value);
    };

    const convertPartialdayMapToList = (partialdayMap: ApiService.PartialDays): Array<ApiService.PartialDayTmp> => {
        if (partialdayMap[queue] === undefined) {
            return [];
        }
        
        const tempPartialdayList = Object.keys(partialdayMap[queue]).map((k) => {
            const mapValue = partialdayMap[queue][k];
            return {
                id: mapValue.id,
                description: mapValue.description,
                date: moment(k, 'MM/DD/yyyy').format('yyyy-MM-DD'),
                offlineMessage: mapValue.offlineMessage,
                key: uuidv4(),
                begin: mapValue.begin,
                end: mapValue.end,
            };
        });

        tempPartialdayList.sort((a, b) => +a.date - +b.date);
        return tempPartialdayList;
    };

    const handleOpen = (partialDay?: ApiService.PartialDayTmp) => {
        if (partialDay !== undefined) {
            setNewPartialDayTmp({
                id: partialDay.id,
                date: partialDay.date,
                begin: partialDay.begin,
                end: partialDay.end,
                description: partialDay.description,
                offlineMessage: partialDay.offlineMessage,
                key: uuidv4() as string
            })
        } else {
            setNewPartialDayTmp({
                date: '',
                begin: '',
                end: '',
                description: '',
                offlineMessage: '',
                key: uuidv4() as string
            })
        }
        setShowNewModal(true);
    }

    const handleClose = () => setShowNewModal(false);

    const handleSave = () => {
        if (newPartialDayTmp === undefined) {
            return;
        }

        setIsSaving(true)
        savePartialDay(queue, newPartialDayTmp)
            .then(async () => {
                setIsSaving(false)
                await init(queue)
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

    const handleDelete = ( id: number ) => {
        setIsDeleting(true)
        deletePartialDay(id)
            .then(() => {
                init(queue).then(() => {
                    setIsDeleting(false)
                })
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

            {showNewModal &&
                <Modal ariaLabelledby={modalHeadingID} isOpen={showNewModal} onDismiss={handleClose} size="default">
                    <ModalHeader>
                        <ModalHeading as="h3" id={modalHeadingID}>
                            New Partial day
                        </ModalHeading>
                    </ModalHeader>

                    <ModalBody>
                        <Stack orientation="horizontal" spacing="space60">
                            <Stack orientation="vertical" spacing="space20">
                                <Label htmlFor=''>Day</Label>
                                <DatePicker value={newPartialDayTmp?.date} onChange={(evt : ChangeEvent<HTMLInputElement>) => setNewPartialDayTmp((prev: any) => ({ ...prev, date: evt.target.value }))} />
                            </Stack>

                            <Stack orientation="vertical" spacing="space20">
                                <Label htmlFor="">Begin</Label>
                                <TimePicker value={newPartialDayTmp?.begin} onChange={(evt: ChangeEvent<HTMLInputElement>) => setNewPartialDayTmp((prev: any) => ({ ...prev, begin: evt.target.value }) )}   />
                            </Stack>
                        
                            <Stack orientation="vertical" spacing="space20">
                                <Label htmlFor="">End</Label>
                                <TimePicker value={newPartialDayTmp?.end} onChange={(evt: ChangeEvent<HTMLInputElement>) => setNewPartialDayTmp((prev: any) => ({ ...prev, end: evt.target.value }) )} />
                            </Stack>
                        
                            <Stack orientation="vertical" spacing="space20">
                                <Label htmlFor="">Description</Label>
                                <Input
                                    type="text"
                                    value={newPartialDayTmp?.description}
                                    onChange={(evt: ChangeEvent<HTMLInputElement>) => setNewPartialDayTmp((prev: any) => ({ ...prev, description: evt.target.value }) )}
                                    placeholder="Partial Day Name"
                                />
                            </Stack>
                        
                            <Stack orientation="vertical" spacing="space20">
                                <Label htmlFor="">Offline Message</Label>
                                <TextArea
                                    value={newPartialDayTmp?.offlineMessage}
                                    onChange={(evt: ChangeEvent<HTMLTextAreaElement>) => setNewPartialDayTmp((prev: any) => ({ ...prev, offlineMessage: evt.target.value }) )}
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
                            <Button variant="primary" onClick={handleSave} loading={isSaving}>Save</Button>
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

                {isLoading &&
                    <Alert variant="neutral">
                        <Stack orientation="horizontal" spacing="space60">
                            <Spinner decorative={true} title="Loading" size="sizeIcon30" />
                            <Text as="span">Timings are being loaded</Text>
                        </Stack>
                    </Alert>
                }
            
                <Box>
                    <Flex hAlignContent="between">
                        <Stack orientation="horizontal" spacing="space60">
                            <Label htmlFor="">Partial Days:</Label>
                            <Button variant="secondary" onClick={() => handleOpen() }>
                                {' '}
                                <PlusIcon decorative={false} title="Add New Partial Day" /> Add New
                            </Button>
                        </Stack>

                        <Stack orientation="horizontal" spacing="space60">
                            <Label htmlFor=''>&nbsp;</Label>
                            <Select onChange={handleChangeQueue}>
                                <Option value="_all">All queues</Option>
                                {
                                    queues.map(q => (
                                        <Option value={q.queue_sid} key={q.queue_sid}>{q.queue_name}</Option>
                                    ))
                                }
                            </Select>
                        </Stack>
                    </Flex>

                    <br />

                    {partialdayList.length === 0 && <Paragraph>No Partial Days Configured</Paragraph>}

                    {partialdayList.length > 0 && (
                        <Box>
                        <Table className="data-grid-clone">
                            <THead>
                                <Tr>
                                    <Th>Sr No</Th>
                                    <Th>Date</Th>
                                    <Th>Start Time</Th>
                                    <Th>End Time</Th>
                                    <Th>Description</Th>
                                    <Th>Offline Message</Th>
                                    <Th>Actions</Th>
                                </Tr>
                            </THead>

                            <TBody>
                                {partialdayList.map((partialday : ApiService.PartialDayTmp, partialdayIter) => (
                                <Tr key={partialday.key}>
                                    <Td>{partialdayIter + 1}</Td>
                                    <Td>
                                        <Text as="span">{partialday.date}</Text>
                                    </Td>
                                    <Td>
                                        <Text as="span">{partialday.begin}</Text>
                                    </Td>
                                    <Td>
                                        <Text as="span">{partialday.end}</Text>
                                    </Td>
                                    <Td>
                                        <Text as="span">{partialday.description}</Text>    
                                    </Td>
                                    <Td>
                                        <Text as="span">{partialday.offlineMessage}</Text>    
                                    </Td>
                                    <Td>
                                        <Button variant="secondary_icon" size="small" onClick={() => handleOpen(partialday)} disabled={isDeleting}>
                                            <EditIcon decorative={false} title="Edit partial day" />
                                        </Button>
                                        <Button variant="destructive_icon" size="small" onClick={() => handleDelete(partialday.id as number)} disabled={isDeleting} >
                                            <DeleteIcon decorative={false} title="Delete timing" />
                                        </Button>
                                    </Td>
                                </Tr>
                                ))}
                            </TBody>
                            </Table>
                            </Box>
                    )}
                </Box>
            </Stack>
        </>
    );
}

export default PartialDayConfig;