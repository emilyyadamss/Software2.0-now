import { signIn } from "@/auth";

export default function LoginPage() {
  async function loginAction(formData: FormData) {
    "use server";

    const email = formData.get("email")?.toString() ?? "";
    const tenantSlug = formData.get("tenantSlug")?.toString() ?? "";

    await signIn("credentials", {
      email,
      tenantSlug,
      redirectTo: "/",
    });
  }

  return (
    <main style={{ maxWidth: 480, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Sign in</h1>
      <p>Use your workspace email + tenant slug.</p>
      <form action={loginAction} style={{ display: "grid", gap: 12 }}>
        <label>
          Email
          <input name="email" type="email" required style={{ width: "100%" }} />
        </label>
        <label>
          Tenant slug
          <input name="tenantSlug" type="text" required style={{ width: "100%" }} />
        </label>
        <button type="submit">Sign in</button>
      </form>
    </main>
  );
}
