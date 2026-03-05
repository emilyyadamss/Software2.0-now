import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRequestContext } from "@/lib/request-context";

export async function GET() {
  const { tenantId } = await getRequestContext();

  const apps = await prisma.tenantApplication.findMany({
    where: { tenantId, isEnabled: true },
    orderBy: { application: { name: "asc" } },
    select: {
      tenantId: true,
      applicationId: true,
      isEnabled: true,
      updateRing: true,
      autoApprove: true,
      application: {
        select: {
          name: true,
          vendor: true,
          category: true,
          installerType: true,
          updatedAt: true,
        },
      },
    },
  });

  return NextResponse.json({ data: apps });
}
