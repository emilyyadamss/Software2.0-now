import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { HomeClient } from "./components/home-client";

export default async function HomePage() {
  const session = await auth();

  const commonApps = await prisma.application.findMany({
    where: {
      isActive: true,
      name: {
        in: ["Google Chrome", "Mozilla Firefox", "Visual Studio Code", "7-Zip", "Zoom"],
      },
    },
    orderBy: { name: "asc" },
    include: {
      versions: {
        orderBy: { releasedAt: "desc" },
        take: 2,
      },
      updateEvents: {
        orderBy: { detectedAt: "desc" },
        take: 1,
      },
    },
  });

  const apps = commonApps.map((app) => ({
    id: app.id,
    name: app.name,
    vendor: app.vendor,
    latestVersion: app.versions[0]?.version ?? null,
    previousVersion: app.versions[1]?.version ?? null,
    isSecurityUpdate: ["HIGH", "CRITICAL"].includes(app.updateEvents[0]?.severity ?? "LOW"),
  }));

  return (
    <HomeClient
      isSignedIn={Boolean(session?.user)}
      userEmail={session?.user?.email}
      apps={apps}
    />
  );
}
