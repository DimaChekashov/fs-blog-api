import { AuthController } from "@/controllers/auth.conroller.ts";
import { UserRepository } from "@/repositories/user.repository.ts";
import { AuthService } from "@/services/auth.service.ts";
import { Router } from "express";

const authRepository = new UserRepository();
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

const authRouter = Router();

authRouter.post("/register", authController.register);

authRouter.post("/login", authController.login);

authRouter.post("/logout", authController.logout);

authRouter.post("/refresh", authController.refresh);

authRouter.get("/me", authController.me);

export default authRouter;
