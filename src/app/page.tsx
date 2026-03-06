import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LogoutButton } from "./components/logout-button";

export default async function HomePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main style={{ padding: 24, fontFamily: "sans-serif", maxWidth: 900, margin: "0 auto" }}>
      <h1>Software2.0-now ✅</h1>
      <p>
        Signed in as <strong>{session.user.email}</strong> (role: {session.user.role})
      </p>
      <p>Tenant ID: {session.user.tenantId}</p>
      <p>
        <Link href="/api/apps">/api/apps</Link> · <Link href="/api/me">/api/me</Link> ·{" "}
        <Link href="/api/tenant/current">/api/tenant/current</Link> ·{" "}
        <Link href="/api/dashboard/summary">/api/dashboard/summary</Link>
        <LogoutButton />
      </p>
    </main>
  );
}
