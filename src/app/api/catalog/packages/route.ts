import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const os = (request.nextUrl.searchParams.get("os") ?? "all").toLowerCase();
  const q = (request.nextUrl.searchParams.get("q") ?? "").trim();

  const osFilter =
    os === "windows"
      ? { osFamily: "WINDOWS" as const }
      : os === "macos"
        ? { osFamily: "MACOS" as const }
        : {};

  const apps = await prisma.application.findMany({
    where: {
      isActive: true,
      ...osFilter,
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { vendor: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { name: "asc" },
    include: {
      versions: {
        orderBy: [{ releasedAt: "desc" }, { discoveredAt: "desc" }],
        take: 2,
      },
    },
    take: 100,
  });

  return NextResponse.json({
    data: apps.map((app) => ({
      id: app.id,
      name: app.name,
      publisher: app.vendor,
      os: app.osFamily,
      latestVersion: app.versions[0]?.version ?? null,
      previousVersion: app.versions[1]?.version ?? null,
      source: app.source,
      refreshedAt: app.latestRefreshedAt,
      detailsUrl: app.detailsUrl ?? app.homepage,
    })),
  });
}
