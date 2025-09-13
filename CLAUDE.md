# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **VibeDoge Exchange Demo** - a modern React-based application showcasing a cryptocurrency exchange platform with lottery functionality. The project demonstrates both frontend capabilities and backend API integration.

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **State Management**: Zustand
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS
- **HTTP Client**: Built-in fetch API
- **Build Tool**: Vite
- **Package Manager**: pnpm
- **Backend**: Express.js (Node.js)
- **Database**: Mock data (no persistent database)

### Project Architecture

#### Frontend Structure
```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── business/     # Business logic components
│   └── Empty.tsx     # Component stubs
├── pages/             # Page components
├── store/             # Zustand state management
├── services/          # API services (MCP service)
├── hooks/             # Custom React hooks
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
├── i18n/              # Internationalization
└── lib/               # Library utilities
```

#### Backend Structure
```
api/
└── routes/
    └── lottery.cjs    # Lottery API endpoints
server.cjs             # Express server setup
```

## Development Commands

### Frontend Development
```bash
# Install dependencies
pnpm install

# Start development server (Vite dev server)
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Type checking
npx tsc --noEmit

# Linting
pnpm lint
```

### Backend Development
```bash
# Start Express server
pnpm dev:server

# Start both frontend and backend concurrently
pnpm dev:full

# Start production server
pnpm start
```

### Testing
Currently no testing framework is configured. Consider adding Jest/Vitest and React Testing Library for comprehensive testing.

## Key Features

### MCP Service (Model Context Protocol)
- **Location**: `src/services/mcpService.ts`
- **Purpose**: Generates and manages user IDs without requiring registration
- **Key Functions**:
  - `getMCPUserId()`: Generate new unique user ID
  - `restoreMCPUser()`: Restore user from localStorage
  - `clearMCPSession()`: Clear user session
- **User ID Format**: `mcp_timestamp_randomstring`

### State Management
Using **Zustand** for global state management:
- `useUserStore`: User authentication and MCP integration
- `useMarketStore`: Market data and product management
- `useLotteryStore`: Lottery activity state
- `useUIStore`: UI state (theme, sidebar)
- `useMessageBoardStore`: Community message board

### Lottery System
The lottery system provides:
- User ID generation (`/api/lottery/generate-user-id`)
- Lottery ID generation (`/api/lottery/generate-lottery-id`)
- User lottery records (`/api/lottery/user-lotteries/:userId`)
- Lottery information (`/api/lottery/info/:lotteryId`)

### Routing
Main application routes:
- `/` - Home page
- `/lottery/detail` - Lottery detail page
- `/global-stats` - Global statistics
- `/about` - About page
- `/community` - Community page

## API Integration

### Development Environment
- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:3001/api`
- **API Proxy**: Vite config proxies `/api` to backend

### Key API Endpoints
```javascript
// Generate user ID
POST /api/lottery/generate-user-id

// Generate lottery ID  
POST /api/lottery/generate-lottery-id

// Get user lotteries
GET /api/lottery/user-lotteries/:userId

// Get lottery info
GET /api/lottery/info/:lotteryId

// Health check
GET /api/health
```

## Styling and UI

### Tailwind CSS Configuration
- Configured in `tailwind.config.js`
- Uses custom color scheme and typography
- Responsive design approach

### UI Components
Located in `src/components/ui/`:
- `Card.tsx` - Reusable card component
- `Button.tsx` - Button with variants
- `Modal.tsx` - Modal dialogs
- `Carousel.tsx` - Image carousel
- `AnimatedText.tsx` - Text animations
- `CountUp.tsx` - Number counting animation

### Theme System
- Light/dark theme support
- Theme state managed in `useUIStore`
- Custom hook `useTheme.ts` for theme handling

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow React functional component patterns
- Use hooks for state and side effects
- Component names should be PascalCase
- File names should be PascalCase for components, camelCase for utilities

### State Management Patterns
- Use Zustand stores for global state
- Keep component state local when possible
- Use selectors for optimal performance
- Store updates should be immutable

### API Patterns
- Use async/await for API calls
- Implement proper error handling
- Use consistent response format `{ success, data, message }`
- Handle loading states in UI

### MCP Integration
- Initialize MCP user on app startup
- Use localStorage for session persistence
- Generate user IDs with timestamp + random format
- Handle session restoration gracefully

## Build and Deployment

### Production Build
```bash
pnpm build  # Creates dist/ folder
```

### Vercel Deployment
- Project is configured for Vercel deployment
- `vercel.json` handles API rewrites
- Static files served from `dist/` folder

### Environment Variables
No required environment variables for basic functionality. Optional:
- `NODE_ENV` - Set to 'production' for production builds
- `PORT` - Server port (default: 3001)

## Performance Considerations

### Code Splitting
- Vite automatically handles code splitting
- Dynamic imports for large components
- Lazy loading for routes

### Optimization
- Bundle analyzer available via Vite plugins
- Image optimization recommendations
- Caching strategies for API responses

### Development Experience
- Fast refresh with Vite HMR
- TypeScript for early error detection
- ESLint for code quality
- Concurrent development for frontend and backend

## Troubleshooting

### Common Issues
1. **Port conflicts**: Change ports in `vite.config.ts` or `server.cjs`
2. **CORS issues**: Ensure backend CORS middleware is properly configured
3. **MCP user initialization**: Check localStorage if user creation fails
4. **Build errors**: Run `pnpm lint` and `npx tsc` to identify issues

### Debug Mode
- Use browser dev tools for React debugging
- Check network tab for API calls
- Use `console.log` for MCP service debugging
- Vite dev server provides detailed error information