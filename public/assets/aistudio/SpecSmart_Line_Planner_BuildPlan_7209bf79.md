# SpecSmart Line Planner – Build Plan

---

## 1. Problem Statement

Small and medium manufacturing factories across India rarely treat **machine health visibility** and **predictive maintenance** as *non‑negotiable* requirements when designing or procuring new production lines. Instead, procurement is driven by:

- Minimizing **upfront capex**  
- Hitting **commissioning dates**  
- Getting only basic **control and historical reporting**

As a result:

- Lines are delivered with **limited or no integrated condition monitoring**
- Data architecture is designed only for **basic SCADA/HMI**, not for reliable sensor data, alerts, or analytics
- Predictive maintenance is left as a **“future upgrade”** rather than a built‑in design requirement
- Factory owners struggle to **justify extra spend** for sensors, data infrastructure, and better HMIs because benefits are not quantified
- Vendors are rarely given **clear, standardized, machine-health-focused specifications**, leading to inconsistent implementations and weak accountability

There is no simple, affordable, and practical tool that:

1. Helps factory leadership **quantify ROI and risk** of machine health visibility  
2. Translates these requirements into a **clear, vendor-ready specification**  
3. Embeds **data standards, alert logic, and predictive maintenance guidelines** into the line design from day one

---

## 2. Solution Overview

**SpecSmart Line Planner** is a web-based planning and specification tool that enables factory owners, plant heads, and production managers to:

- Assess their factory’s **current production and downtime risk profile**
- Configure **machine health monitoring requirements** using guided checklists
- Quantify the **ROI and risk reduction** from better machine health visibility
- Receive **AI-powered recommendations** for sensors, monitoring technologies, and architecture
- Automatically generate a **vendor-ready specification document** that makes machine health visibility a **non-negotiable** in line design and procurement

The application emphasizes:

- **Affordability** – lightweight web app with simple UX; no complex integration needed for initial use
- **Practicality** – defaults tuned for typical Indian SME manufacturing setups (e.g., packaging lines, CNC shops, process lines)
- **Scalability** – cloud-based with templates and presets for different industries and line types
- **Ease of use** – wizard-style workflows, pre-filled templates, and visual data flow diagrams

---

## 3. Target Users & Needs

### Primary Users

1. **Factory Owners / Promoters (SMEs)**
   - Need: High-level view of **financial impact** of downtime and maintenance decisions.
   - Pain: Hard to justify additional capex for sensors/data; limited time for technical deep-dive.
   - What they want: Simple **ROI/payback** view and a **clean specification** they can share with vendors and investors.

2. **Plant Heads / Operations Managers**
   - Need: Reliable output, fewer surprises, easier vendor negotiations.
   - Pain: Frequent unplanned downtime; lack of actionable machine health data; reactive firefighting.
   - What they want: Clear **machine monitoring requirements**, **alert and escalation rules**, and **data standards** embedded upfront.

3. **Production / Maintenance Managers & Engineers**
   - Need: Concrete checklists and configuration guidance.
   - Pain: Vague specifications, ambiguous vendor deliverables, and no alignment between maintenance needs and procurement specs.
   - What they want: Detailed **machine health visibility checklists**, data point lists, and **predictive maintenance guidelines**.

### Secondary Users

4. **System Integrators / OEM Vendors**
   - Need: Clear, consistent, realistic specifications.
   - Pain: Ambiguous requirements, scope creep, disputes over “what was included.”
   - What they want: A **vendor-ready spec** that clarifies expectations, interfaces, sensors, and alerts.

---

## 4. Key Features

You must include and reference all of the following throughout the build:

1. **Interactive ROI and Risk Calculator**  
2. **Customizable Specification Templates**  
3. **Checklist for Machine Health Visibility**  
4. **Vendor-Ready Specification Export**  
5. **Data Architecture Visualization Tool**  
6. **Alert and Monitoring Standards Guide**  
7. **AI-Powered Smart Procurement Advisor**

Below is how each feature will work in v1.

---

### 4.1 Interactive ROI and Risk Calculator

