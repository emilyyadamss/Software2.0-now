import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRequestContext } from "@/lib/request-context";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { tenantId, userId } = await getRequestContext();
    const { id: dashboardId } = await context.params;
    const body = (await request.json()) as { applicationId?: string };

    if (!body.applicationId) {
      return NextResponse.json({ error: "applicationId is required" }, { status: 400 });
    }

    const dashboard = await prisma.dashboard.findFirst({
      where: { id: dashboardId, tenantId, userId },
      select: { id: true },
    });

    if (!dashboard) {
      return NextResponse.json({ error: "Dashboard not found" }, { status: 404 });
    }

    const item = await prisma.dashboardItem.upsert({
      where: {
        dashboardId_applicationId: {
          dashboardId,
          applicationId: body.applicationId,
        },
      },
      create: {
        dashboardId,
        applicationId: body.applicationId,
      },
      update: {},
    });

    return NextResponse.json({ data: item }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
