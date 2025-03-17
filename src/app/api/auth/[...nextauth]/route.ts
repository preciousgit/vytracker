import NextAuth, { NextAuthOptions, Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";

// ✅ Extend JWT Type to include `accessToken`
interface CustomJWT extends JWT {
  accessToken?: string;
}

// ✅ Extend Session Type to include `accessToken`
interface CustomSession extends Session {
  accessToken?: string;
}

// ✅ Extend User Type to include `token`, but keep it optional
interface CustomUser extends User {
  token?: string;
}

// ✅ Define NextAuth Options
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // ✅ Send request to your backend
        const res = await fetch("https://your-backend.com/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });

        const user = await res.json();

        if (!res.ok) return null;

        return { ...user, token: user.token } as CustomUser; // ✅ Ensure token is included
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: CustomJWT; user?: CustomUser }) {
      if (user?.token) {
        token.accessToken = user.token; // ✅ Store token safely
      }
      return token;
    },
    async session({ session, token }: { session: CustomSession; token: CustomJWT }) {
      session.accessToken = token.accessToken; // ✅ Ensure session contains token
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // ✅ Use environment variable for security
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
