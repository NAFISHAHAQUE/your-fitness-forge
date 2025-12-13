import { useState, useEffect } from 'react';
import { Workout } from '@/types/workout';
import { Button } from '@/components/ui/button';
import { ExerciseList } from './ExerciseList';
import { Play, Pause, SkipForward, CheckCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WorkoutSessionProps {
  workout: Workout;
  onComplete: (notes?: string) => void;
  onCancel: () => void;
}

export const WorkoutSession = ({ workout, onComplete, onCancel }: WorkoutSessionProps) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [totalTime, setTotalTime] = useState(0);

  const currentExercise = workout.exercises[currentExerciseIndex];
  const isLastExercise = currentExerciseIndex === workout.exercises.length - 1;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
        setTotalTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNextExercise = () => {
    if (isLastExercise) {
      onComplete();
    } else {
      setIsResting(true);
      setTimer(0);
    }
  };

  const handleRestComplete = () => {
    setIsResting(false);
    setCurrentExerciseIndex(prev => prev + 1);
    setTimer(0);
  };

  const handleSkip = () => {
    if (isResting) {
      handleRestComplete();
    } else {
      handleNextExercise();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">{workout.name}</h2>
            <p className="text-sm text-muted-foreground">
              Exercise {currentExerciseIndex + 1} of {workout.exercises.length}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Time</p>
              <p className="text-xl font-bold text-primary">{formatTime(totalTime)}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          {isResting ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 text-6xl">⏱️</div>
              <h3 className="mb-2 text-2xl font-bold text-foreground">Rest Time</h3>
              <p className="mb-6 text-muted-foreground">
                Next: {workout.exercises[currentExerciseIndex + 1]?.name}
              </p>
              <div className="mb-8 text-6xl font-bold text-primary">
                {formatTime(timer)}
              </div>
              <p className="mb-4 text-sm text-muted-foreground">
                Recommended rest: {currentExercise.restTime}s
              </p>
              <Button size="lg" onClick={handleRestComplete}>
                <SkipForward className="mr-2 h-5 w-5" />
                Skip Rest
              </Button>
            </div>
          ) : (
            <div className="mx-auto max-w-2xl">
              <div className="mb-8 text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full gradient-primary text-2xl font-bold text-primary-foreground">
                  {currentExerciseIndex + 1}
                </div>
                <h3 className="mb-2 text-3xl font-bold text-foreground">
                  {currentExercise.name}
                </h3>
                <p className="text-muted-foreground">
                  {currentExercise.description}
                </p>
              </div>

              <div className="mb-8 flex justify-center gap-6">
                {currentExercise.sets && currentExercise.reps && (
                  <div className="text-center">
                    <p className="text-3xl font-bold text-foreground">
                      {currentExercise.sets} × {currentExercise.reps}
                    </p>
                    <p className="text-sm text-muted-foreground">Sets × Reps</p>
                  </div>
                )}
                {currentExercise.duration && (
                  <div className="text-center">
                    <p className="text-3xl font-bold text-foreground">
                      {currentExercise.duration}s
                    </p>
                    <p className="text-sm text-muted-foreground">Duration</p>
                  </div>
                )}
              </div>

              <div className="mb-8 text-center">
                <div className="mb-4 text-5xl font-bold text-primary">
                  {formatTime(timer)}
                </div>
                <div className="flex justify-center gap-3">
                  <Button
                    size="lg"
                    variant={isRunning ? "secondary" : "default"}
                    onClick={() => setIsRunning(!isRunning)}
                  >
                    {isRunning ? (
                      <>
                        <Pause className="mr-2 h-5 w-5" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-5 w-5" />
                        Start
                      </>
                    )}
                  </Button>
                  <Button size="lg" variant="outline" onClick={handleSkip}>
                    <SkipForward className="mr-2 h-5 w-5" />
                    Skip
                  </Button>
                </div>
              </div>

              <div className="flex justify-center">
                <Button 
                  size="xl" 
                  onClick={handleNextExercise}
                  className={cn(
                    isLastExercise && "gradient-accent"
                  )}
                >
                  {isLastExercise ? (
                    <>
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Complete Workout
                    </>
                  ) : (
                    <>
                      <SkipForward className="mr-2 h-5 w-5" />
                      Next Exercise
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Exercise List */}
        <div className="border-t border-border bg-card/50 p-4">
          <p className="mb-3 text-sm font-medium text-muted-foreground">
            Exercises
          </p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {workout.exercises.map((exercise, index) => (
              <div
                key={exercise.id + index}
                className={cn(
                  "shrink-0 rounded-lg px-3 py-2 text-xs font-medium transition-all",
                  index === currentExerciseIndex && "gradient-primary text-primary-foreground",
                  index < currentExerciseIndex && "bg-primary/20 text-primary",
                  index > currentExerciseIndex && "bg-secondary text-muted-foreground"
                )}
              >
                {exercise.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
