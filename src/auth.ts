import NextAuth from 'next-auth';
import TwitchProvider from 'next-auth/providers/twitch';

const TWITCH_CLIENT_ID = process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;

export const { auth, handlers, signIn, signOut } = NextAuth({
  debug: true,
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
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.idToken = account.id_token;
        token.userId = account.providerAccountId;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.idToken = token.idToken as string;
      session.userId = token.userId as string;
      return session;
    },
  },
});
