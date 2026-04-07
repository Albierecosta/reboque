import { Prisma, ServiceRequestStatus } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/app-error.js";
import { calculateDistanceKm } from "../utils/geo.js";

const providerProfileSchema = z.object({
  businessName: z.string().min(3),
  documentNumber: z.string().min(11),
  city: z.string().min(2),
  state: z.string().length(2),
  vehicleType: z.string().min(3),
  vehiclePlate: z.string().min(6),
  serviceRadiusKm: z.coerce.number().min(1).max(300),
});

const providerOnlineSchema = z.object({
  isOnline: z.boolean(),
  currentLatitude: z.coerce.number().optional(),
  currentLongitude: z.coerce.number().optional(),
});

const providerLocationSchema = z.object({
  currentLatitude: z.coerce.number(),
  currentLongitude: z.coerce.number(),
});

const updateStatusSchema = z.object({
  status: z.enum(["accepted", "on_the_way", "arrived", "completed", "cancelled"]),
});

function requestInclude() {
  return {
    customer: {
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
      },
    },
    provider: {
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        providerProfile: true,
      },
    },
    rating: true,
  } satisfies Prisma.ServiceRequestInclude;
}

async function getProviderProfileByUserId(userId: string) {
  const profile = await prisma.providerProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new AppError("Perfil de prestador nao encontrado.", 404);
  }

  return profile;
}

export async function getProviderDashboard(userId: string) {
  const profile = await prisma.providerProfile.findUnique({
    where: { userId },
    include: {
      user: true,
    },
  });

  if (!profile) {
    throw new AppError("Perfil de prestador nao encontrado.", 404);
  }

  const [activeRequest, availableRequests, history, notifications] = await Promise.all([
    prisma.serviceRequest.findFirst({
      where: {
        providerId: userId,
        status: {
          in: [ServiceRequestStatus.accepted, ServiceRequestStatus.on_the_way, ServiceRequestStatus.arrived],
        },
      },
      include: requestInclude(),
      orderBy: { updatedAt: "desc" },
    }),
    listAvailableRequests(userId),
    prisma.serviceRequest.findMany({
      where: {
        providerId: userId,
        status: {
          in: [ServiceRequestStatus.completed, ServiceRequestStatus.cancelled],
        },
      },
      include: requestInclude(),
      take: 5,
      orderBy: { updatedAt: "desc" },
    }),
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
  ]);

  return {
    profile,
    activeRequest,
    availableRequests,
    recentHistory: history,
    notifications,
  };
}

export async function updateProviderProfile(userId: string, payload: unknown) {
  const data = providerProfileSchema.parse(payload);
  const profile = await getProviderProfileByUserId(userId);

  return prisma.providerProfile.update({
    where: { id: profile.id },
    data: {
      ...data,
      state: data.state.toUpperCase(),
    },
  });
}

export async function toggleProviderAvailability(userId: string, payload: unknown) {
  const data = providerOnlineSchema.parse(payload);
  const profile = await getProviderProfileByUserId(userId);

  if (data.isOnline && (!data.currentLatitude || !data.currentLongitude)) {
    throw new AppError("Localizacao atual e obrigatoria para ficar online.", 400);
  }

  return prisma.providerProfile.update({
    where: { id: profile.id },
    data: {
      isOnline: data.isOnline,
      currentLatitude: data.currentLatitude,
      currentLongitude: data.currentLongitude,
    },
  });
}

export async function updateProviderLocation(userId: string, payload: unknown) {
  const data = providerLocationSchema.parse(payload);
  const profile = await getProviderProfileByUserId(userId);

  return prisma.providerProfile.update({
    where: { id: profile.id },
    data: {
      currentLatitude: data.currentLatitude,
      currentLongitude: data.currentLongitude,
    },
  });
}

