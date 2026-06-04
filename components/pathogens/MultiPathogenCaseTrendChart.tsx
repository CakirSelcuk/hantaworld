'use client';

import dynamic from 'next/dynamic';
import type { EChartsOption } from 'echarts';
import type { PathogenTrendPoint } from '@/lib/types';
import { formatDate, formatNumber } from '@/lib/utils';

const ReactECharts = dynamic(() => import('echarts-for-react'), {
  ssr: false,
  loading: () => (
    <div style={{ height: 320, display: 'grid', placeItems: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
      Loading pathogen trends...
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

function hasValue(value: number | null | undefined): value is number {
  return value !== null && value !== undefined;
}

function getTooltipValue(value: TooltipParam['value']) {
  if (Array.isArray(value)) {
    return value[value.length - 1];
  }

  return value;
}

function formatTooltip(params: TooltipParam | TooltipParam[]) {
  const rows = (Array.isArray(params) ? params : [params])
    .filter((row) => getTooltipValue(row.value) !== null && getTooltipValue(row.value) !== undefined);
  const dateValue = rows[0]?.axisValueLabel || rows[0]?.axisValue || '';
  const header = dateValue ? `<strong>${formatDate(dateValue)}</strong>` : '<strong>Reported cases</strong>';
  const body = rows
    .map((row) => `${typeof row.marker === 'string' ? row.marker : ''}${row.seriesName}: ${formatNumber(Number(getTooltipValue(row.value)))}`)
    .join('<br/>');

  return body ? `${header}<br/>${body}` : header;
}

export default function MultiPathogenCaseTrendChart({ trend }: { trend: PathogenTrendPoint[] }) {
  const rowsWithCases = trend.filter((point) => hasValue(point.reportedCases));
  const dates = [...new Set(rowsWithCases.map((point) => point.date))].sort((a, b) => a.localeCompare(b));
  const pathogens = [...new Map(rowsWithCases.map((point) => [
    point.pathogenSlug,
    {
      slug: point.pathogenSlug,
      displayName: point.pathogenDisplayName,
      color: point.pathogenColor || '#38bdf8',
    },
  ])).values()].sort((a, b) => a.displayName.localeCompare(b.displayName));

  const option: EChartsOption = {
    backgroundColor: 'transparent',
    color: pathogens.map((pathogen) => pathogen.color),
    grid: { left: 36, right: 18, top: 36, bottom: 38, containLabel: true },
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
      type: 'scroll',
      itemWidth: 18,
      itemHeight: 8,
      textStyle: { color: '#7d8fa9', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 11 },
      data: pathogens.map((pathogen) => pathogen.displayName),
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates,
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
    series: pathogens.map((pathogen) => ({
      name: pathogen.displayName,
      type: 'line',
      smooth: true,
      connectNulls: false,
      symbol: 'circle',
      symbolSize: 6,
      itemStyle: { color: pathogen.color },
      lineStyle: { width: 2.5, color: pathogen.color },
      emphasis: { focus: 'series' },
      data: dates.map((date) => rowsWithCases.find((point) => point.date === date && point.pathogenSlug === pathogen.slug)?.reportedCases ?? null),
    })),
  };

  return (
    <section style={{ padding: '3rem 0' }}>
      <div className="container-main">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          <div>
            <div className="section-header" style={{ marginBottom: '0.75rem' }}>Multi-Pathogen Case Trends</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', lineHeight: 1.7, maxWidth: 700 }}>
              Reported case trends by pathogen based on verified source-attributed updates.
            </p>
          </div>

          {pathogens.length > 0 && (
            <div style={{ border: '1px solid rgba(14,165,233,0.22)', background: 'rgba(14,165,233,0.08)', borderRadius: 8, padding: '0.65rem 0.85rem', minWidth: 150 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: '#bae6fd', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Active lines
              </div>
              <div style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontWeight: 650, fontSize: '1.25rem' }}>
                {pathogens.length}
              </div>
            </div>
          )}
        </div>

        <div style={{ border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-xl)', background: 'rgba(13,20,38,0.54)', padding: '1rem', boxShadow: '0 18px 36px rgba(0,0,0,0.28)' }}>
          {rowsWithCases.length === 0 ? (
            <div style={{ height: 320, display: 'grid', placeItems: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textAlign: 'center' }}>
              No verified data available yet.
            </div>
          ) : (
            <ReactECharts option={option} style={{ height: 320, width: '100%' }} notMerge lazyUpdate />
          )}
        </div>
      </div>
    </section>
  );
}
