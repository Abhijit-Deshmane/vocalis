import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isOrgRoute = createRouteMatcher(["/orgs/:slug(.*)"])
const isOrgSettingsRoute = createRouteMatcher(["/orgs/:slug/settings(.*)"])

export default clerkMiddleware(async (auth, req) => {
  // All org-scoped routes require sign-in
  if (isOrgRoute(req)) {
    await auth.protect()
  }
  // Settings pages require org:admin role
  if (isOrgSettingsRoute(req)) {
    await auth.protect({ role: "org:admin" })
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
