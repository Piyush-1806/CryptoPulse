import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';

interface StatusCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  iconBgColor: string;
  change?: {
    value: string;
    isPositive: boolean;
  };
  period?: string;
}

export function StatusCard({ title, value, icon, iconBgColor, change, period }: StatusCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <p className="text-2xl font-semibold text-white mt-1">{value}</p>
        </div>
        <div className={`rounded-full ${iconBgColor} p-2`}>
          {icon}
        </div>
      </div>
      {change && (
        <div className="mt-4">
          <span className={`text-sm ${change.isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {change.value}
          </span>
          {period && <span className="text-sm text-slate-500 ml-2">{period}</span>}
        </div>
      )}
    </Card>
  );
}
