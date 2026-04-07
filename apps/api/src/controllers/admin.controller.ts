import { Request, Response } from "express";
import {
  createServiceCategory,
  getAdminDashboard,
  listAllServiceRequests,
  listProviders,
  listRegions,
  listServiceCategoriesForAdmin,
  listUsers,
  updateProviderApproval,
  updateServiceCategory,
} from "../services/admin.service.js";

export async function dashboard(_request: Request, response: Response) {
  const result = await getAdminDashboard();
  return response.json(result);
}

export async function users(_request: Request, response: Response) {
  const result = await listUsers();
  return response.json(result);
}

export async function providers(_request: Request, response: Response) {
  const result = await listProviders();
  return response.json(result);
}

export async function requests(_request: Request, response: Response) {
  const result = await listAllServiceRequests();
  return response.json(result);
}

export async function regions(_request: Request, response: Response) {
  const result = await listRegions();
  return response.json(result);
}

export async function approveProvider(request: Request, response: Response) {
  const userId = Array.isArray(request.params.userId) ? request.params.userId[0] : request.params.userId;
  const result = await updateProviderApproval(userId, request.body);
  return response.json(result);
}

export async function categories(_request: Request, response: Response) {
  const result = await listServiceCategoriesForAdmin();
  return response.json(result);
}

export async function createCategory(request: Request, response: Response) {
  const result = await createServiceCategory(request.body);
  return response.status(201).json(result);
}

export async function updateCategory(request: Request, response: Response) {
  const categoryId = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
  const result = await updateServiceCategory(categoryId, request.body);
  return response.json(result);
}
