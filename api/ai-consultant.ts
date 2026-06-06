import { GoogleGenerativeAI } from '@google/generative-ai';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { checkRateLimit } from './lib/rate-limiter';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Enforce IP-based rate limiting (30 attempts per 15 minutes)
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
  const rateLimit = await checkRateLimit(clientIp, 30, 15 * 60 * 1000);
  if (!rateLimit.allowed) {
    res.setHeader('Retry-After', Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString());
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  const { canvasData, context } = req.body;

  if (!canvasData) {
    return res.status(400).json({ error: 'Missing canvas data' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const prompt = `
      You are "Kettle Strat AI", a world-class strategic consultant. 
      Your goal is to review a Business Strategic Plan and provide sharp, guiding suggestions to improve its viability, scalability, and impact.

      CURRENT STRATEGIC PLAN:
      Title: ${canvasData.title}
      
      BUSINESS MODEL CANVAS:
      - Value Propositions: ${canvasData.valuePropositions}
      - Customer Segments: ${canvasData.customerSegments}
      - Revenue Streams: ${canvasData.revenueStreams}
      - Key Activities: ${canvasData.keyActivities}
      - Cost Structure: ${canvasData.costStructure}

      SWOT ANALYSIS:
      - Strengths: ${canvasData.swot?.strengths}
      - Weaknesses: ${canvasData.swot?.weaknesses}
      - Opportunities: ${canvasData.swot?.opportunities}
      - Threats: ${canvasData.swot?.threats}

      USER QUESTION/CONTEXT:
      ${context || 'Please review the overall plan and suggest 3 high-impact additions or refinements.'}

      INSTRUCTIONS:
      1. Be concise but deep.
      2. Provide actionable items (e.g., "Add X to Customer Segments because Y").
      3. Use a professional, encouraging, but rigorous tone.
      4. Format your response in clean Markdown.
      5. Do not hallucinate data; stick to the context provided.
      6. Focus on finding "blind spots" in the current plan.

      RESPONSE FORMAT:
      ### 🎯 Strategic Insights
      [Overall assessment]

      ### 💡 High-Impact Suggestions
      - **[Suggestion 1 Title]**: [Detail]
      - **[Suggestion 2 Title]**: [Detail]
      
      ### 🚀 Recommended Next Step
      [One single most important thing to do next]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ suggestion: text });
  } catch (error: any) {
    console.error('AI Consultant Error:', error);
    res.status(500).json({ error: 'Failed to generate AI insights', details: error.message });
  }
}
