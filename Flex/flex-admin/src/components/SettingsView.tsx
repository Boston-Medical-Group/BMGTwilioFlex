import * as Flex from "@twilio/flex-ui";
import { Heading, Stack, Box } from "@twilio-paste/core";
import { sections } from "../config/sections";
import { Actions, Button } from "@twilio/flex-ui";
import { Theme } from '@twilio-paste/core/dist/theme';
import { SectionItemElement } from '../Types';
import useLang from '../hooks/useLang';

type Props = {
    manager: Flex.Manager
}

const SettingsView = ({ manager }: Props) => {
    const { _l } = useLang();
    
    const renderChildren = (child: SectionItemElement, index: number|string) => {
        if (child.childrens) {
            return (
                <Stack key={index} orientation="vertical" spacing="space40">
                    <Heading as="h4" variant="heading40">{_l(child.label)}</Heading>
                    {child.childrens?.map((item, i) => {
                        return renderChildren(item, `${index}-${i}`);
                    })}
                </Stack>
            )

        } else {
            return (
                <Button key={index} size="small" variant="link" onClick={() => goTo(child.component)}>{_l(child.label)}</Button>
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
                    <Heading as="h2" variant="heading20">{_l('Settings')}</Heading>
                    <Stack orientation="vertical" spacing="space40">
                        {sections.map((value: SectionItemElement, index : number) => renderChildren(value, index))}
                    </Stack>
                </Stack>
            </Box>
        </Theme.Provider>

    )
}

export default SettingsView;