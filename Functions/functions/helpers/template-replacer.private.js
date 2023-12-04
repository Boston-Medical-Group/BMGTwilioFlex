exports.replaceTemplate = (template, data) => {
    let result = template;
    for (const [key, value] of Object.entries(data)) {
        result = result.replaceAll(`{${key}}`, value);
    }
    return result;
}