# Business Plan Generation Mapping & Gap Analysis

This document outlines how Strategy Labs can generate a comprehensive Business Plan based on the `business_plan_template.docx` structure by aggregating data from existing canvases, alongside an analysis of the feature gaps.

---

## 1. Canvas Data Sources Mapping

Here is how each section of the Word template maps to our existing strategic frameworks and databases:

| Word Document Section | Strategy Labs Canvas Data Source | Existing Field Mapping |
| :--- | :--- | :--- |
| **1. Executive Summary** | **Business Plan View** | `businessPlan.executiveSummary` |
| **2. Business Details** | **App User Metadata / Canvas Info** | `canvas.title`, `canvas.userId` |
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
| **16. Fair Work** | **Value Chain** | `valueChain.hrManagement` |
| **17. Sustainability** | **PESTEL / Value Chain** | `pestel.environmental` / `valueChain.operations` |
| **18. Finance** | **Financial Projections** | `financials.years` (Revenue, COGS, OpEx) |

---

## 2. Gaps & Missing Information Checklist

To generate a complete, production-ready Business Plan matching the document template, the following gaps in the current database schema (`types.ts`) and frontend UI must be addressed:

### Gaps in 2. Business Details & Personnel
- [ ] **Address & Contact Info**: No fields exist for physical address or telephone number.
- [ ] **Legal Status & Registration**: Need fields for legal structure (e.g. LLC, Corp, Sole Proprietor), date established, and Business Registration Number.
- [ ] **Advisers**: Need a list of legal/financial advisers.
- [ ] **VAT Status & Web Presence**: Gaps for VAT registration indicator and online URLs.
- [ ] **Personnel / Owner Backgrounds**: The template demands a structured table of Key Personnel:
  - Owner names, positions, industry experience, previous employment, key skills, qualifications, and most recent salary.

### Gaps in Product, Market & Competitor Tables
- [ ] **Features & Benefits**: Lean Canvas captures a simple "Solution" string, but the plan requires a structured table mapping Features directly to customer Benefits.
- [ ] **Customer Groups Research**: Gaps for customer feedback details ("What your customers want" and "How you know this").
- [ ] **Competitor Table**: We lack a structured table matching specific competitors to their Strengths, Weaknesses, price ranges, and comparative price points.

### Gaps in Operations, Procurement & Staff Costs
- [ ] **Staff Details**: The plan requires an operational staff list detailing: Role, Total Cost, Experience, and specialist skills/qualifications.
- [ ] **Premises Details**: Gaps for startup premises costs vs. future requirements.
- [ ] **Suppliers Credit Terms**: BMC key partners does not capture supplier specific products or payment credit terms (number of days credit).
- [ ] **Equipment Table**: Operational resource details (timing, funding source, cost per unit).

### Gaps in Strategic Policy
- [ ] **Fair Work Practices**: Detailed practices regarding modern, flexible, and diverse workforce requirements.
- [ ] **Sustainability Policy**: Explicit details of carbon reduction, local sourcing, or circular economy practices.

### Gaps in Financial Projections
- [ ] **Pre-trading Start-up Costs**: Detailed categories (IT/computers, stock, tools, professional fees, insurance, rent deposit, licenses, wages/recruitment).
- [ ] **Personal Survival Budget**: Detailed calculator representing personal mortgage/rent, utilities, food, taxes, and other monthly personal expenditure vs. personal income sources.
- [ ] **P&L Cost Breakdown**: Current projections focus on high-level Revenue, COGS, and OpEx. The business plan requires splitting out salaries, rent, banking charges, insurances, stock, depreciation, and a calculated breakeven forecast.
- [ ] **Sourcing Finance Table**: Tracking total borrowing requirements, start-up contributions, and assets available as security.
