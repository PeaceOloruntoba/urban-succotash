import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Spinner from "../../../components/Spinner";
import { Clock, Tag } from "lucide-react";
import { usePodcastsStore } from "../../../stores/podcasts";
import VideoPlayer from "../../../components/VideoPlayer";

export default function AdminPodcastDetail() {
  const { id } = useParams();
  const { currentPodcast, fetchAdminPodcastById, loading } = usePodcastsStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setError(null);
      try {
        await fetchAdminPodcastById(id);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load podcast details");
      }
    })();
  }, [id, fetchAdminPodcastById]);

  if (loading) {
    return <div className="p-6 flex items-center gap-2"><Spinner /> Loading podcast...</div>;
  }
  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }
  if (!currentPodcast) {
    return <div className="p-6 text-slate-600">Podcast not found.</div>;
  }

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{currentPodcast.title}</h1>
        <Link to={`/admin/podcasts/${id}/edit`} className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm">Edit Podcast</Link>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <p className="text-slate-600">{currentPodcast.description}</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2"><Clock size={16} className="text-slate-500"/> <strong>Duration:</strong> {Math.round((currentPodcast.duration_sec || 0) / 60)} minutes</div>
          <div className="flex items-center gap-2"><Tag size={16} className="text-slate-500"/> <strong>Status:</strong> <span className="capitalize px-2 py-1 text-xs rounded bg-slate-100 text-slate-800">{currentPodcast.status}</span></div>
        </div>
        {currentPodcast.audio_url && (
          /\.(mp4|webm|m3u8)(\?|$)/i.test(currentPodcast.audio_url) ? (
            <div className="mt-4">
              <VideoPlayer src={currentPodcast.audio_url} poster={currentPodcast.cover_url || undefined} />
            </div>
          ) : (
            <audio controls src={currentPodcast.audio_url} className="mt-4 w-full" />
          )
        )}
      </div>
    </div>
  );
}
