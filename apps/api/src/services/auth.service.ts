import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/app-error.js";
import { signToken } from "../utils/jwt.js";

const registerSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  phone: z.string().min(8),
  password: z.string().min(6),
  role: z.enum(["customer", "provider"]),
  providerProfile: z
    .object({
      businessName: z.string().min(3),
      documentNumber: z.string().min(11),
      city: z.string().min(2),
      state: z.string().length(2),
      vehicleType: z.string().min(3),
      vehiclePlate: z.string().min(6),
      serviceRadiusKm: z.coerce.number().min(1).max(300),
    })
    .optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function registerUser(payload: unknown) {
  const data = registerSchema.parse(payload);

  const existingUser = await prisma.user.findUnique({
    where: { email: data.email.toLowerCase() },
  });

  if (existingUser) {
    throw new AppError("Ja existe uma conta com este e-mail.", 409);
  }

  if (data.role === "provider" && !data.providerProfile) {
    throw new AppError("O perfil profissional e obrigatorio para prestadores.", 400);
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email.toLowerCase(),
      phone: data.phone,
      passwordHash,
      role: data.role as UserRole,
      providerProfile:
        data.role === "provider" && data.providerProfile
          ? {
              create: {
                ...data.providerProfile,
                state: data.providerProfile.state.toUpperCase(),
              },
            }
          : undefined,
    },
    include: {
      providerProfile: true,
    },
  });

  const token = signToken({
    sub: user.id,
    role: user.role,
  });

  return {
    token,
    user,
  };
}

export async function loginUser(payload: unknown) {
  const data = loginSchema.parse(payload);

  const user = await prisma.user.findUnique({
    where: { email: data.email.toLowerCase() },
    include: { providerProfile: true },
  });

  if (!user) {
    throw new AppError("Credenciais invalidas.", 401);
  }

  const passwordMatches = await bcrypt.compare(data.password, user.passwordHash);

  if (!passwordMatches) {
    throw new AppError("Credenciais invalidas.", 401);
  }

  const token = signToken({
    sub: user.id,
    role: user.role,
  });

  return {
    token,
    user,
  };
}

export async function getAuthenticatedUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      providerProfile: true,
      notifications: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  if (!user) {
    throw new AppError("Usuario nao encontrado.", 404);
  }

  return user;
}
