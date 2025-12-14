import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { StatCard } from '@/components/StatCard';
import { WorkoutCard } from '@/components/WorkoutCard';
import { WorkoutFilters } from '@/components/WorkoutFilters';
import { ExerciseList } from '@/components/ExerciseList';
import { ProgressChart } from '@/components/ProgressChart';
import { WorkoutSession } from '@/components/WorkoutSession';
import { WorkoutLogCard } from '@/components/WorkoutLogCard';
import { WorkoutFeedback } from '@/components/WorkoutFeedback';
import { VideoDemo, getVideoUrl } from '@/components/VideoDemo';
import { Button } from '@/components/ui/button';
import { useWorkoutStore } from '@/hooks/useWorkoutStore';
import { useAuth } from '@/hooks/useAuth';
import { generateWorkout } from '@/lib/workoutGenerator';
import { Workout, WorkoutFilters as FilterType } from '@/types/workout';
import { supabase } from '@/integrations/supabase/client';
import { 
  Dumbbell, 
  Flame, 
  Clock, 
  Trophy, 
  Sparkles, 
  Plus,
  BookOpen,
  ChevronRight,
  Zap,
  LogOut,
  User,
  Lightbulb,
  MessageSquare,
  Star,
  Send
} from 'lucide-react';
import { toast } from 'sonner';
import heroBg from '@/assets/hero-bg.jpg';
import workoutPattern from '@/assets/workout-pattern.jpg';

