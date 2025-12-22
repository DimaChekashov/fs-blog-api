import { AuthController } from "@/controllers/auth.controller.ts";
import { TokenRepository } from "@/repositories/token.repository.ts";
import { UserRepository } from "@/repositories/user.repository.ts";
import { AuthService } from "@/services/auth.service.ts";
import { Router } from "express";

const authRepository = new UserRepository();
const tokenRepository = new TokenRepository();
const authService = new AuthService(authRepository, tokenRepository);
const authController = new AuthController(authService);

const authRouter = Router();

authRouter.post("/register", authController.register);

authRouter.post("/login", authController.login);

authRouter.post("/logout", authController.logout);

authRouter.post("/refresh", authController.refresh);

authRouter.get("/me", authController.me);

export default authRouter;
