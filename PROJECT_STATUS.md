# Strategy Labs: Project Status & Handoff

**Date Updated:** May 31, 2026
**Current Branch:** `main` (Stable State)

---

## 🟢 What We Accomplished Recently

### 1. Business Plan Suite Enhancements (Section 2 & Policies)
- **Business Details & Personnel Tab**: Added detailed fields for physical address, contact telephone, legal structure, date established, registration number, and legal/financial advisers, including a VAT registration toggle.
- **Key Personnel Management**: Built an interactive roster list system allowing owners to add, update inline, and remove key staff profiles (industry experience, previous employment, salary, skills, qualifications).
- **Strategic Policies Tab**: Introduced "Strategic Policies" view under the Business Plan category to capture **Fair Work Practices** and **Sustainability Policies**, fully pre-populated with high-quality boilerplate templates.

### 2. Detailed Financial Projections Suite
- **Interactive P&L Cost Splits**: Extended the 3-year P&L table to split out salaries, rent, banking charges, insurances, stock, depreciation, and other overheads. OpEx is dynamically summed, and a **Breakeven Forecast** is calculated live for each year based on gross profit margin ratios.
- **Pre-Trading Start-up Costs**: Interactive calculator tracking capital requirements (computers, stock, tools, fees, deposits, licenses) with a live totals summary card.
- **Personal Survival Budget**: An outgoings vs. income balance sheet calculator verifying net monthly surplus/deficit for founders.
- **Sourcing of Finance Table**: Structured log capturing total borrowing requirements, owner cash contributions, and assets available as security.

### 3. Robust Real-Time Speech-to-Text (STT) Engine
- **Interim Results (Real-Time Feedback)**: Re-architected the SpeechRecognition handler to enable `interimResults: true`, displaying live, word-by-word dictation feedback directly inside the active inputs.
- **Transition Queue (Race-Condition Fix)**: Implemented a state queue (`pendingTargetRef` and `startSpeech`) that sequences audio operations, fully resolving the `InvalidStateError` when users quickly swap fields or double-click mic buttons.

---

## 🟡 Status of Rolled Back/Pending Features

1. **User Engagement Analytics**: still to re-implement (`firstLoginAt`, `lastActiveAt`).
2. **Apple Web Redirect Auth**: Apple Sign-in registration requirements pending client credentials setup.

---

## 🔴 Immediate Next Steps (To-Do List)

### 1. Business Plan docx Generator
- Build a backend/frontend utility to compile the gathered business details, strategy maps, SWOT, risks, P&L, and policies directly into a downloadable `.docx` file matching the template structure.

### 2. Operations cost views (Staff, Suppliers, Equipment)
- Build out the outstanding operations tables mapping staff roles, supplier credit terms, and equipment unit check sheets as detailed in the gaps mapping.

### 3. Mobile Responsiveness Overhaul
- Implement a collapsible "Hamburger Menu" for mobile devices and refactor action buttons for smaller screens.
