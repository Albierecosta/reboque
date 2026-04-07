import { Request, Response } from "express";
import {
  cancelServiceRequest,
  createServiceRequest,
  getServiceRequestById,
  listCustomerRequests,
  listServiceCategories,
  rateServiceRequest,
} from "../services/service-request.service.js";

export async function create(request: Request, response: Response) {
  const result = await createServiceRequest(request.auth!.userId, request.body);
  return response.status(201).json(result);
}

export async function listMine(request: Request, response: Response) {
  const result = await listCustomerRequests(request.auth!.userId);
  return response.json(result);
}

export async function show(request: Request, response: Response) {
  const requestId = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
  const result = await getServiceRequestById(
    requestId,
    request.auth!.userId,
    request.auth!.role,
  );

  return response.json(result);
}

export async function cancel(request: Request, response: Response) {
  const requestId = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
  const result = await cancelServiceRequest(requestId, request.auth!.userId);
  return response.json(result);
}

export async function rate(request: Request, response: Response) {
  const requestId = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
  const result = await rateServiceRequest(requestId, request.auth!.userId, request.body);
  return response.status(201).json(result);
}

export async function categories(_request: Request, response: Response) {
  const result = await listServiceCategories();
  return response.json(result);
}
