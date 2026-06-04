'use client';

import dynamic from 'next/dynamic';
import type { EChartsOption } from 'echarts';
import type { PathogenTrendPoint } from '@/lib/types';
import { formatDate, formatNumber } from '@/lib/utils';

const ReactECharts = dynamic(() => import('echarts-for-react'), {
  ssr: false,
  loading: () => (
    <div style={{ height: 260, display: 'grid', placeItems: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
      Loading trend...
    </div>
  ),
});

type TooltipParam = {
  axisValue?: string;
  axisValueLabel?: string;
  marker?: unknown;
  seriesName?: string;
  value?: number | string | null | Array<number | string | null>;
};

function getTooltipValue(value: TooltipParam['value']) {
  if (Array.isArray(value)) {
    return value[value.length - 1];
  }

  return value;
}

function formatTooltip(params: TooltipParam | TooltipParam[]) {
  const rows = Array.isArray(params) ? params : [params];
  const row = rows.find((item) => getTooltipValue(item.value) !== null && getTooltipValue(item.value) !== undefined);
  const dateValue = row?.axisValueLabel || row?.axisValue || '';
  const header = dateValue ? `<strong>${formatDate(dateValue)}</strong>` : '<strong>Reported cases</strong>';

  if (!row) return header;

  return `${header}<br/>${typeof row.marker === 'string' ? row.marker : ''}${row.seriesName}: ${formatNumber(Number(getTooltipValue(row.value)))}`;
}

export default function PathogenCaseTrendChart({
  trend,
  color,
}: {
  trend: PathogenTrendPoint[];
  color: string;
}) {
  const rows = [...trend]
    .filter((point) => point.reportedCases !== null && point.reportedCases !== undefined)
    .sort((a, b) => a.date.localeCompare(b.date));

  const option: EChartsOption = {
    backgroundColor: 'transparent',
    color: [color],
    grid: { left: 34, right: 18, top: 18, bottom: 36, containLabel: true },
    tooltip: {
      trigger: 'axis',
      formatter: (params: unknown) => formatTooltip(params as TooltipParam | TooltipParam[]),
      backgroundColor: 'rgba(7,11,20,0.96)',
      borderColor: 'rgba(255,255,255,0.12)',
      textStyle: { color: '#e2e8f4', fontFamily: 'Inter, sans-serif', fontSize: 12 },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: rows.map((point) => point.date),
      axisLabel: {
        color: '#7d8fa9',
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: 10,
        formatter: (value: string) => formatDate(value).replace(', 2026', ''),
      },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.12)' } },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
      axisLabel: {
        color: '#7d8fa9',
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: 10,
      },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
    },
    series: [
      {
        name: 'Reported Cases',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: { color },
        lineStyle: { width: 2.5, color },
        areaStyle: { color: `${color}14` },
        data: rows.map((point) => point.reportedCases),
      },
    ],
  };

  return (
    <div className="glass-card" style={{ padding: '1.1rem', marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
            Reported Case Trend
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.76rem', lineHeight: 1.6 }}>
            Verified source-attributed reported cases over time.
          </p>
        </div>
        <span style={{ color, border: `1px solid ${color}40`, background: `${color}12`, borderRadius: 999, padding: '0.2rem 0.55rem', fontFamily: 'var(--font-mono)', fontSize: '0.62rem' }}>
          Reported cases
        </span>
      </div>

      {rows.length === 0 ? (
        <div style={{ height: 220, display: 'grid', placeItems: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', textAlign: 'center' }}>
          No verified trend data available yet.
        </div>
      ) : (
        <ReactECharts option={option} style={{ height: 260, width: '100%' }} notMerge lazyUpdate />
      )}
    </div>
  );
}
