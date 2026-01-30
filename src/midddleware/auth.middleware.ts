import { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from "../lib/auth";
import { prisma } from "../lib/prisma";

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
  PROVIDER = "PROVIDER",
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: UserRole;
        phone?: string;
        address?: string;
        emailVerified: boolean;
        providerId?: string;
      };
    }
  }
}

const auth = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await betterAuth.api.getSession({
        headers: req.headers as any,
      });

      if (!session) {
        return res
          .status(401)
          .json({ error: "You are not authorized to perform this action." });
      }

      if (!session.user.emailVerified) {
        return res
          .status(403)
          .json({ error: "Please verify your email to perform this action." });
      }

      const userRole = session.user.role as UserRole;

      req.user = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: userRole,
        phone: session.user.phone as string,
        address: session.user.address as string,
        emailVerified: session.user.emailVerified,
      };

      // Handle role specific data attachment
      if (userRole === UserRole.PROVIDER) {
        const provider = await prisma.provider.findUnique({
          where: { email: session.user.email },
        });
        if (provider) {
          req.user.providerId = provider.id;
        }
      }

      if (roles.length && !roles.includes(userRole)) {
        return res
          .status(403)
          .json({
            error: `Access denied. This action requires one of the following roles: ${roles.join(", ")}`,
          });
      }

      next();
    } catch (error) {
      console.error("[Auth Middleware Error]:", error);
      next(error);
    }
  };
};

export default auth;

