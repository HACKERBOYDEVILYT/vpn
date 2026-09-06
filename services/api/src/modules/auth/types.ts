import type { User } from "@nexavpn/types";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthenticatedUser extends User {
  sessionId: string;
}

export interface AuthContext {
  user: AuthenticatedUser;
  sessionId: string;
}
