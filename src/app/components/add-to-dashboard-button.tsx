"use client";

import { useState } from "react";

type Props = {
  applicationId: string;
  isSignedIn: boolean;
  selectedDashboardId: string;
};

export function AddToDashboardButton({ applicationId, isSignedIn, selectedDashboardId }: Props) {
  const [status, setStatus] = useState("");

  async function onAdd() {
    if (!isSignedIn) {
      setStatus("Sign in to save this app");
      return;
    }

    if (!selectedDashboardId) {
      setStatus("Create/select a dashboard first");
      return;
    }

    const res = await fetch(`/api/dashboards/${selectedDashboardId}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId }),
    });

    const json = await res.json();
    setStatus(res.ok ? "Added" : (json.error ?? "Failed"));
  }

  return (
    <div>
      <button type="button" onClick={onAdd}>Add to dashboard</button>
      {status ? <div style={{ fontSize: 12 }}>{status}</div> : null}
    </div>
  );
}
