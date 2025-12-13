import { WorkoutLog } from '@/types/workout';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';

interface ProgressChartProps {
  logs: WorkoutLog[];
}

export const ProgressChart = ({ logs }: ProgressChartProps) => {
  // Create data for last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dayLogs = logs.filter(log => {
      const logDate = new Date(log.completedAt);
      return logDate.toDateString() === date.toDateString();
    });

    return {
      date: format(date, 'EEE'),
      fullDate: format(date, 'MMM d'),
      workouts: dayLogs.length,
      minutes: dayLogs.reduce((sum, log) => sum + log.duration, 0),
      calories: dayLogs.reduce((sum, log) => sum + log.caloriesBurned, 0),
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-border bg-card p-3 shadow-elevated">
          <p className="mb-1 text-sm font-medium text-foreground">
            {payload[0]?.payload?.fullDate}
          </p>
          <p className="text-xs text-muted-foreground">
            {payload[0]?.value} min • {payload[0]?.payload?.calories} cal
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={last7Days} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(142 76% 50%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(142 76% 50%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(220 10% 60%)', fontSize: 12 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(220 10% 60%)', fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="minutes"
            stroke="hsl(142 76% 50%)"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorMinutes)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
