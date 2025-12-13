import { Exercise } from '@/types/workout';
import { Clock, Repeat, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExerciseListProps {
  exercises: Exercise[];
  currentIndex?: number;
  onExerciseClick?: (index: number) => void;
}

export const ExerciseList = ({ 
  exercises, 
  currentIndex, 
  onExerciseClick 
}: ExerciseListProps) => {
  return (
    <div className="space-y-2">
      {exercises.map((exercise, index) => {
        const isActive = currentIndex === index;
        const isCompleted = currentIndex !== undefined && index < currentIndex;
        
        return (
          <div
            key={exercise.id + index}
            onClick={() => onExerciseClick?.(index)}
            className={cn(
              "rounded-lg border p-4 transition-all duration-200",
              isActive && "border-primary bg-primary/10 shadow-glow",
              isCompleted && "border-primary/30 bg-primary/5 opacity-70",
              !isActive && !isCompleted && "border-border bg-card hover:border-primary/30",
              onExerciseClick && "cursor-pointer"
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
                  isActive && "gradient-primary text-primary-foreground",
                  isCompleted && "bg-primary/20 text-primary",
                  !isActive && !isCompleted && "bg-secondary text-muted-foreground"
                )}>
                  {index + 1}
                </div>
                
                <div>
                  <h4 className={cn(
                    "font-medium",
                    isActive ? "text-primary" : "text-foreground"
                  )}>
                    {exercise.name}
                  </h4>
                  <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">
                    {exercise.description}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1 text-xs text-muted-foreground">
                {exercise.sets && exercise.reps && (
                  <div className="flex items-center gap-1">
                    <Repeat className="h-3.5 w-3.5" />
                    <span>{exercise.sets} x {exercise.reps}</span>
                  </div>
                )}
                {exercise.duration && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{exercise.duration}s</span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-accent">
                  <Flame className="h-3.5 w-3.5" />
                  <span>{exercise.calories} cal</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
