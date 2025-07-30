# Graft

> Minimalist task management and time tracking application

Graft is a modern, full-stack web application built for focused productivity. Track your tasks, measure time, and gain insights into your work patterns through a clean, distraction-free interface.

![App marketing banner](https://benevolent-wolverine-87.convex.cloud/api/storage/4b9433b1-d339-4fac-b27e-8ef9982cd55d)

## ✨ Features

- **Task Management**: Create and organize tasks with topics and subtopics
- **Time Tracking**: Record work sessions with detailed time analytics
- **Daily Planning**: Plan your day with structured planning sessions
- **Analytics Dashboard**: Visualize time spent across different tasks and topics
- **Real-time Updates**: Live data synchronization across all devices
- **OAuth Authentication**: Secure login with Google, GitHub, and Apple
- **Dark/Light Theme**: System-adaptive theme with manual toggle

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd graft

# Install dependencies
npm install

# Set up development environment
npm run dev
```

This starts both the frontend (Next.js) and backend (Convex) development servers in parallel.

### Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend and backend servers |
| `npm run dev:frontend` | Start Next.js development server only |
| `npm run dev:backend` | Start Convex development server only |
| `npm run build` | Build for production and deploy Convex functions |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint code quality checks |
| `npm test` | Run tests in watch mode |
| `npm run test:ui` | Run tests with visual UI |
| `npm run test:run` | Run tests once |

## 🏗️ Architecture

### Tech Stack

**Frontend**
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React features
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality component library
- **next-themes** - Theme management

**Backend**
- **Convex** - Real-time database and serverless functions
- **@convex-dev/auth** - OAuth 2.0 authentication system

**Development**
- **TypeScript** - Type-safe development
- **Vitest** - Fast unit testing
- **ESLint** - Code linting and formatting

### Project Structure

```
graft/
├── app/                     # Next.js App Router
│   ├── dashboard/          # Main application pages
│   │   ├── track/         # Time tracking interface
│   │   ├── plan/          # Daily planning
│   │   ├── analyze/       # Analytics and insights
│   │   └── shared/        # Shared dashboard components
│   ├── sign-in/           # Authentication pages
│   └── layout.tsx         # Root layout with providers
├── components/             # Reusable React components
│   ├── auth/              # Authentication components
│   ├── ui/                # shadcn/ui base components
│   └── navbar/            # Navigation components
├── convex/                 # Backend functions and schema
│   ├── schema.ts          # Database schema definition
│   ├── tasks.ts           # Task management functions
│   ├── timeEntries.ts     # Time tracking functions
│   ├── dashboard.ts       # Dashboard data aggregation
│   └── auth.config.ts     # Authentication configuration
└── lib/                   # Utility functions
```

## 📊 Data Models

### Tasks
- Title, topic, and subtopic organization
- User-scoped with creation timestamps
- Indexed for efficient querying by user and topic

### Time Entries
- Duration tracking with start timestamps
- Denormalized task data for performance
- Optional notes for context
- Indexed by user and date for analytics

### Plans
- Daily planning content per user
- Date-based organization
- Creation and update timestamps

## 🔐 Authentication

Graft uses Convex Auth with OAuth providers:
- **Google** - Social login
- **GitHub** - Developer-friendly authentication
- **Apple** - iOS/macOS integration

Authentication is handled server-side with secure session management and automatic user provisioning.

## 🎨 UI/UX Design

- **Responsive Design**: Mobile-first approach with desktop optimization
- **Accessibility**: WCAG compliant components via Radix UI
- **Theme Support**: Automatic dark/light mode detection
- **Progressive Enhancement**: Works without JavaScript for core features

## 🧪 Testing

The project uses Vitest with React Testing Library:

```bash
# Run tests in watch mode
npm test

# Run tests with UI dashboard
npm run test:ui

# Run tests once for CI/CD
npm run test:run
```

Test files are located alongside components using the `*.test.tsx` pattern.

## 🚢 Deployment

### Production Build

```bash
npm run build
```

This command:
1. Builds the Next.js application
2. Deploys Convex functions to production
3. Optimizes assets for production

### Environment Variables

Required environment variables:
- `CONVEX_DEPLOYMENT` - Convex deployment URL
- `NEXT_PUBLIC_CONVEX_URL` - Public Convex client URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Run `npm run lint` to ensure code quality
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Check the [Convex documentation](https://docs.convex.dev/)
- Review the [Next.js documentation](https://nextjs.org/docs)

---

Built with ❤️ using modern web technologies for focused productivity.
