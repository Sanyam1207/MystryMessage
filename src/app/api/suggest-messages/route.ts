import { NextRequest } from 'next/server';
import axios from 'axios';

// Define API URL and constants
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export async function POST(req: NextRequest) {
    try {
        const { content } = await req.json();

        // Get API key from environment variables
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

        // Construct the prompt with the subject for context - same as your frontend
        const prompt = ` Create a list of three open-ended and engaging Complements or positive 
            criticism formatted as a single string the complements or the 
            criticism should be based upon ${content}.directly start from the messages and Each reply should be separated by '||'. These reply are for an anonymous social messaging platform. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly inter. Do not make it as a question make it as a one or two liner statement. `;

        // Call Gemini API - exact same structure as your frontend code
        const response = await axios.post(
            `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
            {
                contents: [
                    {
                        parts: [
                            { text: prompt }
                        ]
                    }
                ],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                }
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        // Extract the response text - same as your frontend
        const generatedText = response.data.candidates[0].content.parts[0].text;
        console.log(`Generated response: ${generatedText.substring(0, 100)}...`);

        return Response.json({
            success: true,
            data: generatedText
        }, {
            status: 200
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error('Gemini API Error:', error);
        let errorMessage = 'Failed to connect to Gemini API';

        if (error.response) {
            errorMessage = `Gemini API Error: ${error.response.data.error?.message || 'Unknown error'}`;
        }

        return Response.json({
            success: false,
            error: errorMessage
        }, {
            status: 500
        });
    }
}