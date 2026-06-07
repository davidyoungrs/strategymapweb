export interface TooltipContent {
  definition: string;
  questions: string[];
  example?: string;
}

export const PESTEL_GUIDANCE: Record<string, TooltipContent> = {
  political: {
    definition: "Government policy, political stability, and regulatory actions affecting the business landscape.",
    questions: [
      "Are there upcoming elections or major policy shifts?",
      "How do trade tariffs, taxation policies, or government grants impact you?",
      "Is political stability in your target regions high or low?"
    ],
    example: "Looming adjustments to international data sovereignty and transfer tariffs."
  },
  economic: {
    definition: "Macroeconomic factors including market growth rates, inflation, interest rates, and consumer spending.",
    questions: [
      "What are the current inflation and interest rate trends?",
      "Are target consumer markets expanding or contracting?",
      "How do fluctuating exchange rates affect your cost of business?"
    ],
    example: "Rising operational overheads driven by sustained local inflation of 4.2%."
  },
  social: {
    definition: "Demographics, consumer lifestyle changes, buying habits, and cultural attitudes.",
    questions: [
      "What demographic trends or population shifts are happening?",
      "Are consumer buying preferences moving toward ethical or digital-first?",
      "What are the prevailing work-life or career attitudes in your talent pool?"
    ],
    example: "Strong consumer demand shift toward local, high-security on-device data processing."
  },
  technological: {
    definition: "Emerging technologies, R&D opportunities, security requirements, and digital maturity.",
    questions: [
      "What new tech innovations could disrupt or enhance your operations?",
      "Are there changes in infrastructure or tooling availability (e.g. WebGPU)?",
      "How is AI or automation impacting competitor workflows?"
    ],
    example: "Widespread support for hardware-accelerated local AI inference inside browsers."
  },
  environmental: {
    definition: "Ecological and environmental factors, climate requirements, carbon footprint, and circular economy expectations.",
    questions: [
      "What are the carbon offset or waste management policies in your industry?",
      "How do weather patterns or climate hazards risk your supply chain?",
      "Are sustainability credentials expected by your target buyers?"
    ],
    example: "Carbon-neutral certification required for entry into Scandinavian retail chains."
  },
  legal: {
    definition: "Employment law, health & safety, consumer protection, intellectual property, and licensing rules.",
    questions: [
      "What licensing, permits, or insurance policies are legally required?",
      "Are there pending changes to consumer safety or fair labor regulations?",
      "How do you secure patents, trademarks, or copyrights?"
    ],
    example: "Pending compliance audits with regional digital privacy frameworks."
  }
};

export const PORTER_GUIDANCE: Record<string, TooltipContent> = {
  threatOfNewEntrants: {
    definition: "The ease with which new competitors can enter your market, determined by barriers to entry.",
    questions: [
      "Are start-up capital requirements high or low?",
      "How strong are existing brand loyalty and proprietary technology barriers?",
      "Are government regulations or distribution networks hard to obtain?"
    ],
    example: "Low barrier to entry for basic web tools, but high barrier for certified offline systems."
  },
  bargainingPowerOfSuppliers: {
    definition: "The leverage suppliers have to raise prices, reduce quality, or limit supply availability.",
    questions: [
      "How many suppliers can you choose from?",
      "What is the cost or operational risk of switching suppliers?",
      "Can suppliers easily integrate forward and compete with you directly?"
    ],
    example: "High supplier power for GPU computing networks due to global chip shortages."
  },
  bargainingPowerOfBuyers: {
    definition: "The leverage customers have to drive down prices, demand higher quality, or switch brands.",
    questions: [
      "How many buyers do you have relative to the size of your competitors?",
      "Can buyers easily switch to alternative products with minimal cost?",
      "How price-sensitive is your target audience?"
    ],
    example: "Medium power; buyers have multiple cloud options but lack offline alternatives."
  },
  threatOfSubstitutes: {
    definition: "The availability of different products or services that solve the same customer need.",
    questions: [
      "Are there indirect alternatives that achieve the same result?",
      "What is the performance-to-price ratio of these alternatives?",
      "Is the buyer's switching cost low?"
    ],
    example: "Traditional manual spreadsheet strategy models act as a low-cost substitute."
  },
  competitiveRivalry: {
    definition: "The intensity of competition among existing businesses in the industry.",
    questions: [
      "How many competitors are there and what is their relative size?",
      "Is the industry growth rate fast enough to support all players?",
      "Are exit barriers high, forcing rivals to compete aggressively?"
    ],
    example: "High rivalry from established venture-backed cloud-based strategy canvases."
  }
};