- Inputs:
  - Line type (e.g., packaging, machining, process)
  - Number of critical machines / stations
  - Average daily production volume and value (₹/day)
  - Current unplanned downtime (hours/month)
  - Cost of downtime (₹/hour) – prefill with industry default + editable
  - Current maintenance style (Run-to-failure / Time-based / Condition-based)
  - Planned sensor/monitoring investment (₹ and high-level choices from checklist)
- Outputs:
  - Estimated reduction in unplanned downtime (% and hours/month) based on selected monitoring options
  - **ROI metrics**:
    - Annual savings (₹)
    - Payback period (months)
    - 3-year NPV-like view (simplified)
  - **Delivery reliability impact**:
    - Improvement in On-Time Delivery (OTD) %
    - Risk band (High/Medium/Low) for missed customer commitments
  - Simple visualizations:
    - Before vs After downtime and cost bars
    - Payback timeline graph

These values will then feed into the **Customizable Specification Templates** and **Vendor-Ready Specification Export** to justify the non-negotiable requirements.

---

### 4.2 Customizable Specification Templates

- Pre-built templates for:
  - New fully automated line
  - Semi-automated/retrofit line
  - Process industry line (continuous or batch)
- Sections include:
  - Project overview (line purpose, capacity, quality KPIs)
  - **Machine Health Monitoring Requirements** (based on the checklist)
  - **Real-time Alert Specifications** (e.g., thresholds, latency, escalation)
  - **Sensor Data Standards** (sampling rates, formats, interfaces)
  - **Data Architecture Requirements** (edge devices, OPC-UA/MQTT, databases)
  - **Predictive Maintenance Guidelines** (data retention, models, metrics)
  - Vendor responsibilities (commissioning tests, documentation, training)
- Each section is:
  - Auto-populated using:
    - User’s answers from the **Factory Assessment** and **Checklist**
    - Calculations from the **ROI and Risk Calculator**
    - Suggestions from the **AI-Powered Smart Procurement Advisor**
  - Editable in a rich-text editor (with guidance prompts and defaults)

---

### 4.3 Checklist for Machine Health Visibility

- Structured wizard-like checklist to ensure **no critical aspect is missed**:
  1. **Line & Machine Inventory**
     - Machines, stations, utilities (e.g., compressors, chillers)
     - Criticality rating (High/Medium/Low)
  2. **Parameters to Monitor**
     - Mechanical (vibration, temperature, current, speed, pressure)
     - Operational (cycle time, stoppages, quality rejects, micro-stops)
  3. **Sensor & Connectivity Choices**
     - New vs existing sensors
     - Connectivity (wired, wireless, protocol selection)
  4. **Alert Requirements**
     - Which parameters generate alerts, thresholds (simple guided rules)
     - Who should be notified, via which channels (SMS/email/WhatsApp in later version)
  5. **Data & Integration**
     - Where data should land (local server, cloud, both)
     - Required integrations (ERP / MES / existing SCADA)
  6. **Predictive Maintenance**
     - Candidate machines for predictive analytics
     - Historical data needed (duration, frequency)
- The checklist will:
  - Drive inputs to the **ROI Calculator**
  - Populate the **Specification Templates**
  - Trigger recommendations in the **AI-Powered Smart Procurement Advisor**

---

### 4.4 Vendor-Ready Specification Export

- One-click generation of:
  - **PDF** (primary)
  - (Optional later) **DOCX** or text export
- Content assembled from:
  - Customizable Specification Template
  - Checklist selections
  - ROI and risk summary
  - Data Architecture Visualization (exported image/embed)
- Formatting:
  - Cover page with project name, factory name, date, and contact details
  - Table of contents
  - Clearly labeled sections with numbering
  - Annexures:
    - Machine list and criticality
    - Data point list (tag list) and sample architecture diagram
    - Alert logic and escalation matrix
- Design goals:
  - Looks **professional** and easy for vendors to read and respond to
  - Uses common, simple language suited for Indian SME vendors
