# GitLedgers — React-JS Component Suite & Mobile App

A complete, modular, hackathon-grade React-JS mobile suite and component library created at:
`C:\Users\nidhi\GitLedgers`

---

## ⚡ Quick Start (Commands to Run)

To run the project locally and see all rendered components and the interactive mobile simulator:

```bash
# 1. Navigate to the GitLedgers folder
cd C:\Users\nidhi\GitLedgers

# 2. Install dependencies (if not already installed)
npm install

# 3. Start the local Vite development server
npm run dev
```

The app will start at `http://localhost:3000`.

---

## 📦 Directory Structure

```
C:\Users\nidhi\GitLedgers\
├── package.json               # Dependencies (React 18 JS, Tailwind CSS, Lucide Icons)
├── vite.config.js             # Vite development server configuration
├── tailwind.config.js         # Tailwind config with palette tokens & dark mode
├── README.md                  # Documentation and component guide
└── src/
    ├── main.jsx               # Application entry point
    ├── App.jsx                # Mobile simulator + 32-component live gallery
    ├── index.css              # Tailwind base & utilities
    ├── theme/
    │   └── tokens.js          # Color variant map (sky, yellow, coral, steel, olive, emerald)
    └── components/
        ├── index.js           # Central barrel export (import { ... } from './components')
        ├── charts/
        │   └── Charts.jsx      # 7 Financial Visualizations & Charts
        ├── hero/
        │   └── Hero.jsx        # 4 Hero & Metric Bento Containers
        ├── agent/
        │   └── Agent.jsx       # 5 Agentic AI & Approval Components
        ├── tax/
        │   └── Tax.jsx         # 4 Explainable Tax & RAG Grounding Components
        ├── transactions/
        │   └── Transactions.jsx# 4 Platform & Transaction Feed Components
        ├── scanner/
        │   └── Scanner.jsx     # 3 Receipt Intelligence & OCR Components
        └── primitives/
            └── Primitives.jsx  # 5 Controls, Navigation & Notification Components
```
