import { exercises } from '@/data/exercises';
import { Workout, WorkoutFilters, Exercise, WorkoutType, IntensityLevel } from '@/types/workout';

const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const getDurationRange = (duration?: 'short' | 'medium' | 'long'): { min: number; max: number } => {
  switch (duration) {
    case 'short':
      return { min: 10, max: 20 };
    case 'medium':
      return { min: 20, max: 40 };
    case 'long':
      return { min: 40, max: 60 };
    default:
      return { min: 20, max: 40 };
  }
};

const adjustForIntensity = (exercise: Exercise, intensity: IntensityLevel): Exercise => {
  const multiplier = intensity === 'beginner' ? 0.7 : intensity === 'advanced' ? 1.3 : 1;
  
  return {
    ...exercise,
    sets: exercise.sets ? Math.max(1, Math.round((exercise.sets) * multiplier)) : undefined,
    reps: exercise.reps ? Math.max(5, Math.round((exercise.reps) * multiplier)) : undefined,
    duration: exercise.duration ? Math.round((exercise.duration) * multiplier) : undefined,
    restTime: Math.round(exercise.restTime * (intensity === 'advanced' ? 0.8 : intensity === 'beginner' ? 1.2 : 1)),
  };
};

const calculateExerciseDuration = (exercise: Exercise): number => {
  if (exercise.duration) {
    return ((exercise.sets || 1) * exercise.duration + (exercise.sets || 1) * exercise.restTime) / 60;
  }
  if (exercise.sets && exercise.reps) {
    const timePerRep = 3; // seconds
    return (exercise.sets * exercise.reps * timePerRep + exercise.sets * exercise.restTime) / 60;
  }
  return 3; // default 3 minutes
};

const getWorkoutName = (type: WorkoutType, intensity: IntensityLevel): string => {
  const adjectives = {
    beginner: ['Gentle', 'Easy', 'Light', 'Simple'],
    intermediate: ['Power', 'Active', 'Dynamic', 'Steady'],
    advanced: ['Intense', 'Extreme', 'Ultimate', 'Beast Mode'],
  };

  const nouns = {
    strength: ['Strength Builder', 'Muscle Maker', 'Power Session', 'Iron Pump'],
    cardio: ['Cardio Blast', 'Heart Racer', 'Endurance Rush', 'Sweat Session'],
    hiit: ['HIIT Inferno', 'Burn Circuit', 'Metabolic Fire', 'Shred Session'],
    flexibility: ['Flex Flow', 'Stretch Session', 'Mobility Flow', 'Zen Stretch'],
  };

  const adj = adjectives[intensity][Math.floor(Math.random() * adjectives[intensity].length)];
  const noun = nouns[type][Math.floor(Math.random() * nouns[type].length)];
  
  return `${adj} ${noun}`;
};

export const generateWorkout = (filters: WorkoutFilters): Workout => {
  const type = filters.type || 'strength';
  const intensity = filters.intensity || 'intermediate';
  const durationRange = getDurationRange(filters.duration);
  const targetDuration = (durationRange.min + durationRange.max) / 2;

  // Filter exercises by type
  let availableExercises = exercises.filter(e => e.type === type);
  
  // If not enough exercises, include some full-body or related exercises
  if (availableExercises.length < 5) {
    const supplementary = exercises.filter(e => 
      e.muscleGroup === 'full-body' || 
      (type === 'strength' && e.type === 'strength')
    );
    availableExercises = [...availableExercises, ...supplementary];
  }

  // Shuffle and select exercises
  const shuffled = shuffleArray(availableExercises);
  const selectedExercises: Exercise[] = [];
  let totalDuration = 0;

  for (const exercise of shuffled) {
    const adjusted = adjustForIntensity(exercise, intensity);
    const exerciseDuration = calculateExerciseDuration(adjusted);
    
    if (totalDuration + exerciseDuration <= targetDuration + 5) {
      selectedExercises.push(adjusted);
      totalDuration += exerciseDuration;
    }
    
    if (totalDuration >= targetDuration - 5 && selectedExercises.length >= 4) {
      break;
    }
  }

  // Calculate total calories
  const estimatedCalories = selectedExercises.reduce((sum, ex) => {
    const multiplier = intensity === 'beginner' ? 0.8 : intensity === 'advanced' ? 1.3 : 1;
    return sum + ex.calories * (ex.sets || 1) * multiplier;
  }, 0);

  return {
    id: `workout-${Date.now()}`,
    name: getWorkoutName(type, intensity),
    type,
    intensity,
    duration: Math.round(totalDuration),
    exercises: selectedExercises,
    estimatedCalories: Math.round(estimatedCalories),
    createdAt: new Date(),
  };
};