- Export options:
  - Download
  - Email to self
  - Share link (backend stores spec as “project” with unique URL)

---

### 4.5 Data Architecture Visualization Tool

- Simple browser-based diagram builder focused on **data flow**:
  - Drag-and-drop elements:
    - Machines / PLCs
    - Sensors / IO modules
    - Edge gateway / IPC
    - SCADA/HMI
    - Historian / Database
    - Cloud analytics platform
  - Connect with directional arrows indicating:
    - Protocols (e.g., Modbus, OPC-UA, MQTT)
    - Data types (events, time-series)
- Auto-suggestions:
  - Based on checklist + AI advisor, pre-generate a **default architecture**
    - Example: Sensors → IO-Link master → PLC → Edge gateway → Cloud
  - Users can edit connections, add/remove blocks
- Display:
  - Simple icons and minimum configuration to be hackathon-feasible
- Integration:
  - Snapshot of the diagram embedded into the **Vendor-Ready Specification Export**
  - Architecture choices feed back into:
    - **Sensor Data Standards** section
    - **Alert and Monitoring Standards Guide** suggestions

---

### 4.6 Alert and Monitoring Standards Guide

- An educational, context-aware guide that shows:
  - Recommended **alert types**:
    - Info / Warning / Critical
  - Basic standard patterns for:
    - Threshold alerts (high/low)
    - Rate of change alerts
    - Combined conditions (e.g., vibration + temperature)
  - **Response and escalation** best practices:
    - Who responds to what severity
    - Typical response time targets
  - Suggested **sampling frequencies**, retention periods, and KPI definitions:
    - MTBF, MTTR, OEE, etc.
- Interaction model:
  - Shows guidance inline while user fills:
    - The **Checklist for Machine Health Visibility**
    - The **Customizable Specification Templates**
  - Region / segment presets (e.g., “general Indian SME discrete manufacturing”)
- Outputs:
  - Pre-filled text for specification sections:
    - “Alerting & Monitoring Standards”
    - “Maintenance KPIs & Reports”
  - Terminology and examples that can be pasted into the vendor spec

---

### 4.7 AI-Powered Smart Procurement Advisor

- Core logic:
  - Analyze:
    - Factory profile (industry, size, line type)
    - Checklist answers (machines, risks, current issues)
    - Budget range and ROI targets
  - Recommend:
    - Sensor categories (vibration, power, temp, flow, etc.) and where to use them
    - Suitable data acquisition options (add-on modules vs new gateways)
    - Minimal viable vs ideal architecture
    - Gaps and risks in the drafted specification:
      - “You did not specify data backup requirements for your historian.”
      - “For critical compressors, predictive vibration analysis is advised; consider adding XYZ.”
- UX:
  - Appears as:
    - Side panel “Smart Advisor” showing real-time suggestions
    - Summary recommendation screen at the end of the process
  - User can:
    - Accept a recommendation (auto-updates checklist/spec template)
    - Dismiss / mark as “Not Applicable”
- Implementation:
  - For hackathon: rule-based and template-driven, with option to later plug into an LLM
  - Use deterministic JSON schemas, then have the AI fill in textual recommendations

---

## 5. User Flow

### 5.1 Entry & Project Setup

1. User opens SpecSmart Line Planner (web app).
2. Landing page shows:
   - Brief description and benefits
   - CTA: **“Start a New Line Plan”** or **“Open Existing Project”**
3. On “Start New Line Plan”:
   - Simple sign-up / login (email + OTP or Google)
   - Create project:
     - Project name
     - Factory name
     - Line type (dropdown)
     - Estimated go-live date
4. Basic onboarding questions:
   - Role (Owner / Plant Head / Maintenance / Other)
   - Approx. factory size and sector

### 5.2 Factory Assessment & Checklist

5. User goes through a guided **Factory Assessment + Checklist for Machine Health Visibility**:
   - Step 1: Machines and criticality (table form)
   - Step 2: Current downtime profile and pain points
   - Step 3: Parameters to monitor and existing sensors
   - Step 4: Alert preferences (what, who, how urgent)
   - Step 5: Data integration preferences and constraints
