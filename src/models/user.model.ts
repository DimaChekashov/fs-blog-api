export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

export interface AuthResponse {
  user: Omit<User, "password_hash">;
  tokens: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  };
}
