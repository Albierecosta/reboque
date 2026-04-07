import { Request, Response } from "express";
import { getAuthenticatedUser, loginUser, registerUser } from "../services/auth.service.js";

export async function register(request: Request, response: Response) {
  const result = await registerUser(request.body);
  return response.status(201).json(result);
}

export async function login(request: Request, response: Response) {
  const result = await loginUser(request.body);
  return response.json(result);
}

export async function me(request: Request, response: Response) {
  const result = await getAuthenticatedUser(request.auth!.userId);
  return response.json(result);
}
