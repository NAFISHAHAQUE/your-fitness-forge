import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subValue?: string;
  accent?: boolean;
  className?: string;
}

export const StatCard = ({ 
  icon: Icon, 
  label, 
  value, 
  subValue, 
  accent,
  className 
}: StatCardProps) => {
  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-xl p-5 transition-all duration-300 hover:scale-[1.02]",
        "glass shadow-card",
        accent && "border-primary/30",
        className
      )}
    >
      {accent && (
        <div className="absolute inset-0 gradient-primary opacity-10" />
      )}
      <div className="relative z-10">
        <div className={cn(
          "mb-3 inline-flex rounded-lg p-2.5",
          accent ? "gradient-primary" : "bg-secondary"
        )}>
          <Icon className={cn(
            "h-5 w-5",
            accent ? "text-primary-foreground" : "text-primary"
          )} />
        </div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
        {subValue && (
          <p className="mt-0.5 text-xs text-muted-foreground">{subValue}</p>
        )}
      </div>
    </div>
  );
};
