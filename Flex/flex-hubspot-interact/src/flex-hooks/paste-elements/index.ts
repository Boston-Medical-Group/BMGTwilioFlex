import { PasteCustomCSS } from '@twilio-paste/core/customization';

export const pasteElementHook = {
    WHATSAPP_TEMPLATES_MENU: {
        maxHeight: '70vh',
        height: '100%',
        overflowY: 'scroll',
    },
    WHATSAPP_TEMPLATES_MENU_BUTTON: {
        backgroundColor: 'transparent',
        borderRadius: 'borderRadiusCircle',
        padding: 'space30',
        ':hover:enabled': {
            backgroundColor: 'colorBackgroundStrong',
        },
    },
    WHATSAPP_TEMPLATES_MENUITEM: {
        borderCollapse: 'collapse',
        borderBottomWidth: 'borderWidth10',
        borderBottomStyle: 'solid',
        borderBottomColor: 'colorBorderDark',
        borderLeftWidth: 'borderWidth20',
        borderLeftStyle: 'solid',
        borderLeftColor: 'transparent',
        ':hover': {
            borderLeft: '2px solid blue',
            backgroundColor: 'rgba(2, 99, 224, 0.2)',
        }
    }
} as { [key: string]: PasteCustomCSS };