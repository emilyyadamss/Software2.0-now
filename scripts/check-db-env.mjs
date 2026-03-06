import fs from "node:fs";

const envPath = ".env";
if (!fs.existsSync(envPath)) {
  console.error("❌ .env file not found.");
  process.exit(1);
}

const txt = fs.readFileSync(envPath, "utf8");
const readVar = (name) => {
  const m = txt.match(new RegExp(`^${name}="?([^"\n]+)"?`, "m"));
  return m?.[1] ?? null;
};

const databaseUrl = readVar("DATABASE_URL");
const directUrl = readVar("DIRECT_URL");

if (!databaseUrl) {
  console.error("❌ DATABASE_URL is missing.");
  process.exit(1);
}

let ok = true;

const checkUrl = (label, value) => {
  if (!value) {
    console.warn(`⚠️ ${label} is missing.`);
    ok = false;
    return;
  }

  let u;
  try {
    u = new URL(value);
  } catch {
    console.error(`❌ ${label} is not a valid URL.`);
    ok = false;
    return;
  }

  const isSupabasePooler = u.hostname.includes("pooler.supabase.com");
  const hasSsl = value.includes("sslmode=require");

  if (!hasSsl) {
    console.error(`❌ ${label} is missing sslmode=require.`);
    ok = false;
  }

  if (isSupabasePooler && !u.username.startsWith("postgres.")) {
    console.error(`❌ ${label} likely has wrong username for Supabase pooler. Expected postgres.<PROJECT_REF>.`);
    ok = false;
  }

  console.log(`✅ ${label}: host=${u.host} user=${u.username}`);
};

checkUrl("DATABASE_URL", databaseUrl);
checkUrl("DIRECT_URL", directUrl);

if (!ok) {
  console.error("\nFix .env values, then run Prisma again.");
  process.exit(1);
}

console.log("\nEnv format looks good.");
