import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRequestContext } from "@/lib/request-context";

export async function GET() {
  const { tenantId } = await getRequestContext();

  const [enabledApps, failedJobs, recentCriticalUpdates] = await Promise.all([
    prisma.tenantApplication.count({
      where: { tenantId, isEnabled: true },
    }),
    prisma.packageJob.count({
      where: { tenantId, status: "FAILED" },
    }),
    prisma.updateEvent.count({
      where: {
        severity: "CRITICAL",
        application: {
          tenantApps: {
            some: {
              tenantId,
              isEnabled: true,
            },
          },
        },
      },
    }),
  ]);

  return NextResponse.json({
    data: {
      enabledApps,
      failedJobs,
      recentCriticalUpdates,
    },
  });
}
