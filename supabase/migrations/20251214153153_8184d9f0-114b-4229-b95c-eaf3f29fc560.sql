-- Create feedback table for workout ratings and comments
CREATE TABLE public.workout_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  workout_id TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  improvement_suggestions TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create expert tips table
CREATE TABLE public.expert_tips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  expert_name TEXT NOT NULL,
  expert_title TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.workout_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expert_tips ENABLE ROW LEVEL SECURITY;

-- Feedback policies - users can only see and manage their own feedback
CREATE POLICY "Users can view their own feedback" 
ON public.workout_feedback FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own feedback" 
ON public.workout_feedback FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own feedback" 
ON public.workout_feedback FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own feedback" 
ON public.workout_feedback FOR DELETE 
USING (auth.uid() = user_id);

-- Expert tips are public read
CREATE POLICY "Anyone can view expert tips" 
ON public.expert_tips FOR SELECT 
USING (true);

-- Insert sample expert tips
INSERT INTO public.expert_tips (title, content, category, expert_name, expert_title) VALUES
('Progressive Overload is Key', 'To build muscle and strength, gradually increase the weight, frequency, or number of repetitions in your training routine. This progressive overload principle ensures continuous improvement.', 'Strength Training', 'Dr. Sarah Mitchell', 'Sports Physiologist'),
('Rest Days Matter', 'Your muscles grow during rest, not during workouts. Ensure you have at least 1-2 rest days per week. Active recovery like walking or yoga can help maintain mobility without overtraining.', 'Recovery', 'Coach Mike Thompson', 'Certified Personal Trainer'),
('Hydration Boosts Performance', 'Drink at least 500ml of water 2 hours before exercise and continue hydrating during your workout. Even mild dehydration can decrease performance by up to 25%.', 'Nutrition', 'Dr. Lisa Chen', 'Sports Nutritionist'),
('Master Form Before Weight', 'Perfect your exercise form with lighter weights before progressing. Poor form leads to injuries and reduces muscle activation. Quality always beats quantity.', 'Technique', 'James Rodriguez', 'Olympic Lifting Coach'),
('Sleep is Your Secret Weapon', 'Aim for 7-9 hours of quality sleep. During deep sleep, your body releases growth hormone essential for muscle repair and recovery. Poor sleep can increase cortisol and hinder progress.', 'Recovery', 'Dr. Amanda Foster', 'Sleep Specialist'),
('Warm Up Properly', 'Spend 5-10 minutes on dynamic stretching and light cardio before intense exercise. A proper warm-up increases blood flow, improves flexibility, and reduces injury risk by up to 50%.', 'Preparation', 'Coach Sarah Davis', 'Athletic Performance Coach');