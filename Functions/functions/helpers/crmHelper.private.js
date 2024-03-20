exports.getGPTSummary = async (openai, historyDelivered, apiModel) => {
    let messages = []

    // System messages
    messages.push({
        role: 'system',
        content: 'Eres el asistente de resúmenes de conversaciones de Boston Medical, la clínica de salud sexual masculina.'
    })
    messages.push({
        role: 'system',
        content: 'La conversación se produce entre nuestro agente y un paciente por Whatsapp.'
    })

    historyDelivered.forEach((h) => {
        let author = 'assistant'
        if (h.author.startsWith('whatsapp:')) {
            author = 'user'
        }
        messages.push({
            role: author,
            content: h.body
        })
    })

    messages.push({
        role: 'assistant',
        content: 'Crea un resumen de la conversación en máximo 500 caracteres. No incluyas las fechas. De tener el dato, menciona la ciudad desde la que nos contacta y la clínica a la cuál quiere asistir'
    })

    let summary = ''
    if (!apiModel) {
        await openai.chat.completions.create({
            model: "gpt-3.5-turbo-0125",
            messages,
        })
            .then(completion => {
                // Extracting the summary from the OpenAI API response
                summary = completion.choices[0].message.content;
            })
            .catch(error => {
                console.log(error)
            });
    } else {
        console.log('Invalid model parameter only gpt and text models supported');
    }

    return summary
}

exports.getGPTThreadRun = async (openai, historyDelivered, instructions, assistant) => {
    if (instructions !== '') {
        messages.push({
            role: 'system',
            content: instructions
        })
    }

    let messages = []
    historyDelivered.forEach((h) => {
        messages.push({
            role: 'user',
            content: h.body
        })
    })

    const run = await openai.beta.threads.createAndRun({
        assistant_id: assistant,
        thread: {
            messages
        },
    });

    return run
}