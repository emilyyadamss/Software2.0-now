"use client";

import { useEffect, useState } from "react";

type Dashboard = {
  id: string;
  name: string;
  _count?: { items: number };
};

type Props = {
  isSignedIn: boolean;
  selectedDashboardId: string;
  onSelectDashboard: (id: string) => void;
};

export function DashboardManager({ isSignedIn, selectedDashboardId, onSelectDashboard }: Props) {
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!isSignedIn) return;

    fetch("/api/dashboards")
      .then((r) => r.json())
      .then((json) => {
        const items = (json.data ?? []) as Dashboard[];
        setDashboards(items);
        if (items.length > 0 && !selectedDashboardId) {
          onSelectDashboard(items[0].id);
        }
      })
      .catch(() => setStatus("Failed to load dashboards"));
  }, [isSignedIn, onSelectDashboard, selectedDashboardId]);

  async function createDashboard() {
    if (!name.trim()) return;

    const res = await fetch("/api/dashboards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    const json = await res.json();
    if (!res.ok) {
      setStatus(json.error ?? "Could not create dashboard");
      return;
    }

    const created = json.data as Dashboard;
    const next = [created, ...dashboards];
    setDashboards(next);
    onSelectDashboard(created.id);
    setName("");
    setStatus("Dashboard created");
  }

  if (!isSignedIn) {
    return <p>Sign in to create dashboards and save tracked apps.</p>;
  }

  return (
    <section style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12, marginBottom: 16 }}>
      <h3>Create dashboard</h3>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Enterprise Baseline"
          style={{ flex: 1 }}
        />
        <button type="button" onClick={createDashboard}>
          Create
        </button>
      </div>

      <label>
        Active dashboard:{" "}
        <select
          value={selectedDashboardId}
          onChange={(e) => onSelectDashboard(e.target.value)}
          style={{ minWidth: 220 }}
        >
          <option value="">Select dashboard...</option>
          {dashboards.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name} ({d._count?.items ?? 0})
            </option>
          ))}
        </select>
      </label>

      {status ? <p style={{ marginTop: 8 }}>{status}</p> : null}
    </section>
  );
}
