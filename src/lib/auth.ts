import { AuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
    }
  }
}

// Extend JWT type
declare module "next-auth/jwt" {
  interface JWT {
    _id: string;
  }
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          await connectMongoDB();
          const user = await User.findOne({ email: credentials.email });

          if (user) {
            const passwordsMatch = await bcrypt.compare(credentials.password, user.password);
            if (passwordsMatch) {
              return {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
              };
            }
          }
          
          // In development, allow login with any credentials
          if (process.env.NODE_ENV === 'development') {
            console.log("Development mode - allowing login with email:", credentials.email);
            return {
              id: 'dev-user-' + credentials.email + '-' + Date.now(),
              name: credentials.email.split('@')[0],
              email: credentials.email,
            };
          }
          
          return null;
        } catch (error) {
          console.error("Error during authentication:", error);
          // Allow dev users to test without MongoDB
          if (process.env.NODE_ENV === 'development') {
            console.log("Development mode - DB error, allowing login anyway");
            return {
              id: 'dev-user-' + Date.now(),
              name: credentials.email.split('@')[0],
              email: credentials.email,
            };
          }
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Redirect to study-plan after successful sign in
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/study-plan`;
    },
  },
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-dev-only-change-in-production',
};