import { compare } from "bcryptjs";
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";
import { unstable_noStore } from "next/cache";
import { AuthOptions, DefaultSession, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { getUserByEmail } from "./commenQueries/getUserByEmail";
import { LoginFormSchema } from "./zod/LoginFormSchema";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      userId: string;
      role: string;
    } & DefaultSession["user"];
  }
}

const authOption: AuthOptions = {
  // adapter: DrizzleAdapter(db),
  session: {
    strategy: "jwt",
    maxAge: 12 * 60 * 60, // 12h
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Sign In",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const validateLoginData = LoginFormSchema.safeParse(credentials);
        if (validateLoginData.success) {
          const { email, password } = validateLoginData.data;
          const user = await getUserByEmail(email);
          if (!user) {
            return null;
          }
          const isPassowrdCorrect = await compare(password, user.password);
          if (!isPassowrdCorrect) {
            return null;
          }
          return user;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.userId = token.id as string;
        session.user.role = token.role as "ADMIN" | "USER";
      }
      return session;
    },
  },
} satisfies AuthOptions;

// // Use it in server contexts
export async function auth(
  ...args: [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]] | [NextApiRequest, NextApiResponse] | []
) {
  unstable_noStore();
  const session = await getServerSession(...args, authOption);
  return { getUser: () => session?.user && { userId: session.user.userId, role: session.user.role } };
}

export { authOption };

//-----------------------------------

// import { DrizzleAdapter } from "@auth/drizzle-adapter";
// import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";
// import { unstable_noStore } from "next/cache";
// import { AuthOptions, DefaultSession, getServerSession } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";

// import { db } from "@/db";

// declare module "next-auth" {
//   interface Session extends DefaultSession {
//     user: {
//       id: string;
//     } & DefaultSession["user"];
//   }
// }

// export const authConfig = {
//   adapter: DrizzleAdapter(db),
//   session: {
//     strategy: "jwt",
//   },
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_ID!,
//       clientSecret: process.env.GOOGLE_SECRET!,
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       const dbUser = await db.query.users.findFirst({
//         where: (users, { eq }) => eq(users.email, token.email!),
//       });

//       if (!dbUser) {
//         throw new Error("no user with email found");
//       }

//       return {
//         id: dbUser.id,
//         name: dbUser.name,
//         email: dbUser.email,
//         picture: dbUser.image,
//       };
//     },
//     async session({ token, session }) {
//       if (token) {
//         session.user.id = token.id as string;
//         session.user.name = token.name;
//         session.user.email = token.email;
//         session.user.image = token.picture;
//       }

//       return session;
//     },
//   },
// } satisfies AuthOptions;

// // Use it in server contexts
// export async function auth(
//   ...args: [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]] | [NextApiRequest, NextApiResponse] | []
// ) {
//   unstable_noStore();
//   const session = await getServerSession(...args, authConfig);
//   return { getUser: () => session?.user && { userId: session.user.id } };
// }
