# AI-Powered Agent Skill Registry & Discovery Platform

An open ecosystem registry for discovering, evaluating, securing, customizing, and composing skills for autonomous AI agents. Built with a modular, layered architecture adhering to strict software engineering standards.

---

## 🌟 Key Features

- **Public Skill Catalog (`/catalog`)**: Searchable, paginated registry of verified agent skills with semantic versioning (`v1.0.0`), publisher metadata, and license tracking.
- **Automated Security Analysis (`/skills/[slug]`)**: Static analysis pipeline inspired by NVIDIA SkillSpector detecting destructive shell commands (`rm -rf /`), unverified pipes (`curl | bash`), credential harvesting, and prompt injection threats with transparent scores.
- **Intent-Based AI Discovery (`/discover`)**: Natural language retrieval engine grounded strictly in verified catalog records to eliminate hallucinations.
- **Skill Composition & Builder (`/compose`)**: Multi-skill bundle creator with provenance graph tracking, license attribution checking, and independent security scanning on merged outputs.
- **Standard `SKILL.md` Exporter**: 1-click browser export of formatted agent instructions with YAML frontmatter.
- **Community Ratings & Voting**: Atomic upserts preventing double-voting race conditions with database-level B-Tree uniqueness constraints.
- **Role-Based Access Control (RBAC)**: Stateless HS256 JWT authentication with bcrypt password hashing (12 adaptive salt rounds).

---

## 🏗️ Architecture & Technology Stack

### Backend
- **Runtime:** Node.js v22 (LTS)
- **Language:** TypeScript 5 (Strict mode)
- **Framework:** Express.js 4 with Helmet security headers, CORS, and request size guards
- **Database & ORM:** Prisma ORM with SQLite for zero-friction local development (PostgreSQL-ready for staging/production)
- **Security & Validation:** Zod runtime schema validation, bcryptjs, jsonwebtoken
- **Architecture Pattern:** Layered Clean Architecture (Routes → Controllers → Services → Adapters/Repositories)

### Frontend
- **Framework:** Next.js 15 (App Router with Server Components & Client Components)
- **UI Library:** React 19, Tailwind CSS 3
- **Design System:** Deep Obsidian minimal dark palette (`#09090b`), high-contrast typography, and Electric Indigo hero accents
- **Icons:** Lucide React

---

## 🚀 Quick Start Guide (Zero External API Keys Required!)

You can run and test the entire full-stack platform locally **without needing Docker, PostgreSQL, or any paid OpenAI/Gemini API keys**.

### 1. Prerequisites
- **Node.js**: v18.0.0 or newer (v22 recommended)
- **NPM**: v9.0.0 or newer

---

### 2. Backend Setup

Open a terminal in the root directory:

```cmd
cd backend

# 1. Install dependencies
npm install

# 2. Synchronize database schema (creates local dev.db)
npx prisma db push

# 3. Seed database with initial verified skills & test users
npx prisma db seed

# 4. Start the backend development server
npm run dev
```

The backend will start on **`http://localhost:5000`**.
- Health Check: `http://localhost:5000/api/v1/health`
- Catalog API: `http://localhost:5000/api/v1/skills`

---

### 3. Frontend Setup

Open a **second terminal** in the root directory:

```cmd
cd frontend

# 1. Install dependencies
npm install

# 2. Start Next.js development server
npm run dev
```

The frontend will start on **`http://localhost:3000`**.

---

## 🧪 Pre-Configured Test Accounts (From Database Seed)

When you run `npx prisma db seed`, the following accounts are automatically ready:

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Publisher** | `alex@nvidia.com` | `Password123!` | Publish skills, release versions, import repositories |
| **Developer** | `sarah@developer.io` | `Password123!` | Search, review, vote, save personal collections |
| **Admin** | `admin@registry.dev` | `Password123!` | Content moderation, audit inspection |

You can also create a brand new account anytime via the `/auth/register` page.

---

## 🔌 API Reference Summary (`/api/v1`)

### Authentication
- `POST /api/v1/auth/register` — Register Developer or Publisher account
- `POST /api/v1/auth/login` — Sign in and obtain Bearer JWT token
- `GET /api/v1/auth/me` — Retrieve profile & activity stats (Requires Bearer token)

### Skills & Catalog
- `GET /api/v1/skills` — Paginated catalog search (`?search=query&page=1&limit=10`)
- `GET /api/v1/skills/:slug` — Full skill detail with latest versions & audit reports
- `POST /api/v1/skills` — Register a new skill identity (Publisher only)
- `POST /api/v1/skills/:slug/versions` — Release an immutable version snapshot with SHA-256 fingerprint

### Security Audits
- `GET /api/v1/skills/:slug/versions/:version/security` — Retrieve full static audit report with severity breakdown and remediation advice

### AI Discovery
- `POST /api/v1/discovery` — Natural language project stack query grounded in real catalog records

### Skill Composition
- `POST /api/v1/composition/compose` — Merge 2+ source skills into a unified bundle with provenance tracking
- `POST /api/v1/composition/generate` — Generate custom agent instructions from a prompt

### Community & Collections
- `POST /api/v1/community/skills/:slug/reviews` — Submit 1-to-5 star review (Atomic upsert)
- `GET /api/v1/community/skills/:slug/reviews` — List reviews with calculated average rating
- `POST /api/v1/community/skills/:slug/vote` — Upvote (+1) or Downvote (-1)
- `POST /api/v1/community/collections` — Create personal user collection
- `GET /api/v1/community/collections/me` — List authenticated user's collections
- `POST /api/v1/community/collections/:id/skills` — Add skill to collection

---

## 🧪 Running Automated Tests

The repository includes end-to-end integration test suites for every domain:

```cmd
cd backend

# Run Authentication Tests
npx tsx src/test-auth.ts

# Run Skill Catalog & Versioning Tests
npx tsx src/test-skills.ts

# Run Security Scanner Tests
npx tsx src/test-security.ts

# Run AI Discovery Tests
npx tsx src/test-discovery.ts

# Run Skill Composition Tests
npx tsx src/test-composition.ts

# Run Community & Collections Tests
npx tsx src/test-community.ts
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

