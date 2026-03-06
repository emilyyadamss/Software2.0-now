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
    <main className="page">
      <header className="topbar">
        <div>
          <h1 style={{ margin: 0 }}>Software2.0-now</h1>
          <p className="subtle" style={{ margin: "6px 0 0" }}>
            Common platforms, version tracking, and customizable dashboards.
          </p>
        </div>
        <div>
          {isSignedIn ? (
            <span className="subtle">Signed in as {userEmail}</span>
          ) : (
            <Link className="btn btn-primary" href="/login" style={{ textDecoration: "none" }}>
              Sign in
            </Link>
          )}
        </div>
      </header>

      <DashboardManager
        isSignedIn={isSignedIn}
        selectedDashboardId={selectedDashboardId}
        onSelectDashboard={setSelectedDashboardId}
      />

      <section className="grid-table-wrap">
        <table className="grid-table">
          <thead>
            <tr>
              <th>Platform</th>
              <th>Vendor</th>
              <th>Latest Version</th>
              <th>Older Version</th>
              <th>Update Type</th>
              <th>Track</th>
            </tr>
          </thead>
          <tbody>
            {apps.map((app) => (
              <tr key={app.id}>
                <td>{app.name}</td>
                <td className="grid-muted">{app.vendor ?? "-"}</td>
                <td>{app.latestVersion ?? "-"}</td>
                <td className="grid-muted">{app.previousVersion ?? "-"}</td>
                <td>
                  <span className={`badge ${app.isSecurityUpdate ? "badge-secure" : ""}`}>
                    {app.isSecurityUpdate ? "Security" : "Standard"}
                  </span>
                </td>
                <td>
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
