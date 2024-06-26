
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

export {
    fullName,
    getStrings
}