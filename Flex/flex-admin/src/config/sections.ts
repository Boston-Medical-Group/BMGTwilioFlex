import React from "react";
import { SectionItemElement } from "../Types";

export const sections : Array<SectionItemElement> = [
    {
        label: "Blocking",
        childrens: [
            {
                label: "Do not call",
                component: "donotcall",
            }, {
                label: "Blacklist",
                component: "blacklist"
            }
        ]
    },/* {
        label: "Scheduling",
        childrens: [
            // {
            //     label: "Business hours",
            //     component: "downtime-manager"
            // }
        ]
    },
    /*{
        label: "Conversations",
        childrens: [
            // {
            //     label: "Wrapup codes",
            //     component: "wrapupcodes"
            // }
        ]
    },*/ {
        label: "Routing",
        childrens: [
            {
                label: "Out of business hour number",
                component: "inboundconfigs"
            }
        ]
    }, {
        label: "Voice",
        childrens: [
            {
                label: "Geographic Permissions",
                component: "geopermissions"
            }
        ]
    }
    
]