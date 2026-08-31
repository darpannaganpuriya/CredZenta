import { cn } from "../../lib/utils";
import type { RiskLevel } from "../../types";
import { ShieldAlert, ShieldCheck, ShieldX, AlertTriangle } from "lucide-react";

const riskConfig: Record<
  RiskLevel,
  { label: string; className: string; icon: React.ElementType }
> = {
  Low: {
    label: "Low Risk",
    className: "risk-badge-low",
    icon: ShieldCheck,
  },
  Medium: {
    label: "Medium Risk",
    className: "risk-badge-medium",
    icon: AlertTriangle,
  },
  High: {
    label: "High Risk",
    className: "risk-badge-high",
    icon: ShieldAlert,
  },
  Critical: {
    label: "Critical Risk",
    className: "risk-badge-critical",
    icon: ShieldX,
  },
};

interface RiskBadgeProps {
  level: RiskLevel;
  showIcon?: boolean;
  className?: string;
}

export function RiskBadge({ level, showIcon = true, className }: RiskBadgeProps) {
  const config = riskConfig[level];
  const Icon = config.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium",
        config.className,
        className
      )}
    >
      {showIcon && <Icon className="w-3 h-3" />}
      {config.label}
    </span>
  );
}
