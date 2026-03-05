import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRequestContext } from "@/lib/request-context";
import { requireRole } from "@/lib/rbac";

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { tenantId, role } = getRequestContext();
  const forbidden = requireRole(role, ["ADMIN", "OPERATOR"]);
  if (forbidden) return forbidden;

  const appId = params.id;

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
      isEnabled: false,
    },
    update: {
      isEnabled: false,
    },
  });

  return NextResponse.json({ data: record });
}
