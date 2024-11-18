import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;

// Initialize the API only if key is available
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function POST(request: Request) {
  if (!genAI) {
    // Return basic analysis if AI is not available
    return NextResponse.json({
      suggestions: [
        {
          category: "performance",
          severity: "medium",
          message: "Consider implementing code splitting for better performance",
          details: "Code splitting can help reduce initial bundle size and improve load times."
        }
      ]
    });
  }

  try {
    const { packageData, bundleStats } = await request.json();

    const prompt = `Analyze this package.json and provide optimization suggestions:
    Package Data: ${JSON.stringify(packageData, null, 2)}
    Bundle Stats: ${JSON.stringify(bundleStats, null, 2)}

    Focus on:
    1. Bundle size optimization opportunities
    2. Performance improvements
    3. Security considerations
    4. Dependency management best practices
    5. Development workflow optimization

    Format the response as JSON with this structure:
    {
      "suggestions": [
        {
          "category": "size"|"performance"|"security"|"obsolete",
          "severity": "high"|"medium"|"low",
          "message": "string",
          "details": "string"
        }
      ]
    }`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const suggestions = JSON.parse(text);
      return NextResponse.json(suggestions);
    } catch (parseError) {
      // Fallback to basic analysis if parsing fails
      return NextResponse.json({
        suggestions: [
          {
            category: "performance",
            severity: "medium",
            message: "Consider implementing code splitting for better performance",
            details: "Code splitting can help reduce initial bundle size and improve load times."
          }
        ]
      });
    }
  } catch (error) {
    console.error("Error analyzing package:", error);
    // Return basic analysis on error
    return NextResponse.json({
      suggestions: [
        {
          category: "performance",
          severity: "medium",
          message: "Consider implementing code splitting for better performance",
          details: "Code splitting can help reduce initial bundle size and improve load times."
        }
      ]
    });
  }
}