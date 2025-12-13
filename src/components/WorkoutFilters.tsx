import { WorkoutFilters as FilterType, WorkoutType, IntensityLevel } from '@/types/workout';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Dumbbell, Heart, Zap, Sparkles, Timer } from 'lucide-react';

interface WorkoutFiltersProps {
  filters: FilterType;
  onChange: (filters: FilterType) => void;
}

const workoutTypes: { value: WorkoutType; label: string; icon: React.ReactNode }[] = [
  { value: 'strength', label: 'Strength', icon: <Dumbbell className="h-4 w-4" /> },
  { value: 'cardio', label: 'Cardio', icon: <Heart className="h-4 w-4" /> },
  { value: 'hiit', label: 'HIIT', icon: <Zap className="h-4 w-4" /> },
  { value: 'flexibility', label: 'Flexibility', icon: <Sparkles className="h-4 w-4" /> },
];

const intensityLevels: { value: IntensityLevel; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

const durations: { value: 'short' | 'medium' | 'long'; label: string; range: string }[] = [
  { value: 'short', label: 'Quick', range: '< 20 min' },
  { value: 'medium', label: 'Standard', range: '20-40 min' },
  { value: 'long', label: 'Extended', range: '40+ min' },
];

export const WorkoutFilters = ({ filters, onChange }: WorkoutFiltersProps) => {
  const updateFilter = <K extends keyof FilterType>(key: K, value: FilterType[K]) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* Workout Type */}
      <div>
        <label className="mb-3 block text-sm font-medium text-foreground">
          Workout Type
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {workoutTypes.map(type => (
            <button
              key={type.value}
              onClick={() => updateFilter('type', type.value)}
              className={cn(
                "flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-all duration-200",
                filters.type === type.value
                  ? "border-primary bg-primary/10 text-primary shadow-glow"
                  : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
              )}
            >
              {type.icon}
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Intensity */}
      <div>
        <label className="mb-3 block text-sm font-medium text-foreground">
          Intensity Level
        </label>
        <div className="flex flex-wrap gap-2">
          {intensityLevels.map(level => (
            <button
              key={level.value}
              onClick={() => updateFilter('intensity', level.value)}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-medium transition-all duration-200",
                filters.intensity === level.value
                  ? "gradient-primary text-primary-foreground shadow-glow"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>

      {/* Duration */}
      <div>
        <label className="mb-3 block text-sm font-medium text-foreground">
          Duration
        </label>
        <div className="grid grid-cols-3 gap-2">
          {durations.map(dur => (
            <button
              key={dur.value}
              onClick={() => updateFilter('duration', dur.value)}
              className={cn(
                "flex flex-col items-center rounded-lg border px-4 py-3 transition-all duration-200",
                filters.duration === dur.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-muted-foreground hover:border-primary/50"
              )}
            >
              <Timer className={cn(
                "mb-1 h-5 w-5",
                filters.duration === dur.value ? "text-primary" : "text-muted-foreground"
              )} />
              <span className="text-sm font-medium">{dur.label}</span>
              <span className="text-xs text-muted-foreground">{dur.range}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
