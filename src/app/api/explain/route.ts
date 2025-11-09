import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { query, context, data } = await request.json();

    if (!query) {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 }
      );
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;
    
    let explanation = "";

    if (geminiApiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: `You are Contrust AI Assistant, an expert in transparent donation tracking and smart contract management. Context: ${context || "general"}. User data: ${JSON.stringify(data || {})}. User question: ${query}\n\nProvide a clear, concise, and helpful response focused on donation transparency, fraud detection, or campaign progress.`
                }]
              }],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 500,
              }
            }),
          }
        );

        if (response.ok) {
          const result = await response.json();
          explanation = result.candidates?.[0]?.content?.parts?.[0]?.text || "";
        }
      } catch (geminiError) {
        console.error("Gemini API error:", geminiError);
      }
    }

    // Fallback to rule-based responses if Gemini fails or no API key
    if (!explanation) {
      explanation = generateFallbackResponse(query, context, data);
    }

    return NextResponse.json({
      explanation,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Explain API error:", error);
    return NextResponse.json(
      { error: "Failed to generate explanation" },
      { status: 500 }
    );
  }
}

function generateFallbackResponse(query: string, context: string, data: any): string {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes("fraud") || lowerQuery.includes("security")) {
    return "Contrust uses AI-powered fraud detection to analyze every donation. We check for unusual patterns, verify donor information through the Nessie API, and assign a trust score to each transaction. Donations with high risk scores are flagged for review before processing.";
  }

  if (lowerQuery.includes("smart contract") || lowerQuery.includes("spending")) {
    return "Smart contracts in Contrust enforce spending categories set by organizations. Each campaign specifies how funds will be allocated (e.g., 40% medical, 35% food, 25% shelter). The AI verifies that every withdrawal matches its intended category and stays within budget. Donors can see real-time spending breakdowns.";
  }

  if (lowerQuery.includes("track") || lowerQuery.includes("progress")) {
    return "You can track your donation in real-time through the dashboard. Every transaction is logged with: donation amount, category allocation, AI verification score, and spending updates. The system uses live data to show exactly how funds are being used.";
  }

  if (lowerQuery.includes("nessie") || lowerQuery.includes("payment")) {
    return "Contrust integrates with Capital One's Nessie API for secure payment processing. Your transactions are logged in real-time, and customer information is tracked for transparency and fraud prevention.";
  }

  if (context === "donation" && data) {
    return `Your donation of $${data.amount || "0"} to the ${data.category || "campaign"} category has been processed with AI verification. The fraud detection score is ${data.fraudScore || 95}%, indicating a secure transaction. Funds will be allocated according to the smart contract terms.`;
  }

  return "I'm the Contrust AI Assistant. I can help you understand donation tracking, fraud detection, smart contract spending rules, and real-time progress monitoring. What would you like to know?";
}