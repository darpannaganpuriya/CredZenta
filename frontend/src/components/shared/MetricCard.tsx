import { cn } from "../../lib/utils";
import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  iconColor?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
  onClick?: () => void;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = "text-brand-600",
  trend,
  trendValue,
  className,
  onClick,
}: MetricCardProps) {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor =
    trend === "up" ? "text-emerald-600" : trend === "down" ? "text-red-500" : "text-slate-400";

  return (
    <div
      className={cn("metric-card", onClick && "cursor-pointer", className)}
      onClick={onClick}
      role={onClick ? "button" : undefined}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider truncate">
            {title}
          </p>
          <p className="mt-1.5 text-2xl font-bold text-slate-900">{value}</p>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-500 truncate">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className={cn("flex-shrink-0 p-2.5 rounded-lg bg-slate-50", iconColor)}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      {trend && trendValue && (
        <div className={cn("mt-3 flex items-center gap-1 text-xs font-medium", trendColor)}>
          <TrendIcon className="w-3 h-3" />
          <span>{trendValue}</span>
        </div>
      )}
    </div>
  );
}
