# SmartFlow One — AI-Powered Financial Report Analysis Intelligence

SmartFlow One is a financial document intelligence SaaS platform that ingests financial reports, automatically scrubs personally identifiable information (PII) for PDPA Malaysia compliance, and produces AI-driven executive summaries, risk assessments, and CFO-level action recommendations using AI.

---

## Lab(s) Tackled

**Lab 1: Digital Transformation & Operations**

- AI-Powered Financial Report Analysis - Powered by Experian 


---

## The Problem

Financial professionals spend hours manually reviewing reports, extracting metrics, and identifying risks across multiple documents. Simultaneously, regulatory requirements (like Malaysia's PDPA) demand that personal data is protected before being processed by AI systems — creating a tension between speed and compliance.

Most existing tools either lack AI capabilities or ignore privacy requirements entirely, forcing finance teams to choose between efficiency and regulatory compliance.

---

## Proposed Solution

SmartFlow One provides a unified platform that:

1. **Ingests** financial documents (PDF, Excel, CSV).
2. **Scrubs** PII automatically before any AI processing (PDPA compliance by default).
3. **Extracts** key financial metrics using Google Gemini.
4. **Generates** executive summaries, risk assessments, and prioritized recommendations.
5. **Presents** everything in a clean, professional dashboard with voice narration support.

Privacy is not an afterthought — it's built into the processing pipeline from step one.

---

## How It Works

### Processing Pipeline

```
Upload Document → PII Detection & Masking → Semantic Chunking → FAISS Vector Indexing → AI Analysis → Dashboard
```

1. **Document Upload** — Users upload financial reports via drag-and-drop or file browser (PDF, XLSX, CSV).
2. **PII Scrubbing** — A regex-based engine detects and masks emails, phone numbers, NRICs, credit cards, IBANs, and IP addresses before any data leaves the client.
3. **Metric Extraction** — Google Gemini extracts Revenue, Operating Expenses, Net Profit, Assets, Liabilities, and Cash Flow; change percentages are computed deterministically in code.
4. **Risk Assessment** — AI generates a severity matrix (high/medium/low) with categorised risks, mitigation strategies, and page-level source references.
5. **Recommendations** — Prioritised CFO action items with cited justifications ("Why this recommendation?").
6. **Voice Summary** — Web Speech API condenses insights to ~75 words and narrates them aloud (~30 seconds).

### Architecture

```
src/
├── app/
│   ├── (app)/              # Authenticated route group (Sidebar + TopBar layout)
│   │   ├── dashboard/      # Command center with upload + stats + AI summary
│   │   ├── financial-insights/  # Metric cards + charts (Recharts)
│   │   ├── risk-analysis/  # Risk severity matrix + detail cards
│   │   ├── ai-recommendations/ # Prioritised action items
│   │   ├── privacy-center/ # PDPA compliance dashboard + data purge
│   │   └── settings/       # Workspace, privacy, and analysis toggles
│   ├── api/                # REST endpoints for analysis, privacy, settings
│   └── login/              # Email/password auth (Supabase)
├── components/             # Sidebar, TopBar, VoiceSummary
└── lib/                    # AI client, PII engine, audit logger, Supabase clients
```

- **Authentication** — Supabase Auth with edge middleware that refreshes sessions on every request and redirects unauthenticated users to `/login`.
- **AI Layer** — Google Gemini 2.5 Flash with automatic fallback to 1.5 Flash. Returns graceful defaults when no API key is configured.
- **Privacy Engine** — Ordered regex rules with overlap prevention, optional partial masking (preserve last 4 digits), and conditional audit trail logging.

---

## Technologies & Tools

| Layer | Technology |
|-------|-----------|
| Framework | Vite + React SPA |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| AI/LLM | Google Gemini (`@google/genai`) — gemini-2.5-flash + 1.5-flash fallback |
| Auth & Database | Supabase (Auth + PostgreSQL) |
| Charts | Recharts 3 |
| Icons | Lucide React |
| Voice | Web Speech API (browser-native) |
| Document Parsing | External microservice (Python/FastAPI) |
| Deployment | Vercel |

---

## Target Users & Beneficiaries

- **CFOs and Finance Directors** — Get AI-generated executive summaries and action recommendations from their financial reports in minutes instead of hours.
- **Financial Analysts** — Automated metric extraction and anomaly detection reduces manual data entry and catches irregularities faster.
- **Compliance Officers** — Built-in PDPA Malaysia compliance with PII masking, audit trails, and data retention controls.
- **Internal Audit Teams** — Full provenance tracking links every insight back to its source document and page number.

---

## What Makes This Solution Unique

1. **Privacy-First AI** — PII is detected and masked *before* any data reaches the AI model. Compliance isn't optional — it's the default pipeline behaviour.
2. **Provenance Tracking** — Every extracted metric, risk, and recommendation links back to its source document and page. Nothing is a black box.
3. **Voice Narration** — AI summaries are condensed and read aloud via the browser's Speech API — useful for executives who prefer audio briefings.
4. **Graceful Degradation** — Works without API keys (returns hardcoded demo data), without Supabase (skips auth), and without the parsing service (uses local pipeline files).
5. **PDPA Malaysia Compliance Built-In** — Specific support for Malaysian regulatory requirements including NRIC detection, data minimisation toggles, and one-click temporary data purge.
6. **Multi-Model Resilience** — Automatically falls back from Gemini 2.5 Flash to 1.5 Flash if the primary model fails, ensuring AI features remain available.

---

## Project Setup & Installation

### Prerequisites

- Node.js 18+ (Node 20+ recommended)
- npm or yarn
- A Supabase project (free tier works)
- Google Gemini API key (optional — app works in demo mode without it)

### 1. Clone the repository

```bash
git clone https://github.com/vaiyud/smartflow-one.git
cd smartflow-one
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GEMINI_API_KEY=your-gemini-api-key
PARSING_SERVICE_URL=http://localhost:8000
```

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | For API routes | Supabase service-role key (server-side only) |
| `GEMINI_API_KEY` | Optional | Google Gemini API key (demo mode if missing) |
| `PARSING_SERVICE_URL` | Optional | External document parsing service URL |

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for production

```bash
npm run build
npm start
```

---

## Running the Project

```bash
# Development (with hot reload)
npm run dev

# Production build
npm run build && npm start

# Lint
npm run lint
```

### Supabase Tables (if using full features)

The app expects these tables in your Supabase project:

- `documents` — Stores uploaded document metadata and raw text
- `extracted_metrics` — Financial metrics extracted by AI
- `risks` — Risk assessments generated by AI
- `executive_summaries` — AI-generated executive summaries
- `audit_trail` — PII operations and data access log
- `user_settings` — Per-user privacy and analysis preferences

---

## Technical Documentation

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/dashboard` | GET | Dashboard stats, summary metrics, and top risks |
| `/api/analysis/extract-metrics` | POST | Extract financial metrics from document text via Gemini |
| `/api/analysis/summary` | GET/POST | Retrieve or generate AI executive summaries |
| `/api/analysis/risks` | GET/POST | Retrieve risk matrix or generate risk assessment |
| `/api/analysis/recommendations` | POST | Generate prioritised action recommendations |
| `/api/documents/mask-pii` | POST | Mask PII in arbitrary text |
| `/api/documents/cleanup` | POST | Purge raw text for PDPA data retention |
| `/api/privacy` | GET | PDPA audit report (redaction counts, compliance status) |
| `/api/settings` | GET/PATCH | Read/update workspace and privacy settings |

### Key Libraries

- **`src/lib/ai.ts`** — Google Gemini wrapper with model fallback
- **`src/lib/pii.ts`** — PII detection engine (email, phone, SSN, credit card, IBAN, IP)
- **`src/lib/audit.ts`** — Conditional audit trail logger
- **`src/lib/supabase/`** — Browser, server, and middleware Supabase clients

---

## License

See [LICENSE](./LICENSE) for details.