export const LEAN_GUIDANCE: Record<string, TooltipContent> = {
  problem: {
    definition: "The top 3 core problems or paint points that your target customer segment experiences.",
    questions: [
      "What are the biggest challenges your customers face daily?",
      "How are customers currently addressing these problems (existing alternatives)?",
      "Why are current workarounds or alternatives insufficient?"
    ],
    example: "1. Strategy docs remain static and collect dust. 2. Cloud uploads compromise company IP."
  },
  solution: {
    definition: "The features and capabilities of your product that directly solve each outlined problem.",
    questions: [
      "What is the minimum set of features needed to solve the top problems?",
      "How does the solution function to streamline the customer's workflow?",
      "Is the solution realistic and ready to implement?"
    ],
    example: "1. Dynamic strategy canvasses with voice input. 2. On-device local Gemma model inference."
  },
  uniqueValueProposition: {
    definition: "A single, clear, compelling statement explaining why your product is different and worth buying.",
    questions: [
      "What is the primary benefit you offer that no one else does?",
      "How do you explain your concept to a busy buyer in 15 seconds?",
      "What is your high-level concept analogy (e.g. 'YouTube for strategy docs')?"
    ],
    example: "Interactive offline strategy maps powered by secure, local AI models."
  },
  unfairAdvantage: {
    definition: "A critical advantage or asset that cannot be easily copied, bought, or reverse-engineered by rivals.",
    questions: [
      "Do you have proprietary technology, patents, or exclusive licenses?",
      "Do you possess a highly specialized team or unique dataset?",
      "Is there a network effect or community barriers that protect you?"
    ],
    example: "Custom WebGPU browser runtime layer optimized for offline consumer GPUs."
  },
  lcCustomerSegments: {
    definition: "The specific groups of people or organizations you aim to reach and serve, including early adopters.",
    questions: [
      "Who are the most important customers you are creating value for?",
      "What demographics, industries, or profiles characterize them?",
      "Who are the 'early adopters' who need this product immediately?"
    ],
    example: "Early adopters: Tech startups, security-conscious B2B consultants, and agile accelerators."
  },
  keyMetrics: {
    definition: "The key indicators or KPIs you track to measure the health, adoption, and success of the business.",
    questions: [
      "What are the user behaviors that indicate value (retention, referrals)?",
      "What are your key acquisition, activation, and retention numbers?",
      "What is the single 'North Star' metric for your product?"
    ],
    example: "Monthly Active Canvases (MAC), user activation rate, and local inference completion count."
  },
  lcChannels: {
    definition: "The pathways and methods you use to reach, educate, and sell to your target customer segments.",
    questions: [
      "Where do your target customers hang out (online/offline)?",
      "How will you build awareness (SEO, direct outreach, content marketing)?",
      "What channels are the most cost-effective and direct?"
    ],
    example: "Developer newsletters, direct LinkedIn outreach, Product Hunt launch, tech hub partnerships."
  },
  lcCostStructure: {
    definition: "All the major fixed and variable costs required to operate your business model.",
    questions: [
      "What are the most expensive resources or activities in your model?",
      "What are your development, hosting, marketing, and salary overheads?",
      "How do costs scale as you acquire more customers?"
    ],
    example: "Fixed: Core development salaries, marketing. Variable: Client-side hosting, WASM CDN bandwidth."
  },
  lcRevenueStreams: {
    definition: "The models and methods through which your business generates income from each customer segment.",
    questions: [
      "For what value are customers really willing to pay?",
      "What are the pricing models (subscription, pay-per-use, freemium)?",
      "How much does each stream contribute to total revenue?"
    ],
    example: "SaaS Subscription: Freemium basic access with a $29/mo Premium tier for advanced AI consultation."
  }
};

