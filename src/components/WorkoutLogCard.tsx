import { WorkoutLog } from '@/types/workout';
import { format } from 'date-fns';
import { Clock, Flame, Calendar } from 'lucide-react';

interface WorkoutLogCardProps {
  log: WorkoutLog;
}

export const WorkoutLogCard = ({ log }: WorkoutLogCardProps) => {
  const completedDate = new Date(log.completedAt);
  
  return (
    <div className="rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:border-primary/30">
      <div className="mb-2 flex items-start justify-between">
        <h4 className="font-semibold text-foreground">{log.workoutName}</h4>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span>{format(completedDate, 'MMM d')}</span>
        </div>
      </div>
      
      <div className="flex gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          <span>{log.duration} min</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Flame className="h-4 w-4 text-accent" />
          <span>{log.caloriesBurned} cal</span>
        </div>
      </div>
      
      {log.notes && (
        <p className="mt-2 text-sm text-muted-foreground italic">
          "{log.notes}"
        </p>
      )}
    </div>
  );
};