export async function listAvailableRequests(userId: string) {
  const profile = await prisma.providerProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new AppError("Perfil de prestador nao encontrado.", 404);
  }

  if (!profile.isApproved) {
    return [];
  }

  if (!profile.currentLatitude || !profile.currentLongitude) {
    return [];
  }

  const requests = await prisma.serviceRequest.findMany({
    where: {
      providerId: null,
      status: {
        in: [ServiceRequestStatus.pending, ServiceRequestStatus.broadcasting],
      },
    },
    include: requestInclude(),
    orderBy: { createdAt: "desc" },
  });

  const availableRequests = requests
    .map((request) => {
      const distanceKm = calculateDistanceKm(
        profile.currentLatitude!,
        profile.currentLongitude!,
        request.originLatitude,
        request.originLongitude,
      );

      if (distanceKm > profile.serviceRadiusKm) {
        return null;
      }

      return {
        ...request,
        distanceKm: Number(distanceKm.toFixed(1)),
      };
    })
    .filter(Boolean) as Array<(typeof requests)[number] & { distanceKm: number }>;

  return availableRequests.sort((requestA, requestB) => requestA.distanceKm - requestB.distanceKm);
}

export async function acceptServiceRequest(userId: string, requestId: string) {
  const profile = await getProviderProfileByUserId(userId);

  if (!profile.isApproved) {
    throw new AppError("Seu cadastro ainda nao foi aprovado.", 403);
  }

  if (!profile.isOnline || profile.currentLatitude == null || profile.currentLongitude == null) {
    throw new AppError("Voce precisa estar online para aceitar chamados.", 400);
  }

  return prisma.$transaction(async (transaction) => {
    const request = await transaction.serviceRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new AppError("Chamado nao encontrado.", 404);
    }

    if (request.providerId) {
      throw new AppError("Este chamado ja foi assumido.", 409);
    }

    if (
      request.status === ServiceRequestStatus.completed ||
      request.status === ServiceRequestStatus.cancelled
    ) {
      throw new AppError("Este chamado nao pode mais ser aceito.", 400);
    }

    const distanceKm = calculateDistanceKm(
      profile.currentLatitude!,
      profile.currentLongitude!,
      request.originLatitude,
      request.originLongitude,
    );

    if (distanceKm > profile.serviceRadiusKm) {
      throw new AppError("Este chamado esta fora do seu raio de atendimento.", 400);
    }

    const updatedRequest = await transaction.serviceRequest.update({
      where: { id: requestId },
      data: {
        providerId: userId,
        status: ServiceRequestStatus.accepted,
        acceptedAt: new Date(),
      },
      include: requestInclude(),
    });

    await transaction.notification.create({
      data: {
        userId: request.customerId,
        title: "Chamado aceito",
        message: "Um prestador assumiu seu atendimento e ja iniciou o deslocamento.",
      },
    });

    return updatedRequest;
  });
}

export async function updateRequestStatus(userId: string, requestId: string, payload: unknown) {
  const data = updateStatusSchema.parse(payload);

  const request = await prisma.serviceRequest.findUnique({
    where: { id: requestId },
  });

  if (!request || request.providerId !== userId) {
    throw new AppError("Chamado nao encontrado.", 404);
  }

  const timestamps: Partial<Record<"startedAt" | "completedAt" | "cancelledAt", Date>> = {};

  if (data.status === "on_the_way" && !request.startedAt) {
    timestamps.startedAt = new Date();
  }

  if (data.status === "completed") {
    timestamps.completedAt = new Date();
  }

  if (data.status === "cancelled") {
    timestamps.cancelledAt = new Date();
  }

  const updatedRequest = await prisma.serviceRequest.update({
    where: { id: requestId },
    data: {
      status: data.status,
      ...timestamps,
    },
    include: requestInclude(),
  });

  await prisma.notification.create({
    data: {
      userId: request.customerId,
      title: "Atualizacao do atendimento",
      message: `Seu chamado agora esta em status ${data.status.replaceAll("_", " ")}.`,
    },
  });

  return updatedRequest;
}

export async function listProviderHistory(userId: string) {
  return prisma.serviceRequest.findMany({
    where: {
      providerId: userId,
    },
    include: requestInclude(),
    orderBy: { updatedAt: "desc" },
  });
}
