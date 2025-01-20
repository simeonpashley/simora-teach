import { authMiddleware, redirectToSignIn } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

// Create intl middleware for non-API routes
const intlMiddleware = createMiddleware({
  locales: ['en', 'cy'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
});

export default authMiddleware({
  beforeAuth: (req) => {
    // Skip intl middleware for API routes
    if (req.nextUrl.pathname.startsWith('/api')) {
      return NextResponse.next();
    }
    return intlMiddleware(req);
  },
  afterAuth: (auth, req) => {
    // For API routes, ensure authentication except for public routes
    if (req.nextUrl.pathname.startsWith('/api')) {
      if (!auth.userId && !req.nextUrl.pathname.startsWith('/api/webhooks')) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 },
        );
      }
      return NextResponse.next();
    }

    // For non-API routes, redirect to sign-in if not authenticated
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }
    return NextResponse.next();
  },
  publicRoutes: [
    '/',
    '/sign-in',
    '/sign-up',
    '/api/webhooks(.*)',
  ],
});

// Update matcher to exclude static files and include API routes
export const config = {
  matcher: [
    // Match all paths except static files and API routes
    '/((?!.+\\.[\\w]+$|_next).*)',
    // Match root path
    '/',
    // Match API routes
    '/(api|trpc)(.*)',
  ],
};
