
import { formatDistance, differenceInCalendarDays } from "date-fns";
import { enUS, es, ptBR } from "date-fns/locale";


const fullName = (contact) => {
    if (!contact) {
        return 'Unknown name';
    }

    let fullName = `${contact.firstname ?? ''} ${contact.lastname ?? ''}`;
    if (fullName.trim() == '') {
        return 'Unknown name';
    }

    return fullName;
}

const getStrings = () => {
    const langStrings = require(`../langs.json`)
    return langStrings
}

function humanReadableDate(lang, comparisonDate) {
    const today = new Date();
    let locale = enUS
    if (lang === 'es') locale = es
    if (lang === 'pt') locale = ptBR

    return formatDistance(comparisonDate, today, { addSuffix: true, locale })
}

function diffDays(comparisonDate) {
    return differenceInCalendarDays(new Date(), comparisonDate)
}

export {
    fullName,
    getStrings,
    humanReadableDate,
    diffDays
}