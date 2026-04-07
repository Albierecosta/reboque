import { Router } from "express";
import { login, me, register } from "../controllers/auth.controller.js";
import { ensureAuthenticated } from "../middlewares/auth.js";

export const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/me", ensureAuthenticated, me);
