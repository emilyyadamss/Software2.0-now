import { PrismaClient, InstallerType, Severity } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const apps = [
    {
      name: "Google Chrome",
      vendor: "Google",
      category: "Browser",
      homepage: "https://www.google.com/chrome/",
      installerType: InstallerType.EXE,
      detectionRule: { type: "registry", key: "HKLM\\Software\\Google\\Chrome" },
      version: "122.0.0.0",
      sourceUrl: "https://dl.google.com/chrome/install/latest/chrome_installer.exe",
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
    },
    {
      name: "7-Zip",
      vendor: "7-Zip",
      category: "Utility",
      homepage: "https://www.7-zip.org/",
      installerType: InstallerType.EXE,
      detectionRule: { type: "file", path: "C:\\Program Files\\7-Zip\\7zFM.exe" },
      version: "24.09",
      sourceUrl: "https://www.7-zip.org/a/7z2409-x64.exe",
    },
    {
      name: "Notepad++",
      vendor: "Notepad++",
      category: "Developer Tools",
      homepage: "https://notepad-plus-plus.org/",
      installerType: InstallerType.EXE,
      detectionRule: { type: "file", path: "C:\\Program Files\\Notepad++\\notepad++.exe" },
      version: "8.6.0",
      sourceUrl: "https://github.com/notepad-plus-plus/notepad-plus-plus/releases",
    },
    {
      name: "Visual Studio Code",
      vendor: "Microsoft",
      category: "Developer Tools",
      homepage: "https://code.visualstudio.com/",
      installerType: InstallerType.EXE,
      detectionRule: { type: "file", path: "C:\\Program Files\\Microsoft VS Code\\Code.exe" },
      version: "1.97.0",
      sourceUrl: "https://update.code.visualstudio.com/latest/win32-x64-user/stable",
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
    },
    {
      name: "Microsoft Teams",
      vendor: "Microsoft",
      category: "Collaboration",
      homepage: "https://www.microsoft.com/en-us/microsoft-teams/download-app",
      installerType: InstallerType.MSIX,
      detectionRule: { type: "package", id: "MSTeams" },
      version: "24215.1007.3090.1590",
      sourceUrl: "https://www.microsoft.com/en-us/microsoft-teams/download-app",
    },
    {
      name: "Adobe Acrobat Reader",
      vendor: "Adobe",
      category: "Productivity",
      homepage: "https://get.adobe.com/reader/",
      installerType: InstallerType.EXE,
      detectionRule: { type: "file", path: "C:\\Program Files\\Adobe\\Acrobat Reader\\Reader\\AcroRd32.exe" },
      version: "2025.001.0",
      sourceUrl: "https://get.adobe.com/reader/enterprise/",
    },
    {
      name: "VLC media player",
      vendor: "VideoLAN",
      category: "Media",
      homepage: "https://www.videolan.org/vlc/",
      installerType: InstallerType.EXE,
      detectionRule: { type: "file", path: "C:\\Program Files\\VideoLAN\\VLC\\vlc.exe" },
      version: "3.0.21",
      sourceUrl: "https://get.videolan.org/vlc/",
    },
  ];

  for (const app of apps) {
    const application = await prisma.application.upsert({
      where: { name_vendor: { name: app.name, vendor: app.vendor } },
      create: {
        name: app.name,
        vendor: app.vendor,
        category: app.category,
        homepage: app.homepage,
        installerType: app.installerType,
        detectionRule: app.detectionRule,
      },
      update: {
        category: app.category,
        homepage: app.homepage,
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
        sourceUrl: app.sourceUrl,
      },
      update: {
        sourceUrl: app.sourceUrl,
      },
    });

    await prisma.updateEvent.create({
      data: {
        applicationId: application.id,
        newVersion: app.version,
        severity: Severity.MEDIUM,
        notes: "Seeded initial baseline version",
      },
    });
  }

  console.log(`Seeded ${apps.length} applications`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
