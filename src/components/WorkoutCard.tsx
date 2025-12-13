import { Dumbbell, Flame, Clock, ChevronRight, Trash2, Play } from 'lucide-react';
import { Workout, WorkoutType } from '@/types/workout';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface WorkoutCardProps {
  workout: Workout;
  onStart?: () => void;
  onDelete?: () => void;
  showDelete?: boolean;
}

const typeIcons: Record<WorkoutType, string> = {
  strength: '💪',
  cardio: '🏃',
  hiit: '🔥',
  flexibility: '🧘',
};

const typeColors: Record<WorkoutType, string> = {
  strength: 'from-primary/20 to-primary/5',
  cardio: 'from-accent/20 to-accent/5',
  hiit: 'from-destructive/20 to-destructive/5',
  flexibility: 'from-blue-500/20 to-blue-500/5',
};

export const WorkoutCard = ({ 
  workout, 
  onStart, 
  onDelete,
  showDelete = false 
}: WorkoutCardProps) => {
  return (
    <div className={cn(
      "group relative overflow-hidden rounded-xl border border-border/50 p-5",
      "bg-gradient-to-br",
      typeColors[workout.type],
      "transition-all duration-300 hover:border-primary/30 hover:shadow-glow"
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-2xl">{typeIcons[workout.type]}</span>
            <span className={cn(
              "rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
              "bg-card/80 text-foreground"
            )}>
              {workout.intensity}
            </span>
          </div>
          
          <h3 className="mb-1 text-lg font-semibold text-foreground">
            {workout.name}
          </h3>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{workout.duration} min</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Flame className="h-4 w-4 text-accent" />
              <span>{workout.estimatedCalories} cal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Dumbbell className="h-4 w-4" />
              <span>{workout.exercises.length} exercises</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {onStart && (
            <Button 
              size="icon" 
              variant="default"
              onClick={onStart}
              className="h-10 w-10"
            >
              <Play className="h-4 w-4" />
            </Button>
          )}
          {showDelete && onDelete && (
            <Button 
              size="icon" 
              variant="ghost"
              onClick={onDelete}
              className="h-10 w-10 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {workout.exercises.slice(0, 4).map((exercise, index) => (
          <span 
            key={exercise.id + index}
            className="rounded-md bg-card/60 px-2 py-1 text-xs text-muted-foreground"
          >
            {exercise.name}
          </span>
        ))}
        {workout.exercises.length > 4 && (
          <span className="rounded-md bg-card/60 px-2 py-1 text-xs text-muted-foreground">
            +{workout.exercises.length - 4} more
          </span>
        )}
      </div>
    </div>
  );
};
