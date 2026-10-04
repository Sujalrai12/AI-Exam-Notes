const Gemini_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent"

export const generateGeminiResponse = async (prompt)=>{

    try {

         if (!process.env.GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY is not configured")
        }

         const response = await fetch(Gemini_URL,{
        method :"POST",
        headers :{
            "Content-Type":"application/json",
            "x-goog-api-key": process.env.GEMINI_API_KEY
        },
        body: JSON.stringify({
            contents : [
                {
                    parts : [
                        {
                            text:prompt
                        }
                    ]
                }
            ]
        })
    })

    if(!response.ok){
        const err = await response.text();
        throw new Error(err);
    }
    const data = await response.json()

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text

    if(!text){
        throw new Error("No text returned from Gemini")
    }
    

    const cleanText = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

    return JSON.parse(cleanText)
        
    } catch (error) {
        console.log("Gemini Fetch error",error.message)
        throw new Error("Gemini API fetch failed")
        
    }
   

}
