import { Prisma, ServiceRequestStatus, ServiceType, UserRole } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/app-error.js";
import { calculateDistanceKm } from "../utils/geo.js";

const createServiceRequestSchema = z.object({
  serviceType: z.enum([
    "reboque",
    "pane_mecanica",
    "bateria_descarregada",
    "pneu_furado",
    "pane_seca",
    "chaveiro_automotivo",
    "outro",
  ]),
  problemDescription: z.string().min(5),
  originAddress: z.string().min(5),
  originLatitude: z.coerce.number(),
  originLongitude: z.coerce.number(),
  destinationAddress: z.string().min(5),
  destinationLatitude: z.coerce.number().optional(),
  destinationLongitude: z.coerce.number().optional(),
  contactPhone: z.string().min(8),
});

const ratingSchema = z.object({
  score: z.coerce.number().int().min(1).max(5),
  comment: z.string().max(400).optional(),
});

type ProviderMatch = {
  id: string;
  name: string;
  businessName: string;
  distanceKm: number;
  serviceRadiusKm: number;
};

const defaultServiceCategories = [
  {
    id: "default-reboque",
    name: "Reboque",
    slug: "reboque",
    description: "Transporte e remocao veicular.",
    active: true,
  },
  {
    id: "default-pane-mecanica",
    name: "Pane mecânica",
    slug: "pane_mecanica",
    description: "Atendimento basico emergencial.",
    active: true,
  },
  {
    id: "default-bateria",
    name: "Bateria descarregada",
    slug: "bateria_descarregada",
    description: "Auxilio com partida e bateria.",
    active: true,
  },
  {
    id: "default-pneu",
    name: "Pneu furado",
    slug: "pneu_furado",
    description: "Troca ou apoio no pneu.",
    active: true,
  },
  {
    id: "default-pane-seca",
    name: "Pane seca",
    slug: "pane_seca",
    description: "Auxilio por falta de combustivel.",
    active: true,
  },
  {
    id: "default-chaveiro",
    name: "Chaveiro automotivo",
    slug: "chaveiro_automotivo",
    description: "Abertura e suporte com chaves.",
    active: true,
  },
  {
    id: "default-outro",
    name: "Outro",
    slug: "outro",
    description: "Demandas especiais.",
    active: true,
  },
] as const;

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

async function findMatchingProviders(originLatitude: number, originLongitude: number) {
  const providers = await prisma.providerProfile.findMany({
    where: {
      isApproved: true,
      isOnline: true,
      currentLatitude: { not: null },
      currentLongitude: { not: null },
    },
    include: {
      user: true,
    },
  });

  const matches = providers
    .map<ProviderMatch | null>((provider) => {
      if (provider.currentLatitude == null || provider.currentLongitude == null) {
        return null;
      }

      const distanceKm = calculateDistanceKm(
        originLatitude,
        originLongitude,
        provider.currentLatitude,
        provider.currentLongitude,
      );

      if (distanceKm > provider.serviceRadiusKm) {
        return null;
      }

      return {
        id: provider.userId,
        name: provider.user.name,
        businessName: provider.businessName,
        distanceKm: Number(distanceKm.toFixed(1)),
        serviceRadiusKm: provider.serviceRadiusKm,
      };
    })
    .filter((provider): provider is ProviderMatch => provider !== null)
    .sort((providerA, providerB) => providerA.distanceKm - providerB.distanceKm);

  return matches;
}

export async function createServiceRequest(customerId: string, payload: unknown) {
  const data = createServiceRequestSchema.parse(payload);
  const providers = await findMatchingProviders(data.originLatitude, data.originLongitude);

  const request = await prisma.serviceRequest.create({
    data: {
      customerId,
      serviceType: data.serviceType as ServiceType,
      problemDescription: data.problemDescription,
      originAddress: data.originAddress,
      originLatitude: data.originLatitude,
      originLongitude: data.originLongitude,
      destinationAddress: data.destinationAddress,
      destinationLatitude: data.destinationLatitude,
      destinationLongitude: data.destinationLongitude,
      contactPhone: data.contactPhone,
      status: providers.length ? ServiceRequestStatus.broadcasting : ServiceRequestStatus.pending,
      estimatedPrice:
        data.serviceType === "reboque" ? 280 : data.serviceType === "pane_mecanica" ? 190 : 140,
    },
    include: requestInclude(),
  });

  if (providers.length) {
    await prisma.notification.createMany({
      data: providers.map((provider) => ({
        userId: provider.id,
        title: "Novo chamado disponivel",
        message: `${data.serviceType.replaceAll("_", " ")} em ${data.originAddress}`,
      })),
    });
  }

  return {
    request,
    matchedProviders: providers,
  };
}

export async function listCustomerRequests(customerId: string) {
  return prisma.serviceRequest.findMany({
    where: { customerId },
    include: requestInclude(),
    orderBy: { createdAt: "desc" },
  });
}

export async function getServiceRequestById(
  requestId: string,
  userId: string,
  role: UserRole | "customer" | "provider" | "admin",
) {
  const request = await prisma.serviceRequest.findUnique({
    where: { id: requestId },
    include: requestInclude(),
  });

  if (!request) {
    throw new AppError("Chamado nao encontrado.", 404);
  }

  const userCanAccess =
    role === "admin" ||
    request.customerId === userId ||
    request.providerId === userId ||
    (role === "provider" && request.providerId == null);

  if (!userCanAccess) {
    throw new AppError("Voce nao pode acessar este chamado.", 403);
  }

  return request;
}

export async function cancelServiceRequest(requestId: string, customerId: string) {
  const request = await prisma.serviceRequest.findUnique({
    where: { id: requestId },
  });

  if (!request || request.customerId !== customerId) {
    throw new AppError("Chamado nao encontrado.", 404);
  }

  if (
    request.status === ServiceRequestStatus.completed ||
    request.status === ServiceRequestStatus.cancelled
  ) {
    throw new AppError("Nao e possivel cancelar este chamado.", 400);
  }

  return prisma.serviceRequest.update({
    where: { id: requestId },
    data: {
      status: ServiceRequestStatus.cancelled,
      cancelledAt: new Date(),
    },
    include: requestInclude(),
  });
}

export async function rateServiceRequest(requestId: string, customerId: string, payload: unknown) {
  const data = ratingSchema.parse(payload);

  const request = await prisma.serviceRequest.findUnique({
    where: { id: requestId },
  });

  if (!request || request.customerId !== customerId) {
    throw new AppError("Chamado nao encontrado.", 404);
  }

  if (!request.providerId) {
    throw new AppError("O chamado ainda nao possui um prestador vinculado.", 400);
  }

  if (request.status !== ServiceRequestStatus.completed) {
    throw new AppError("A avaliacao so pode ser enviada apos a conclusao.", 400);
  }

  return prisma.rating.upsert({
    where: { serviceRequestId: requestId },
    create: {
      serviceRequestId: requestId,
      customerId,
      providerId: request.providerId,
      score: data.score,
      comment: data.comment,
    },
    update: {
      score: data.score,
      comment: data.comment,
    },
  });
}

export async function listServiceCategories() {
  const categories = await prisma.serviceCategory.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });

  if (categories.length > 0) {
    return categories;
  }

  return defaultServiceCategories;
}
