import { useEffect, useRef } from "react";

type Props = {
  src: string;
  poster?: string;
  onPlay?: () => void;
  onEnded?: (durationSec?: number) => void;
};

export default function VideoPlayer({ src, poster, onPlay, onEnded }: Props) {
  const ref = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handlePlay = () => onPlay && onPlay();
    const handleEnded = () => {
      try {
        const d = Math.round(el.duration || 0);
        onEnded && onEnded(d);
      } catch {
        onEnded && onEnded();
      }
    };
    el.addEventListener("play", handlePlay);
    el.addEventListener("ended", handleEnded);
    return () => {
      el.removeEventListener("play", handlePlay);
      el.removeEventListener("ended", handleEnded);
    };
  }, [onPlay, onEnded]);

  return (
    <div className="w-full">
      <video
        ref={ref}
        src={src}
        poster={poster}
        controls
        playsInline
        preload="none"
        className="w-full rounded-lg shadow-sm bg-black"
      />
    </div>
  );
}
