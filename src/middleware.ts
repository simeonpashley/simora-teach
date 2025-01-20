import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

// Create intl middleware for non-API routes
const intlMiddleware = createMiddleware({
  locales: ['en', 'cy'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
});

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in',
  '/sign-up',
  '/api/webhooks(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (req.nextUrl.pathname.startsWith('/api')) {
    if (!(await auth()).userId && !req.nextUrl.pathname.startsWith('/api/webhooks')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 },
      );
    }
    return NextResponse.next();
  }

  // For non-API routes, redirect to sign-in if not authenticated
  if (!isPublicRoute(req)) {
    await auth.protect();
  }

  return intlMiddleware(req);
});

// Update matcher to exclude static files and include API routes
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