6. As they fill the checklist:
   - **Alert and Monitoring Standards Guide** shows context tips
   - **AI-Powered Smart Procurement Advisor** highlights missing items or suggests additional sensors/requirements

### 5.3 ROI & Risk Calculation

7. After the checklist, user moves to the **Interactive ROI and Risk Calculator**:
   - Pre-filled with:
     - Downtime hours
     - Cost of downtime (with suggestions)
     - Planned monitoring scope (from checklist)
   - User can adjust:
     - Investment budget
     - Assumptions about downtime reduction
8. Click “Calculate”:
   - Shows:
     - Annual savings, payback period
     - Reliability metrics (OTD improvement, risk band)
9. User can tweak assumptions and lock one preferred scenario:
   - “Conservative”, “Realistic”, or “Aggressive” case
   - Selected scenario is tagged as “Final” and pushed to the spec templates

### 5.4 Data Architecture Visualization

10. System opens **Data Architecture Visualization Tool** with a default diagram:
    - Based on line type, checklist answers, and AI recommendations
11. User can:
    - Add/remove blocks (sensors, gateways, DB, cloud)
    - Change connections / protocols from dropdowns
12. User saves architecture:
    - Snapshot stored as an image/diagram data
    - Key selections (e.g., OPC-UA between PLC and gateway) saved into project

### 5.5 Specification Drafting

13. User proceeds to **Customizable Specification Templates**:
    - A template is chosen automatically based on line type (user can override)
14. Key sections are:
    - Auto-filled with:
      - Project details
      - Checklist-driven requirements
      - ROI summary (embedded as a paragraph + table/graph reference)
      - Architecture description
      - Alert standards from the guide
15. User reviews each section with inline guidance:
    - Can manually edit text
    - AI Advisor suggests improvements or warns about gaps (e.g., “No data retention period specified for historical data”)

### 5.6 Review & Export

16. Final review screen:
    - Checklist completeness meter
    - Summary of ROI and risks
    - High-level architecture preview
    - AI Advisor “Risk radar” summary (e.g., 3 gaps detected)
17. User clicks **“Generate Vendor-Ready Spec”**:
    - **Vendor-Ready Specification Export** compiles:
      - Cover + TOC
      - Main spec sections
      - ROI summary
      - Architecture diagram
      - Annexes (checklists, tag list, alert rules)
18. User downloads spec as PDF or sends via email/shareable link.

19. Project is stored and can be:
    - Duplicated for another line
    - Updated later (v2 spec)

---

## 6. Technical Approach

### 6.1 Overall Architecture

- **Type**: Cloud-hosted web application (SPA frontend + REST/GraphQL backend)
- **Target**: Quick loading, mobile-friendly (for phones and tablets), but optimized for desktop usage in offices

### 6.2 Frontend

- **Framework**: React (or Next.js for SSR) for faster development and routing
- **UI Library**:  
  - Material UI / Chakra UI / Ant Design (for consistent forms, tables, modals)
- **Key Components**:
  - Multi-step form/wizard for:
    - Factory Assessment
    - Checklist
    - ROI Calculator
  - Diagram/Canvas for **Data Architecture Visualization Tool**:
    - Libraries like React Flow or Drawflow for a node-based editor
  - Rich-text editor for **Customizable Specification Templates**:
    - Draft.js, TipTap, or Quill
  - Charts for ROI:
    - Recharts or Chart.js
- **State Management**:
  - React Query or Redux Toolkit for project data
- **PDF Preview**:
  - Use a “Preview spec” page with styled HTML that mirrors the PDF content

### 6.3 Backend

- **Language/Framework**:
  - Node.js (Express/Fastify/NestJS) or Python (FastAPI) – Node pairs well with React and has rich PDF tooling
- **Data Storage**:
  - PostgreSQL or MySQL for:
    - User accounts
    - Projects
    - Checklist results
    - Template versions
  - Optionally Redis for session caching (if needed)
