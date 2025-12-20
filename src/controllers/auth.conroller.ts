import { auth } from "@/middlewares/auth.middleware.ts";
import { validateBody } from "@/middlewares/validate-body.middleware.ts";
import {
  CreateUserSchema,
  LoginUserSchema,
  RefreshTokenSchema,
  UpdateAccessTokenSchema,
} from "@/models/user.model.ts";
import type { AuthService } from "@/services/auth.service.ts";
import type { Request, Response } from "express";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = [
    validateBody(CreateUserSchema),
    async (req: Request, res: Response) => {
      const userData = req.body;

      const newUser = await this.authService.register(userData);

      res.status(201).json({
        success: true,
        data: newUser,
      });
    },
  ];

  login = [
    validateBody(LoginUserSchema),
    async (req: Request, res: Response) => {
      const userData = req.body;

      const user = await this.authService.login(userData);

      res.status(200).json({
        success: true,
        data: user,
      });
    },
  ];

  logout = [auth, async (req: Request, res: Response) => {}];

  refresh = [
    validateBody(UpdateAccessTokenSchema),
    async (req: Request, res: Response) => {
      const { refreshToken } = req.body;

      const accessTokenResponse = await this.authService.refresh(refreshToken);

      res.status(200).json({
        success: true,
        data: accessTokenResponse,
      });
    },
  ];

  me = [
    auth,
    async (req: Request, res: Response) => {
      const { sub } = req.user;

      const user = await this.authService.me(sub);

      res.json({
        success: true,
        data: user,
      });
    },
  ];
}
