import { useEffect, useRef } from "react";

type Props = {
  src: string;
  onPlay?: () => void;
  onEnded?: (durationSec?: number) => void;
};

export default function AudioPlayer({ src, onPlay, onEnded }: Props) {
  const ref = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    return () => {
      if (el) el.pause();
    };
  }, [src]);
  return (
    <audio
      ref={ref}
      className="w-full"
      controls
      src={src}
      onPlay={() => onPlay?.()}
      onEnded={() => onEnded?.(Math.floor(ref.current?.currentTime || 0))}
    />
  );
}
