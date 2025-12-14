import { useState } from 'react';
import { Play, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoDemoProps {
  title: string;
  thumbnailUrl?: string;
  videoUrl: string;
  duration?: string;
}

// Sample workout video URLs (YouTube embed URLs)
const DEMO_VIDEOS: Record<string, string> = {
  'Push-ups': 'https://www.youtube.com/embed/IODxDxX7oi4',
  'Squats': 'https://www.youtube.com/embed/aclHkVaku9U',
  'Lunges': 'https://www.youtube.com/embed/QOVaHwm-Q6U',
  'Plank': 'https://www.youtube.com/embed/ASdvN_XEl_c',
  'Burpees': 'https://www.youtube.com/embed/dZgVxmf6jkA',
  'Deadlift': 'https://www.youtube.com/embed/op9kVnSso6Q',
  'Bench Press': 'https://www.youtube.com/embed/rT7DgCr-3pg',
  'Pull-ups': 'https://www.youtube.com/embed/eGo4IYlbE5g',
  'default': 'https://www.youtube.com/embed/IODxDxX7oi4',
};

export const getVideoUrl = (exerciseName: string): string => {
  return DEMO_VIDEOS[exerciseName] || DEMO_VIDEOS['default'];
};

export const VideoDemo = ({ title, thumbnailUrl, videoUrl, duration }: VideoDemoProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="relative rounded-lg overflow-hidden bg-secondary/50 aspect-video">
      {isPlaying ? (
        <>
          <iframe
            src={`${videoUrl}?autoplay=1`}
            title={title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          <button
            onClick={() => setIsPlaying(false)}
            className="absolute top-2 right-2 p-2 rounded-full bg-background/80 text-foreground hover:bg-background transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </>
      ) : (
        <button
          onClick={() => setIsPlaying(true)}
          className="w-full h-full flex flex-col items-center justify-center group"
        >
          {thumbnailUrl ? (
            <img 
              src={thumbnailUrl} 
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 gradient-card" />
          )}
          
          <div className={cn(
            "relative z-10 flex h-14 w-14 items-center justify-center rounded-full",
            "gradient-primary shadow-glow transition-transform duration-300",
            "group-hover:scale-110"
          )}>
            <Play className="h-6 w-6 text-primary-foreground ml-1" />
          </div>
          
          <p className="relative z-10 mt-3 text-sm font-medium text-foreground">
            Watch Demo
          </p>
          
          {duration && (
            <p className="relative z-10 text-xs text-muted-foreground mt-1">
              {duration}
            </p>
          )}
        </button>
      )}
    </div>
  );
};
