import type {
  AuthResponse,
  CreateUserDto,
  LoginUserSchema,
} from "@/models/user.model.ts";
import type { UserRepository } from "@/repositories/user.repository.ts";
import { comparePassword, hashPassword } from "@/utils/auth.ts";
import { ApiError } from "@/utils/errors.ts";

export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private jwtSecret: string = process.env.JWT_SECRET_KEY || "jwt-secret",
    private refreshSecret: string = process.env.JWT_REFRESH_SECRET_KEY ||
      "jwt-refresh-secret"
  ) {}

  async register(userData: CreateUserDto): Promise<AuthResponse> {
    const user = await this.userRepository.findOne(userData.email);

    if (user !== null) {
      throw new ApiError(
        409,
        "User with that username, email or password already exists!"
      );
    }

    const newHashedPassword = await hashPassword(userData.password);

    const { hashedPassword, ...userWithoutHash } =
      await this.userRepository.create(userData, newHashedPassword);

    return {
      user: userWithoutHash,
    };
  }

  // async login(credentials: LoginUserSchema): Promise<AuthResponse> {
  //   const isMatch = await comparePassword(credentials.password, hashedPassword);
  // }

  // async logout(userId: number): Promise<void> {}
}