interface FeedbackEntry {
  id: string;
  workout_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [filters, setFilters] = useState<FilterType>({
    type: 'strength',
    intensity: 'intermediate',
    duration: 'medium',
  });
  const [generatedWorkout, setGeneratedWorkout] = useState<Workout | null>(null);
  const [activeSession, setActiveSession] = useState<Workout | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastCompletedWorkout, setLastCompletedWorkout] = useState<Workout | null>(null);
  const [userFeedback, setUserFeedback] = useState<FeedbackEntry[]>([]);
  
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  
  const { 
    savedWorkouts, 
    workoutLogs, 
    stats, 
    saveWorkout, 
    removeWorkout,
    logWorkout,
    getRecentLogs,
    getWeeklyStats 
  } = useWorkoutStore();

  const weeklyStats = getWeeklyStats();
  const recentLogs = getRecentLogs(5);

  useEffect(() => {
    if (user) {
      fetchUserFeedback();
    }
  }, [user]);

  const fetchUserFeedback = async () => {
    const { data } = await supabase
      .from('workout_feedback')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (data) {
      setUserFeedback(data);
    }
  };

  const handleTabChange = (tab: string) => {
    if (tab === 'tips') {
      navigate('/tips');
    } else {
      setActiveTab(tab);
    }
  };

  const handleGenerateWorkout = () => {
    const workout = generateWorkout(filters);
    setGeneratedWorkout(workout);
    toast.success('Workout generated!', {
      description: `${workout.name} - ${workout.duration} min`,
    });
  };

  const handleSaveWorkout = (workout: Workout) => {
    saveWorkout(workout);
    toast.success('Workout saved!');
  };

  const handleStartWorkout = (workout: Workout) => {
    setActiveSession(workout);
  };

  const handleCompleteWorkout = (notes?: string) => {
    if (activeSession) {
      logWorkout(activeSession, notes);
      setLastCompletedWorkout(activeSession);
      setActiveSession(null);
      setShowFeedback(true);
      toast.success('Workout completed! 💪', {
        description: `Burned ${activeSession.estimatedCalories} calories`,
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
  };

  if (activeSession) {
    return (
      <WorkoutSession
        workout={activeSession}
        onComplete={handleCompleteWorkout}
        onCancel={() => setActiveSession(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <div className="flex">
        {/* Desktop Navigation */}
        <div className="hidden w-64 shrink-0 md:block">
          <div className="fixed left-0 top-0 h-full w-64 border-r border-border bg-card/50">
            <div className="p-6 flex flex-col h-full">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-glow">
                  <Dumbbell className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">FitForge</span>
              </div>
              <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
              
              {/* User Section */}
              <div className="mt-auto pt-6 border-t border-border">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 px-3 py-2">
                      <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center">
                        <User className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {user.user_metadata?.full_name || user.email?.split('@')[0]}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSignOut}
                      className="w-full justify-start text-muted-foreground hover:text-foreground"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => navigate('/auth')}
                    className="w-full"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="mx-auto max-w-5xl animate-fade-in">
              {/* Hero Section with Background */}
              <div 
                className="relative mb-8 rounded-2xl overflow-hidden"
                style={{ backgroundImage: `url(${heroBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-transparent" />
                <div className="relative p-8">
                  <h1 className="text-3xl font-bold text-foreground md:text-4xl">
                    Welcome back{user ? `, ${user.user_metadata?.full_name?.split(' ')[0] || 'Champion'}` : ''}! 💪
                  </h1>
                  <p className="mt-2 text-muted-foreground">
                    Ready to crush your fitness goals today?
                  </p>
                  {!user && (
                    <Button onClick={() => navigate('/auth')} className="mt-4">
                      <User className="h-4 w-4 mr-2" />
                      Sign in to save progress
                    </Button>
                  )}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                <StatCard
                  icon={Dumbbell}
                  label="Total Workouts"
                  value={stats.totalWorkouts}
                  accent
                />
                <StatCard
                  icon={Clock}
                  label="Total Minutes"
                  value={stats.totalMinutes}
                />
                <StatCard
                  icon={Flame}
                  label="Calories Burned"
                  value={stats.totalCalories.toLocaleString()}
                />
                <StatCard
                  icon={Trophy}
                  label="Current Streak"
                  value={`${stats.currentStreak} days`}
                  subValue={`Best: ${stats.longestStreak} days`}
                />
              </div>

              {/* Weekly Progress */}
              <div className="mb-8 rounded-xl border border-border bg-card p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground">
                    This Week
                  </h2>
                  <div className="flex gap-4 text-sm">
                    <span className="text-muted-foreground">
                      {weeklyStats.workouts} workouts
                    </span>
                    <span className="text-primary font-medium">
                      {weeklyStats.minutes} min
                    </span>
                  </div>
                </div>
                <ProgressChart logs={workoutLogs} />
              </div>

              {/* Quick Actions */}
              <div className="mb-8 grid gap-4 md:grid-cols-3">
                <button
                  onClick={() => setActiveTab('generator')}
                  className="group flex items-center gap-4 rounded-xl border border-primary/30 bg-primary/5 p-5 transition-all duration-300 hover:border-primary hover:bg-primary/10 hover:shadow-glow"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary shadow-glow">
                    <Sparkles className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-foreground">Generate Workout</h3>
                    <p className="text-sm text-muted-foreground">
                      Create a personalized routine
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-primary transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  onClick={() => navigate('/tips')}
                  className="group flex items-center gap-4 rounded-xl border border-accent/30 bg-accent/5 p-5 transition-all duration-300 hover:border-accent hover:bg-accent/10"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-accent">
                    <Lightbulb className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-foreground">Expert Tips</h3>
                    <p className="text-sm text-muted-foreground">
                      Pro advice from trainers
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-accent transition-transform group-hover:translate-x-1" />
                </button>

                {savedWorkouts.length > 0 && (
                  <button
                    onClick={() => handleStartWorkout(savedWorkouts[0])}
                    className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-primary/30"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                      <Zap className="h-6 w-6 text-foreground" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold text-foreground">Quick Start</h3>
                      <p className="text-sm text-muted-foreground">
                        {savedWorkouts[0].name}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </button>
                )}
              </div>

              {/* Recent Activity */}
              {recentLogs.length > 0 && (
                <div>
                  <h2 className="mb-4 text-lg font-semibold text-foreground">
                    Recent Activity
                  </h2>
                  <div className="space-y-3">
                    {recentLogs.slice(0, 3).map(log => (
                      <WorkoutLogCard key={log.id} log={log} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Generator */}
          {activeTab === 'generator' && (
            <div className="mx-auto max-w-4xl animate-fade-in">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground">
                  Workout Generator
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Customize your perfect workout routine
                </p>
              </div>

              <div 
                className="mb-8 rounded-xl border border-border bg-card p-6 relative overflow-hidden"
                style={{ backgroundImage: `url(${workoutPattern})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              >
                <div className="absolute inset-0 bg-card/95" />
                <div className="relative">
                  <WorkoutFilters filters={filters} onChange={setFilters} />
                  
                  <div className="mt-8">
                    <Button size="lg" onClick={handleGenerateWorkout} className="w-full sm:w-auto">
                      <Sparkles className="mr-2 h-5 w-5" />
                      Generate Workout
                    </Button>
                  </div>
                </div>
              </div>

              {generatedWorkout && (
                <div className="animate-scale-in space-y-6">
                  <WorkoutCard 
                    workout={generatedWorkout}
                    onStart={() => handleStartWorkout(generatedWorkout)}
                  />
                  
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => handleSaveWorkout(generatedWorkout)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Save Workout
                    </Button>
                    <Button 
                      variant="secondary"
                      onClick={handleGenerateWorkout}
                    >
                      Generate Another
                    </Button>
                  </div>

                  <div className="rounded-xl border border-border bg-card p-6">
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                      <BookOpen className="h-5 w-5 text-primary" />
                      Exercise Details
                    </h3>
                    <ExerciseList exercises={generatedWorkout.exercises} />
                    
                    {/* Video Demo for first exercise */}
                    <div className="mt-6 pt-6 border-t border-border">
                      <h4 className="text-sm font-medium text-foreground mb-3">
                        Watch: {generatedWorkout.exercises[0]?.name} Demo
                      </h4>
                      <VideoDemo
                        title={generatedWorkout.exercises[0]?.name || 'Exercise Demo'}
                        videoUrl={getVideoUrl(generatedWorkout.exercises[0]?.name || '')}
                        duration="2:30"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Saved Workouts */}
              {savedWorkouts.length > 0 && (
                <div className="mt-10">
                  <h2 className="mb-4 text-xl font-semibold text-foreground">
                    Saved Workouts
                  </h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {savedWorkouts.map(workout => (
                      <WorkoutCard
                        key={workout.id}
                        workout={workout}
                        onStart={() => handleStartWorkout(workout)}
                        onDelete={() => removeWorkout(workout.id)}
                        showDelete
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* History */}
          {activeTab === 'history' && (
            <div className="mx-auto max-w-3xl animate-fade-in">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground">
                  Workout History
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Track your fitness journey
                </p>
              </div>

              {workoutLogs.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border bg-card/50 p-12 text-center">
                  <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                    <Clock className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    No workouts yet
                  </h3>
                  <p className="mb-6 text-muted-foreground">
                    Complete your first workout to see it here
                  </p>
                  <Button onClick={() => setActiveTab('generator')}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Workout
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {workoutLogs.map(log => (
                    <WorkoutLogCard key={log.id} log={log} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Progress */}
          {activeTab === 'progress' && (
            <div className="mx-auto max-w-4xl animate-fade-in">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground">
                  Your Progress
                </h1>
                <p className="mt-2 text-muted-foreground">
                  See how far you've come
                </p>
              </div>

              {/* All-time Stats */}
              <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                <StatCard
                  icon={Dumbbell}
                  label="Total Workouts"
                  value={stats.totalWorkouts}
                  accent
                />
                <StatCard
                  icon={Clock}
                  label="Total Time"
                  value={`${Math.round(stats.totalMinutes / 60)}h ${stats.totalMinutes % 60}m`}
                />
                <StatCard
                  icon={Flame}
                  label="Calories Burned"
                  value={stats.totalCalories.toLocaleString()}
                />
                <StatCard
                  icon={Trophy}
                  label="Longest Streak"
                  value={`${stats.longestStreak} days`}
                />
              </div>

              {/* Weekly Activity Chart */}
              <div className="mb-8 rounded-xl border border-border bg-card p-6">
                <h2 className="mb-4 text-lg font-semibold text-foreground">
                  Weekly Activity
                </h2>
                <ProgressChart logs={workoutLogs} />
              </div>

              {/* Weekly Summary */}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-border bg-card p-5">
                  <p className="text-sm text-muted-foreground">This Week</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">
                    {weeklyStats.workouts}
                  </p>
                  <p className="text-sm text-muted-foreground">workouts</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-5">
                  <p className="text-sm text-muted-foreground">Time Active</p>
                  <p className="mt-1 text-2xl font-bold text-primary">
                    {weeklyStats.minutes}
                  </p>
                  <p className="text-sm text-muted-foreground">minutes</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-5">
                  <p className="text-sm text-muted-foreground">Calories</p>
                  <p className="mt-1 text-2xl font-bold text-accent">
                    {weeklyStats.calories}
                  </p>
                  <p className="text-sm text-muted-foreground">burned</p>
                </div>
              </div>
            </div>
          )}

          {/* Feedback Tab */}
          {activeTab === 'feedback' && (
            <div className="mx-auto max-w-3xl animate-fade-in">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                  <MessageSquare className="h-8 w-8 text-primary" />
                  Your Feedback
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Rate your workouts and help us improve
                </p>
              </div>

              {/* Show feedback form if workout was just completed */}
              {showFeedback && lastCompletedWorkout && (
                <div className="mb-8">
                  <WorkoutFeedback
                    workoutId={lastCompletedWorkout.id}
                    workoutName={lastCompletedWorkout.name}
                    onSubmit={() => {
                      setShowFeedback(false);
                      fetchUserFeedback();
                    }}
                  />
                </div>
              )}

              {/* Past Feedback */}
              {user ? (
                userFeedback.length > 0 ? (
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-foreground">Your Past Reviews</h2>
                    {userFeedback.map(feedback => (
                      <div 
                        key={feedback.id}
                        className="rounded-xl border border-border bg-card p-5"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= feedback.rating 
                                  ? 'fill-accent text-accent' 
                                  : 'text-muted-foreground'
                              }`}
                            />
                          ))}
                          <span className="text-xs text-muted-foreground ml-2">
                            {new Date(feedback.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {feedback.comment && (
                          <p className="text-sm text-foreground">{feedback.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-border bg-card/50 p-12 text-center">
                    <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                      <Star className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-foreground">
                      No feedback yet
                    </h3>
                    <p className="mb-6 text-muted-foreground">
                      Complete a workout to rate and review it
                    </p>
                    <Button onClick={() => setActiveTab('generator')}>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Start a Workout
                    </Button>
                  </div>
                )
              ) : (
                <div className="rounded-xl border border-dashed border-border bg-card/50 p-12 text-center">
                  <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                    <User className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    Sign in to leave feedback
                  </h3>
                  <p className="mb-6 text-muted-foreground">
                    Create an account to rate your workouts and track your reviews
                  </p>
                  <Button onClick={() => navigate('/auth')}>
                    <User className="mr-2 h-4 w-4" />
                    Sign In
                  </Button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    </div>
  );
};

export default Index;
