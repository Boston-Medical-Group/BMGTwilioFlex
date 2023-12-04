const i18next = require('i18next');

const languages = Runtime.getAssets()['/language.json'].open;

exports.init = (language) => {
    i18next.init({
        lng: language,
        debug: process.env.DEBUG_MODE || false,
        resources: JSON.parse(languages()),
    });

    return i18next;
}
