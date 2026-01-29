import { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from "../lib/auth";

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: string;
        phone?: string;
        emailVerified: boolean;
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
      console.log(session);

      if (!session)
        return res
          .status(401)
          .json({ error: "You are not authorized to perform this action." });

      if (!session.user.emailVerified) {
        return res
          .status(403)
          .json({ error: "Please verify your email to perform this action." });
      }
      req.user = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
        phone: session.user.phone as string,
        emailVerified: session.user.emailVerified,
      };
      if (roles.length && !roles.includes(req.user.role as UserRole)) {
        return res
          .status(403)
          .json({ error: "You are not authorized to perform this action." });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
