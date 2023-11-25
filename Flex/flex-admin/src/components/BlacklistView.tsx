import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Heading, Paragraph, Table, TBody, Td, Th, THead, Tr, Flex as FlexView, Card, SkeletonLoader } from "@twilio-paste/core";
import { Theme } from '@twilio-paste/core/dist/theme';
import PhoneTableRow from "./Phone/TableRow";
import PhoneCreateCard from "./Phone/CreateCard";
import * as Flex from "@twilio/flex-ui";

type Props = {
    manager: Flex.Manager
}

const BlacklistView = ({ manager }: Props) => {
    const [accountCountry, setAccountCountry] = useState(manager.serviceConfiguration.attributes.account_country);
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState < boolean > (false)
    const [items, setItems] = useState < Array < { id: string } >> ([])

    const reloadHandler = () => {
        axios.get(`inbound-blacklists?filter[country]=${accountCountry}`)
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
        <Theme.Provider theme="flex">
            <FlexView>
                <FlexView grow padding="space50">
                    <Card>
                        <Heading as="h2" variant="heading20">Lista de números entrantes bloqueados</Heading>
                        <Paragraph>Listado de números que no se recibirán llamadas</Paragraph>

                        <Table>
                            <THead>
                                <Tr>
                                    <Th>Número</Th>
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

                <FlexView padding="space50" paddingLeft="space0">
                    <PhoneCreateCard reloadFunction={reloadHandler} createFunction={createHandler} />
                </FlexView>
            </FlexView>
        </Theme.Provider>
    )
}

export default BlacklistView;