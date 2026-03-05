import { headers } from "next/headers";

export type RequestContext = {
  userId: string;
  tenantId: string;
  role: "ADMIN" | "OPERATOR" | "VIEWER";
};

/**
 * TODO: Replace this with NextAuth/session-derived tenant context.
 * For now, this allows local testing with headers:
 * - x-user-id
 * - x-tenant-id
 * - x-role (ADMIN|OPERATOR|VIEWER)
 */
export async function getRequestContext(): Promise<RequestContext> {
  const h = await headers();
  const userId = h.get("x-user-id") ?? "dev-user";
  const tenantId = h.get("x-tenant-id") ?? "dev-tenant";
  const role = (h.get("x-role") as RequestContext["role"] | null) ?? "ADMIN";

  return { userId, tenantId, role };
}
