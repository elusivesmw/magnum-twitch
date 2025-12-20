import { DefaultSession } from 'next-auth';
import { DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  export interface Session extends DefaultSession {
    accessToken?: string;
    idToken?: string;
    userId?: string;
    error?: string;
  }

  export interface JWT extends DefaultJWT {
    accessToken?: string;
    idToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    userId?: string;
    error?: string;
  }
}
