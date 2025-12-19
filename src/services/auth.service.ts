import type {
  AuthResponse,
  CreateUserDto,
  LoginUserDto,
  LoginUserSchema,
} from "@/models/user.model.ts";
import type { UserRepository } from "@/repositories/user.repository.ts";
import { comparePassword, createTokens, hashPassword } from "@/utils/auth.ts";
import { ApiError } from "@/utils/errors.ts";

export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private jwtSecret: string = process.env.JWT_SECRET_KEY ||
      "your-secret-key-here",
    private refreshSecret: string = process.env.JWT_REFRESH_SECRET_KEY ||
      "your-refresh-secret-here"
  ) {}

  async register(userData: CreateUserDto): Promise<AuthResponse> {
    const user = await this.userRepository.findOne(
      userData.email,
      userData.username
    );

    if (user !== null) {
      throw new ApiError(
        409,
        "User with that username or email is already exists!"
      );
    }

    const newHashedPassword = await hashPassword(userData.password);

    const { hashedPassword, ...userWithoutHash } =
      await this.userRepository.create(userData, newHashedPassword);

    return {
      user: userWithoutHash,
      tokens: createTokens(
        userWithoutHash,
        this.jwtSecret,
        15 * 60,
        this.refreshSecret,
        60 * 60 * 24 * 7
      ),
    };
  }

  async login(credentials: LoginUserDto): Promise<AuthResponse> {
    const user = await this.userRepository.findOne(credentials.email);

    if (user === null) {
      throw new ApiError(400, "Wrong email!");
    }

    const isMatch = await comparePassword(
      credentials.password,
      user.hashedPassword
    );

    if (!isMatch) {
      throw new ApiError(400, "Wrong password!");
    }

    const { hashedPassword, ...userWithoutHash } = user;

    return {
      user: userWithoutHash,
      tokens: createTokens(
        userWithoutHash,
        this.jwtSecret,
        15 * 60,
        this.refreshSecret,
        60 * 60 * 24 * 7
      ),
    };
  }

  // async logout(userId: number): Promise<void> {}
}
