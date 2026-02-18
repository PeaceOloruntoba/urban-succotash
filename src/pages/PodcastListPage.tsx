import { useEffect, useState } from "react";
import { api } from "../lib/axios";
import { Link } from "react-router-dom";
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
      <div className="flex items-end justify-between mb-4">
        <h1 className="text-2xl font-semibold">Podcasts</h1>
        <div className="text-sm text-gray-500">Fresh and trending episodes</div>
      </div>
      {loading ? (
        <div className="py-6"><Spinner /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((p) => (
            <Link key={p.id} to={`/podcasts/${p.id}`} className="group rounded-xl overflow-hidden border hover:shadow-lg transition">
              {p.cover_url ? (
                <div className="relative aspect-[16/9] bg-gray-100">
                  <img src={p.cover_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform" />
                </div>
              ) : (
                <div className="aspect-[16/9] bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-blue-700">🎧</div>
              )}
              <div className="p-4">
                <div className="font-semibold line-clamp-1">{p.title}</div>
                <div className="text-sm text-gray-600 line-clamp-2 mt-1">{p.description}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
      <div className="flex gap-2 mt-6 justify-center">
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
