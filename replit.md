# Overview

This is an Arabic tic-tac-toe game with a colorful, child-friendly interface built using React, TypeScript, and Express. The game features multiple modes (single-player vs AI, two-player), difficulty levels, character selection with unlockable characters, and Arabic voice narration. The frontend uses React with Three.js capabilities for 3D graphics support, Tailwind CSS for styling, and Zustand for state management. The backend is a minimal Express server with Drizzle ORM configured for PostgreSQL.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Technology Stack**
- React 18 with TypeScript for the UI framework
- Vite as the build tool and development server
- Tailwind CSS with custom theme configuration for styling
- Zustand for client-side state management (no Redux)
- React Three Fiber and Drei for 3D graphics capabilities
- Radix UI primitives for accessible component patterns

**Component Structure**
The application follows a phase-based architecture with distinct screens:
- Mode selection (single vs two-player)
- Difficulty selection (for single-player mode)
- Character selection with locked/unlocked states
- Game board with interactive cells
- Game UI overlay with controls and winner display

**State Management Pattern**
Three separate Zustand stores manage different concerns:
- `useTicTacToe`: Core game logic including board state, turn management, AI moves, character progression
- `useAudio`: Sound effects and mute control (background music, hit sounds, success sounds)
- `useGame`: Generic game phase transitions (ready/playing/ended)

**Internationalization**
The application is designed for Arabic language support with RTL (right-to-left) text direction using the `dir="rtl"` attribute on components.

## Backend Architecture

**Server Framework**
- Express.js with TypeScript for the HTTP server
- Vite integration in development mode for HMR (Hot Module Replacement)
- Custom logging middleware for API request tracking

**Route Organization**
Routes are centralized in `server/routes.ts` with the convention that all application routes should be prefixed with `/api`. Currently implements a minimal route structure awaiting application-specific endpoints.

**Storage Layer Abstraction**
The storage layer uses an interface pattern (`IStorage`) with a concrete in-memory implementation (`MemStorage`). This allows easy swapping between memory storage and database-backed storage without changing route logic.

**Development vs Production**
- Development: Vite dev server handles static assets and provides HMR
- Production: Built assets are served statically from `dist/public`

## Data Storage

**Database Configuration**
- Drizzle ORM configured for PostgreSQL dialect
- Schema defined in `shared/schema.ts` for type-safe database operations
- Migration files output to `./migrations` directory
- Connection via `DATABASE_URL` environment variable (using Neon serverless driver)

**Schema Design**
Currently implements a minimal user schema with:
- Serial primary key
- Unique username field
- Password storage (Note: No encryption/hashing implementation visible)
- Zod validation schemas generated from Drizzle tables

**Storage Pattern**
The `IStorage` interface defines CRUD operations as async methods. The `MemStorage` implementation provides in-memory data persistence for development/testing, storing users in a Map with auto-incrementing IDs.

## External Dependencies

**Database Service**
- Neon Serverless PostgreSQL (`@neondatabase/serverless`) for serverless-compatible database connections
- Connection string expected via `DATABASE_URL` environment variable

**UI Component Libraries**
- Radix UI primitives for 30+ accessible components (dialogs, dropdowns, tooltips, etc.)
- shadcn/ui component pattern (components in `client/src/components/ui/`)

**3D Graphics & Animation**
- Three.js via React Three Fiber for 3D rendering
- React Three Drei for helpful 3D utilities
- React Three Postprocessing for visual effects
- GLSL shader support via vite-plugin-glsl

**Audio Management**
- Browser Web Audio API for sound effects
- Speech Synthesis API for Arabic voice narration
- Manual audio file management (mp3, ogg, wav formats supported)

**Development Tools**
- Replit-specific error overlay plugin for development
- TanStack Query for future API data fetching (configured but not actively used)
- TypeScript with strict mode enabled
- Path aliases (`@/` for client, `@shared/` for shared code)

**Styling & Typography**
- Fontsource Inter for web fonts
- Google Fonts (Baloo Bhaijaan 2) for Arabic typography
- class-variance-authority for component variant styling
- clsx and tailwind-merge for conditional class composition

**Authentication**
No authentication system is currently implemented despite the user schema existing. The storage interface includes user lookup methods but no session management or password verification.