export const BMC_GUIDANCE: Record<string, TooltipContent> = {
  keyPartners: {
    definition: "The network of suppliers, alliances, and partners that help make the business model work.",
    questions: [
      "Who are your key partners and suppliers?",
      "Which key resources are you acquiring from partners?",
      "What motivators drive these partnerships (optimization, risk reduction)?"
    ],
    example: "Hugging Face (model repo hub), local startup incubators, browser engine dev groups."
  },
  keyActivities: {
    definition: "The most important actions your company must perform to execute its value proposition successfully.",
    questions: [
      "What actions are required to build and deliver your product?",
      "What activities are needed for channel distribution and customer relationships?",
      "How do you maintain product quality and technological advantages?"
    ],
    example: "Ongoing local WebGPU optimization, refining AI prompts, content marketing."
  },
  valuePropositions: {
    definition: "The bundle of products and services that create value for a specific Customer Segment.",
    questions: [
      "What core value or solution do you deliver to the customer?",
      "Which customer needs are you satisfying?",
      "What bundle of products/services are you offering to each segment?"
    ],
    example: "A secure, client-side strategy canvas featuring instant offline AI audits."
  },
  customerRelationships: {
    definition: "The types of relationships and experiences you establish with your customer segments.",
    questions: [
      "What type of relationship does each customer segment expect (automated, personal)?",
      "How are these relationships integrated into the rest of the business model?",
      "What is the cost of maintaining these relationships?"
    ],
    example: "Self-service dashboard, automated AI support, dedicated Discord developer community."
  },
  customerSegments: {
    definition: "The target groups of customers (consumers or organizations) that your model serves.",
    questions: [
      "For whom are you creating value?",
      "Who are your most important, high-value customers?",
      "Are you serving a mass market, niche market, or multi-sided platform?"
    ],
    example: "SaaS founders, strategic management consultants, enterprise innovation departments."
  },
  keyResources: {
    definition: "The assets (physical, intellectual, human, or financial) required to make the business model work.",
    questions: [
      "What assets are essential to build and deliver your value propositions?",
      "What distribution channels or customer relationships require physical/IP resources?",
      "What intellectual property (code, patents) is required?"
    ],
    example: "Proprietary WASM compilation pipeline, core software engineering team, cloud hosting assets."
  },
  channels: {
    definition: "How you communicate with and reach your customer segments to deliver your value proposition.",
    questions: [
      "Through which channels do your customer segments want to be reached?",
      "How are you reaching them now? Which channels work best?",
      "How are your channels integrated with customer routines?"
    ],
    example: "GitHub repository, organic technical articles, direct enterprise sales outreach."
  },
  costStructure: {
    definition: "All costs incurred to operate the business model.",
    questions: [
      "What are the most critical costs inherent in your business model?",
      "Is your business model cost-driven (low cost) or value-driven (high value)?",
      "What are the major fixed and variable operational expenses?"
    ],
    example: "Engineering payroll, SEO marketing tools, software licensing, hosting bandwidth."
  },
  revenueStreams: {
    definition: "The cash a company generates from each Customer Segment.",
    questions: [
      "How do customers currently pay? How would they prefer to pay?",
      "What is the pricing model for each stream (fixed, dynamic)?",
      "What percentage of total revenue does each stream represent?"
    ],
    example: "Flat-rate monthly subscriptions, enterprise custom licenses, team collaborator seat add-ons."
  }
};

