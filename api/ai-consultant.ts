import { GoogleGenerativeAI } from '@google/generative-ai';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { checkRateLimit } from './lib/rate-limiter';
import { sanitizeString, validateCanvasData } from './lib/sanitizer';

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

  // Validate canvasData payload structure and reject if malformed
  if (!canvasData || !validateCanvasData(canvasData)) {
    return res.status(400).json({ error: 'Invalid or malformed canvas data' });
  }

  // Sanitize incoming fields and truncate lengths to prevent payload inflation
  const sanitizedTitle = sanitizeString(canvasData.title, 200);
  const sanitizedValuePropositions = sanitizeString(canvasData.valuePropositions, 5000);
  const sanitizedCustomerSegments = sanitizeString(canvasData.customerSegments, 5000);
  const sanitizedRevenueStreams = sanitizeString(canvasData.revenueStreams, 5000);
  const sanitizedKeyActivities = sanitizeString(canvasData.keyActivities, 5000);
  const sanitizedCostStructure = sanitizeString(canvasData.costStructure, 5000);

  const swot = canvasData.swot || {};
  const sanitizedStrengths = sanitizeString(swot.strengths, 5000);
  const sanitizedWeaknesses = sanitizeString(swot.weaknesses, 5000);
  const sanitizedOpportunities = sanitizeString(swot.opportunities, 5000);
  const sanitizedThreats = sanitizeString(swot.threats, 5000);

  const sanitizedContext = sanitizeString(context, 2000);

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const prompt = `
      You are "Kettle Strat AI", a world-class strategic consultant. 
      Your goal is to review a Business Strategic Plan and provide sharp, guiding suggestions to improve its viability, scalability, and impact.

      CURRENT STRATEGIC PLAN:
      Title: ${sanitizedTitle}
      
      BUSINESS MODEL CANVAS:
      - Value Propositions: ${sanitizedValuePropositions}
      - Customer Segments: ${sanitizedCustomerSegments}
      - Revenue Streams: ${sanitizedRevenueStreams}
      - Key Activities: ${sanitizedKeyActivities}
      - Cost Structure: ${sanitizedCostStructure}

      SWOT ANALYSIS:
      - Strengths: ${sanitizedStrengths}
      - Weaknesses: ${sanitizedWeaknesses}
      - Opportunities: ${sanitizedOpportunities}
      - Threats: ${sanitizedThreats}

      USER QUESTION/CONTEXT:
      ${sanitizedContext || 'Please review the overall plan and suggest 3 high-impact additions or refinements.'}

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
