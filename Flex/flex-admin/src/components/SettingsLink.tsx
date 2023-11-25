import { SideLink, Actions, Icon, SideLinkProps } from "@twilio/flex-ui";
import * as Flex from "@twilio/flex-ui";

const SettingsLink = (props : SideLinkProps & { flex: typeof Flex }) => {
    function navigate() {
        props.flex.Actions.invokeAction('NavigateToView', { viewName: 'settings-view' });
    }

    return (
        <SideLink
            {...props}
            showLabel={true}
            icon={<Icon icon="Settings" />}
            iconActive="SettingsBold"
            isActive={props.activeView === 'settings-view'}
            onClick={navigate}
        >Admin</SideLink>

    )
}

export default SettingsLink;