import { PrismaClient, InstallerType, OsFamily, Severity } from "@prisma/client";

const prisma = new PrismaClient();

type SeedApp = {
  name: string;
  vendor: string;
  category: string;
  homepage: string;
  detailsUrl?: string;
  installerType: InstallerType;
  detectionRule: Record<string, string>;
  version: string;
  sourceUrl: string;
  osFamily: OsFamily;
  source: string;
  sourcePackageId: string;
};

async function main() {
  const apps: SeedApp[] = [
    {
      name: "Google Chrome",
      vendor: "Google",
      category: "Browser",
      homepage: "https://www.google.com/chrome/",
      installerType: InstallerType.EXE,
      detectionRule: { type: "registry", key: "HKLM\\Software\\Google\\Chrome" },
      version: "122.0.0.0",
      sourceUrl: "https://dl.google.com/chrome/install/latest/chrome_installer.exe",
      osFamily: OsFamily.WINDOWS,
      source: "winget",
      sourcePackageId: "Google.Chrome",
    },
    {
      name: "Mozilla Firefox",
      vendor: "Mozilla",
      category: "Browser",
      homepage: "https://www.mozilla.org/firefox/",
      installerType: InstallerType.EXE,
      detectionRule: { type: "registry", key: "HKLM\\Software\\Mozilla\\Mozilla Firefox" },
      version: "124.0",
      sourceUrl: "https://download.mozilla.org/?product=firefox-latest&os=win64&lang=en-US",
      osFamily: OsFamily.WINDOWS,
      source: "winget",
      sourcePackageId: "Mozilla.Firefox",
    },
    {
      name: "Zoom",
      vendor: "Zoom",
      category: "Collaboration",
      homepage: "https://zoom.us/download",
      installerType: InstallerType.MSI,
      detectionRule: { type: "registry", key: "HKLM\\Software\\ZoomUMX" },
      version: "6.0.0",
      sourceUrl: "https://zoom.us/client/latest/ZoomInstallerFull.msi",
      osFamily: OsFamily.WINDOWS,
      source: "winget",
      sourcePackageId: "Zoom.Zoom",
    },
    {
      name: "Slack",
      vendor: "Slack",
      category: "Collaboration",
      homepage: "https://slack.com/downloads/windows",
      installerType: InstallerType.EXE,
      detectionRule: { type: "file", path: "C:\\Users\\%USERNAME%\\AppData\\Local\\slack\\slack.exe" },
      version: "4.38.121",
      sourceUrl: "https://slack.com/ssb/download-win64",
      osFamily: OsFamily.WINDOWS,
      source: "winget",
      sourcePackageId: "SlackTechnologies.Slack",
    },
    {
      name: "Google Chrome",
      vendor: "Google",
      category: "Browser",
      homepage: "https://www.google.com/chrome/",
      installerType: InstallerType.ZIP,
      detectionRule: { type: "bundle", id: "com.google.Chrome" },
      version: "122.0.6261.112",
      sourceUrl: "https://formulae.brew.sh/cask/google-chrome",
      osFamily: OsFamily.MACOS,
      source: "homebrew-cask",
      sourcePackageId: "google-chrome",
    },
    {
      name: "Visual Studio Code",
      vendor: "Microsoft",
      category: "Developer Tools",
      homepage: "https://code.visualstudio.com/",
      installerType: InstallerType.ZIP,
      detectionRule: { type: "bundle", id: "com.microsoft.VSCode" },
      version: "1.97.0",
      sourceUrl: "https://formulae.brew.sh/cask/visual-studio-code",
      osFamily: OsFamily.MACOS,
      source: "homebrew-cask",
      sourcePackageId: "visual-studio-code",
    },
  ];

  for (const app of apps) {
    const application = await prisma.application.upsert({
      where: { source_sourcePackageId: { source: app.source, sourcePackageId: app.sourcePackageId } },
      create: {
        name: app.name,
        vendor: app.vendor,
        category: app.category,
        homepage: app.homepage,
        detailsUrl: app.detailsUrl ?? app.homepage,
        osFamily: app.osFamily,
        source: app.source,
        sourcePackageId: app.sourcePackageId,
        canonicalSlug: `${app.osFamily.toLowerCase()}-${app.sourcePackageId.toLowerCase()}`,
        latestRefreshedAt: new Date(),
        installerType: app.installerType,
        detectionRule: app.detectionRule,
      },
      update: {
        category: app.category,
        homepage: app.homepage,
        detailsUrl: app.detailsUrl ?? app.homepage,
        osFamily: app.osFamily,
        source: app.source,
        sourcePackageId: app.sourcePackageId,
        latestRefreshedAt: new Date(),
        installerType: app.installerType,
        detectionRule: app.detectionRule,
        isActive: true,
      },
    });

    await prisma.applicationVersion.upsert({
      where: {
        applicationId_version: {
          applicationId: application.id,
          version: app.version,
        },
      },
      create: {
        applicationId: application.id,
        version: app.version,
        versionSortKey: app.version,
        sourceUrl: app.sourceUrl,
      },
      update: {
        versionSortKey: app.version,
        sourceUrl: app.sourceUrl,
      },
    });

    await prisma.updateEvent.create({
      data: {
        applicationId: application.id,
        newVersion: app.version,
        severity: Severity.MEDIUM,
        notes: "Seeded baseline catalog version",
      },
    });
  }

  console.log(`Seeded ${apps.length} source-specific applications`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
