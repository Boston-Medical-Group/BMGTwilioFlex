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
            return data.data.attributes.counter;
        }).catch(function (err) {
            return false;
        });
    } catch (error) {
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
            return data.data.attributes.counter;
        }).catch(async function (err) {
            return await createRRCounter(queue, context);
        });
    } catch (error) {
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
            return data.data.attributes.counter;
        }).catch(function (err) {
            console.log(err);
            return false;
        });
    } catch (error) {
        console.log(err);
        return false;
    }
}

exports.updateRRCounter = updateRRCounter;
exports.createRRCounter = createRRCounter;
exports.getRRCounter = getRRCounter;