import moment from 'moment-timezone';
import { useState, useEffect, ChangeEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@twilio-paste/core/button';
import { TimePicker, formatReturnTime } from '@twilio-paste/core/time-picker';
import { Label } from '@twilio-paste/core/label';
import { Combobox } from '@twilio-paste/core/combobox';
import { Stack } from '@twilio-paste/core/stack';
import { PlusIcon } from '@twilio-paste/icons/esm/PlusIcon';
import { Box } from '@twilio-paste/core/box';
import { useUID} from '@twilio-paste/core/uid-library';

import '../../styles/styledTable.css';
import {
    Flex, Text, Modal, ModalHeader, ModalHeading, ModalBody, ModalFooter, ModalFooterActions, Option,
    Select, UseComboboxPrimitiveStateChange, Alert, Spinner, Toast, AlertDialog, useToaster, Toaster, Table, TBody, THead, Tr, Td, Th
} from '@twilio-paste/core';
import { loadRemoteConfigRegularHours } from '../../helpers';
import { saveRegularHour, deleteRegularHour, DowntimeManagerConfigRegularHours, RegularHoursAttributes } from '../../helpers/downtimeConfigService';
import { DeleteIcon } from '@twilio-paste/icons/esm/DeleteIcon';
import { EditIcon } from '@twilio-paste/icons/esm/EditIcon';
import { AxiosError } from 'axios';
import { HoopRows, Hours } from '../../Types';

const DAYS_OF_WEEK = moment.weekdays();

type Props = { queues: Array<any>, isReadOnly: boolean }

const WeeklyConfig = ({ queues }: Props) => {
    const [isLoadingTimings, setIsLoadingTimings] = useState(false);
    const [value, setValue] = useState<DowntimeManagerConfigRegularHours>();
    const [hoopRows, setHoopRows] = useState<HoopRows[]>([]);
    const [queue, setQueue] = useState<string>('_all');
    const toaster = useToaster()

    // Carga horas según la cola
    useEffect(() => {
        loadWorkingHours(queue)
    }, [queue])

    const loadWorkingHours = async (queue: string) => {
        setIsLoadingTimings(true)
        await loadRemoteConfigRegularHours(queue)
            .then((data: DowntimeManagerConfigRegularHours) => {
                setValue(data)
            })
            .catch((err: AxiosError) => {
                toaster.push({
                    message: err.message,
                    variant: 'error',
                    dismissAfter: 3000
                })
            })
            .finally(() => {
                setIsLoadingTimings(false)
            })
    }
    
    // Maneja el cambio de cola
    const handleChangeQueue = (e: ChangeEvent<HTMLSelectElement>) => {
        setQueue(e.target.value);
    };

    // Convierte la data json en objeto valido para el component
    const convertWeeklyTimingsToHoopList = (configObj : DowntimeManagerConfigRegularHours) => {
        if(configObj==null || configObj.weeklyTimings == null){
            return [];
        }

        const tempHoopRows : Array<HoopRows> = [];
   
        DAYS_OF_WEEK.forEach((x) => {
            let existing = configObj.weeklyTimings.hasOwnProperty(queue) ? configObj.weeklyTimings[queue][x] : null;
            if(existing!=null){
                if(!Array.isArray(existing)){
                    existing = [existing];
                }

                existing.forEach(row=>{
                    tempHoopRows.push({ id: row.id, dayOfWeek: x, begin: row.begin,end: row.end, key: uuidv4() } as HoopRows)
                })
            }
        });

        tempHoopRows.sort((a, b) => {
            if(a.dayOfWeek==b.dayOfWeek){
                var beginningTimeA : moment.Moment = moment(a.begin, 'kk:mm');
                var beginningTimeB : moment.Moment = moment(b.begin, 'kk:mm');
                return +beginningTimeA.toDate() - +beginningTimeB.toDate()
            }
            return DAYS_OF_WEEK.indexOf(a.dayOfWeek) - DAYS_OF_WEEK.indexOf(b.dayOfWeek)
        });

        return tempHoopRows;
    }

    // Agrupa los horarios por día y los ordena
    const convertHoopListToWeeklyTimings = (rows : HoopRows[])=>{
        const tempWeeklyTimings : { [key: string ] : Hours[] }= {};
        DAYS_OF_WEEK.forEach((d) => {
            tempWeeklyTimings[d] = rows.filter(x => x.dayOfWeek === d && x.begin != null && x.end != null)
                .map(x => { return { 'begin': x.begin, 'end': x.end } });
        })
        return tempWeeklyTimings;
    }

    useEffect(() => {
        setHoopRows(convertWeeklyTimingsToHoopList(value as DowntimeManagerConfigRegularHours));
    }, [value]);


    const [isSaving, setIsSaving] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [showNewHourModal, setShowNewHourModal] = useState(false);
    const [newHourTmp, setNewHourTmp] = useState<any>()
    const handleOpen = (workingHour?: HoopRows) => {
        if (workingHour !== undefined) {
            setNewHourTmp({
                id: workingHour.id,
                dayOfWeek: workingHour.dayOfWeek,
                begin: workingHour.begin,
                end: workingHour.end,
                key: uuidv4() as string
            })
        } else {
            setNewHourTmp({
                dayOfWeek: 'Monday',
                begin: '',
                end: '',
                key: uuidv4() as string
            })
        }
        setShowNewHourModal(true);
    }
    const handleClose = () => setShowNewHourModal(false);
    const modalHeadingID = useUID();

    const handleChangeItem = (fieldName: string) => {
        return (evt: any) => {
            if (fieldName === 'dayOfWeek') {
                setNewHourTmp((prev: any) => ({ ...prev, dayOfWeek: evt.selectedItem }))
            } else if (fieldName === 'begin') {
                setNewHourTmp((prev: any) => ({ ...prev, begin: evt.target.value }))
            } else if (fieldName === 'end') {
                setNewHourTmp((prev: any) => ({ ...prev, end: evt.target.value }))
            }
        }
    }

    const handleSaveTiming = () => {
        setIsSaving(true)
        saveRegularHour(queue, newHourTmp)
        loadWorkingHours(queue)
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

    const handleDeleteTiming = (id: number) => {
        setIsDeleting(true)
        deleteRegularHour(id)
            .then(() => {
                loadWorkingHours(queue).then(() => {
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
            {showNewHourModal &&
                <Modal ariaLabelledby={modalHeadingID} isOpen={showNewHourModal} onDismiss={handleClose} size="default">
                    <ModalHeader>
                        <ModalHeading as="h3" id={modalHeadingID}>
                            New working hour
                        </ModalHeading>
                    </ModalHeader>

                    <ModalBody>
                        <Stack orientation="horizontal" spacing="space60">
                            <Stack orientation="vertical" spacing="space20">
                                <Label htmlFor=''>Day</Label>
                                <Combobox
                                    labelText={""}
                                    selectedItem={newHourTmp?.dayOfWeek}
                                    items={DAYS_OF_WEEK}
                                    onSelectedItemChange={handleChangeItem('dayOfWeek')}
                                />
                            </Stack>

                            <Stack orientation="vertical" spacing="space20">
                                <Label htmlFor=''>Begin</Label>
                                <TimePicker value={newHourTmp?.begin} onChange={handleChangeItem('begin')} />
                            </Stack>

                            <Stack orientation="vertical" spacing="space20">
                                <Label htmlFor=''>End</Label>
                                <TimePicker value={newHourTmp?.end} onChange={handleChangeItem('end')} />
                            </Stack>

                        </Stack>
                    </ModalBody>

                    <ModalFooter>
                        <ModalFooterActions>
                            <Button variant="secondary" onClick={handleClose} disabled={isSaving}>
                            Cancel
                            </Button>
                            <Button variant="primary" onClick={handleSaveTiming} loading={isSaving}>Save</Button>
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

                {isLoadingTimings &&
                    <Alert variant="neutral">
                        <Stack orientation="horizontal" spacing="space60">
                            <Spinner decorative={true} title="Loading" size="sizeIcon30" />
                            <Text as="span">Timings are being loaded</Text>
                        </Stack>
                    </Alert>
                }
                    
                <Box>
                    <Flex hAlignContent="between">
                        <Stack orientation="horizontal" spacing="space60" >
                            <Label htmlFor=''>Hours of Operation:</Label>
                            
                            <Button variant="secondary" onClick={() => handleOpen()}>
                                {' '}
                                <PlusIcon decorative={false} title="Add Row" /> Add Row
                            </Button>

                        </Stack>

                        <Stack orientation="horizontal" spacing="space60">
                            <Label htmlFor=''>&nbsp;</Label>
                            <Select onChange={handleChangeQueue}>
                                <Option value="_all">All queues</Option>
                                {
                                    queues.map(queue => (
                                        <Option value={queue.queue_sid} key={queue.queue_sid}>{queue.queue_name}</Option>
                                    ))
                                }
                            </Select>
                        </Stack>
                    </Flex>
                    <br />

                    <Table>
                        <THead>
                            <Tr>
                                <Th>Day</Th>
                                <Th>Start Time</Th>
                                <Th>End Time</Th>
                                <Th>Actions</Th>
                            </Tr>
                        </THead>
                        <TBody>
                            {
                                hoopRows.map(hoopRow => (
                                    <Tr key={`hoop-edit-row-${hoopRow.key}`}>
                                        <Td>
                                            <Text as="span">{hoopRow.dayOfWeek}</Text>
                                        </Td>
                                        <Td>
                                            <Text as="span">{hoopRow.begin}</Text>
                                        </Td>
                                        <Td>
                                            <Text as="span">{hoopRow.end}</Text>
                                        </Td>
                                        <Td>
                                            <Button variant="secondary_icon" size="small" onClick={() => handleOpen(hoopRow)} disabled={isDeleting}>
                                                <EditIcon decorative={false} title="Edit timing" />
                                            </Button>
                                            <Button variant="destructive_icon" size="small" onClick={() => handleDeleteTiming(hoopRow.id as number)} disabled={isDeleting} >
                                                <DeleteIcon decorative={false} title="Delete timing" />
                                            </Button>
                                        </Td>
                                    </Tr>
                                ))
                            }
                        </TBody>
                    </Table>
                </Box>
            </Stack>
        </>
    );
}

export default WeeklyConfig;