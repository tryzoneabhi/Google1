import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const getChatResponse = async (message: string, context: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: message,
      config: {
        systemInstruction: `You are Webora AI, an assistant for Sanskar's web development agency called Webora. 
        Context about Webora: ${context}. 
        Be professional, helpful, and encourage users to buy services. 
        If they ask about prices, refer to the Elite (499), Pro (599), and Premium (999) tiers.
        Sanskar is the lead developer.`,
      },
    });
    return response.text;
  } catch (error) {
    console.error("AI Error:", error);
    return "I'm having trouble connecting right now. Please try again later!";
  }
};
