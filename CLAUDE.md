# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Start Development
```bash
npm run dev          # Starts both frontend (Next.js) and backend (Convex) in parallel
npm run dev:frontend # Start Next.js development server only
npm run dev:backend  # Start Convex development server only
```

### Build and Deployment
```bash
npm run build        # Build Next.js app and deploy Convex functions
npm run start        # Start production Next.js server
```

### Code Quality
```bash
npm run lint         # Run ESLint
```

### Testing
```bash
npm test             # Run Vitest in watch mode
npm run test:ui      # Run Vitest with UI
npm run test:run     # Run tests once
```

## Architecture Overview

### Frontend (Next.js 15 + React 19)
- **App Router**: Uses Next.js 15 app directory structure
- **Authentication**: Convex Auth with OAuth providers (Google, GitHub, Apple)
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context for dashboard data with preloaded queries
- **Testing**: Vitest with React Testing Library and jsdom

### Backend (Convex)
- **Database**: Convex real-time database with type-safe queries
- **Authentication**: @convex-dev/auth for OAuth integration
- **Functions**: Uses new Convex function syntax with validators
- **Schema**: Defined in `convex/schema.ts` with proper indexes

### Key Data Models
- **tasks**: User tasks with title, topic, subtopic
- **timeEntries**: Time tracking with denormalized task data
- **plans**: Daily planning content per user
- **Auth tables**: Managed by @convex-dev/auth

### Project Structure
```
app/                          # Next.js app router
├── dashboard/               # Main dashboard pages
│   ├── track/              # Time tracking functionality
│   ├── plan/               # Daily planning
│   ├── analyze/            # Analytics/insights
│   └── shared/             # Shared dashboard components
convex/                      # Backend functions and schema
├── tasks.ts                # Task management functions
├── timeEntries.ts          # Time tracking functions
├── dashboard.ts            # Dashboard data functions
├── plans.ts                # Planning functions
└── schema.ts               # Database schema
components/                  # Reusable React components
├── auth/                   # Authentication components
├── ui/                     # shadcn/ui components
└── navbar/                 # Navigation
```

## Convex Guidelines

Follow the comprehensive Convex guidelines in `.cursor/rules/convex_rules.mdc`:

### Function Syntax
- Always use new function syntax with `args`, `returns`, and `handler`
- Include proper validators for all arguments and return types
- Use `internalQuery`, `internalMutation`, `internalAction` for private functions
- Use `query`, `mutation`, `action` for public API functions

### Database Operations
- Define indexes in schema and use `withIndex` instead of `filter`
- Use proper ordering with `.order("asc")` or `.order("desc")`
- Follow pagination patterns with `paginationOptsValidator`

### Authentication Integration
- Uses @convex-dev/auth with OAuth providers
- Auth tables are automatically included in schema
- User authentication is handled through Convex Auth

## Development Patterns

### Dashboard Data Loading
- Uses preloaded queries for better performance
- Dashboard context provides shared data across components
- Custom hooks in `app/dashboard/shared/hooks/` for data operations

### Component Architecture
- shadcn/ui for base components in `components/ui/`
- Feature-specific components organized by domain
- Proper TypeScript types with Convex-generated types

### Time Tracking System
- Tasks can have topics and subtopics for organization
- Time entries store denormalized task data for performance
- Real-time updates through Convex subscriptions

## Testing Setup
- Vitest configuration in `vitest.config.ts`
- Tests use jsdom environment
- Setup file: `vitest.setup.ts`
- Test files: `**/*.test.tsx` and `**/*.test.ts`