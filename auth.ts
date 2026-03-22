import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      // Avoid OIDC discovery on the callback: Google's discovery advertises
      // authorization_response_iss_parameter_supported, but the auth redirect
      // often omits `iss`, which oauth4webapi rejects (CallbackRouteError).
      token: "https://oauth2.googleapis.com/token",
      userinfo: "https://openidconnect.googleapis.com/v1/userinfo",
    }),
  ],
  useSecureCookies: false,
});
