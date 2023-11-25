import axios from 'axios';
import * as Flex from "@twilio/flex-ui";
import { Heading, Card, UnorderedList, ListItem, Stack, Box } from "@twilio-paste/core";
import { sections } from "../config/sections";
import { Actions, Button } from "@twilio/flex-ui";
import { Theme } from '@twilio-paste/core/dist/theme';
import { SectionItemElement } from '../Types';

type Props = {
    manager: Flex.Manager
}

const SettingsView = ({manager } : Props) => {
    
    const renderChildren = (child: SectionItemElement, index: number|string) => {
        if (child.childrens) {
            return (
                <Stack key={index} orientation="vertical" spacing="space40">
                    <Heading as="h4" variant="heading40">{child.label}</Heading>
                    {child.childrens?.map((item, i) => {
                        return renderChildren(item, `${index}-${i}`);
                    })}
                </Stack>
            )

        } else {
            return (
                <Button key={index} size="small" variant="link" onClick={() => goTo(child.component)}>{child.label}</Button>
            )
        }
    }
 
    const goTo = (component?: string) => {
        Actions.invokeAction('NavigateToView', { viewName: `${component}-view` });
    }

    return (
        <Theme.Provider theme="flex">
            <Box padding="space50">
                <Stack spacing="space40" orientation="vertical">
                    <Heading as="h2" variant="heading20">Settings</Heading>
                    <Stack orientation="vertical" spacing="space40" style={{
                        alignItems: 'flex-start'
                    }}>
                        {sections.map((value: SectionItemElement, index : number) => renderChildren(value, index))}
                    </Stack>
                </Stack>
            </Box>
        </Theme.Provider>

    )
}

export default SettingsView;