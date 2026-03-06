import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const tenantSlug = (process.env.DEV_TENANT_SLUG ?? "acme").toLowerCase();
  const tenantName = process.env.DEV_TENANT_NAME ?? "Acme Corp";
  const userEmail = (process.env.DEV_USER_EMAIL ?? "admin@example.com").toLowerCase();

  const tenant = await prisma.tenant.upsert({
    where: { slug: tenantSlug },
    create: {
      slug: tenantSlug,
      name: tenantName,
      plan: "MVP",
    },
    update: {
      name: tenantName,
    },
  });

  const user = await prisma.user.upsert({
    where: { email: userEmail },
    create: {
      email: userEmail,
      name: userEmail.split("@")[0],
    },
    update: {},
  });

  await prisma.tenantMembership.upsert({
    where: {
      tenantId_userId: {
        tenantId: tenant.id,
        userId: user.id,
      },
    },
    create: {
      tenantId: tenant.id,
      userId: user.id,
      role: "ADMIN",
    },
    update: {
      role: "ADMIN",
    },
  });

  console.log("Bootstrap complete:");
  console.log(`- tenant slug: ${tenant.slug}`);
  console.log(`- user email:  ${user.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
