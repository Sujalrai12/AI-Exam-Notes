const model = process.env.GEMINI_MODEL || "gemini-3.8-flash"
const retryableStatuses = new Set([408, 429, 500, 502, 503, 504])
const maxRetries = 3

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds))

const retryDelay = (attempt) => (1000 * (2 ** attempt)) + Math.floor(Math.random() * 250)

const createError = (message, statusCode) => {
    const error = new Error(message)
    error.statusCode = statusCode
    return error
}

export const generateGeminiResponse = async (prompt) => {
    if (!process.env.GEMINI_API_KEY) {
        throw createError("GEMINI_API_KEY is not configured", 500)
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`
    let response

    for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
        try {
            response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": process.env.GEMINI_API_KEY
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { responseMimeType: "application/json" }
                })
            })
        } catch (error) {
            if (attempt === maxRetries) {
                console.error("Gemini network request failed:", error.message)
                throw createError("Gemini could not be reached. Check the server connection and try again.", 503)
            }
            await wait(retryDelay(attempt))
            continue
        }

        if (response.ok) break

        const errorBody = await response.text()
        if (retryableStatuses.has(response.status) && attempt < maxRetries) {
            console.warn(`Gemini returned ${response.status}; retrying request (${attempt + 1}/${maxRetries})`)
            await wait(retryDelay(attempt))
            continue
        }

        if (response.status === 401 || response.status === 403) {
            throw createError(
                "Gemini authentication failed. Set GEMINI_API_KEY in server/.env to a Gemini API key from Google AI Studio.",
                response.status
            )
        }

        if (retryableStatuses.has(response.status)) {
            console.error(`Gemini remained unavailable after ${maxRetries} retries:`, errorBody)
            throw createError("Gemini is temporarily busy. Please wait a moment and try again.", 503)
        }

        console.error("Gemini request failed:", errorBody)
        throw createError("Gemini rejected the request. Check the server logs for details.", response.status)
    }

    let data
    try {
        data = await response.json()
    } catch {
        throw createError("Gemini returned an unreadable response. Please try again.", 502)
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) {
        throw createError("Gemini returned no notes. Please try again.", 502)
    }

    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim()
    try {
        return JSON.parse(cleanText)
    } catch {
        throw createError("Gemini returned notes in an invalid format. Please try again.", 502)
    }
}
