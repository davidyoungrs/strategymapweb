# Business Plan Generation Mapping & Gap Analysis

This document outlines how Strategy Labs can generate a comprehensive Business Plan based on the `business_plan_template.docx` structure by aggregating data from existing canvases, alongside an analysis of the feature gaps.

---

## 1. Canvas Data Sources Mapping (Status: In Place vs. Gap)

Below is the status of each section in the Business Gateway Word document template relative to Strategy Labs.

| Word Document Section | Strategy Labs Canvas Data Source | Database Fields / Mapping | Status |
| :--- | :--- | :--- | :--- |
| **1. Executive Summary** | **Business Plan View** | `businessPlan.executiveSummary` | **[IN PLACE]** |
| **2. Business Details** | **Business Plan View (Details)** | `businessPlan.businessName`, `businessPlan.address`, `businessPlan.telephone`, `businessPlan.legalStatus`, `businessPlan.dateEstablished`, `businessPlan.registrationNumber`, `businessPlan.advisers`, `businessPlan.isVatRegistered`, `businessPlan.onlinePresence`, `businessPlan.keyPersonnel` | **[IN PLACE]** |
| **3. Business Overview** | **Business Plan / Lean Canvas** | `businessPlan.mission` / `leanCanvas.uniqueValueProposition` | **[IN PLACE]** |
| **4. Business Goals** | **Strategy Map / Balanced Scorecard** | `strategyMap.financial`, `strategyMap.customer`, etc. | **[IN PLACE]** |
| **Product / Service Description** | **Lean Canvas / BMC** | `leanCanvas.solution` / `bmc.valuePropositions` | **[GAP]** (Needs Feature/Benefit table) |
| **SWOT Analysis** | **SWOT View** | `swot.strengths`, `swot.weaknesses`, `swot.opportunities`, `swot.threats` | **[IN PLACE]** |
| **Legal Requirements** | **PESTEL View** | `pestel.legal` | **[IN PLACE]** |
| **5. Market Research & Trends** | **PESTEL View** | `pestel.social`, `pestel.technological`, `pestel.economic` | **[GAP]** (Needs "How you know this") |
| **6. Market Overview** | **Market Sizing / Lean Canvas** | `marketSizing.tam`, `marketSizing.sam`, `marketSizing.som`, `leanCanvas.lcCustomerSegments` | **[GAP]** (Needs Customer Research Details) |
| **7. Competitor Analysis** | **Porter's 5 Forces / BCG Matrix** | `porterForces.competitiveRivalry`, `bcgMatrix.questionMarks` | **[GAP]** (Needs Competitor Matrix table) |
| **8. Sales** | **Lean Canvas / BMC** | `leanCanvas.lcChannels` / `bmc.channels` | **[IN PLACE]** |
| **9. Marketing** | **Lean Canvas / BMC** | `leanCanvas.lcChannels` | **[IN PLACE]** |
| **10. Pricing** | **Lean Canvas / BMC** | `leanCanvas.lcRevenueStreams` / `bmc.revenueStreams` | **[GAP]** (Needs Competitor Pricing table) |
| **11. Staff** | **Value Chain** | `valueChain.hrManagement` | **[GAP]** (Needs Staff Costs table) |
| **12. Premises** | **Value Chain** | `valueChain.firmInfrastructure` | **[GAP]** (Needs Premises Costs) |
| **13. Suppliers** | **BMC / Value Chain** | `bmc.keyPartners` / `valueChain.procurement` | **[GAP]** (Needs Suppliers Credit terms) |
| **14. Equipment** | **Value Chain** | `valueChain.technologyDevelopment` / `valueChain.operations` | **[GAP]** (Needs Equipment table) |
| **15. Managing Operational Risks** | **Risk Register** | `riskRegister` | **[GAP]** (Needs Risk category alignment) |
| **16. Fair Work** | **Business Plan View (Policies)** | `businessPlan.fairWorkPractices` | **[IN PLACE]** |
| **17. Sustainability** | **Business Plan View (Policies)** | `businessPlan.sustainabilityPolicy` | **[IN PLACE]** |
| **18. Finance** | **Financial Projections View** | `financials.years` (detailed P&L and breakeven), `financials.startupCosts`, `financials.personalBudget`, `financials.sourcingFinance` | **[IN PLACE]** |
| **19. Cash Flow Forecast** | **N/A** | *No existing model* | **[GAP]** (Needs monthly Cash Flow sheet) |

---

## 2. Detailed Checklist of Remaining Gaps

Based on the actual structural details in `business_plan_template.docx`, here are the detailed outstanding gaps that need to be built into the database and user interfaces.

### Gaps in Product, Market & Competitor Tables
- [ ] **Features & Benefits Table**: The template demands a clear table mapping the business's product/service features to customer benefits.
- [ ] **Research Verification**: The template requires structured inputs explaining **how you know** the market trends and customer requirements (e.g. primary vs. secondary research evidence).
- [ ] **Competitor Evaluation Matrix**: Structured table comparing specific competitors detailing their Name, Strengths, and Weaknesses, alongside qualitative questions on competitive advantage.

### Gaps in Operations, Procurement & Staff Costs
- [ ] **Staff Costs List**: Structured table detailing Role, Total Cost, Experience, and Specialist Qualifications.
- [ ] **Premises Costs**: Separate inputs for initial start-up premises costs vs. future ongoing premises costs.
- [ ] **Suppliers Credit Terms**: Table tracking Supplier name, items purchased, and credit terms (number of credit days allowed).
- [ ] **Equipment Table**: Detailed checklist tracking Resource name, timing, funding method, and cost per unit.

### Gaps in Risk Management
- [ ] **Risk Categories Alignment**: Current Risk Register tracks arbitrary risks. The template requires categorizing risks into: **Staff**, **Suppliers**, **Financial**, and **Marketing** with dedicated mitigation solutions.

### Gaps in Financial Forecasts
- [ ] **Monthly Cash Flow Sheet**: A comprehensive 6-month spreadsheet model forecasting monthly Cash Income (Cash from Sales, Debtors, Loans) vs. Cash Outgoings (Wages, Premises, Broadband, printing, promotion, bank charges, professional fees, insurance, HP, lease, variable payments, VAT, owner wages, loan repayments, stock, consumables).

---

## 3. Suggested Updates & Next Steps

To prepare Strategy Labs for compiling a matching docx file, we suggest implementing the following modifications:

1. **Strategic Models & Forms Extensions**:
   - Create a sub-section under **Business Goals** in the app representing Products/Services, Features, and Benefits.
   - Expand the **Risk Register** schema to support a `category: 'Staff' | 'Suppliers' | 'Financial' | 'Marketing' | 'Other'` filter, matching the template structure.
   
2. **Operations & Operations cost views**:
   - Implement a new sub-tab in the sidebar or within the Business Plan section named **"Operations & Supply"** to consolidate the Staff list, Equipment table, Suppliers credit terms, and Premises details.

3. **Cash Flow Tab**:
   - Build a **Cash Flow Forecast** tab within the Financial Projections view containing a 6-month spreadsheet editor. This can dynamically initialize from P&L figures (e.g., distributing Year 1 revenues and opex across months) and let users customize the monthly distribution.