- **APIs**:
  - Authentication (simple email + OTP or social login via OAuth2)
  - CRUD for:
    - Projects
    - Templates
    - ROI calculation configurations and results
    - Saved architecture diagrams (JSON representation)
- **AI/Rules Engine**:
  - For hackathon v1: implement **rule-based logic** for AI Advisor using:
    - JSON-based rules mapping (industry, line type, downtime, budget → recommendations)
  - Optionally connect to an LLM API for natural language suggestions, with strict prompting:
    - Input: structured project summary
    - Output: paragraphs of recommendations and spec text snippets

### 6.4 PDF Generation (Vendor-Ready Specification Export)

- Approach:
  - Backend renders a React or HTML template server-side
  - Convert HTML to PDF using:
    - Puppeteer (Node) to render headless Chrome PDF
    - Or wkhtmltopdf/Playwright equivalent
- Inputs:
  - Project data (JSON)
  - Template content (HTML/Markdown)
  - Architecture diagram:
    - Export diagram canvas as SVG/PNG from frontend
    - Upload/store; backend embeds into PDF
- Output:
  - Download link stored in DB with expiry (optional)

### 6.5 Security & Multi-Tenancy

- Basic requirements:
  - JWT-based auth tokens
  - Role = User only (admin account for managing templates)
  - Authorization checks so users see only their own projects
- Multi-tenancy is simple: tenant = `factory_id` or `user_id`

### 6.6 Performance & Offline

- Target is form-based; minimal heavy computation:
  - ROI calculator is arithmetic
  - Rule-based AI Advisor is light
- Store draft inputs locally (localStorage) to avoid losing data if network glitches

### 6.7 Localization & India Focus

- Language: English in v1, with simple phrasing
- Units & currency:
  - Default to INR (₹) and metric units
- Defaults & presets tailored to:
  - SME-sized plants (not giant multi-national plants)
  - Common sectors: auto-ancillaries, food & bev, packaging, general machining

---

## 7. Success Metrics

To validate that SpecSmart Line Planner is effective and valuable:

### 7.1 Adoption & Engagement

- **# of projects created per factory/user**
- **% of users who complete**:
  - Checklist → ROI Calculator → Spec Export flow
- Average time to create first vendor-ready spec (goal: < 45–60 minutes on first use, < 20 minutes on repeat)

### 7.2 Feature Utilization

- Interactive ROI and Risk Calculator:
  - % of projects that run a calculation
  - # of different ROI scenarios tested per project
- Customizable Specification Templates:
  - Time spent editing vs using defaults
  - Sections most frequently modified
- Checklist for Machine Health Visibility:
  - Completion rate of all checklist steps
  - Most-selected monitoring parameters
- Data Architecture Visualization Tool:
  - % of projects with at least one saved diagram
  - Average number of nodes/edges per diagram
- Alert and Monitoring Standards Guide:
  - View/click rate of help tooltips and guidance items
- AI-Powered Smart Procurement Advisor:
  - # of suggestions generated vs accepted vs ignored
  - Top categories of flagged gaps or risks

### 7.3 Business & Outcome Metrics (Post-Use Feedback)

Collected via in-app surveys and follow-ups:

- % of users who say:
  - “This helped me clearly justify machine health investments” (target > 70%)
  - “I made machine health visibility a non-negotiable line item in my vendor tender/spec” (target > 60% of active users)
- # of vendor-ready specs actually shared with vendors (self-reported)
- Reported impact:
  - Expected downtime reduction (user estimate)
  - Expected payback period compared to previous approach

### 7.4 Quality & Satisfaction

- Net Promoter Score (NPS)
- Average rating for:
  - Ease of use
  - Clarity of generated specification
  - Usefulness of AI Advisor and standards guide

---

This build plan provides enough structure for an AI prototyping tool (e.g., Lovable/Bolt) to scaffold:

- Data models for projects, checklists, templates, ROI scenarios
- Frontend wizard flows for checklist and ROI
- Rule-based “AI Advisor” with upgrade path to LLM
- PDF spec generation pipeline
- Node-based data architecture diagram editor