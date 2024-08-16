import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Heading, Paragraph, Table, TBody, Td, Th, THead, Tr, Flex as FlexView, Card, SkeletonLoader, Box } from "@twilio-paste/core";
import PhoneTableRow from "./Phone/TableRow";
import PhoneCreateCard from "./Phone/CreateCard";
import * as Flex from "@twilio/flex-ui";
import useLang from '../hooks/useLang'

type Props = {
    manager: Flex.Manager
}

const BlacklistView = ({ manager }: Props) => {
    const { _l } = useLang();
    const [accountCountry, setAccountCountry] = useState(manager.serviceConfiguration.attributes.account_country);
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState < boolean > (false)
    const [items, setItems] = useState < Array < { id: string } >> ([])

    const reloadHandler = () => {
        axios.get(`inbound-blacklists?filter[country]=${accountCountry}&page[limit]=100`)
            .then(result => {
                setIsLoaded(true)
                setItems(result.data.data)
            })
            .catch(error => {
                console.log(error)
                setIsLoaded(true)
                setError(error)
            });
    }

    useEffect(() => {
        reloadHandler();
    }, [])

    const deleteHandler = async (phoneNumber: string) => {
        return axios.delete(`inbound-blacklists/${phoneNumber}`)
            .then(() => {
                reloadHandler();
            })
    }

    const createHandler = (phoneNumber: string) => {
        return axios.post('inbound-blacklists', {
            data: {
                type: "inbound-blacklists",
                id: `${phoneNumber}`,
                relationships: {
                    country: {
                        data: {
                            type: "countries",
                            id: accountCountry
                        }
                    }
                }
            }
        }, {
            headers: {
                'Content-Type': 'application/vnd.api+json'
            }
        })
    }

    return (
        <Box overflowY="auto" minHeight="100%" width={"100%"} padding={"space60"} verticalAlign={"top"}>
            <FlexView vAlignContent={"top"}>
    
                <PhoneCreateCard reloadFunction={reloadHandler} createFunction={createHandler} />

                <FlexView grow paddingLeft="space50" paddingRight={"space50"}>
                    <Card>
                        <Heading as="h2" variant="heading20">{_l('Blocked inbound numbers')}</Heading>
                        <Paragraph>{_l('List of incoming numbers to be rejected')}</Paragraph>

                        <Table>
                            <THead>
                                <Tr>
                                    <Th>{_l('Number')}</Th>
                                </Tr>
                            </THead>
                            <TBody>
                                {isLoaded
                                    ? items.map((x, i) => (<Tr key={i}><Td><PhoneTableRow key={x.id} phoneNumber={x.id} deleteFunction={deleteHandler} /></Td></Tr>))
                                    : <Tr><Td><SkeletonLoader width="50%" /></Td></Tr>
                                }
                            </TBody>
                        </Table>
                    </Card>
                </FlexView>
            </FlexView>
        </Box>
    )
}

export default BlacklistView;