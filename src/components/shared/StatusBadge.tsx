import React from 'react';
import { MasteryLevel, RiskLevel, TrendDirection } from '../../types';
import { TrendingUp, TrendingDown, Minus, AlertCircle, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';

interface MasteryBadgeProps {
  level: MasteryLevel | number;
  showPercent?: boolean;
}

export const MasteryBadge: React.FC<MasteryBadgeProps> = ({ level, showPercent = false }) => {
  let status: MasteryLevel = 'developing';
  let percentage: number | null = null;

  if (typeof level === 'number') {
    percentage = level;
    if (level >= 75) status = 'mastered';
    else if (level >= 60) status = 'developing';
    else status = 'critical';
  } else {
    status = level;
  }

  const styles = {
    mastered: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-600/10',
    developing: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-600/10',
    critical: 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-600/10',
  };

  const labels = {
    mastered: 'Mastered',
    developing: 'Developing',
    critical: 'Critical Gap',
  };

  return (
    <span
      id={`mastery-badge-${status}`}
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[status]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'mastered' ? 'bg-emerald-500' : status === 'developing' ? 'bg-amber-500' : 'bg-rose-500'}`} />
      <span>{showPercent && percentage !== null ? `${percentage}%` : labels[status]}</span>
    </span>
  );
};

interface RiskBadgeProps {
  risk: RiskLevel;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ risk }) => {
  const config = {
    low: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      label: 'Low Risk',
      icon: CheckCircle2,
      dot: 'bg-emerald-500'
    },
    watch: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      label: 'Watch Signal',
      icon: Clock,
      dot: 'bg-amber-500'
    },
    elevated: {
      bg: 'bg-orange-50 text-orange-700 border-orange-200',
      label: 'Elevated Risk',
      icon: AlertCircle,
      dot: 'bg-orange-500'
    },
    critical: {
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      label: 'Critical Risk',
      icon: ShieldAlert,
      dot: 'bg-rose-500'
    },
  };

  const current = config[risk] || config.low;
  const Icon = current.icon;

  return (
    <span
      id={`risk-badge-${risk}`}
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${current.bg}`}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{current.label}</span>
    </span>
  );
};

interface TrendBadgeProps {
  trend: TrendDirection;
  delta?: number | string;
}

export const TrendBadge: React.FC<TrendBadgeProps> = ({ trend, delta }) => {
  if (trend === 'up') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
        <TrendingUp className="w-3.5 h-3.5" />
        {delta ? `${delta}` : 'Improving'}
      </span>
    );
  }
  if (trend === 'down') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600">
        <TrendingDown className="w-3.5 h-3.5" />
        {delta ? `${delta}` : 'Declining'}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500">
      <Minus className="w-3.5 h-3.5" />
      {delta ? `${delta}` : 'Stable'}
    </span>
  );
};

export const DemoDataBadge: React.FC<{ size?: 'sm' | 'md' }> = ({ size = 'sm' }) => (
  <span
    id="demo-data-badge"
    className={`inline-flex items-center gap-1 font-bold rounded-md uppercase tracking-wider ${
      size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs'
    } bg-purple-50 text-purple-700 border border-purple-200 shadow-2xs`}
  >
    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
    <span>Demo Data</span>
  </span>
);