export const ANSOFF_GUIDANCE: Record<string, TooltipContent> = {
  marketPenetration: {
    definition: "Low-risk strategy focusing on selling existing products to existing markets to increase share.",
    questions: [
      "How can you encourage existing customers to buy more frequently?",
      "What promotional strategies can capture market share from competitors?",
      "Can you optimize pricing or loyalty rewards to increase conversion?"
    ],
    example: "Running targeted ad campaigns to encourage existing Kettle Strat free users to upgrade."
  },
  productDevelopment: {
    definition: "Medium-risk strategy introducing new products or features to your existing customer base.",
    questions: [
      "What adjacent products or integrations are current clients asking for?",
      "How can you leverage your current R&D to build value add-ons?",
      "Do you have the engineering resources to design and support new products?"
    ],
    example: "Adding local financial forecasting tools onto the existing dashboard for current users."
  },
  marketDevelopment: {
    definition: "Medium-risk strategy targeting new markets, geographical regions, or customer segments with existing products.",
    questions: [
      "Are there new user segments (e.g. educational institutions) that can use your app?",
      "Can you localize or translate your product to expand into other countries?",
      "Are there adjacent industries that have the same core problem?"
    ],
    example: "Translating the Kettle Strat platform and pitching it to European accelerator programs."
  },
  diversification: {
    definition: "High-risk strategy introducing completely new products to entirely new, untapped markets.",
    questions: [
      "What new opportunities leverage your capabilities but serve a different audience?",
      "Do you have the capital to absorb potential losses during market entry?",
      "How will you acquire the necessary expertise to navigate the new sector?"
    ],
    example: "Developing an offline executive training VR simulation tool for governmental clients."
  }
};

export const BCG_GUIDANCE: Record<string, TooltipContent> = {
  stars: {
    definition: "High-growth, high-market-share products. Requires heavy investment to maintain dominance.",
    questions: [
      "Which products are market leaders in fast-growing sectors?",
      "How will you fund their ongoing feature development and marketing?",
      "Can they transition into Cash Cows as the market matures?"
    ],
    example: "Our on-device local AI consulting engine, experiencing 40% MoM growth."
  },
  cashCows: {
    definition: "Low-growth, high-market-share products. Generates more cash than they consume, funding other products.",
    questions: [
      "Which mature products have stable market shares and low capital requirements?",
      "How can you defend their position with minimal reinvestment?",
      "How will you allocate their generated cash to finance high-potential Stars?"
    ],
    example: "Our standard classic SWOT and PESTEL canvases subscription tier."
  },
  questionMarks: {
    definition: "High-growth, low-market-share products. High potential but requires evaluation to invest or divest.",
    questions: [
      "Which new features show promise in hot markets but have low current adoption?",
      "What is the cost to convert these into Stars?",
      "Are they underperforming due to poor marketing or structural issues?"
    ],
    example: "Our newly launched Value Chain collaboration boards for enterprises."
  },
  dogs: {
    definition: "Low-growth, low-market-share products. Generates minimal cash; prime candidates for divestment.",
    questions: [
      "Which products consume management time but yield low margins and growth?",
      "Can they be refactored, merged, or retired?",
      "Is there a strategic value to keeping them in the portfolio?"
    ],
    example: "Our legacy offline static PDF export utility tool (superseded by interactive HTML reports)."
  }
};

