import { Router } from "express";
import { categories, cancel, create, listMine, rate, show } from "../controllers/service-request.controller.js";
import { authorize, ensureAuthenticated } from "../middlewares/auth.js";

export const serviceRequestRouter = Router();

serviceRequestRouter.get("/categories", categories);
serviceRequestRouter.use(ensureAuthenticated);
serviceRequestRouter.post("/", authorize(["customer"]), create);
serviceRequestRouter.get("/mine", authorize(["customer"]), listMine);
serviceRequestRouter.get("/:id", show);
serviceRequestRouter.patch("/:id/cancel", authorize(["customer"]), cancel);
serviceRequestRouter.post("/:id/rate", authorize(["customer"]), rate);
