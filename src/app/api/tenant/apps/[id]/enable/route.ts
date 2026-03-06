import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRequestContext } from "@/lib/request-context";
import { requireRole } from "@/lib/rbac";

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  let tenantId: string;
  let role: "ADMIN" | "OPERATOR" | "VIEWER";
  try {
    ({ tenantId, role } = await getRequestContext());
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const forbidden = requireRole(role, ["ADMIN", "OPERATOR"]);
  if (forbidden) return forbidden;

  const { id: appId } = await context.params;

  const record = await prisma.tenantApplication.upsert({
    where: {
      tenantId_applicationId: {
        tenantId,
        applicationId: appId,
      },
    },
    create: {
      tenantId,
      applicationId: appId,
      isEnabled: true,
    },
    update: {
      isEnabled: true,
    },
  });

  return NextResponse.json({ data: record });
}
