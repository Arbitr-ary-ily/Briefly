import {
  clerkMiddleware,
  createRouteMatcher
} from '@clerk/nextjs/server'

// Define protected routes
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/analytics(.*)',
  '/bias(.*)',
  '/news(.*)',
  '/stories(.*)',
  '/story(.*)',
])

// Define public routes
const isPublicRoute = createRouteMatcher(["/signin(.*)", "/signup(.*)"])

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect() // Protect the route if it's a protected one
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
