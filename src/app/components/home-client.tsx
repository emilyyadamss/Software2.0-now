"use client";

import Link from "next/link";
import { useState } from "react";
import { DashboardManager } from "./dashboard-manager";
import { AddToDashboardButton } from "./add-to-dashboard-button";

type AppRow = {
  id: string;
  name: string;
  vendor: string | null;
  latestVersion: string | null;
  previousVersion: string | null;
  isSecurityUpdate: boolean;
};

type Props = {
  isSignedIn: boolean;
  userEmail?: string | null;
  apps: AppRow[];
};

export function HomeClient({ isSignedIn, userEmail, apps }: Props) {
  const [selectedDashboardId, setSelectedDashboardId] = useState("");

  return (
    <main style={{ padding: 24, fontFamily: "sans-serif", maxWidth: 1050, margin: "0 auto" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Software2.0-now</h1>
        <div>
          {isSignedIn ? (
            <span>Signed in as {userEmail}</span>
          ) : (
            <Link href="/login">Sign in</Link>
          )}
        </div>
      </header>

      <p>
        Browse common platforms, compare latest vs prior versions, and add apps to a custom tracking
        dashboard.
      </p>

      <DashboardManager
        isSignedIn={isSignedIn}
        selectedDashboardId={selectedDashboardId}
        onSelectDashboard={setSelectedDashboardId}
      />

      <section style={{ border: "1px solid #ddd", borderRadius: 8, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f7f7f7", textAlign: "left" }}>
              <th style={{ padding: 10 }}>Platform</th>
              <th style={{ padding: 10 }}>Vendor</th>
              <th style={{ padding: 10 }}>Latest</th>
              <th style={{ padding: 10 }}>Previous</th>
              <th style={{ padding: 10 }}>Security update</th>
              <th style={{ padding: 10 }}>Track</th>
            </tr>
          </thead>
          <tbody>
            {apps.map((app) => (
              <tr key={app.id} style={{ borderTop: "1px solid #eee" }}>
                <td style={{ padding: 10 }}>{app.name}</td>
                <td style={{ padding: 10 }}>{app.vendor ?? "-"}</td>
                <td style={{ padding: 10 }}>{app.latestVersion ?? "-"}</td>
                <td style={{ padding: 10 }}>{app.previousVersion ?? "-"}</td>
                <td style={{ padding: 10 }}>
                  {app.isSecurityUpdate ? "Yes (security)" : "No / standard"}
                </td>
                <td style={{ padding: 10 }}>
                  <AddToDashboardButton
                    applicationId={app.id}
                    isSignedIn={isSignedIn}
                    selectedDashboardId={selectedDashboardId}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
