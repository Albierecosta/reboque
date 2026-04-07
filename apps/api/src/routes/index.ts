import { Router } from "express";
import { authRouter } from "./auth.routes.js";
import { serviceRequestRouter } from "./service-request.routes.js";
import { providerRouter } from "./provider.routes.js";
import { adminRouter } from "./admin.routes.js";

export const router = Router();

router.get("/health", (_request, response) => {
  response.json({
    status: "ok",
    service: "altum-sistemas-reboque-api",
  });
});

router.use("/auth", authRouter);
router.use("/service-requests", serviceRequestRouter);
router.use("/provider", providerRouter);
router.use("/admin", adminRouter);
