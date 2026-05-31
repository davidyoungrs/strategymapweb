# Business Plan Generation Mapping & Gap Analysis

This document outlines how Strategy Labs can generate a comprehensive Business Plan based on the `business_plan_template.docx` structure by aggregating data from existing canvases, alongside an analysis of the feature gaps.

---

## 1. Canvas Data Sources Mapping

Here is how each section of the Word template maps to our existing strategic frameworks and databases:

| Word Document Section | Strategy Labs Canvas Data Source | Existing Field Mapping |
| :--- | :--- | :--- |
| **1. Executive Summary** | **Business Plan View** | `businessPlan.executiveSummary` |
| **2. Business Details** | **Business Plan View (Details)** | `businessPlan.businessName`, `businessPlan.address`, `businessPlan.telephone`, `businessPlan.legalStatus`, `businessPlan.dateEstablished`, `businessPlan.registrationNumber`, `businessPlan.advisers`, `businessPlan.isVatRegistered`, `businessPlan.onlinePresence`, `businessPlan.keyPersonnel` |
| **3. Business Overview** | **Business Plan / Lean Canvas** | `businessPlan.mission` / `leanCanvas.uniqueValueProposition` |
| **4. Business Goals** | **Strategy Map / Balanced Scorecard** | `strategyMap.financial`, `strategyMap.customer`, etc. |
| **Product / Service Description** | **Lean Canvas / BMC** | `leanCanvas.solution` / `bmc.valuePropositions` |
| **SWOT Analysis** | **SWOT View** | `swot.strengths`, `swot.weaknesses`, `swot.opportunities`, `swot.threats` |
| **Legal Requirements** | **PESTEL View** | `pestel.legal` |
| **5. Market Research & Trends** | **PESTEL View** | `pestel.social`, `pestel.technological`, `pestel.economic` |
| **6. Market Overview** | **Market Sizing / Lean Canvas** | `marketSizing.tam`, `marketSizing.sam`, `marketSizing.som`, `leanCanvas.lcCustomerSegments` |
| **7. Competitor Analysis** | **Porter's 5 Forces / BCG Matrix** | `porterForces.competitiveRivalry`, `bcgMatrix.questionMarks` |
| **8. Sales** | **Lean Canvas / BMC** | `leanCanvas.lcChannels` / `bmc.channels` |
| **9. Marketing** | **Lean Canvas / BMC** | `leanCanvas.lcChannels` |
| **10. Pricing** | **Lean Canvas / BMC** | `leanCanvas.lcRevenueStreams` / `bmc.revenueStreams` |
| **11. Staff** | **Value Chain** | `valueChain.hrManagement` |
| **12. Premises** | **Value Chain** | `valueChain.firmInfrastructure` |
| **13. Suppliers** | **BMC / Value Chain** | `bmc.keyPartners` / `valueChain.procurement` |
| **14. Equipment** | **Value Chain** | `valueChain.technologyDevelopment` / `valueChain.operations` |
| **15. Managing Operational Risks** | **Risk Register** | `riskRegister` |
| **16. Fair Work** | **Business Plan View (Policies)** | `businessPlan.fairWorkPractices` |
| **17. Sustainability** | **Business Plan View (Policies)** | `businessPlan.sustainabilityPolicy` |
| **18. Finance** | **Financial Projections View** | `financials.years` (detailed P&L and breakeven), `financials.startupCosts`, `financials.personalBudget`, `financials.sourcingFinance` |

---

## 2. Gaps & Missing Information Checklist

To generate a complete, production-ready Business Plan matching the document template, the following gaps in the database schema (`types.ts`) and frontend UI have been fully addressed:

### Gaps in Product, Market & Competitor Tables

- [x] **Features & Benefits**: Lean Canvas captures a simple "Solution" string, but the plan requires a structured table mapping Features directly to customer Benefits. (Completed: mapped to `businessPlan.featuresBenefits`)
- [x] **Customer Groups Research**: Gaps for customer feedback details ("What your customers want" and "How you know this"). (Completed: mapped to `businessPlan.marketTrends`, `businessPlan.customerResearch`, etc.)
- [x] **Competitor Table**: We lack a structured table matching specific competitors to their Strengths, Weaknesses, price ranges, and comparative price points. (Completed: mapped to `businessPlan.competitors` and `businessPlan.competitorPricing`)

### Gaps in Operations, Procurement & Staff Costs

- [x] **Staff Details**: The plan requires an operational staff list detailing: Role, Total Cost, Experience, and specialist skills/qualifications. (Completed: mapped to `businessPlan.staffMembers`)
- [x] **Premises Details**: Gaps for startup premises costs vs. future requirements. (Completed: mapped to `businessPlan.premisesStartupCosts` and `businessPlan.premisesFutureRequirements`)
- [x] **Suppliers Credit Terms**: BMC key partners does not capture supplier specific products or payment credit terms (number of days credit). (Completed: mapped to `businessPlan.suppliers`)
- [x] **Equipment Table**: Operational resource details (timing, funding source, cost per unit). (Completed: mapped to `businessPlan.equipment`)
