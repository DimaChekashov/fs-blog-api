import jwt from "jsonwebtoken";
import type {
  AccessToken,
  AccessTokenResponse,
  AuthResponse,
  CreateUserDto,
  LoginUserDto,
  RefreshToken,
  UserResponse,
} from "@/models/user.model.ts";
import type { UserRepository } from "@/repositories/user.repository.ts";
import {
  comparePassword,
  createToken,
  createTokens,
  getTokenExpiresAt,
  hashPassword,
} from "@/utils/auth.ts";
import { ApiError } from "@/utils/errors.ts";
import { jwtSecret, refreshSecret } from "@/consts.ts";
import type { TokenRepository } from "@/repositories/token.repository.ts";

export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenRepository: TokenRepository
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
      tokens: createTokens({ sub: userWithoutHash.id }, 15 * 60),
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
      tokens: createTokens({ sub: userWithoutHash.id }, 15 * 60),
    };
  }

  async me(userId: number): Promise<UserResponse> {
    const user = await this.userRepository.findOneById(userId);

    const { hashedPassword, ...userWithoutHash } = user;

    return userWithoutHash;
  }

  async refresh(refreshToken: RefreshToken): Promise<AccessTokenResponse> {
    const isTokenBlacklisted = await this.tokenRepository.isTokenBlacklisted(
      refreshToken
    );
    if (isTokenBlacklisted) {
      throw new ApiError(401, "Refresh token revoked!");
    }

    try {
      const decoded = jwt.verify(refreshToken, refreshSecret);

      const newAccessToken = createToken(
        { sub: decoded.sub },
        jwtSecret,
        15 * 60
      );

      return {
        accessToken: newAccessToken,
      };
    } catch (error) {
      throw new ApiError(401, "Invalid or expired refresh token!");
    }
  }

  async logout(accessToken: AccessToken, refreshToken: RefreshToken) {
    try {
      const accessTokenExpiresAt = getTokenExpiresAt(accessToken, jwtSecret);
      this.tokenRepository.blacklistToken(accessToken, accessTokenExpiresAt);

      const refreshTokenExpiresAt = getTokenExpiresAt(
        refreshToken,
        refreshSecret
      );
      this.tokenRepository.blacklistToken(refreshToken, refreshTokenExpiresAt);
    } catch (error) {
      throw new ApiError(401, "Invalid or expired access or refresh token!");
    }
  }
}
