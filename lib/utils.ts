import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
  return num.toLocaleString();
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

export function sanitizeText(text?: string): string {
  if (!text) return '';

  return text
    .replaceAll('â€”', '-')
    .replaceAll('â€“', '-')
    .replaceAll('â€¢', '-')
    .replaceAll('â†’', '->')
    .replaceAll('â†—', '->')
    .replaceAll('Â·', '|');
}

export function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function getSeverityColor(status: string): string {
  const map: Record<string, string> = {
    confirmed:   '#ef4444',
    suspected:   '#f97316',
    monitoring:  '#eab308',
    resolved:    '#22c55e',
    insufficient:'#475569',
  };
  return map[status] ?? '#475569';
}

export function getSeverityLabel(status: string): string {
  const map: Record<string, string> = {
    confirmed:   'Confirmed',
    suspected:   'Suspected',
    monitoring:  'Monitoring',
    resolved:    'Resolved',
    insufficient:'Insufficient Data',
  };
  return map[status] ?? 'Unknown';
}
