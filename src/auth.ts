import NextAuth, { JWT } from 'next-auth';
import TwitchProvider from 'next-auth/providers/twitch';

const TWITCH_CLIENT_ID = process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID ?? '';
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET ?? '';

export const { auth, handlers, signIn, signOut } = NextAuth({
  debug: process.env.NODE_ENV !== 'production',
  providers: [
    TwitchProvider({
      clientId: TWITCH_CLIENT_ID,
      clientSecret: TWITCH_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'openid user:read:email user:read:follows',
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.idToken = account.id_token;
        token.userId = account.providerAccountId;
        token.expiresAt = account.expires_at;
        return token;
      }

      //const now = Math.floor(Date.now() / 1000);
      //console.log('expiresIn', (token.expiresAt as number) - now);
      if (Date.now() < (token.expiresAt as number) * 1000) {
        return token;
      }

      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.idToken = token.idToken as string;
      session.userId = token.userId as string;
      return session;
    },
  },
});

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const response = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: TWITCH_CLIENT_ID,
        client_secret: TWITCH_CLIENT_SECRET,
        refresh_token: token.refreshToken ?? '',
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      refreshToken: refreshedTokens.refresh_token,
      expiresAt: Math.floor(Date.now() / 1000) + refreshedTokens.expires_in,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Failed to refresh access token', error.message);
    }

    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}
