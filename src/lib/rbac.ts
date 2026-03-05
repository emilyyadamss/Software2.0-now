import { NextResponse } from "next/server";

export function requireRole(
  role: "ADMIN" | "OPERATOR" | "VIEWER",
  allowed: Array<"ADMIN" | "OPERATOR" | "VIEWER">
) {
  if (!allowed.includes(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}
