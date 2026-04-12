import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { providerService } from "../modules/provider/provider.service";
// If your Prisma file is located elsewhere, you can change the path

/**
 * BETTER_AUTH_URL — The PUBLIC base URL where `/api/auth` is reachable by browsers.
 *
 * Because the Next.js frontend PROXIES all `/api/auth/*` requests to this API,
 * Google must redirect the user back through the FRONTEND (not directly to this server).
 * So BETTER_AUTH_URL must be the FRONTEND origin:
 *
 *   Production:  BETTER_AUTH_URL=https://foodhub-frontend-mu.vercel.app
 *   Local:       BETTER_AUTH_URL=http://localhost:3000
 *
 * better-auth will build the Google redirect_uri as:
 *   ${BETTER_AUTH_URL}/api/auth/callback/google
 * Register that exact URL in Google Cloud Console → Authorized Redirect URIs.
 *
 * APP_URL — same frontend origin, used for trusted origins.
 */
const publicAuthBaseURL =
  process.env.BETTER_AUTH_URL ||
  process.env.AUTH_URL ||
  (process.env.NODE_ENV !== "production" ? "http://localhost:3000" : "");

function buildTrustedOrigins(): string[] {
  const raw = [
    process.env.APP_URL,          // frontend Vercel URL
    "http://localhost:3000",
    "https://foodhub-frontend-mu.vercel.app",
    // Accept any Vercel preview deployment for this project
    "https://foodhub-frontend-mu.vercel.app",
  ].filter(Boolean) as string[];

  const extra =
    process.env.AUTH_TRUSTED_ORIGINS?.split(",").map((s) => s.trim()) ?? [];

  return [...new Set([...raw, ...extra])];
}

export const auth = betterAuth({
  ...(publicAuthBaseURL ? { baseURL: publicAuthBaseURL } : {}),
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          return {
            data: {
              ...user,
              emailVerified: true,
            },
          };
        },
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    async afterSignUp({ user, session, request }: any) {
      try {
        // Force emailVerified to true immediately after signup
        // using a direct update. This bypasses better-auth's default behavior.
        await prisma.user.update({
          where: { id: user.id },
          data: { emailVerified: true },
        });

        console.log(
          `[Auth] afterSignUp triggered for user: ${user.email}, role: ${user.role}`
        );

        // Check if user has PROVIDER role
        if (user.role === "PROVIDER") {
          try {
            console.log(
              `[Auth] User is a PROVIDER, creating provider record...`
            );

            // Try to get phone and address from user object first (since they are additionalFields)
            // If not there, we might need to look at the request body
            const phone = user.phone || "";
            const address = user.address || "";

            console.log(
              `[Auth] Extracted phone: "${phone}", address: "${address}"`
            );

            // Create provider record using provider service
            await providerService.createProvider({
              name: user.name,
              email: user.email,
              phone: phone,
              address: address,
              logo: user.image || undefined,
            });

            console.log(
              `[Auth] Provider record created successfully for ${user.email}`
            );
          } catch (providerError) {
            console.error(
              "[Auth] Error creating provider record:",
              providerError
            );
            // Don't throw - allow signup to succeed even if provider creation fails
          }
        } else {
          console.log(
            `[Auth] User is NOT a PROVIDER (role: ${user.role}), skipping provider creation.`
          );
        }
      } catch (error) {
        console.error("[Auth] Error in afterSignUp hook:", error);
        // Don't throw - allow signup to succeed
      }
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "CUSTOMER",
        input: true,
      },
      phone: {
        type: "string",
        required: false,
        input: true,
      },
      address: {
        type: "string",
        required: false,
        input: true, // Allow passing address from client
      },
    },
  },
  trustedOrigins: buildTrustedOrigins(),
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
    // Required when the API sits behind a reverse proxy (Railway, Render, etc.)
    trustedProxyHeaders: true,
  },
  onAPIError: {
    onError: (error, _ctx) => {
      console.error("[better-auth]", error);
    },
  },
});

export type Auth = typeof auth;