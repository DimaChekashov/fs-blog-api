import { validateBody } from "@/middlewares/validate-body.middleware.ts";
import { CreateUserSchema } from "@/models/user.model.ts";
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
      })
    },
  ];

  login(req: Request, res: Response) {}

  logout(req: Request, res: Response) {}

  refresh(req: Request, res: Response) {}

  me(req: Request, res: Response) {}
}
