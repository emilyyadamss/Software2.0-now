import { auth } from "@/auth";

export type RequestContext = {
  userId: string;
  tenantId: string;
  role: "ADMIN" | "OPERATOR" | "VIEWER";
};

export async function getRequestContext(): Promise<RequestContext> {
  const session = await auth();

  if (!session?.user?.id || !session.user.tenantId || !session.user.role) {
    throw new Error("UNAUTHORIZED");
  }

  return {
    userId: session.user.id,
    tenantId: session.user.tenantId,
    role: session.user.role,
  };
}
