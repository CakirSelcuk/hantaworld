'use client';

import dynamic from 'next/dynamic';
import { Activity, Skull } from 'lucide-react';
import type { EChartsOption } from 'echarts';
import type { GlobalStatsTrendPoint } from '@/lib/types';
import { formatDate, formatNumber } from '@/lib/utils';

const ReactECharts = dynamic(() => import('echarts-for-react'), {
  ssr: false,
  loading: () => (
    <div style={{ height: 300, display: 'grid', placeItems: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
      Loading trend...
    </div>
  ),
});

type TooltipParam = {
  axisValue?: string;
  axisValueLabel?: string;
  marker?: unknown;
  seriesName?: string;
  value?: number | string | Array<number | string>;
};

function getTooltipValue(value: TooltipParam['value']) {
  if (Array.isArray(value)) {
    return value[value.length - 1];
  }

  return value;
}

function formatTooltip(params: TooltipParam | TooltipParam[]) {
  const rows = Array.isArray(params) ? params : [params];
  const dateValue = rows[0]?.axisValueLabel || rows[0]?.axisValue || '';
  const header = dateValue ? `<strong>${formatDate(dateValue)}</strong>` : '<strong>Trend</strong>';
  const body = rows
    .map((row) => `${typeof row.marker === 'string' ? row.marker : ''}${row.seriesName}: ${formatNumber(Number(getTooltipValue(row.value) ?? 0))}`)
    .join('<br/>');

  return `${header}<br/>${body}`;
}

export default function GlobalStatsTrendChart({ trend }: { trend: GlobalStatsTrendPoint[] }) {
  const sortedTrend = [...trend].sort((a, b) => a.date.localeCompare(b.date));
  const latest = sortedTrend.at(-1);
  const first = sortedTrend[0];
  const caseDelta = latest && first ? latest.reportedCases - first.reportedCases : 0;
  const deathDelta = latest && first ? latest.totalDeaths - first.totalDeaths : 0;

  const option: EChartsOption = {
    backgroundColor: 'transparent',
    color: ['#ef4444', '#facc15'],
    grid: { left: 36, right: 18, top: 28, bottom: 36, containLabel: true },
    tooltip: {
      trigger: 'axis',
      formatter: (params: unknown) => formatTooltip(params as TooltipParam | TooltipParam[]),
      backgroundColor: 'rgba(7,11,20,0.96)',
      borderColor: 'rgba(255,255,255,0.12)',
      textStyle: { color: '#e2e8f4', fontFamily: 'Inter, sans-serif', fontSize: 12 },
    },
    legend: {
      top: 0,
      right: 0,
      itemWidth: 18,
      itemHeight: 8,
      textStyle: { color: '#7d8fa9', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 11 },
      data: ['Reported Cases', 'Total Deaths'],
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: sortedTrend.map((point) => point.date),
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
        symbolSize: 7,
        itemStyle: { color: '#ef4444' },
        lineStyle: { width: 3, color: '#ef4444' },
        areaStyle: { color: 'rgba(239,68,68,0.08)' },
        data: sortedTrend.map((point) => point.reportedCases),
      },
      {
        name: 'Total Deaths',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 7,
        itemStyle: { color: '#facc15' },
        lineStyle: { width: 3, color: '#facc15' },
        areaStyle: { color: 'rgba(250,204,21,0.06)' },
        data: sortedTrend.map((point) => point.totalDeaths),
      },
    ],
  };

  return (
    <section style={{ padding: '3rem 0' }}>
      <div className="container-main">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          <div>
            <div className="section-header" style={{ marginBottom: '0.75rem' }}>Case & Fatality Trend</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', lineHeight: 1.7, maxWidth: 680 }}>
              Daily verified totals from the public numeric feed, tracked from the first recorded outbreak update.
            </p>
          </div>

          {latest && (
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{ border: '1px solid rgba(239,68,68,0.22)', background: 'rgba(239,68,68,0.08)', borderRadius: 8, padding: '0.65rem 0.85rem', minWidth: 132 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fca5a5', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                  <Activity size={13} /> Cases
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', color: 'var(--text-primary)' }}>{formatNumber(latest.reportedCases)}</div>
                <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.62rem' }}>{caseDelta >= 0 ? '+' : ''}{formatNumber(caseDelta)} since start</div>
              </div>

              <div style={{ border: '1px solid rgba(250,204,21,0.24)', background: 'rgba(250,204,21,0.08)', borderRadius: 8, padding: '0.65rem 0.85rem', minWidth: 132 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fde047', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                  <Skull size={13} /> Deaths
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', color: 'var(--text-primary)' }}>{formatNumber(latest.totalDeaths)}</div>
                <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.62rem' }}>{deathDelta >= 0 ? '+' : ''}{formatNumber(deathDelta)} since start</div>
              </div>
            </div>
          )}
        </div>

        <div style={{ border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-xl)', background: 'rgba(13,20,38,0.54)', padding: '1rem', boxShadow: '0 18px 36px rgba(0,0,0,0.28)' }}>
          {sortedTrend.length === 0 ? (
            <div style={{ height: 300, display: 'grid', placeItems: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
              No trend data published yet.
            </div>
          ) : (
            <ReactECharts option={option} style={{ height: 300, width: '100%' }} notMerge lazyUpdate />
          )}
        </div>
      </div>
    </section>
  );
}
