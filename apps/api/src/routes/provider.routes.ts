import { Router } from "express";
import {
  accept,
  availability,
  availableRequests,
  dashboard,
  history,
  location,
  updateProfile,
  updateStatus,
} from "../controllers/provider.controller.js";
import { authorize, ensureAuthenticated } from "../middlewares/auth.js";

export const providerRouter = Router();

providerRouter.use(ensureAuthenticated, authorize(["provider"]));
providerRouter.get("/dashboard", dashboard);
providerRouter.get("/service-requests/available", availableRequests);
providerRouter.post("/service-requests/:id/accept", accept);
providerRouter.patch("/service-requests/:id/status", updateStatus);
providerRouter.get("/history", history);
providerRouter.patch("/profile", updateProfile);
providerRouter.patch("/availability", availability);
providerRouter.patch("/location", location);
