import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      tenantId: string;
      role: "ADMIN" | "OPERATOR" | "VIEWER";
    };
  }

  interface User {
    tenantId: string;
    role: "ADMIN" | "OPERATOR" | "VIEWER";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    tenantId?: string;
    role?: "ADMIN" | "OPERATOR" | "VIEWER";
  }
}
