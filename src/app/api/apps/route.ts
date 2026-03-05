import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const apps = await prisma.application.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      vendor: true,
      category: true,
      homepage: true,
      installerType: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({ data: apps });
}
