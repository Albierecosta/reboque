import { Prisma, ServiceRequestStatus } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/app-error.js";

const approvalSchema = z.object({
  isApproved: z.boolean(),
});

const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  active: z.boolean().default(true),
});

function requestInclude() {
  return {
    customer: {
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
      },
    },
    provider: {
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        providerProfile: true,
      },
    },
    rating: true,
  } satisfies Prisma.ServiceRequestInclude;
}

export async function getAdminDashboard() {
  const [usersCount, providerCounts, requestCounts, latestRequests] = await Promise.all([
    prisma.user.count(),
    prisma.providerProfile.groupBy({
      by: ["isApproved"],
      _count: true,
    }),
    prisma.serviceRequest.groupBy({
      by: ["status"],
      _count: true,
    }),
    prisma.serviceRequest.findMany({
      include: requestInclude(),
      take: 8,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const metrics = {
    usersCount,
    providersApproved: providerCounts.find((item) => item.isApproved)?._count ?? 0,
    providersPending: providerCounts.find((item) => !item.isApproved)?._count ?? 0,
    requestsByStatus: Object.values(ServiceRequestStatus).reduce<Record<string, number>>(
      (accumulator, status) => ({
        ...accumulator,
        [status]: requestCounts.find((item) => item.status === status)?._count ?? 0,
      }),
      {},
    ),
  };

  return {
    metrics,
    latestRequests,
  };
}

export async function listUsers() {
  return prisma.user.findMany({
    include: {
      providerProfile: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function listProviders() {
  return prisma.providerProfile.findMany({
    include: {
      user: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateProviderApproval(userId: string, payload: unknown) {
  const data = approvalSchema.parse(payload);

  const profile = await prisma.providerProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new AppError("Prestador nao encontrado.", 404);
  }

  return prisma.providerProfile.update({
    where: { userId },
    data: {
      isApproved: data.isApproved,
    },
  });
}

export async function listAllServiceRequests() {
  return prisma.serviceRequest.findMany({
    include: requestInclude(),
    orderBy: { createdAt: "desc" },
  });
}

export async function listRegions() {
  const providers = await prisma.providerProfile.groupBy({
    by: ["city", "state"],
    _count: true,
    orderBy: [{ state: "asc" }, { city: "asc" }],
  });

  return providers.map((region) => ({
    city: region.city,
    state: region.state,
    providers: region._count,
  }));
}

export async function createServiceCategory(payload: unknown) {
  const data = categorySchema.parse(payload);

  return prisma.serviceCategory.create({
    data,
  });
}

export async function updateServiceCategory(categoryId: string, payload: unknown) {
  const data = categorySchema.partial().parse(payload);

  return prisma.serviceCategory.update({
    where: { id: categoryId },
    data,
  });
}

export async function listServiceCategoriesForAdmin() {
  return prisma.serviceCategory.findMany({
    orderBy: { name: "asc" },
  });
}
