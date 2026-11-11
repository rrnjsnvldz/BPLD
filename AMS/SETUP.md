# AMS Development Setup Guide

**Quick start guide for developers joining the AMS project.**

---

## Prerequisites

- **Node.js:** 18.17 or later ([Download](https://nodejs.org/))
- **npm:** 9 or later (comes with Node.js)
- **Git:** Latest version
- **Code editor:** VS Code recommended ([Download](https://code.visualstudio.com/))

---

## Initial Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd AMS

# Install dependencies
npm install

# Copy environment template
cp .env.local.example .env.local
```

### 2. Configure Environment Variables

Edit `.env.local` and add your Supabase credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Get Supabase credentials:**
1. Go to [supabase.com](https://supabase.com)
2. Create project or use existing one
3. Go to Settings → API
4. Copy URL and keys

### 3. Database Setup

**Option A: Use Supabase Cloud (Recommended for Development)**

Your database is already set up! Just run migrations:

```bash
# Install Supabase CLI
npm install -g supabase

# Link to cloud project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

**Option B: Use Supabase Local**

```bash
# Install Docker Desktop first (https://www.docker.com/products/docker-desktop/)

# Start Supabase locally
supabase start

# Migrations run automatically
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
AMS/
├── docs/                    # Phase 0 documentation
│   ├── 01-MASTER-PLAN.md   # System blueprint
│   ├── 02-MASTER-CHECKLIST.md
│   ├── modules/            # Module checklists (K, A-J)
│   ├── design/             # Design system, wireframes
│   ├── adr/                # Architecture decisions
│   └── legal/              # Contract draft
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── (modules)/      # Module routes
│   │   │   ├── admin/      # Module K - Administration
│   │   │   ├── customers/  # Module A - Customers & Vehicles
│   │   │   └── ...         # Other modules (B-J)
│   │   └── (platform)/     # Auth routes (login, register)
│   ├── components/
│   │   ├── ui/             # shadcn/ui components
│   │   └── platform/       # Shared components
│   ├── lib/
│   │   ├── platform/       # Platform Kernel
│   │   │   ├── auth/       # Authentication utilities
│   │   │   ├── db/         # Supabase clients
│   │   │   └── types/      # Shared types
│   │   └── modules/        # Module business logic
│   │       └── [module-id]/
│   │           ├── domain/ # Business logic
│   │           ├── data/   # Database queries
│   │           ├── types/  # Module types
│   │           └── contracts.ts  # Public API
├── supabase/
│   └── migrations/         # Database migrations
├── public/                 # Static files
└── package.json            # Dependencies
```

---

## Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run lint:fix         # Fix lint errors

# Testing (to be added)
npm test                 # Run tests
npm run test:watch       # Run tests in watch mode
npm run test:e2e         # Run end-to-end tests

# Database
supabase migration new <name>    # Create new migration
supabase db push                 # Push migrations to cloud
supabase db pull                 # Pull schema from cloud
supabase db reset                # Reset local database

# Supabase Local
supabase start                   # Start local Supabase
supabase stop                    # Stop local Supabase
supabase status                  # Check status
```

---

## Development Workflow

### 1. Pick a Task

Check the current sprint plan in `docs/PHASE-1-PROGRESS.md`

### 2. Create a Branch

```bash
git checkout -b feature/module-k-user-list
```

Branch naming convention:
- `feature/` - New features
- `fix/` - Bug fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation updates

### 3. Make Changes

Follow the coding standards in `CONTRIBUTING.md`

**Module Boundary Rules (IMPORTANT):**
- A module can only import from its own folder and `lib/platform/`
- Cross-module communication goes through `contracts.ts` only
- Database tables are prefixed with module letter (e.g., `k_users`, `a_customers`)
- All tables use Row Level Security (RLS)

### 4. Test Your Changes

```bash
# Check types
npm run build

# Check linting
npm run lint

# Run tests (when available)
npm test

# Test in browser
npm run dev
```

### 5. Commit and Push

```bash
git add .
git commit -m "feat(module-k): add user list screen"
git push origin feature/module-k-user-list
```

Commit message format:
- `feat(scope): description` - New feature
- `fix(scope): description` - Bug fix
- `refactor(scope): description` - Code refactoring
- `docs(scope): description` - Documentation
- `test(scope): description` - Tests

### 6. Create Pull Request

1. Go to GitHub
2. Click "New Pull Request"
3. Fill in the template (auto-generated)
4. Request review from team
5. Address review feedback
6. Merge when approved

---

## Troubleshooting

### Port 3000 Already in Use

```bash
# Kill the process using port 3000
npx kill-port 3000

# Or use a different port
npm run dev -- -p 3001
```

### Supabase Connection Error

1. Check `.env.local` has correct credentials
2. Verify Supabase project is not paused (free tier auto-pauses after 1 week inactivity)
3. Check internet connection
4. Try restarting dev server

### TypeScript Errors

```bash
# Delete build cache and rebuild
rm -rf .next
npm run build
```

### Module Not Found Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### ESLint Errors

```bash
# Auto-fix what can be fixed
npm run lint:fix

# If module boundary error, check you're not importing across modules incorrectly
```

---

## VS Code Recommended Extensions

Install these for the best developer experience:

- **ESLint** (dbaeumer.vscode-eslint)
- **Prettier** (esbenp.prettier-vscode)
- **Tailwind CSS IntelliSense** (bradlc.vscode-tailwindcss)
- **TypeScript Importer** (pmneo.tsimporter)
- **Error Lens** (usernamehw.errorlens)
- **GitLens** (eamodio.gitlens)

### VS Code Settings

Add to `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

---

## Resources

### Documentation
- **Master Plan:** `docs/01-MASTER-PLAN.md` - Complete system design
- **Module Checklists:** `docs/modules/` - Feature requirements per module
- **Design System:** `docs/design/DESIGN-SYSTEM-PLAN.md` - UI components and patterns
- **Architecture Decisions:** `docs/adr/` - Why we made key technical choices
- **Security Plan:** `docs/SECURITY-PLAN.md` - Security requirements and RLS policies

### External
- **Next.js Docs:** https://nextjs.org/docs
- **Supabase Docs:** https://supabase.com/docs
- **shadcn/ui:** https://ui.shadcn.com
- **Tailwind CSS:** https://tailwindcss.com/docs
- **TypeScript:** https://www.typescriptlang.org/docs

### Team
- **Slack/Discord:** [Add team communication link]
- **Figma:** [Add design files link when available]
- **Supabase Dashboard:** [Add Supabase project link]
- **Vercel Dashboard:** [Add Vercel project link]

---

## Getting Help

1. **Check documentation** in `docs/` folder first
2. **Search existing issues** on GitHub
3. **Ask in team chat** (Slack/Discord)
4. **Create an issue** if it's a bug or feature request

---

## Security Notes

**NEVER commit:**
- `.env.local` file (contains secrets)
- API keys or passwords
- Service role keys in client code

**Always:**
- Use environment variables for secrets
- Test RLS policies before deploying
- Review security checklist in PRs

---

**Ready to start?** Run `npm run dev` and open http://localhost:3000

**Questions?** Check `docs/01-MASTER-PLAN.md` or ask the team!
