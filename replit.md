# Sankalp - Personalized Devotional Song App

## Overview
Sankalp is a mobile-first web app that generates personalized bhajans (devotional songs) for Indian users. Users select a recipient, occasion, deity, and write their prayer (sankalp), and the app generates custom bhajan lyrics using AI.

## Tech Stack
- **Frontend**: React + TypeScript, Tailwind CSS, Wouter routing, TanStack Query, Framer Motion
- **Backend**: Express.js, Drizzle ORM, PostgreSQL
- **AI**: OpenAI (via Replit AI Integrations) for lyrics generation using gpt-5-mini

## Project Structure
```
client/src/
  pages/
    home.tsx       - Landing page with hero, features, testimonials
    create.tsx     - Multi-step wizard (5 steps: recipient, occasion, deity, sankalp, review)
    song.tsx       - Song display page with lyrics, sharing options
  App.tsx          - Router setup

server/
  index.ts         - Express server entry
  routes.ts        - API routes (/api/songs)
  storage.ts       - Database operations (DatabaseStorage)
  db.ts            - Drizzle DB connection
  lyrics.ts        - AI lyrics generation using OpenAI
  seed.ts          - Seed data for example songs

shared/
  schema.ts        - Drizzle schema, Zod validation, constants (RELATIONS, OCCASIONS, DEITIES, LANGUAGES)
```

## Key API Endpoints
- `POST /api/songs` - Create a new song (triggers async lyrics generation)
- `GET /api/songs/:id` - Get a song by ID
- `GET /api/songs` - List recent songs

## User Flow
1. Home page → "आशीर्वाद बनाएं" button
2. Step 1: Select relation + enter recipient name
3. Step 2: Select occasion
4. Step 3: Select deity + language style
5. Step 4: Write prayer (sankalp)
6. Step 5: Review and confirm
7. Song generation (polling for completion)
8. Song display with lyrics + WhatsApp sharing

## Design
- Hindi-first UI with Poppins font
- Warm orange/saffron primary color (hue 27)
- Mobile-first responsive design
- Deity images generated and stored in client/public/images/

## Database
- PostgreSQL with Drizzle ORM
- Single `songs` table with all song data
- Seeds 3 example songs on first startup

## Recent Changes
- 2026-02-14: Initial MVP build with full wizard flow, AI lyrics generation, seed data
