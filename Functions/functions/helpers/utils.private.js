const axios = require('axios');


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
    'deu': 'DE',
    'dev': 'DEV',
}

/**
 * Maps a country code to its ISO2 code.
 *
 * @param {string} country - The country code to map.
 * @return {string} The ISO2 code of the country.
 */
exports.countryToIso2 = (country) => {
    return countryMap[country.toLowerCase()];
}

exports.iso2ToCountry = (iso2) => {
    return Object.keys(countryMap).find(key => countryMap[key] === iso2);
}

/**
 * Creates a round-robin counter for a given queue.
 *
 * @param {string} queue - The name of the queue.
 * @param {object} context - The context object containing the Flex Manager API URL and API key.
 * @return {Promise<number|boolean>} A Promise that resolves to the counter value if successful, or false if there was an error.
 */
const createRRCounter = async (queue, context) => {
    try {
        return await axios({
            method: 'post',
            url: `${context.FLEXMANAGER_API_URL}/rr-counters`,
            headers: {
                'Authorization': `Bearer ${context.FLEXMANAGER_API_KEY}`,
                'Content-Type': 'application/vnd.api+json'
            },
            data: {
                "data": {
                    "type": "rr-counters",
                    "id": queue,
                    "attributes": {
                        "counter": 0
                    }
                }
            }
        }).then(({ data }) => {
            return parseInt(data.data.attributes.counter);
        }).catch(function (err) {
            return false;
        });
    } catch (err) {
        console.log(err);
        return false;
    }
}

/**
 * Retrieves the RR counter for a given queue from the FlexManager API.
 *
 * @param {string} queue - The name of the queue.
 * @param {object} context - The context object containing the FlexManager API URL and key.
 * @return {Promise<number|boolean>} A promise that resolves to the RR counter if successful, or false if an error occurred.
 */
const getRRCounter = async (queue, context) => {
    try {
        return axios({
            method: 'get',
            url: `${context.FLEXMANAGER_API_URL}/rr-counters/${queue}`,
            headers: {
                'Authorization': `Bearer ${context.FLEXMANAGER_API_KEY}`,
                'Content-Type': 'application/vnd.api+json'
            }
        }).then(({ data }) => {
            return parseInt(data.data.attributes.counter);
        }).catch(async function (err) {
            return await createRRCounter(queue, context);
        });
    } catch (error) {
        console.log(err);
        return false;
    }
}


/**
 * Updates the RR counter for a specific queue.
 *
 * @param {string} queue - The name of the queue to update the RR counter for.
 * @param {number} count - The new value of the RR counter.
 * @param {object} context - The context object containing the FLEXMANAGER_API_URL and FLEXMANAGER_API_KEY.
 * @return {Promise<number|boolean>} The updated value of the RR counter if the update was successful, or false otherwise.
 */
const updateRRCounter = async (queue, count, context) => {
    try {
        return await axios({
            method: 'patch',
            url: `${context.FLEXMANAGER_API_URL}/rr-counters/${queue}`,
            headers: {
                'Authorization': `Bearer ${context.FLEXMANAGER_API_KEY}`,
                'Content-Type': 'application/vnd.api+json'
            },
            data: {
                "data": {
                    "type": "rr-counters",
                    "id": queue,
                    "attributes": {
                        "counter": count
                    }
                }
            }
        }).then(({ data }) => {
            return parseInt(data.data.attributes.counter);
        }).catch(function (err) {
            console.log(err);
            return false;
        });
    } catch (err) {
        console.log(err);
        return false;
    }
}

/**
 * Return the queue of the given area code
 *
 * @param {string} country - Country ISO 2
 * @param {string} areaCode - The area code of the destination phone number
 */
exports.areaCodeQueue = (country, areaCode) => {
    try {
        const areaCodesByCountry = {
            "MX": {
                "449": {
                    "areaCodes": ["449", "458", "465", "495", "496"]
                },
                "664": {
                    "areaCodes": ["615", "616", "646", "653", "658", "661", "664", "665", "686"]
                },
                "614": {
                    "areaCodes": ["614", "621", "625", "626", "627", "628", "629", "635", "636", "639", "648", "649", " 652", "656", "659"]
                },
                "477": {
                    "areaCodes": ["352", "411", "412", "413", "415", "417", "418", "419", "421", "428", "429", "432", "438", "445", "456", "461", "462", "464", "466", "469", "472", "476", "477"]
                },
                "33": {
                    "areaCodes": ["33", "312", "315", "316", "317", "321", "322", "326", "341", "342", "343", "344", "345", "346", "347", "348", "349", "357", "358", "371", "372", "373", "374", "375", "376", "377", "378", "382", "384", "385", "386", "387", "388", "391", "392", "393", "395", "437", "474", "475", "496", "499"]
                },
                "81": {
                    "areaCodes": ["81", "821", "823", "824", "825", "826", "828", "829", "867", "873", "892"]
                },
                "443": {
                    "areaCodes": ["313", "328", "351", "352", "353", "354", "355", "356", "359", "381", "383", "393", "394", "422", "423", "424", "425", "426", "434", "435", "436", "438", "443", "447", "451", "452", "453", "454", "455", "459", "471", "715", "753", "786"]
                },
                "222": {
                    "areaCodes": ["222", "223", "224", "227", "231", "233", "236", "237", "238", "243", "244", "245", "248", "249", "275", "276", "746", "764", "776", "797", "953", ""]
                },
                "442": {
                    "areaCodes": ["414", "427", "441", "442", "448", "487", "761"]
                },
                "993": {
                    "areaCodes": ["913", "914", "917", "923", "932", "933", "934", "936", "937", "993"]
                },
                "999": {
                    "areaCodes": ["969", "985", "986", "988", "991", "999"]
                },
                "771": {
                    "areaCodes": ["736", "738", "743", "748", "759", "761", "763", "771", "772", "773", "774", "775", "776", "778", "779", "789", "791"]
                },
                "998": {
                    "areaCodes": ["983", "984", "997", "998"]
                }
            }
        }

        if (areaCodesByCountry.hasOwnProperty(country)) {
            
            let queue = null;
            for (const key in areaCodesByCountry[country]) {
                if (areaCodesByCountry[country][key].hasOwnProperty('areaCodes')) {
                    if (areaCodesByCountry[country][key].areaCodes.find(element => element == areaCode)) {
                        queue = key;
                        break;
                    }
                }
            }
            return queue;

        } else {
            return false;
        }
    } catch (err) {
        console.log(err);
        return false;
    }
}

exports.updateRRCounter = updateRRCounter;
exports.createRRCounter = createRRCounter;
exports.getRRCounter = getRRCounter;