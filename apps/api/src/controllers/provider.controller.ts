import { Request, Response } from "express";
import {
  acceptServiceRequest,
  getProviderDashboard,
  listAvailableRequests,
  listProviderHistory,
  toggleProviderAvailability,
  updateProviderLocation,
  updateProviderProfile,
  updateRequestStatus,
} from "../services/provider.service.js";

export async function dashboard(request: Request, response: Response) {
  const result = await getProviderDashboard(request.auth!.userId);
  return response.json(result);
}

export async function availableRequests(request: Request, response: Response) {
  const result = await listAvailableRequests(request.auth!.userId);
  return response.json(result);
}

export async function accept(request: Request, response: Response) {
  const requestId = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
  const result = await acceptServiceRequest(request.auth!.userId, requestId);
  return response.json(result);
}

export async function updateStatus(request: Request, response: Response) {
  const requestId = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
  const result = await updateRequestStatus(request.auth!.userId, requestId, request.body);
  return response.json(result);
}

export async function history(request: Request, response: Response) {
  const result = await listProviderHistory(request.auth!.userId);
  return response.json(result);
}

export async function updateProfile(request: Request, response: Response) {
  const result = await updateProviderProfile(request.auth!.userId, request.body);
  return response.json(result);
}

export async function availability(request: Request, response: Response) {
  const result = await toggleProviderAvailability(request.auth!.userId, request.body);
  return response.json(result);
}

export async function location(request: Request, response: Response) {
  const result = await updateProviderLocation(request.auth!.userId, request.body);
  return response.json(result);
}
