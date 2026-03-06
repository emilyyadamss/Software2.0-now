import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRequestContext } from "@/lib/request-context";

export async function GET() {
  try {
    const { tenantId, userId } = await getRequestContext();

    const dashboards = await prisma.dashboard.findMany({
      where: { tenantId, userId },
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { items: true } },
      },
    });

    return NextResponse.json({ data: dashboards });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const { tenantId, userId } = await getRequestContext();
    const body = (await request.json()) as { name?: string };

    const name = body.name?.trim();
    if (!name) {
      return NextResponse.json({ error: "Dashboard name is required" }, { status: 400 });
    }

    const dashboard = await prisma.dashboard.create({
      data: {
        tenantId,
        userId,
        name,
      },
    });

    return NextResponse.json({ data: dashboard }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
