import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const fallbackExplanations = {
  "tree-shaking": "Tree shaking is a term commonly used in JavaScript context for dead-code elimination. It refers to the process of removing unused code from your final bundle. When you import and export modules, tree shaking helps in identifying which exports are actually used and removes the unused ones, resulting in smaller bundle sizes and better performance.",
};

export async function POST(request: Request) {
  if (!genAI) {
    return NextResponse.json({
      explanations: Object.entries(fallbackExplanations).map(([term, explanation]) => ({
        term,
        explanation,
      })),
    });
  }

  try {
    const { terms } = await request.json();

    const prompt = `Explain the following technical terms in simple language, focusing on their relevance to JavaScript and web development. Keep each explanation under 250 words and make it easy to understand for developers of all levels:

    Terms: ${terms.join(", ")}

    Format the response as JSON with this structure:
    {
      "explanations": [
        {
          "term": "string",
          "explanation": "string"
        }
      ]
    }`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const explanations = JSON.parse(text);
      return NextResponse.json(explanations);
    } catch (parseError) {
      // Return fallback explanations if parsing fails
      return NextResponse.json({
        explanations: Object.entries(fallbackExplanations).map(([term, explanation]) => ({
          term,
          explanation,
        })),
      });
    }
  } catch (error) {
    console.error("Error explaining terms:", error);
    // Return fallback explanations on error
    return NextResponse.json({
      explanations: Object.entries(fallbackExplanations).map(([term, explanation]) => ({
        term,
        explanation,
      })),
    });
  }
}