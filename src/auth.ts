import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Workspace Login",
      credentials: {
        email: { label: "Email", type: "email" },
        tenantSlug: { label: "Tenant Slug", type: "text" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toString().trim().toLowerCase();
        const tenantSlug = credentials?.tenantSlug?.toString().trim().toLowerCase();

        if (!email || !tenantSlug) return null;

        const tenant = await prisma.tenant.findUnique({ where: { slug: tenantSlug } });
        if (!tenant) return null;

        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              name: email.split("@")[0],
            },
          });
        }

        let membership = await prisma.tenantMembership.findUnique({
          where: { tenantId_userId: { tenantId: tenant.id, userId: user.id } },
        });

        // bootstrap: first member of a tenant becomes ADMIN
        if (!membership) {
          const existingCount = await prisma.tenantMembership.count({
            where: { tenantId: tenant.id },
          });

          membership = await prisma.tenantMembership.create({
            data: {
              tenantId: tenant.id,
              userId: user.id,
              role: existingCount === 0 ? "ADMIN" : "VIEWER",
            },
          });
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          tenantId: tenant.id,
          role: membership.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.tenantId = user.tenantId;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (
        session.user &&
        typeof token.sub === "string" &&
        typeof token.tenantId === "string" &&
        (token.role === "ADMIN" || token.role === "OPERATOR" || token.role === "VIEWER")
      ) {
        session.user.id = token.sub;
        session.user.tenantId = token.tenantId;
        session.user.role = token.role;
      }
      return session;
    },
  },
  trustHost: true,
});
