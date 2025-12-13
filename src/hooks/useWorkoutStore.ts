import { useState, useEffect } from 'react';
import { Workout, WorkoutLog, UserStats } from '@/types/workout';

const STORAGE_KEYS = {
  WORKOUTS: 'fitforge-workouts',
  LOGS: 'fitforge-logs',
  STATS: 'fitforge-stats',
};

const defaultStats: UserStats = {
  totalWorkouts: 0,
  totalMinutes: 0,
  totalCalories: 0,
  currentStreak: 0,
  longestStreak: 0,
};

export const useWorkoutStore = () => {
  const [savedWorkouts, setSavedWorkouts] = useState<Workout[]>([]);
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [stats, setStats] = useState<UserStats>(defaultStats);

  // Load from localStorage on mount
  useEffect(() => {
    const storedWorkouts = localStorage.getItem(STORAGE_KEYS.WORKOUTS);
    const storedLogs = localStorage.getItem(STORAGE_KEYS.LOGS);
    const storedStats = localStorage.getItem(STORAGE_KEYS.STATS);

    if (storedWorkouts) setSavedWorkouts(JSON.parse(storedWorkouts));
    if (storedLogs) setWorkoutLogs(JSON.parse(storedLogs));
    if (storedStats) setStats(JSON.parse(storedStats));
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(savedWorkouts));
  }, [savedWorkouts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(workoutLogs));
  }, [workoutLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  }, [stats]);

  const saveWorkout = (workout: Workout) => {
    setSavedWorkouts(prev => {
      const exists = prev.find(w => w.id === workout.id);
      if (exists) return prev;
      return [...prev, workout];
    });
  };

  const removeWorkout = (workoutId: string) => {
    setSavedWorkouts(prev => prev.filter(w => w.id !== workoutId));
  };

  const logWorkout = (workout: Workout, notes?: string) => {
    const log: WorkoutLog = {
      id: `log-${Date.now()}`,
      workoutId: workout.id,
      workoutName: workout.name,
      completedAt: new Date(),
      duration: workout.duration,
      caloriesBurned: workout.estimatedCalories,
      notes,
    };

    setWorkoutLogs(prev => [log, ...prev]);

    // Update stats
    setStats(prev => {
      const today = new Date().toDateString();
      const lastWorkout = prev.totalWorkouts > 0 && workoutLogs[0]
        ? new Date(workoutLogs[0].completedAt).toDateString()
        : null;
      
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      const isConsecutive = lastWorkout === yesterday || lastWorkout === today;
      
      const newStreak = isConsecutive ? prev.currentStreak + 1 : 1;
      
      return {
        totalWorkouts: prev.totalWorkouts + 1,
        totalMinutes: prev.totalMinutes + workout.duration,
        totalCalories: prev.totalCalories + workout.estimatedCalories,
        currentStreak: newStreak,
        longestStreak: Math.max(prev.longestStreak, newStreak),
      };
    });
  };

  const getRecentLogs = (limit = 10) => {
    return workoutLogs.slice(0, limit);
  };

  const getWeeklyStats = () => {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weekLogs = workoutLogs.filter(log => 
      new Date(log.completedAt) >= oneWeekAgo
    );

    return {
      workouts: weekLogs.length,
      minutes: weekLogs.reduce((sum, log) => sum + log.duration, 0),
      calories: weekLogs.reduce((sum, log) => sum + log.caloriesBurned, 0),
    };
  };

  return {
    savedWorkouts,
    workoutLogs,
    stats,
    saveWorkout,
    removeWorkout,
    logWorkout,
    getRecentLogs,
    getWeeklyStats,
  };
};
