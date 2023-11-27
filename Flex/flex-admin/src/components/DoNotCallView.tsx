import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Heading, Paragraph, Table, TBody, Td, Th, THead, Tr, Card, SkeletonLoader, Flex as FlexView } from "@twilio-paste/core";
import { Theme } from "@twilio-paste/core/dist/theme";
import PhoneTableRow from "./Phone/TableRow";
import PhoneCreateCard from "./Phone/CreateCard";
import * as Flex from "@twilio/flex-ui";

type Props = {
    manager: Flex.Manager
}

const DoNotCallView = ({ manager } : Props) => {
    const [accountCountry, setAccountCountry] = useState(manager.serviceConfiguration.attributes.account_country);
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState<boolean>(false)
    const [items, setItems] = useState<Array<{ id: string }>>([])

    const reloadHandler = () => {
        axios.get(`do-not-calls?filter[country]=${accountCountry}`)
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
        return axios.delete(`do-not-calls/${phoneNumber}`)
            .then(() => {
                reloadHandler();
            })
    }

    const createHandler = (phoneNumber: string) => {
        return axios.post('do-not-calls', {
            data: {
                type: "do-not-calls",
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
                        <Heading as="h2" variant="heading20">Lista de números bloqueados</Heading>
                        <Paragraph>Listado de números a los que no se realizarán llamadas</Paragraph>

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


export default DoNotCallView;