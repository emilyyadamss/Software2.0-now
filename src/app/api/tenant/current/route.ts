import { NextResponse } from "next/server";
import { getRequestContext } from "@/lib/request-context";
import { prisma } from "@/lib/prisma";

export async function GET() {
  let tenantId: string;

  try {
    ({ tenantId } = await getRequestContext());
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: {
      id: true,
      name: true,
      slug: true,
      plan: true,
      createdAt: true,
    },
  });

  if (!tenant) {
    return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
  }

  return NextResponse.json({ data: tenant });
}
