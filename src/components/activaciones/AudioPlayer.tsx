'use client';

import { useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock } from 'lucide-react';

type Props = {
  title: string;
  description: string | null;
  category: string | null;
  durationSeconds: number | null;
  audioUrl: string;
  slug?: string;
  userId?: string;
};

function formatDuration(seconds: number | null): string {
  if (!seconds) return '';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function AudioPlayer({ title, description, category, durationSeconds, audioUrl, slug, userId }: Props) {
  const playFiredRef = useRef(false);

  const handlePlay = () => {
    if (playFiredRef.current || !slug || !userId) return;
    playFiredRef.current = true;
    fetch('/api/activaciones/track-play', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, slug }),
      keepalive: true,
    }).catch(() => {
      playFiredRef.current = false;
    });
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-grow">
            <h3 className="font-semibold text-lg leading-tight">{title}</h3>
            {category && (
              <span className="inline-block mt-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                {category}
              </span>
            )}
          </div>
          {durationSeconds && (
            <div className="flex items-center text-muted-foreground text-sm shrink-0">
              <Clock className="h-3 w-3 mr-1" />
              {formatDuration(durationSeconds)}
            </div>
          )}
        </div>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
        <audio
          controls
          controlsList="nodownload noplaybackrate"
          onContextMenu={(e) => e.preventDefault()}
          onPlay={handlePlay}
          preload="none"
          className="w-full"
          src={audioUrl}
        >
          Tu navegador no soporta reproducción de audio.
        </audio>
      </CardContent>
    </Card>
  );
}
