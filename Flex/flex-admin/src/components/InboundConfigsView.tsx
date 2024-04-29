import React, { useState, useEffect, ChangeEvent } from "react";
import axios from 'axios';
import { Heading, Paragraph, Table, TBody, Td, Th, THead, Tr, Flex as FlexView, Card, SkeletonLoader, Button, AlertDialog, Input, Label, Box, Stack, HelpText, Text } from "@twilio-paste/core";
import { Theme } from '@twilio-paste/core/dist/theme';
import PhoneTableRow from "./Phone/TableRow";
import PhoneCreateCard from "./Phone/CreateCard";
import * as Flex from "@twilio/flex-ui";

type Props = {
    manager: Flex.Manager
}
type Nullable<T> = T | null;
const InboundConfigsView = ({ manager }: Props) => {
    const [accountCountry, setAccountCountry] = useState(manager.serviceConfiguration.attributes.account_country);
    const [errorInbound, setErrorInbound] = useState<Nullable<string>>(null);
    const [isLoaded, setIsLoaded] = useState < boolean > (false);
    const [configs, setConfigs] = useState(
        {
            skillACD1: null,
            skillACD2: null,
            label: null,
            playWelcome: null,
            welcomeTTS: null,
            languageIVRTTS: null,
            playRecRequestIVRIfClosed: null,
            recordingRequestIVRTTS: null,
            playPPoliciesIfOpen: null,
            playPPoliciesIfClosed: null,
            privacyPoliciesTTS: null,
            openBehavior: null,
            openIVRTTS: null,
            onQueueTTS1: null,
            onQueueTTS2: null,
            onQueueTTS3: null,
            segment1Timeout: null,
            segment2Timeout: null,
            segment3Timeout: null,
            segment3TimeoutExtended: null,
            closedBehavior: null,
            closedQueueTTS: null,
            closedTTS: null,
            closedIVRTTS: null,
            closedIVROpt1TTS: null,
            closedIVROpt2TTS: null,
            forwardNumbers: '',
            failedFordwardTTS: null
        })
    
    const reloadHandler = () => {
        axios.get(`inbound-configs/${accountCountry}`)
            .then(result => {
                setIsLoaded(true)
                setConfigs(result.data.data.attributes)
            })
            .catch(error => {
                console.log(error)
                setIsLoaded(true)
                setErrorInbound(error)
            });
    }

    const deleteHandler = async (phoneNumber: string) => {
        updateHandler('');
    }

    useEffect(() => {
        reloadHandler();
        console.log(configs);
    }, [])

    const updateHandler = async (phoneNumber: string) => {
        configs.forwardNumbers = phoneNumber || '';
        return axios.patch(`inbound-configs/${accountCountry}`,{
            data: {
                type: "inbound-configs",
                id: accountCountry,
                attributes: {
                    //forwardNumbers: `${phoneNumber}`    
                    //configs
                    skillACD1: configs.skillACD1,
                    skillACD2: configs.skillACD2,
                    label: configs.label,
                    playWelcome: Boolean(configs.playWelcome),
                    welcomeTTS: configs.welcomeTTS,
                    languageIVRTTS: configs.languageIVRTTS,
                    playRecRequestIVRIfClosed: Boolean(configs.playRecRequestIVRIfClosed),
                    recordingRequestIVRTTS: configs.recordingRequestIVRTTS,
                    playPPoliciesIfOpen: configs.playPPoliciesIfOpen,
                    playPPoliciesIfClosed: configs.playPPoliciesIfClosed,
                    privacyPoliciesTTS: configs.privacyPoliciesTTS,
                    openBehavior: configs.openBehavior,
                    openIVRTTS: configs.openIVRTTS,
                    onQueueTTS1: configs.onQueueTTS1,
                    onQueueTTS2: configs.onQueueTTS2,
                    onQueueTTS3: configs.onQueueTTS3,
                    segment1Timeout: configs.segment1Timeout,
                    segment2Timeout: configs.segment2Timeout,
                    segment3Timeout: configs.segment3Timeout,
                    segment3TimeoutExtended: configs.segment3TimeoutExtended,
                    closedBehavior: configs.closedBehavior,
                    closedQueueTTS: configs.closedQueueTTS,
                    closedTTS: configs.closedTTS,
                    closedIVRTTS: configs.closedIVRTTS,
                    closedIVROpt1TTS: configs.closedIVROpt1TTS,
                    closedIVROpt2TTS: configs.closedIVROpt2TTS,
                    forwardNumbers: phoneNumber,
                    failedFordwardTTS: configs.failedFordwardTTS
                }
            }
        }, {
            headers: {
                'Content-Type': 'application/vnd.api+json'
            }
        })
        .then(() => {
            reloadHandler();
        })
        .catch(error => {
            console.log(error)
            setIsLoaded(true)
            setErrorInbound(error)
        });
    }
    

    return (
        <Theme.Provider theme="flex">
            <FlexView>
                <FlexView padding="space50" paddingLeft="space0">
                    <Card>
                        <Heading as="h2" variant="heading20">Número fuera de horario</Heading>
                        <Table>
                            <THead>
                                <Tr>
                                    <Th>Número</Th>
                                </Tr>
                            </THead>
                            <TBody>
                                {isLoaded
                                    ? <Tr><Td><PhoneTableRow key={configs.forwardNumbers} phoneNumber={configs.forwardNumbers || ''} deleteFunction={deleteHandler} /></Td></Tr>
                                    : <Tr><Td><SkeletonLoader width="50%" /></Td></Tr>
                                }
                            </TBody>
                        </Table>
                    </Card>
                </FlexView>
                <FlexView padding="space50" paddingLeft="space0">
                    <PhoneCreateCard setTitle={' '} reloadFunction={reloadHandler} createFunction={updateHandler} />

                </FlexView>
            </FlexView>
        </Theme.Provider>
    )
}

export default InboundConfigsView;