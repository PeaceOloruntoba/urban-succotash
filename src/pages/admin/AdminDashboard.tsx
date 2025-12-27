import { useEffect, useState } from "react";
import { api } from "../../lib/axios";
import PodcastsTable from "./PodcastsTable";
import PodcastForm from "./PodcastForm";

export default function AdminDashboard() {
  const [items, setItems] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);

  const load = async () => {
    const r = await api.get("/podcasts/admin", {
      params: { status: "all", sortBy: "created_at", sortDir: "desc" },
    });
    setItems(r.data?.data?.items ?? []);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        <button
          className="px-3 py-1 rounded border"
          onClick={() => setEditing({})}
        >
          New Podcast
        </button>
      </div>
      {editing ? (
        <PodcastForm
          initial={editing}
          onClose={() => {
            setEditing(null);
            load();
          }}
        />
      ) : (
        <PodcastsTable
          items={items}
          onEdit={(it) => setEditing(it)}
          onChanged={load}
        />
      )}
    </div>
  );
}