export const VALUE_CHAIN_GUIDANCE: Record<string, TooltipContent> = {
  firmInfrastructure: {
    definition: "Management, planning, finance, accounting, legal, and government affairs structures.",
    questions: [
      "How do your financial controls and legal advisors protect cash flow and IP?",
      "Does your corporate governance support long-term strategic scaling?",
      "Are administrative systems integrated and automated?"
    ],
    example: "Automated billing systems, legal retainers for trademark protection."
  },
  hrManagement: {
    definition: "Recruiting, training, compensation, performance appraisals, and labor commitments.",
    questions: [
      "How do you recruit and retain top engineering and sales talent?",
      "What is your commitment to fair work practices (e.g. Living Wage, flexible hours)?",
      "Do you provide regular training and workforce development?"
    ],
    example: "Offer competitive salaries, strict anti-zero-hour contract policy, flexible remote work."
  },
  technologyDevelopment: {
    definition: "R&D, product design, IT infrastructure, database management, and software optimization.",
    questions: [
      "How do you maintain technological advantages over cloud-based rivals?",
      "Are your systems secure and optimized for client-side processing?",
      "What percentage of revenue is reinvested in tech R&D?"
    ],
    example: "Optimizing WebAssembly/WebGPU pipelines to compress large AI models locally."
  },
  procurement: {
    definition: "Purchasing materials, hardware, server access, services, and software licenses.",
    questions: [
      "How do you negotiate credit terms and volume discounts with key vendors?",
      "How do you minimize the supply risks of core cloud services?",
      "Is there a structured supplier tendering and audit process?"
    ],
    example: "Bulk credit agreements with CDN providers to reduce bandwidth costs."
  },
  inboundLogistics: {
    definition: "Receiving, storing, and managing input materials, digital assets, or source databases.",
    questions: [
      "How do you import, verify, and catalog raw data inputs securely?",
      "What are the warehousing or data storage costs for development assets?",
      "How do you manage supply updates from upstream data partners?"
    ],
    example: "Secure developer staging environments for storing downloaded model weights."
  },
  operations: {
    definition: "Transforming inputs into the final product (e.g. writing code, compiling packages).",
    questions: [
      "What is your software release cycle and QA testing pipeline?",
      "How do you optimize production speed while maintaining strict bug limits?",
      "Are operational code compiles and deployments automated?"
    ],
    example: "Automated Github Actions compilation of client-side bundles and asset checks."
  },
  outboundLogistics: {
    definition: "Packaging, shipping, and distributing the final software or digital files to buyers.",
    questions: [
      "How are software bundles and model weights delivered to end users?",
      "How do you ensure low latency and high availability globally (e.g. CDNs)?",
      "Is user onboarding and activation frictionless?"
    ],
    example: "Caching compiled WASM engines on Cloudflare Edge nodes for global speed."
  },
  marketingSales: {
    definition: "Informing, persuading, and converting target leads into paying subscribers.",
    questions: [
      "What promotion methods (content, search, ads, PR) are most successful?",
      "How are sales conversions handled (automated Stripe billing, enterprise demos)?",
      "What is your customer acquisition cost (CAC)?"
    ],
    example: "SEO articles on offline AI security, freemium self-serve conversion funnel."
  },
  service: {
    definition: "Customer support, onboarding assistance, upgrades, and ongoing maintenance.",
    questions: [
      "How do users submit issues and what is your target response time (SLA)?",
      "How do you gather user feedback to inform product upgrades?",
      "Do you provide detailed self-service documentation and guides?"
    ],
    example: "E-mail ticket support (24h response), extensive interactive documentation database."
  }
};

export const CUSTOMER_JOURNEY_GUIDANCE: Record<string, TooltipContent> = {
  awareness: {
    definition: "First impressions and discovery. The customer realizes they have a problem and finds your brand.",
    questions: [
      "What trigger leads customers to search for a strategic mapping tool?",
      "Through which touchpoints (blog post, ad, referral) do they first find you?",
      "What emotions (frustrated with static plans, curious) do they feel?"
    ],
    example: "Search query: 'secure offline business canvases' leads to our organic blog post."
  },
  consideration: {
    definition: "Research and comparison. The customer evaluates your features and pricing against competitors.",
    questions: [
      "What key features (local AI, custom colors) do they compare?",
      "What barriers or worries (pricing, privacy) might hold them back?",
      "What touchpoints (pricing page, free trial) help persuade them?"
    ],
    example: "Evaluating the free SWOT tier; verifying if local Gemma inference works on their browser."
  },
  purchase: {
    definition: "Decision and conversion. The customer completes checkout and begins onboarding.",
    questions: [
      "Is the checkout process frictionless (e.g., Stripe, clear invoices)?",
      "What onboarding steps happen immediately after payment?",
      "Are customers excited or confused?"
    ],
    example: "Subscribing to Premium with single-click card checkout, receiving instant workspace access."
  },
  retention: {
    definition: "Onboarding and loyalty. The customer regularly uses the app and receives long-term value.",
    questions: [
      "What triggers keep the customer returning (monthly reports, team reviews)?",
      "How does the customer resolve problems (support chat, tutorials)?",
      "Are customers satisfied with product upgrades?"
    ],
    example: "Using the AI Consultant to audit canvases before quarterly investor reviews."
  },
  advocacy: {
    definition: "Referrals and word-of-mouth. The customer recommends your product to colleagues.",
    questions: [
      "What motivates the customer to share your app (referral links, pride in their plans)?",
      "How easy is it for them to export or invite team members?",
      "Do they write positive public reviews or tweets?"
    ],
    example: "Exporting high-quality PDF canvases to present to investors, mentioning Kettle Strat on LinkedIn."
  }
};

