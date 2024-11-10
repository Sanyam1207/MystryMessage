const { GoogleGenerativeAI } = require("@google/generative-ai");

export async function POST(req: Request) {
    try {
        const { content } = await req.json();
        console.log(`\n\n\nRequest from suggest messages : ${content}\n\n`)
        const genAI = new GoogleGenerativeAI(process.env.API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt =
            `Create a list of three open-ended and engaging Complements or positive 
            criticism formatted as a single string the complements or the 
            criticism should be based upon ${content}.directly start from the messages and Each reply should be separated by '||'. These reply are for an anonymous social messaging platform. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. Do not make it as a question make it as a one or two liner statement. `;
        const result = await model.generateContent(prompt);
        console.log(result.response.candidates[0].content.parts[0].text);

        return Response.json({
            success: true,
            message: result.response.candidates[0].content.parts[0].text
        }, {
            status: 201
        })
    } catch (error) {
        console.log(`error from the generative text ai ${error}`)
        return Response.json({
            message: "Error in getting messages from the AI",
        }, {
            status: 500
        })
    }
}