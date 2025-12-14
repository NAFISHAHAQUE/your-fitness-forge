import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface WorkoutFeedbackProps {
  workoutId: string;
  workoutName: string;
  onSubmit?: () => void;
}

export const WorkoutFeedback = ({ workoutId, workoutName, onSubmit }: WorkoutFeedbackProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Please sign in to submit feedback');
        return;
      }

      const { error } = await supabase
        .from('workout_feedback')
        .insert({
          user_id: user.id,
          workout_id: workoutId,
          rating,
          comment: comment.trim() || null,
          improvement_suggestions: suggestions.trim() || null,
        });

      if (error) throw error;

      toast.success('Thank you for your feedback!');
      setRating(0);
      setComment('');
      setSuggestions('');
      onSubmit?.();
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 animate-fade-in">
      <h3 className="text-lg font-semibold text-foreground mb-2">
        Rate Your Workout
      </h3>
      <p className="text-sm text-muted-foreground mb-6">
        How was "{workoutName}"? Your feedback helps us improve.
      </p>

      {/* Star Rating */}
      <div className="mb-6">
        <Label className="text-foreground mb-3 block">Rating</Label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="transition-transform duration-200 hover:scale-110"
            >
              <Star
                className={cn(
                  'h-8 w-8 transition-colors duration-200',
                  (hoveredRating || rating) >= star
                    ? 'fill-accent text-accent'
                    : 'text-muted-foreground'
                )}
              />
            </button>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {rating === 1 && 'Poor - Needs improvement'}
          {rating === 2 && 'Fair - Below expectations'}
          {rating === 3 && 'Good - Met expectations'}
          {rating === 4 && 'Great - Above expectations'}
          {rating === 5 && 'Excellent - Exceeded expectations!'}
        </p>
      </div>

      {/* Comment */}
      <div className="mb-4">
        <Label htmlFor="comment" className="text-foreground mb-2 block">
          Comments (optional)
        </Label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts about this workout..."
          className="bg-secondary/50 border-border resize-none"
          rows={3}
        />
      </div>

      {/* Suggestions */}
      <div className="mb-6">
        <Label htmlFor="suggestions" className="text-foreground mb-2 block">
          Improvement Suggestions (optional)
        </Label>
        <Textarea
          id="suggestions"
          value={suggestions}
          onChange={(e) => setSuggestions(e.target.value)}
          placeholder="How could we make this workout better?"
          className="bg-secondary/50 border-border resize-none"
          rows={2}
        />
      </div>

      {/* Submit */}
      <Button
        onClick={handleSubmit}
        disabled={loading || rating === 0}
        className="w-full"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <Send className="h-4 w-4 mr-2" />
        )}
        Submit Feedback
      </Button>
    </div>
  );
};