export const MARKET_SIZING_GUIDANCE: Record<string, TooltipContent> = {
  tamDescription: {
    definition: "Total Addressable Market: The absolute total global revenue opportunity if you achieve 100% market share.",
    questions: [
      "Who would buy if you had no competitors and infinite distribution?",
      "What is the total global size of this target demographic or industry?",
      "What is the average annual revenue value per customer?"
    ],
    example: "All global SaaS startups and consulting agencies. ~150,000 teams spending $300/yr = $45M TAM."
  },
  samDescription: {
    definition: "Serviceable Addressable Market: The segment of the TAM targeted by your product that you can realistically reach.",
    questions: [
      "Which portion of the TAM fits your specialized value propositions (e.g. offline security)?",
      "What geographical regions or channels can you actually service?",
      "Which segment of buyers has a budget that matches your pricing?"
    ],
    example: "Security-conscious B2B consultants and early-stage tech startups. ~30,000 teams = $9M SAM."
  },
  somDescription: {
    definition: "Serviceable Obtainable Market: The share of the SAM you can realistically capture in the short term (1-3 years).",
    questions: [
      "Which specific clients or niches will you focus on immediately?",
      "What is the capacity of your sales team/marketing budget?",
      "Which market shares can you realistically win from current rivals?"
    ],
    example: "First 1,500 active premium teams captured through startup hubs and direct sales = $450,000 SOM."
  }
};

