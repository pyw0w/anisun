import {StatusType} from "@/types/Shikimori/General/Status.type";
import {MantineColor} from "@mantine/core";

export type VariablesType = {
    imagePlaceholder: string;
    sorting: {
        latest: {
            label: string;
            value: StatusType;
        };
        anons: {
            label: string;
            value: StatusType;
        };
        ongoing: {
            label: string;
            value: StatusType;
        };
        released: {
            label: string;
            value: StatusType;
        };
    };
    settings: {
        general: {
            label: string;
            value: "general";
        };
        about: {
            label: string;
            value: "about";
        }
    };
    iconProps: {
        size: number;
        stroke: number;
    };
    rippleColor: {
        color: string;
    };
    mantineColors: MantineColor[];
    websiteLinks: {
        label: string;
        href: string;
    }[];
}