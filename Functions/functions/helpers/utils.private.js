
/**
 * Maps a country code to its ISO2 code.
 *
 * @param {string} country - The country code to map.
 * @return {string} The ISO2 code of the country.
 */
exports.countryToIso2 = (country) => {
    const countryMap = {
        'esp': 'ES',
        'can': 'CA',
        'col': 'CO',
        'arg': 'AR',
        'per': 'PE',
        'ecu': 'EC',
        'mex': 'MX',
        'bra': 'BR',
        'ale': 'DE',
        'deu': 'DE'
    }

    return countryMap[country.toLowerCase()];
}
