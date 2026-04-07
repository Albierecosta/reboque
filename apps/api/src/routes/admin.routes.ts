import { Router } from "express";
import {
  approveProvider,
  categories,
  createCategory,
  dashboard,
  providers,
  regions,
  requests,
  updateCategory,
  users,
} from "../controllers/admin.controller.js";
import { authorize, ensureAuthenticated } from "../middlewares/auth.js";

export const adminRouter = Router();

adminRouter.use(ensureAuthenticated, authorize(["admin"]));
adminRouter.get("/dashboard", dashboard);
adminRouter.get("/users", users);
adminRouter.get("/providers", providers);
adminRouter.patch("/providers/:userId/approval", approveProvider);
adminRouter.get("/service-requests", requests);
adminRouter.get("/regions", regions);
adminRouter.get("/service-categories", categories);
adminRouter.post("/service-categories", createCategory);
adminRouter.patch("/service-categories/:id", updateCategory);
