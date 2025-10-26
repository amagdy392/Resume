import { GoogleGenAI, Type } from '@google/genai';
import type { AnalysisResult, Language } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        overallScore: {
            type: Type.NUMBER,
            description: 'An overall score for the resume from 0 to 100 based on ATS compatibility.'
        },
        summary: {
            type: Type.STRING,
            description: 'A brief, constructive summary of the resume\'s strengths and weaknesses.'
        },
        sections: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    sectionName: {
                        type: Type.STRING,
                        description: 'The name of the resume section (e.g., "Work Experience", "Skills").'
                    },
                    score: {
                        type: Type.NUMBER,
                        description: 'A score for this specific section from 0 to 100.'
                    },
                    findings: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: 'Specific, bullet-pointed findings about what is good or bad in this section.'
                    },
                    suggestions: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: 'Actionable suggestions to improve this section.'
                    }
                },
                 required: ['sectionName', 'score', 'findings', 'suggestions']
            }
        },
        keywords: {
            type: Type.OBJECT,
            properties: {
                identified: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'A list of important keywords and skills identified in the resume.'
                },
                suggestions: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'A list of relevant keywords that are missing and could be added.'
                }
            },
            required: ['identified', 'suggestions']
        }
    },
    required: ['overallScore', 'summary', 'sections', 'keywords']
};

export const analyzeResume = async (base64Data: string, mimeType: string, language: Language): Promise<AnalysisResult> => {
    const langInstruction = language === 'ar' 
        ? 'All analysis, feedback, and section names must be in Arabic.' 
        : 'All analysis, feedback, and section names must be in English.';

    const systemInstruction = `You are an expert ATS (Applicant Tracking System) resume analyzer. Your task is to review the provided resume and return a detailed analysis in JSON format.
    - If the provided document is a scanned image or contains non-selectable text, your first step is to perform Optical Character Recognition (OCR) to accurately extract all text content before analysis.
    - Be critical and objective.
    - Evaluate the resume's content based on standard ATS parsing rules: clear headings, standard fonts, keyword optimization, and structured data.
    - Provide an overall score and a breakdown by standard resume sections (Contact Info, Summary, Experience, Education, Skills, etc.).
    - For each section, provide specific findings and actionable suggestions for improvement.
    - Also, perform a keyword analysis. Identify the key skills and terms present in the resume. Based on the content, suggest other relevant keywords that could be added to improve its chances of passing through an ATS for relevant job roles.
    - ${langInstruction}`;

    const prompt = `Please analyze this resume for ATS compatibility.`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64Data,
                            mimeType: mimeType,
                        },
                    },
                    { text: prompt },
                ]
            },
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: 'application/json',
                responseSchema: responseSchema,
                temperature: 0.2,
            }
        });

        const jsonText = response.text.trim();
        try {
            const result = JSON.parse(jsonText) as AnalysisResult;
            return result;
        } catch (parseError) {
            console.error("Error parsing JSON response from Gemini API:", parseError, "Raw text:", jsonText);
            throw new Error("PARSING_ERROR");
        }

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof Error) {
            if (error.message.toLowerCase().includes('fetch')) {
                 throw new Error("NETWORK_ERROR");
            }
            throw new Error("API_ERROR");
        }
        throw new Error("UNKNOWN_ANALYSIS_ERROR");
    }
};