export const BUSINESS_PLAN_GUIDANCE: Record<string, TooltipContent> = {
  executiveSummary: {
    definition: "A concise overview of your entire business plan, summarizing key goals, value propositions, and strategies.",
    questions: [
      "What core problem does your business solve, and for whom?",
      "What is your unique solution and competitive advantage?",
      "What are your key financial projections and funding requirements?"
    ],
    example: "Kettle Strat is seeking $150k in seed funding to expand its B2B strategy SaaS platform, aiming to reach $1.2M ARR in 18 months."
  },
  goals: {
    definition: "Clear strategic goals, milestones, or key metrics for success over the next 12-24 months.",
    questions: [
      "What are our primary business goals (revenue, user growth, features, launch)?",
      "What milestones must we reach in the next 6, 12, and 24 months?",
      "How will we measure success?"
    ],
    example: "Launch Beta in Month 3, acquire 500 active users by Month 6, and reach monthly profitability by Month 12."
  },
  mission: {
    definition: "A statement defining the organization's core purpose, what it does, and who it serves today.",
    questions: [
      "What is the primary purpose of our business?",
      "Who are our primary customers and what value do we deliver to them?",
      "What makes our day-to-day operations unique?"
    ],
    example: "Our mission is to democratize high-level business strategy consultancy using local on-device AI."
  },
  vision: {
    definition: "A statement outlining the aspirational long-term goals and direction of the business for the next 3-5 years.",
    questions: [
      "Where do we want our business to be in 3 to 5 years?",
      "What major milestone or industry impact do we aspire to achieve?",
      "How will the world look different if we succeed?"
    ],
    example: "To become the leading secure, on-device strategic operating system for startups globally."
  },
  values: {
    definition: "The core beliefs and guiding principles that direct the business's decisions, culture, and actions.",
    questions: [
      "What principles are non-negotiable for our team?",
      "How do we treat our customers, partners, and each other?",
      "What standards guide our product development and business conduct?"
    ],
    example: "1. Privacy First (on-device AI), 2. Actionable Insights, 3. Absolute Transparency."
  },
  fairWorkPractices: {
    definition: "Details of your modern, flexible, and diverse workforce requirements and fair employment practices.",
    questions: [
      "What is your stance on flexible, remote, or hybrid work arrangements?",
      "How do you ensure equal opportunity, fair pay, and diversity within your team?",
      "What measures do you have in place to support employee wellbeing and mental health?"
    ],
    example: "We support fully remote/flexible hybrid patterns and conduct annual pay equity audits to ensure equal compensation across all demographics."
  },
  sustainabilityPolicy: {
    definition: "Explicit details regarding carbon reduction, local sourcing, and circular economy practices.",
    questions: [
      "What strategies do you use to measure and reduce your carbon footprint?",
      "Do you prioritize local sourcing, fair trade, or ethical vendors in your supply chain?",
      "How does your business incorporate circular economy principles, recycling, or waste reduction?"
    ],
    example: "We minimize server energy consumption through green hosting partners and source all physical materials from certified local suppliers."
  },
  featuresBenefits: {
    definition: "A detailed breakdown mapping specific product or service features directly to customer benefits.",
    questions: [
      "What exact features or service capabilities do we offer?",
      "How does each feature translate to value or solve a problem for the customer?"
    ],
    example: "Feature: Offline Local AI Processing -> Benefit: Zero latency and absolute user data privacy."
  },
  marketTrends: {
    definition: "Analysis of major social, economic, or technological trends in your chosen industry and how you validated them.",
    questions: [
      "What trends are reshaping your target industry?",
      "What primary or secondary sources verify these trends (how you know this)?"
    ],
    example: "We observe a 14% YoY increase in remote work software spending, verified by the Q3 Gartner Software Report."
  },
  customerGroups: {
    definition: "Details of your target customer demographics and direct feedback about what they want.",
    questions: [
      "Who are the core customer groups buying your product?",
      "What customer research or interviews have you conducted to verify their demands?"
    ],
    example: "Customer Group: Freelance Marketers. Demand: Consolidated strategy reports. Verified by 45 user interviews."
  },
  competitors: {
    definition: "An evaluation matrix listing specific competitor strengths, weaknesses, and your competitive advantage.",
    questions: [
      "Who are your top 3 direct competitors?",
      "What are their key strengths and weaknesses?",
      "How will you improve on their offer or price to win market share?"
    ],
    example: "Competitor: StratCo. Strength: Large enterprise footprint. Weakness: Outdated UX. Our advantage: Frictionless modern interface."
  },
  competitorPricing: {
    definition: "Comparison grid matching your prices against competitor price points and justifying the difference.",
    questions: [
      "What are the unit prices of your main competitors?",
      "Why are your prices higher, lower, or equal (reasons for difference)?"
    ],
    example: "Our price: $29/mo. Competitor range: $49 - $99/mo. Difference reason: Cost efficiency from local on-device AI operations."
  }
};

