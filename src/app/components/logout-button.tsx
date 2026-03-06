import { signOut } from "@/auth";

export function LogoutButton() {
  async function logoutAction() {
    "use server";
    await signOut({ redirectTo: "/login" });
  }

  return (
    <form action={logoutAction} style={{ display: "inline" }}>
      <button style={{ marginLeft: 8 }} type="submit">
        Sign out
      </button>
    </form>
  );
}
