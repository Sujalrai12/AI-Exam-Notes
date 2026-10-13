const model = process.env.GROQ_MODEL || "openai/gpt-oss-120b"
const retryableStatuses = new Set([408, 429, 500, 502, 503, 504])
const maxRetries = 3

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds))
const retryDelay = (attempt) => (1000 * (2 ** attempt)) + Math.floor(Math.random() * 250)

const createError = (message, statusCode) => {
    const error = new Error(message)
    error.statusCode = statusCode
    return error
}

export const generateGroqResponse = async (prompt) => {
    if (!process.env.GROQ_API_KEY) {
        throw createError("GROQ_API_KEY is not configured", 500)
    }

    let response
    for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
        try {
            response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.GROQ_API_KEY}`
                },
                body: JSON.stringify({
                    model,
                    messages: [{ role: "user", content: prompt }],
                    response_format: { type: "json_object" }
                })
            })
        } catch (error) {
            if (attempt === maxRetries) {
                console.error("Groq network request failed:", error.message)
                throw createError("Groq could not be reached. Check the server connection and try again.", 503)
            }
            await wait(retryDelay(attempt))
            continue
        }

        if (response.ok) break

        const errorBody = await response.text()
        if (retryableStatuses.has(response.status) && attempt < maxRetries) {
            console.warn(`Groq returned ${response.status}; retrying request (${attempt + 1}/${maxRetries})`)
            const retryAfter = Number(response.headers.get("retry-after"))
            await wait(retryAfter > 0 ? retryAfter * 1000 : retryDelay(attempt))
            continue
        }

        if (response.status === 401 || response.status === 403) {
            throw createError(
                "Groq authentication failed. Set GROQ_API_KEY in the server environment to an API key from Groq.",
                response.status
            )
        }

        if (retryableStatuses.has(response.status)) {
            console.error(`Groq remained unavailable after ${maxRetries} retries:`, errorBody)
            throw createError("Groq is temporarily busy or its rate limit has been reached. Please wait and try again.", 503)
        }

        console.error("Groq request failed:", errorBody)
        throw createError("Groq rejected the request. Check the server logs for details.", response.status)
    }

    let data
    try {
        data = await response.json()
    } catch {
        throw createError("Groq returned an unreadable response. Please try again.", 502)
    }

    const text = data.choices?.[0]?.message?.content
    if (!text) {
        throw createError("Groq returned no notes. Please try again.", 502)
    }

    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim()
    try {
        return JSON.parse(cleanText)
    } catch {
        throw createError("Groq returned notes in an invalid format. Please try again.", 502)
    }
}
