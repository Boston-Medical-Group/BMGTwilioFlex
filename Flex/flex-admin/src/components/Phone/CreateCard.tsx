import React, { ChangeEvent, useState } from "react";
import { AxiosError } from "axios";
import { Card, Heading, Label, Input, HelpText, Button, Text, Box, Stack } from "@twilio-paste/core";
import { PlusIcon } from "@twilio-paste/icons/esm/PlusIcon";

type Nullable<T> = T | null;
type PhoneCreateResponse = { errors: Array<{ detail: string }> }

type Props = { reloadFunction: () => void, createFunction: (number: string) => any } & DefaultProps 
type DefaultProps = Partial<typeof defaultProps>
const defaultProps = {
    setTitle: '',
    defaultNumber: '',
    error: ''
}

const CreateCard = (props : Props) => {
    
    const [error, setError] = useState<Nullable<string>>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [number, setNumber] = useState<string>("")

    const addNumber = () => {
        if (!number) {
            setError('Debe ingresar un número válido')
            return;
        }

        setIsLoading(true);

        props.createFunction(number)
            .then(() => {
                setIsLoading(false)
                setNumber("")
                setError(null)
                reloadNumbers()
            })
            .catch((err : AxiosError) => {
                setIsLoading(false)
                let data = err.response?.data as PhoneCreateResponse;
                setError(data.errors[0]?.detail ?? err.message)
            })
    }

    const handleChange = (event : ChangeEvent<HTMLInputElement>) => {
        setNumber(event.target.value)
    }

    const reloadNumbers = () => {
        props.reloadFunction();
    }

    return (

        <Card>
            <Heading as="h2" variant="heading20">{props.setTitle || "Nuevo número"}</Heading>

            <Stack orientation="vertical" spacing="space50">
                <Box>
                    <Label htmlFor="phone_number">Número</Label>
                    <Input aria-describedby="phone_number_help_text" id="phone_number" name="phone_number" type="text" placeholder=""
                        hasError={error !== null} value={number} onChange={handleChange} onBlur={handleChange}
                        insertBefore={<Text color="colorTextWeak" as="span" fontWeight="fontWeightSemibold">+</Text>}/>
                    {(error || props.error) && <HelpText id="phone_number_help_text" variant="error">{error || props.error}.</HelpText>}
                </Box>
        
                <Button onClick={addNumber} variant="primary" loading={isLoading}>
                    <PlusIcon decorative={true} />
                    <Text as="span" color="colorTextBrandInverse">Agregar</Text>
                </Button>
            </Stack>
        </Card>

    )
}

export default CreateCard;