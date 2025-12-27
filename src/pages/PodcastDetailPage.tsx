import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { api } from "../lib/axios";
import AudioPlayer from "../components/AudioPlayer";

export default function PodcastDetailPage() {
  const { id } = useParams();
  const [podcast, setPodcast] = useState<any>(null);
  const [sourceUrl, setSourceUrl] = useState<string>("");
  const [stats, setStats] = useState<{
    streams: number;
    likes: number;
    saves: number;
  }>({ streams: 0, likes: 0, saves: 0 });

  useEffect(() => {
    if (!id) return;
    api.get(`/podcasts/${id}`).then((r) => setPodcast(r.data?.data?.item));
    api
      .get(`/podcasts/${id}/source`)
      .then((r) => setSourceUrl(r.data?.data?.sourceUrl));
    api.get(`/podcasts/${id}/stats`).then((r) => setStats(r.data?.data?.stats));
  }, [id]);

  const logStream = async (durationSec?: number) => {
    if (!id) return;
    try {
      await api.post(
        `/podcasts/${id}/stream`,
        durationSec ? { durationSec } : {}
      );
    } catch {
    } finally {
      api
        .get(`/podcasts/${id}/stats`)
        .then((r) => setStats(r.data?.data?.stats));
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
      <h1 className="text-xl font-semibold">{podcast?.title ?? "Podcast"}</h1>
      <div className="text-gray-600">{podcast?.description}</div>
      {sourceUrl && (
        <AudioPlayer
          src={sourceUrl}
          onPlay={() => logStream()}
          onEnded={(d) => logStream(d)}
        />
      )}
      <div className="text-sm text-gray-500">
        Streams: {stats.streams} • Likes: {stats.likes} • Saves: {stats.saves}
      </div>
    </div>
  );
}
