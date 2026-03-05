# Sankalp 🙏

**Personalized Devotional Song (Bhajan) App for Indian users.**
Generate custom AI-powered bhajans dedicated to your loved ones, for any occasion and deity.

---

## Overview

Sankalp allows users to create heartfelt, personalized bhajans using AI. Simply enter the recipient's name, choose a deity, pick an occasion, and receive a beautifully composed devotional song tailored to your sankalp (intention).

---

## Features

- **AI-Powered Bhajan Generation** — Uses OpenAI to compose personalized devotional lyrics.
- **Multiple Deities Supported** — Ganesh Ji, Hanuman Ji, Krishna Ji, Shiv Ji, and Durga Maa.
- **Occasion-Based Personalization** — Daily Blessing, Recovery, Exam Success, New Job, Festival Greeting, Gratitude, Wedding Blessing, New Home.
- **Relation Targeting** — Dedicate bhajans to yourself, mother, father, spouse, child, sibling, friend, or elders.
- **Language Options** — Hindi (Classical) and Hindi (Bhojpuri style).
- **Recipient Pronunciation Guide** — Optional field to ensure the name is pronounced correctly in the bhajan.
- **Async Lyrics Generation** — Songs are created instantly and lyrics are generated in the background.
- **Song History** — Browse recently generated bhajans.
- **Persistent Storage** — PostgreSQL database via Drizzle ORM.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, Radix UI, Framer Motion |
| Backend | Node.js, Express 5 |
| Database | PostgreSQL, Drizzle ORM |
| AI | OpenAI API |
| Form Handling | React Hook Form, Zod |
| State Management | TanStack React Query |
| Routing | Wouter |

---

## Project Structure

```
sankalp/
├── client/               # React frontend
│   ├── public/           # Static assets (deity images, etc.)
│   └── src/              # React components and pages
├── server/               # Express backend
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API route definitions
│   ├── lyrics.ts         # AI lyrics generation logic
│   ├── storage.ts        # Database access layer
│   ├── db.ts             # Drizzle DB connection
│   └── seed.ts           # Database seeding
├── shared/               # Shared types and schema
│   └── schema.ts         # Drizzle schema, Zod validation, constants
├── script/               # Build scripts
└── package.json
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/songs` | Create a new bhajan request |
| `GET` | `/api/songs/:id` | Fetch a specific song by ID |
| `GET` | `/api/songs` | Fetch 20 most recent songs |

---

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database
- OpenAI API key

### Installation

```bash
# Clone the repository
git clone https://github.com/anil-gorti/sankalp.git
cd sankalp

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your DATABASE_URL and OPENAI_API_KEY to .env

# Push database schema
npm run db:push

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
npm run start
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `OPENAI_API_KEY` | OpenAI API key for lyrics generation |
| `NODE_ENV` | `development` or `production` |

---

## License

MIT
