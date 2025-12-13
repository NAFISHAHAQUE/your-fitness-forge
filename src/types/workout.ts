export type WorkoutType = 'strength' | 'cardio' | 'flexibility' | 'hiit';
export type IntensityLevel = 'beginner' | 'intermediate' | 'advanced';
export type MuscleGroup = 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core' | 'full-body';

export interface Exercise {
  id: string;
  name: string;
  type: WorkoutType;
  muscleGroup: MuscleGroup;
  sets?: number;
  reps?: number;
  duration?: number; // in seconds
  restTime: number; // in seconds
  description: string;
  calories: number;
}

export interface Workout {
  id: string;
  name: string;
  type: WorkoutType;
  intensity: IntensityLevel;
  duration: number; // in minutes
  exercises: Exercise[];
  estimatedCalories: number;
  createdAt: Date;
}

export interface WorkoutLog {
  id: string;
  workoutId: string;
  workoutName: string;
  completedAt: Date;
  duration: number;
  caloriesBurned: number;
  notes?: string;
}

export interface UserStats {
  totalWorkouts: number;
  totalMinutes: number;
  totalCalories: number;
  currentStreak: number;
  longestStreak: number;
}

export interface WorkoutFilters {
  type?: WorkoutType;
  intensity?: IntensityLevel;
  duration?: 'short' | 'medium' | 'long'; // <20, 20-40, >40 min
}
