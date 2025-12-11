import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const getModel = (isComplex: boolean = false, isVision: boolean = false) => {
  // Use Gemini 3 Pro for complex reasoning or vision
  if (isComplex || isVision) {
    return 'gemini-3-pro-preview'; 
  }
  return 'gemini-2.5-flash';
};

/**
 * Simplifies text using Gemini 3 Pro with Thinking Mode
 */
export const simplifyTextWithThinking = async (
  text: string, 
  level: string,
  targetLanguage: string
): Promise<string> => {
  const prompt = `You are an accessibility expert. 
  Rewrite the following text to make it suitable for a ${level} reading level. 
  Translate it to ${targetLanguage} if it is not already.
  Provide a summary first, then the simplified details.
  
  Text to process:
  ${text}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 }, // Max thinking for deep simplification
        responseMimeType: 'text/plain'
      }
    });
    return response.text || "Could not generate simplification.";
  } catch (error) {
    console.error("Simplification error:", error);
    return "Error processing text. Please try again.";
  }
};

/**
 * Describes an image for visually impaired users.
 */
export const describeImage = async (base64Image: string, language: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // High quality vision
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: `Describe this image in detail for a visually impaired user. Language: ${language}. Focus on spatial layout, objects, and text present.` }
        ]
      }
    });
    return response.text || "No description available.";
  } catch (error) {
    console.error("Image description error:", error);
    return "Error analyzing image.";
  }
};

/**
 * Interprets Sign Language from a video frame (simulated via image for this demo).
 */
export const interpretSignLanguage = async (base64Image: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: "Analyze the hand gesture in this image. If it is a recognizable sign language gesture (ASL or common universal), translate it to text. If not, say 'No gesture detected'." }
        ]
      }
    });
    return response.text || "";
  } catch (error) {
    console.error("Sign interpretation error:", error);
    return "";
  }
};

/**
 * Advanced Chat with Thinking Mode
 */
export const createChatSession = () => {
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      thinkingConfig: { thinkingBudget: 32768 },
    }
  });
};
