import { SideLink, SideLinkProps } from "@twilio/flex-ui";
import * as Flex from "@twilio/flex-ui";
import useLang from "../hooks/useLang";

const ActiveConversationsLink = (props: SideLinkProps & { flex: typeof Flex }) => {
    const { _l } = useLang();

    function navigate() {
        props.flex.Actions.invokeAction('NavigateToView', { viewName: 'active-conversations' });
    }

    return (
        <SideLink
            {...props}
            showLabel={true}
            icon="Message"
            iconActive="MessageBold"
            isActive={props.activeView === 'active-conversations'}
            onClick={navigate}
        >{_l('Active Conversations')}</SideLink>

    )
}

export default ActiveConversationsLink;