import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Lightbulb, 
  Dumbbell, 
  User, 
  ArrowLeft,
  Sparkles,
  Heart,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import expertAvatar from '@/assets/expert-avatar.jpg';

interface ExpertTip {
  id: string;
  title: string;
  content: string;
  category: string;
  expert_name: string;
  expert_title: string | null;
  created_at: string;
}

const categoryIcons: Record<string, any> = {
  'Strength Training': Dumbbell,
  'Recovery': Heart,
  'Nutrition': Sparkles,
  'Technique': Zap,
  'Preparation': Lightbulb,
};

const categoryColors: Record<string, string> = {
  'Strength Training': 'bg-primary/20 text-primary border-primary/30',
  'Recovery': 'bg-accent/20 text-accent border-accent/30',
  'Nutrition': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'Technique': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Preparation': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

const ExpertTips = () => {
  const [tips, setTips] = useState<ExpertTip[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTips();
  }, []);

  const fetchTips = async () => {
    const { data, error } = await supabase
      .from('expert_tips')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tips:', error);
    } else {
      setTips(data || []);
    }
    setLoading(false);
  };

  const categories = [...new Set(tips.map(tip => tip.category))];
  const filteredTips = selectedCategory 
    ? tips.filter(tip => tip.category === selectedCategory)
    : tips;

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <div className="flex">
        {/* Desktop Navigation */}
        <div className="hidden w-64 shrink-0 md:block">
          <div className="fixed left-0 top-0 h-full w-64 border-r border-border bg-card/50">
            <div className="p-6">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-glow">
                  <Dumbbell className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">FitForge</span>
              </div>
              <Navigation activeTab="tips" onTabChange={(tab) => navigate(tab === 'tips' ? '/tips' : '/')} />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto max-w-4xl animate-fade-in">
            {/* Header */}
            <div className="mb-8">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="mb-4 -ml-2"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-3xl font-bold text-foreground md:text-4xl flex items-center gap-3">
                <Lightbulb className="h-8 w-8 text-primary" />
                Expert Tips
              </h1>
              <p className="mt-2 text-muted-foreground">
                Professional advice from fitness experts to optimize your training
              </p>
            </div>

            {/* Category Filter */}
            <div className="mb-8 flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                All Tips
              </Button>
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Tips Grid */}
            {loading ? (
              <div className="grid gap-6 md:grid-cols-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="rounded-xl border border-border bg-card p-6 animate-pulse">
                    <div className="h-6 bg-secondary rounded w-3/4 mb-4" />
                    <div className="h-4 bg-secondary rounded w-full mb-2" />
                    <div className="h-4 bg-secondary rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {filteredTips.map((tip, index) => {
                  const Icon = categoryIcons[tip.category] || Lightbulb;
                  const colorClass = categoryColors[tip.category] || 'bg-primary/20 text-primary border-primary/30';
                  
                  return (
                    <div
                      key={tip.id}
                      className="group rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-glow animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Category Badge */}
                      <Badge className={`${colorClass} border mb-4`}>
                        <Icon className="h-3 w-3 mr-1" />
                        {tip.category}
                      </Badge>

                      {/* Title */}
                      <h3 className="text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                        {tip.title}
                      </h3>

                      {/* Content */}
                      <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                        {tip.content}
                      </p>

                      {/* Expert */}
                      <div className="flex items-center gap-3 pt-4 border-t border-border">
                        <div className="h-10 w-10 rounded-full overflow-hidden bg-secondary">
                          <img 
                            src={expertAvatar} 
                            alt={tip.expert_name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {tip.expert_name}
                          </p>
                          {tip.expert_title && (
                            <p className="text-xs text-muted-foreground">
                              {tip.expert_title}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <Navigation activeTab="tips" onTabChange={(tab) => navigate(tab === 'tips' ? '/tips' : '/')} />
      </div>
    </div>
  );
};

export default ExpertTips;
