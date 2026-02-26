# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Deals Mocktail** is a Next.js 16 e-commerce deals aggregator platform with multi-locale support (US, India) that displays deals, coupons, blogs, and stories from various stores and brands. The frontend is built with React 19, TypeScript, Tailwind CSS 4, and shadcn/ui components.

## Common Commands

```bash
# Development
npm run dev              # Start dev server on port 3000

# Production
npm run build           # Build for production
npm start               # Start production server on port 3007

# Linting
npm run lint           # Run ESLint
```

## Architecture Overview

### Routing & Localization

- **Next.js App Router** with locale-prefixed routes: `/[locale]/...` (e.g., `/us/deals`, `/in/coupons`)
- **Middleware** (`proxy.ts` exported from root): Handles locale routing and authentication
  - Automatically redirects non-locale routes to `/us/` (default locale)
  - Validates locale codes (2-letter codes like `us`, `in`)
  - Sets `NEXT_LOCALE` cookie for locale persistence
  - Routes in `LOCALE_EXEMPT_ROUTES` (`/auth`, `/profile`) bypass locale prefixing
  - Protects authenticated routes listed in `AUTHENTICATED_ROUTES`

### State Management

**Redux Toolkit** (`store/index.ts`):
- `newAuth`: Authentication state (user profile, session)
- `catalogue`: Product catalogue data
- `preview`: Preview modal state for product details

**Note**: Uses `serializableCheck: false` middleware option.

### Data Fetching Pattern

The application uses a **server-first data fetching strategy**:

1. **Server-side data services** (`data/` directory):
   - Contains server-only data fetchers marked with `'server-only'` directive
   - Example: `data/deals/deals-server-only.ts` - Fetches deals from backend API
   - Returns transformed data ready for client consumption

2. **Client-side service layer** (`lib/` directory):
   - Contains service functions that orchestrate data fetching and transformation
   - Example: `lib/alldeals-service.tsx` - Calls server data fetchers and applies filtering/sorting
   - Acts as bridge between server data and client components

3. **Data transformation** (`lib/transform.ts`):
   - Converts API responses to frontend-compatible formats
   - Example: `transformApiDealToDeal()`, `transformStories()`

4. **Caching** (currently commented out but infrastructure present):
   - Uses Next.js 15+ caching APIs: `cacheTag()`, `cacheLife()`
   - Cache keys defined in `app/cache-keys.ts`

### API Integration

- **Backend API**: Configured via `NEXT_PUBLIC_API_BASE_URL` environment variable
- **Axios Client** (`lib/axios-client.ts`):
  - Base URL set from env variable
  - Timeout: 30 seconds
  - `withCredentials: true` for session cookies
  - Interceptors handle 401 errors with page reload

### Authentication

- Uses **Better Auth** library with session tokens
- Cookie name varies by protocol:
  - HTTPS: `__Secure-better-auth.session_token`
  - HTTP: `better-auth.session_token`
- Auth logic in `proxy.ts` middleware
- Protected routes redirect to `/auth` with `?redirect=<original-path>` query param
- API routes: `app/api/auth/logout/route.ts`

### Filtering System

**Two-layer filtering architecture**:

1. **Multi-select filters** (new system using filter IDs):
   - Components in `components/filters/`
   - State managed via URL search params and local state
   - Filter data structure: categories (tree), brands, stores, tags

2. **Filter Bridge** (`lib/filter-bridge.ts`):
   - Translates between new multi-select filters (IDs) and legacy filtering (names/slugs)
   - Creates ID-to-name mappings for categories, brands, stores
   - Applies filters to deal arrays

3. **Filter Mappers** (`lib/filter-mappers.ts`):
   - Converts API filter structures to frontend format

4. **Filter Utils**:
   - `lib/blogs-filter-utils.ts` - Blog-specific filtering
   - `lib/coupons-filter-utils.ts` - Coupon-specific filtering

### Component Organization

```
components/
├── ui/              # shadcn/ui base components
├── filters/         # Filter-related components (mobile/desktop)
├── landing-page/    # Homepage components
├── alldeals/        # Deal listing components
├── coupons/         # Coupon listing components
├── blogs/           # Blog listing components
├── auth/            # Authentication flows
├── common/          # Shared components
├── card/            # Card variants for different content types
└── providers/       # React context providers
```

### Type Definitions

All TypeScript types in `types/` directory:
- `alldeals.types.ts` - Deal entities and filter states
- `deals-api.types.ts` - API response shapes for deals
- `coupons.types.ts` & `coupons-api.types.ts` - Coupon types
- `blogs.types.ts` & `blogs-api.types.ts` - Blog types
- `stories.types.ts` - Stories/carousel types
- `profile.types.ts` - User profile types

### Styling

- **Tailwind CSS 4** with custom configuration
- **CSS Variables** for theming (defined in `app/globals.css`)
- **Font Stack**:
  - Sans: Geist
  - Serif: Lora
  - Mono: Fira Code
- **Component Library**: shadcn/ui (New York style) with custom registries:
  - `@magicui`: https://magicui.design
  - `@aceternity`: https://ui.aceternity.com

### Path Aliases

TypeScript path alias `@/*` maps to root directory (configured in `tsconfig.json`):
```typescript
import { Deal } from '@/types/alldeals.types'
import { getDeals } from '@/data/deals/deals-server-only'
```

## Key Implementation Patterns

### Locale Handling

Always extract locale from URL params in page components:
```typescript
export default async function Page({ params }: { params: Promise<{ locale: LocaleCode }> }) {
  const { locale } = await params
  // Use locale for data fetching
}
```

Currency formatting using `lib/locale-utils.ts`:
```typescript
const config = SUPPORTED_LOCALES[locale]
const formatted = new Intl.NumberFormat(config.currency.locale, {
  style: 'currency',
  currency: config.currency.code
}).format(price)
```

### Server-Only Data Fetching

Mark server data modules with `'server-only'`:
```typescript
import 'server-only'
// ... server-side data fetching code
```

### Filter State Management

Filters use URL search params for state persistence and shareable URLs. See `components/filters/` for implementation examples.

## Environment Variables

Required environment variables (see `.env`):
- `NEXT_PUBLIC_API_BASE_URL` - Backend API base URL
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `NEXT_PUBLIC_COOKIE_DOMAIN` - Cookie domain for auth (use `localhost` in dev)

## Git Workflow

- **Main branch**: `development` (use this for PRs)
- **Current branch**: `sharath-homepage`
- Conventional commit messages recommended based on repo history

## Performance Optimizations

- Image optimization configured in `next.config.ts`:
  - Formats: AVIF, WebP
  - Device sizes optimized for responsive images
  - Allowed remote domains configured
- Package import optimization for `lucide-react`, `@tabler/icons-react`, `motion`
- Component caching enabled: `cacheComponents: true`
- Compression enabled

## Notes

- React Strict Mode is enabled
- `poweredByHeader` disabled for security
- Redux store uses non-serializable check disabled for flexibility
- Mobile keyboard handling via `MobileKeyboardProvider`
- Preview modal for product details overlays across entire app
