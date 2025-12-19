import type { AuthResponse } from "@/models/user.model.ts";
import type { UserRepository } from "@/repositories/user.repository.ts";
import { createToken } from "@/utils/auth.ts";

export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private jwtSecret: string = "sectet",
    private refreshSecret: string = "refresh-secret"
  ) {}

  async register(userData): Promise<AuthResponse> {
    createToken();
  }

  async login(credentials): Promise<AuthResponse> {}

  async logout(userId: number): Promise<void> {}
}
