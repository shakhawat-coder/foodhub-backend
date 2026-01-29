import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { providerService } from "../modules/provider/provider.service";
// If your Prisma file is located elsewhere, you can change the path

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    async afterSignUp({ user, session, request }: any) {
      try {
        console.log(
          `[Auth] afterSignUp triggered for user: ${user.email}, role: ${user.role}`,
        );

        // Check if user has PROVIDER role
        if (user.role === "PROVIDER") {
          try {
            console.log(
              `[Auth] User is a PROVIDER, creating provider record...`,
            );

            // Try to get phone and address from user object first (since they are additionalFields)
            // If not there, we might need to look at the request body
            const phone = user.phone || "";
            const address = user.address || "";

            console.log(
              `[Auth] Extracted phone: "${phone}", address: "${address}"`,
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
              `[Auth] Provider record created successfully for ${user.email}`,
            );
          } catch (providerError) {
            console.error(
              "[Auth] Error creating provider record:",
              providerError,
            );
            // Don't throw - allow signup to succeed even if provider creation fails
          }
        } else {
          console.log(
            `[Auth] User is NOT a PROVIDER (role: ${user.role}), skipping provider creation.`,
          );
        }
      } catch (error) {
        console.error("[Auth] Error in afterSignUp hook:", error);
        // Don't throw - allow signup to succeed
      }
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
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
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000",
  trustedOrigins: [process.env.APP_URL || "http://localhost:3000"],
});

export type Auth = typeof auth;
