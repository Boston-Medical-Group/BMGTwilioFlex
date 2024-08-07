import React, { useState } from "react";
import axios, { AxiosError } from 'axios';
import { Text, Flex as FlexBox, Button } from "@twilio-paste/core";
import * as Flex from '@twilio/flex-ui';
import parsePhoneNumber from 'libphonenumber-js';
import { DeleteIcon } from "@twilio-paste/icons/esm/DeleteIcon";
import useLang from "../../hooks/useLang";

const manager = Flex.Manager.getInstance();

type Props = { deleteFunction : (number : string) => any, phoneNumber: string }
const TableRow = (props: Props) => {
    
    const { _l } = useLang();
    const [isLoading, setIsLoading] = useState<boolean>(false)
    
    const formatNumber = (number : string) =>  {
        const phoneNumber = parsePhoneNumber('+' + number)

        return phoneNumber?.formatInternational()
    }

    const deleteNumber = (number : string) => {
        setIsLoading(true);

        if (number) {
            props.deleteFunction(number)
            .catch((err : AxiosError) => {
                setIsLoading(false)
                console.error(err.message)
            });
        } else {
            setIsLoading(false)
        }
    }

    return (

        <FlexBox hAlignContent="between" vAlignContent="center">
            <Text as="span">{formatNumber(props.phoneNumber)}</Text>
            <Button variant="destructive_icon" loading={isLoading} name="" onClick={() => {
                deleteNumber(props.phoneNumber)
            }}>
                <DeleteIcon decorative={false} title={_l('Delete number')} />
            </Button>
        </FlexBox>
        
    )
}

export default TableRow;