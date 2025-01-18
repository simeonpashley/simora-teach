import { authMiddleware } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

// Create intl middleware for non-API routes
const intlMiddleware = createMiddleware({
  locales: ['en', 'cy'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
});

// Rate limiting setup
const rateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  store: new Map(), // In-memory store - use Redis in production
};

function isRateLimited(req: NextRequest): boolean {
  if (!process.env.ENABLE_RATE_LIMITING) {
    return false;
  }

  const ip = req.ip || 'unknown';
  const now = Date.now();
  const windowStart = now - rateLimit.windowMs;

  // Clean up old entries
  for (const [key, timestamp] of rateLimit.store.entries()) {
    if (timestamp < windowStart) {
      rateLimit.store.delete(key);
    }
  }

  // Count requests in current window
  const requests = Array.from(rateLimit.store.entries())
    .filter(([key, timestamp]) => key.startsWith(ip) && timestamp > windowStart)
    .length;

  if (requests >= rateLimit.max) {
    return true;
  }

  // Record this request
  rateLimit.store.set(`${ip}-${now}`, now);
  return false;
}

function secureResponse(response: Response): Response {
  const headers = new Headers(response.headers);

  if (process.env.NODE_ENV === 'production') {
    // Security headers
    headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('X-Frame-Options', 'DENY');
    headers.set('X-XSS-Protection', '1; mode=block');
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    headers.set('Content-Security-Policy', 'default-src \'self\'');

    // Secure cookies
    const cookies = headers.get('Set-Cookie');
    if (cookies) {
      headers.set(
        'Set-Cookie',
        cookies
          .split(',')
          .map(cookie =>
            `${cookie}; Secure; SameSite=Lax; HttpOnly`,
          )
          .join(','),
      );
    }
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default authMiddleware({
  beforeAuth: (req) => {
    // Skip intl middleware for API routes
    if (req.nextUrl.pathname.startsWith('/api')) {
      return NextResponse.next();
    }
    return intlMiddleware(req);
  },
  afterAuth: (auth, req) => {
    // Rate limiting for API routes
    if (req.nextUrl.pathname.startsWith('/api')) {
      if (isRateLimited(req)) {
        return NextResponse.json(
          {
            error: process.env.NODE_ENV === 'development'
              ? 'Rate limit exceeded. Please try again later.'
              : 'Too many requests',
          },
          { status: 429 },
        );
      }

      // Require authentication for API routes except webhooks
      if (!auth.userId && !req.nextUrl.pathname.startsWith('/api/webhooks')) {
        return NextResponse.json(
          {
            error: process.env.NODE_ENV === 'development'
              ? 'Authentication required for this endpoint'
              : 'Unauthorized',
          },
          { status: 401 },
        );
      }
    } else if (!auth.userId && !req.nextUrl.pathname.includes('/sign-in')) {
      // Handle non-API routes authentication
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(signInUrl);
    }

    // Add security headers to response
    const response = NextResponse.next();
    return secureResponse(response);
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
