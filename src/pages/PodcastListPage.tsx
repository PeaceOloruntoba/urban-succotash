import { useEffect, useState } from "react";
import { api } from "../lib/axios";
import { Link } from "react-router";
import Spinner from "../components/Spinner";
import { toast } from "sonner";

export default function PodcastListPage() {
  const [items, setItems] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const limit = 12;

  useEffect(() => {
    setLoading(true);
    api
      .get("/podcasts", {
        params: {
          limit,
          offset: page * limit,
          sortBy: "published_at",
          sortDir: "desc",
        },
      })
      .then((r) => setItems(r.data?.data?.items ?? []))
      .catch((e) => toast.error(e?.response?.data?.message || "Failed to load podcasts"))
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold mb-4">Podcasts</h1>
      {loading ? (
        <div className="py-6"><Spinner /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((p) => (
            <Link
              key={p.id}
              to={`/podcasts/${p.id}`}
              className="border rounded p-4 hover:shadow"
            >
              <div className="font-medium">{p.title}</div>
              <div className="text-sm text-gray-600 line-clamp-2">
                {p.description}
              </div>
            </Link>
          ))}
        </div>
      )}
      <div className="flex gap-2 mt-4">
        <button
          className="px-3 py-1 rounded border"
          disabled={page === 0}
          onClick={() => setPage((x) => Math.max(0, x - 1))}
        >
          Prev
        </button>
        <button
          className="px-3 py-1 rounded border"
          onClick={() => setPage((x) => x + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
