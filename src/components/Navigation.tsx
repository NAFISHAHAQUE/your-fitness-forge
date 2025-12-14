import { Home, Dumbbell, History, BarChart3, Lightbulb, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'generator', label: 'Generator', icon: Dumbbell },
  { id: 'history', label: 'History', icon: History },
  { id: 'progress', label: 'Progress', icon: BarChart3 },
  { id: 'tips', label: 'Tips', icon: Lightbulb },
  { id: 'feedback', label: 'Feedback', icon: MessageSquare },
];

export const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur-xl md:relative md:border-t-0 md:border-r md:bg-transparent">
      <div className="flex justify-around md:flex-col md:gap-1 md:p-3 overflow-x-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "group flex flex-col items-center gap-1 px-3 py-3 transition-all duration-200 md:flex-row md:gap-3 md:rounded-lg md:px-4 md:py-3 shrink-0",
                isActive
                  ? "text-primary md:bg-primary/10"
                  : "text-muted-foreground hover:text-foreground md:hover:bg-secondary"
              )}
            >
              <div className={cn(
                "relative rounded-lg p-1.5 transition-all duration-200",
                isActive && "gradient-primary shadow-glow"
              )}>
                <Icon className={cn(
                  "h-5 w-5 transition-transform duration-200 group-hover:scale-110",
                  isActive ? "text-primary-foreground" : "text-current"
                )} />
              </div>
              <span className={cn(
                "text-xs font-medium md:text-sm",
                isActive && "text-primary"
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
