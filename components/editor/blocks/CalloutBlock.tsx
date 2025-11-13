'use client';

import { Info, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CalloutBlockProps {
  content: { text?: string; type?: 'info' | 'warning' | 'success' | 'error' };
  onChange: (content: any) => void;
  onMenuToggle: () => void;
}

const calloutTypes = {
  info: {
    icon: Info,
    bg: 'bg-blue-50 dark:bg-blue-950',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-900 dark:text-blue-100',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-yellow-50 dark:bg-yellow-950',
    border: 'border-yellow-200 dark:border-yellow-800',
    text: 'text-yellow-900 dark:text-yellow-100',
  },
  success: {
    icon: CheckCircle,
    bg: 'bg-green-50 dark:bg-green-950',
    border: 'border-green-200 dark:border-green-800',
    text: 'text-green-900 dark:text-green-100',
  },
  error: {
    icon: AlertCircle,
    bg: 'bg-red-50 dark:bg-red-950',
    border: 'border-red-200 dark:border-red-800',
    text: 'text-red-900 dark:text-red-100',
  },
};

export function CalloutBlock({ content, onChange, onMenuToggle }: CalloutBlockProps) {
  const type = content.type || 'info';
  const Icon = calloutTypes[type].icon;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === '/') {
      e.preventDefault();
      onMenuToggle();
    }
  };

  return (
    <div
      className={cn(
        'flex gap-3 rounded-lg border-2 p-4',
        calloutTypes[type].bg,
        calloutTypes[type].border
      )}
    >
      <div className="flex items-start gap-3 flex-1">
        <Icon className={cn('h-5 w-5 mt-0.5', calloutTypes[type].text)} />
        <input
          type="text"
          value={content.text || ''}
          onChange={(e) => onChange({ ...content, text: e.target.value })}
          onKeyDown={handleKeyDown}
          placeholder="Callout text..."
          className={cn(
            'flex-1 border-none bg-transparent outline-none',
            calloutTypes[type].text,
            'placeholder:opacity-50'
          )}
        />
      </div>
      <Select
        value={type}
        onValueChange={(newType) => onChange({ ...content, type: newType })}
      >
        <SelectTrigger className="w-[100px] h-8">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="info">Info</SelectItem>
          <SelectItem value="warning">Warning</SelectItem>
          <SelectItem value="success">Success</SelectItem>
          <SelectItem value="error">Error</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
