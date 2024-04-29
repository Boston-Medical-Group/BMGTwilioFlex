exports.getGPTSummary = async (openai, historyDelivered, apiModel) => {
    let messages = []

    // System messages
    messages.push({
        role: 'system',
        content: 'Eres un asistente, encargado de generar el resumen o "summary" de una conversación entre un paciente y uno o varios agentes.'
    })
    messages.push({
        role: 'system',
        content: 'No debes incluir costos de servicios ni productos en tus resúmenes.'
    })
    messages.push({
        role: 'system',
        content: 'No debes inventar o inferir información, solo debes incluir información relevante de la conversación si es que ha sido proporcionada.'
    })
    messages.push({
        role: 'system',
        content: 'Debes incluir la ciudad del paciente solo en caso de que el paciente la haya proporcionado en algún momento de la conversación.'
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
        content: 'Crea un resumen de la conversación en máximo 500 caracteres ahora.'
    })

    let summary = ''
    if (!apiModel) {
        let completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-0125",
            messages,
            temperature: 0.7
        })
            
        if (completion.hasOwnProperty('choices') && completion.choices.length > 0) {
            summary = completion.choices[0].message.content;
        } else {
            console.error('COMPLETION ERROR')
            console.error(completion)
        }
    } else {
        console.log('Invalid model parameter only gpt and text models supported');
    }

    return summary
}

exports.getGPTThreadRun = async (openai, historyDelivered, instructions, assistant) => {
    let messages = []
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

    const thread = await openai.beta.threads.create({
        messages
    });

    let options = {
        assistant_id: assistant
    }

    if (instructions !== '') {
        options = {
            ...options,
            additional_instructions: instructions
        }
    }

    const run = await openai.beta.threads.runs.create(thread.id, options)

    return run
}