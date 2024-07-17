import { useState } from "react";
import { useSelector } from "react-redux";
import { getStrings } from "../utils/helpers";

type LanguageStrings = {
    [key: string]: {
        [key: string]: string
    }
}

const useLang = () => {
    const language = useSelector((state: any) => {
        const langCode = state.languageState?.language?.language ?? 'es'
        // Get first part of language code
        return langCode.split('-')[0]
    });

    const [langStrings] = useState<LanguageStrings>(() => getStrings())

    const _l = (str: string) => {
        return langStrings[language][str] ?? str
    }

    return {
        _l, 
        language
    }
}

export default useLang