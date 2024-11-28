import { compare } from "bcryptjs";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { getUserByEmail } from "./commenQueries/getUserByEmail";
import { LoginFormSchema } from "./zod/LoginFormSchema";

const authOption: AuthOptions = {
  session: {
    strategy: "jwt",
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
      console.log(user);
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
        },
      };
    },
  },
};

export { authOption };
