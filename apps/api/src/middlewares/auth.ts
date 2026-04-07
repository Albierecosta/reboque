import { UserRole } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/app-error.js";
import { verifyToken } from "../utils/jwt.js";

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
        role: UserRole;
      };
    }
  }
}

export async function ensureAuthenticated(request: Request, _response: Response, next: NextFunction) {
  const authorization = request.headers.authorization;

  if (!authorization) {
    throw new AppError("Token de autenticacao ausente.", 401);
  }

  const [, token] = authorization.split(" ");

  if (!token) {
    throw new AppError("Token invalido.", 401);
  }

  const payload = verifyToken(token);

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
  });

  if (!user) {
    throw new AppError("Usuario nao encontrado.", 401);
  }

  request.auth = {
    userId: user.id,
    role: user.role,
  };

  next();
}

export function authorize(roles: Array<UserRole | "customer" | "provider" | "admin">) {
  return (request: Request, _response: Response, next: NextFunction) => {
    if (!request.auth) {
      throw new AppError("Usuario nao autenticado.", 401);
    }

    if (!roles.includes(request.auth.role)) {
      throw new AppError("Voce nao tem permissao para esta acao.", 403);
    }

    next();
  };
}