export const MCKINSEY_7S_GUIDANCE: Record<string, TooltipContent> = {
  sharedValues: {
    definition: "The core values, beliefs, and norms of the organization that shape corporate culture and guide behavior.",
    questions: [
      "What are the central values upon which the organization was built?",
      "How strong is the company culture, and how are values demonstrated daily?",
      "Are values aligned across different teams and departments?"
    ],
    example: "Privacy First (offline-first execution), transparency, and absolute user empowerment."
  },
  strategy: {
    definition: "The plan devised by the organization to maintain and build competitive advantage over time.",
    questions: [
      "What is our strategy to achieve our long-term business objectives?",
      "How do we plan to compete and differentiate ourselves in the market?",
      "How does the strategy adapt to changes in the environment or competitor actions?"
    ],
    example: "Differentiating through secure local AI compute rather than costly cloud servers."
  },
  structure: {
    definition: "The organizational structure and hierarchy, including reporting lines and division of responsibilities.",
    questions: [
      "How is the organization structured (e.g. flat, functional, matrix)?",
      "How are decisions made, and where is the authority concentrated?",
      "How do different teams communicate and coordinate with one another?"
    ],
    example: "Flat team structure with three core nodes: Product/Engineering, Operations, and Growth."
  },
  systems: {
    definition: "The daily activities, procedures, and IT infrastructure that employees use to get work done.",
    questions: [
      "What are the primary systems or workflows that run the business (e.g. CRM, CI/CD)?",
      "How are these systems monitored and evaluated for efficiency?",
      "Are there bottlenecks in our operational or technical procedures?"
    ],
    example: "Automated GitHub Actions pipelines, Stripe for billing, and client-side database synchronization."
  },
  style: {
    definition: "The style of leadership adopted by management and the overall cultural style of the organization.",
    questions: [
      "What style of leadership is most prominent in the company (e.g. collaborative, top-down)?",
      "How effective is management in motivating employees and guiding direction?",
      "Do team members feel comfortable sharing feedback and voicing concerns?"
    ],
    example: "Collaborative, data-driven leadership style prioritizing rapid prototyping and developer autonomy."
  },
  staff: {
    definition: "The employees, their characteristics, and how they are recruited, trained, and motivated.",
    questions: [
      "What are the current staffing levels and do we have talent gaps?",
      "How are employees onboarded, trained, and supported in their roles?",
      "Are staffing requirements aligned with our current strategic goals?"
    ],
    example: "Small, high-efficiency team of 3 full-stack engineers and 1 product designer."
  },
  skills: {
    definition: "The actual capabilities, competencies, and specialized skills of the organization's workforce.",
    questions: [
      "What are the core competencies or specialized technical skills of our team?",
      "Are there skill gaps that could hinder execution?",
      "How do we keep our skills up to date with new technology (e.g. WebGPU/WASM)?"
    ],
    example: "Advanced skills in WebAssembly compilation, GPU browser acceleration, and modern React architectures."
  }
};

export const ELEVATOR_PITCH_GUIDANCE: Record<string, TooltipContent> = {
  targetCustomer: {
    definition: "The specific group or profile of ideal users/buyers who experience the core problem you solve.",
    questions: [
      "Who is the primary audience or target customer segment?",
      "Who will derive the most value from this product immediately?"
    ],
    example: "early-stage tech founders and strategic management consultants"
  },
  unmetNeed: {
    definition: "The specific, unresolved pain point, problem, or desire that your target customer faces.",
    questions: [
      "What is the biggest frustration or challenge the customer experiences?",
      "Why are existing solutions or workarounds failing them?"
    ],
    example: "need to build and present strategic plans quickly without cloud data privacy risks"
  },
  productName: {
    definition: "The formal name of your product, service, platform, or venture.",
    questions: [
      "What is the brand name of the product?",
      "Is it easy to pronounce, recall, and associate with the solution?"
    ],
    example: "Kettle Strat"
  },
  marketCategory: {
    definition: "The specific product category or industry sector that clearly identifies what your product is.",
    questions: [
      "What category of application or tool is this?",
      "How would a buyer describe this to a colleague (e.g. B2B SaaS, CRM, canvas tool)?"
    ],
    example: "on-device strategic planning workspace"
  },
  productBenefit: {
    definition: "The primary way your product solves the customer's problem and the main benefit it delivers.",
    questions: [
      "What is the primary action or benefit the product provides?",
      "How does it make the user's life easier or business more profitable?"
    ],
    example: "creates secure, local AI-powered canvases, roadmaps, and business plans instantly"
  },
  competitors: {
    definition: "The primary alternatives or rivals that your customers currently use to address this problem.",
    questions: [
      "Who are your direct competitors or dominant market alternatives?",
      "What static workarounds (e.g., standard spreadsheets, slides) are they using?"
    ],
    example: "classic cloud-based canvas templates and static PowerPoint strategy decks"
  },
  differentiator: {
    definition: "Your unique value proposition or technological advantage that sets you apart from all competitors.",
    questions: [
      "What is your unfair advantage or proprietary technology?",
      "Why will customers choose you over established alternatives?"
    ],
    example: "runs entirely in the browser using secure, offline local AI models so user IP never leaves the device"
  }
};

