import type { UserRepository } from "@/repositories/user.repository.ts";

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
}
