import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: Promise<{ packageId: string }> }) {
  const { packageId } = await params;

  const app = await prisma.application.findUnique({
    where: { id: packageId },
    include: {
      versions: {
        orderBy: [{ releasedAt: "desc" }, { discoveredAt: "desc" }],
        take: 10,
      },
    },
  });

  if (!app) {
    return NextResponse.json({ error: "Package not found" }, { status: 404 });
  }

  return NextResponse.json({
    data: {
      id: app.id,
      name: app.name,
      publisher: app.vendor,
      os: app.osFamily,
      source: app.source,
      sourcePackageId: app.sourcePackageId,
      canonicalSlug: app.canonicalSlug,
      homepage: app.homepage,
      detailsUrl: app.detailsUrl,
      refreshedAt: app.latestRefreshedAt,
      versions: app.versions.map((v) => ({
        id: v.id,
        version: v.version,
        releasedAt: v.releasedAt,
        discoveredAt: v.discoveredAt,
        sourceUrl: v.sourceUrl,
      })),
    },
  });
}
