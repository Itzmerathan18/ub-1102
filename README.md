# 🌿 Jeevaloom — Tradition Meets Science

An integrative health platform combining **Ayurveda** and **Modern Medicine** with multilingual support (English, Hindi, Kannada).

## Features

| Feature | Description |
|---------|-------------|
| 🌿 **Ayurveda Assessment** | 15-question Dosha quiz (Vata / Pitta / Kapha) with personalized diet, lifestyle & seasonal advice |
| 🏥 **Health Assessment** | BMI calculator + lifestyle risk scoring with wellness suggestions |
| 📋 **History** | Track all past assessments with a 3-tab view |
| 📄 **Prescriptions** | Upload & manage prescriptions (Ayurveda or English type) |
| 🌐 **Multilingual** | Switch between English, Hindi (हिंदी), and Kannada (ಕನ್ನಡ) |
| 🔐 **Auth** | Email + password registration/login with JWT |

## Tech Stack

- **Frontend:** Next.js 16, React, TypeScript, CSS (Glassmorphism design)
- **Backend:** Node.js, Express, Prisma ORM, SQLite
- **Auth:** bcryptjs + JWT

## Quick Start

### 1. Clone & install

```bash
git clone https://github.com/Itzmerathan18/UTHKARSHA.git
cd UTHKARSHA

# Backend
cd backend
npm install
cp .env.example .env
npx prisma db push
npx prisma generate

# Frontend
cd ../frontend
npm install
cp .env.example .env.local
```

### 2. Run

```bash
# Terminal 1 — Backend (http://localhost:4000)
cd backend && npm run dev

# Terminal 2 — Frontend (http://localhost:3000)
cd frontend && npm run dev
```

### 3. Use

1. Open `http://localhost:3000` → Register a new account
2. Take the **Ayurveda** dosha assessment (15 questions)
3. Take the **Health** assessment (BMI + risk)
4. View results and save to **History**
5. Upload prescriptions in the **History** → Prescriptions tab
6. Switch language anytime from the header

## Project Structure

```
UTHKARSHA/
├── backend/
│   ├── prisma/schema.prisma     # Database schema
│   ├── src/
│   │   ├── index.js             # Express server
│   │   ├── routes/
│   │   │   ├── auth.js          # Register/Login/Language
│   │   │   ├── assessments.js   # Ayurveda & Health CRUD
│   │   │   └── prescriptions.js # File upload & management
│   │   ├── middleware/auth.js   # JWT verification
│   │   └── lib/auth.js          # JWT config
│   └── package.json
├── frontend/
│   ├── app/
│   │   ├── layout.tsx           # Root layout + metadata
│   │   ├── dashboard/           # Dashboard with action cards
│   │   ├── ayurveda/            # Landing → Assessment → Result
│   │   ├── english-medicine/    # Landing → Assessment → Result
│   │   ├── history/             # 3-tab history view
│   │   ├── login/ & register/   # Auth pages
│   │   └── profile/             # User profile
│   ├── components/
│   │   ├── Sidebar.tsx          # Navigation sidebar
│   │   ├── AppLayout.tsx        # Layout wrapper + lang switcher
│   │   └── JeevaloomLogo.tsx    # Brand logo
│   ├── lib/
│   │   ├── api.ts               # Axios API client
│   │   ├── auth-context.tsx     # Auth state management
│   │   ├── language-context.tsx # Language state
│   │   └── translations.ts     # EN/HI/KN strings
│   └── package.json
└── README.md
```

## Environment Variables

### Backend (`.env`)
| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `file:./dev.db` | SQLite database path |
| `JWT_SECRET` | — | Secret for JWT signing |
| `PORT` | `4000` | Server port |
| `FRONTEND_URL` | `http://localhost:3000` | CORS allowed origin |

### Frontend (`.env.local`)
| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000` | Backend API URL |

## License

MIT
