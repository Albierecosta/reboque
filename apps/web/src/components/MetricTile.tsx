import { TrendingUp, TrendingDown } from "lucide-react";

export function MetricTile({
  label,
  value,
  support,
  trend,
}: {
  label: string;
  value: string | number;
  support?: string;
  trend?: { value: string; positive: boolean };
}) {
  return (
    <div className="glass-card p-6 !rounded-[28px] group transition-all duration-500 hover:-translate-y-1">
      <div className="flex items-start justify-between">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{label}</p>
        {trend && (
          <div className={`flex items-center gap-1 text-[10px] font-bold ${trend.positive ? 'text-brand-400' : 'text-rose-400'}`}>
            {trend.positive ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
            {trend.value}
          </div>
        )}
      </div>
      
      <div className="mt-4 flex items-baseline gap-2">
        <p className="font-display text-4xl font-black text-white tracking-tight group-hover:glow-text transition-all duration-500">
          {value}
        </p>
        {support && <span className="text-xs font-semibold text-slate-500">{support}</span>}
      </div>

      <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-slate-800/50">
        <div 
          className="h-full bg-brand-500/50 rounded-full transition-all duration-1000" 
          style={{ width: '65%' }} 
        />
      </div>
    </div>
  );
}
