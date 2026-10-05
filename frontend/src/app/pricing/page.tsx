import { PageHeader, SectionCard, Badge, EmptyState, fmtINR, KpiCard } from '@/components/ui';
import { DollarSign, TrendingUp, AlertTriangle, ArrowRightLeft, Activity } from 'lucide-react';
import { api } from '@/lib/api';

export const dynamic = 'force-dynamic';

export default async function PricingPage() {
  const summary = await api.getDashboardSummary().catch(() => null);
  const competitorsData = await api.getCompetitorsRanking().catch(() => []);
  
  const market = summary?.market || {};
  const primaryInfo = summary?.primary?.info || {};
  const primaryMetrics = summary?.primary?.metrics || {};
  
  const primaryPrice = primaryInfo?.price?.[0]?.price || 0;
  const marketAvg = market?.avg_market_price || 0;
  
  const sortedComps = [...competitorsData].sort((a, b) => (a.price || 0) - (b.price || 0));

  return (
    <div>
      <PageHeader
        title="Pricing Intelligence"
        subtitle={`Market positioning & rate distribution · ${primaryInfo?.property_name || 'Primary Hotel'}`}
        breadcrumb={['OrbitEdge', 'Pricing Intelligence']}
      />

      {/* KPI Row */}
      <div className="px-8 grid grid-cols-4 gap-4 mb-6">
        <KpiCard
          label="Your Current Rate"
          value={fmtINR(primaryPrice)}
          subtext="Base price for tonight"
          icon={<DollarSign size={16} />}
          highlight
        />
        <KpiCard
          label="Market Average"
          value={fmtINR(marketAvg)}
          subtext="Across all tracked competitors"
          icon={<Activity size={16} />}
        />
        <KpiCard
          label="Positioning vs Market"
          value={`${primaryPrice > marketAvg ? '+' : ''}${marketAvg ? ((primaryPrice - marketAvg) / marketAvg * 100).toFixed(1) : 0}%`}
          change={0}
          subtext="Premium/Discount"
          icon={<ArrowRightLeft size={16} />}
        />
        <KpiCard
          label="Est. Revenue 7 Days"
          value={fmtINR(primaryMetrics?.estimated_gross_booking_value || 0)}
          subtext="Based on demand score"
          icon={<TrendingUp size={16} />}
        />
      </div>

      <div className="px-8 mb-8 grid grid-cols-3 gap-6">
        <div className="col-span-2">
            <SectionCard title="Market Rate Distribution" subtitle={`Price spread across ${sortedComps.length} tracked properties`}>
                {sortedComps.length === 0 ? (
                  <div className="h-72 flex items-center justify-center text-sm" style={{ color: 'var(--text-muted)' }}>
                    No competitor data yet. Run the tracker to populate prices.
                  </div>
                ) : (() => {
                  const CHART_H = 220; // px — explicit height for bars

                  const prices = sortedComps.map(c => c.price || 0).filter(p => p > 0);
                  const minP = Math.floor(Math.min(...prices) / 1000) * 1000;
                  const maxP = Math.ceil(Math.max(...prices) / 1000) * 1000;
                  const bucketSize = Math.max(1000, Math.ceil((maxP - minP) / 10 / 500) * 500);
                  const buckets: number[] = [];
                  for (let b = minP; b <= maxP; b += bucketSize) buckets.push(b);

                  const counts = buckets.map(b => prices.filter(p => p >= b && p < b + bucketSize).length);
                  const maxCount = Math.max(1, ...counts);

                  return (
                    <div>
                      {/* Chart area */}
                      <div className="flex gap-3 items-end" style={{ height: `${CHART_H + 20}px`, paddingBottom: '28px' }}>

                        {/* Y-Axis labels */}
                        <div className="flex flex-col justify-between text-xs h-full pb-0 shrink-0" style={{ color: 'var(--text-muted)', height: `${CHART_H}px` }}>
                          <span>{maxCount}</span>
                          <span>{Math.round(maxCount * 0.66)}</span>
                          <span>{Math.round(maxCount * 0.33)}</span>
                          <span>0</span>
                        </div>

                        {/* Bars */}
                        <div className="flex items-end gap-1.5 w-full" style={{ height: `${CHART_H}px` }}>
                          {buckets.map((bucket, i) => {
                            const count = counts[i];
                            const barH = count === 0 ? 0 : Math.max(6, Math.round((count / maxCount) * CHART_H));
                            const isPrimary = primaryPrice >= bucket && primaryPrice < bucket + bucketSize;
                            const isAvg    = marketAvg >= bucket && marketAvg < bucket + bucketSize;

                            const bg = isPrimary
                              ? 'linear-gradient(to top, #2563eb, #60a5fa)'
                              : isAvg
                              ? 'linear-gradient(to top, #d97706, #fbbf24)'
                              : 'linear-gradient(to top, rgba(59,130,246,0.18), rgba(59,130,246,0.45))';

                            return (
                              <div key={bucket} className="flex-1 flex flex-col items-center justify-end relative group" style={{ height: `${CHART_H}px` }}>
                                {/* You / Avg badge */}
                                {isPrimary && (
                                  <div className="absolute text-xs font-bold px-1.5 py-0.5 rounded whitespace-nowrap z-10"
                                    style={{ bottom: `${barH + 6}px`, background: 'rgba(59,130,246,0.25)', color: 'var(--brand)', border: '1px solid rgba(59,130,246,0.4)' }}>
                                    You
                                  </div>
                                )}
                                {isAvg && !isPrimary && (
                                  <div className="absolute text-xs font-bold px-1.5 py-0.5 rounded whitespace-nowrap z-10"
                                    style={{ bottom: `${barH + 6}px`, background: 'rgba(245,158,11,0.2)', color: 'var(--warning)', border: '1px solid rgba(245,158,11,0.35)' }}>
                                    Avg
                                  </div>
                                )}
                                {/* Hover tooltip */}
                                {count > 0 && (
                                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block text-white text-xs rounded-lg px-2.5 py-1.5 whitespace-nowrap z-20 shadow-xl"
                                    style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border)' }}>
                                    {count} hotel{count !== 1 ? 's' : ''}<br/>
                                    <span style={{ color: 'var(--text-muted)' }}>{fmtINR(bucket)}–{fmtINR(bucket + bucketSize)}</span>
                                  </div>
                                )}
                                {/* Bar itself */}
                                <div
                                  className="w-full rounded-t-md transition-all duration-500 cursor-pointer hover:brightness-125"
                                  style={{
                                    height: `${barH}px`,
                                    background: bg,
                                    boxShadow: isPrimary ? '0 0 18px rgba(59,130,246,0.4)' : isAvg ? '0 0 12px rgba(245,158,11,0.3)' : 'none',
                                  }}
                                />
                                {/* X label */}
                                <div className="absolute text-center whitespace-nowrap" style={{ bottom: '-22px', fontSize: '10px', color: 'var(--text-muted)' }}>
                                  {(bucket / 1000).toFixed(0)}k
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Legend */}
                      <div className="flex items-center gap-5 mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                        <div className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded-sm inline-block" style={{ background: 'linear-gradient(to top,#2563eb,#60a5fa)' }} />
                          Your Rate
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded-sm inline-block" style={{ background: 'linear-gradient(to top,#d97706,#fbbf24)' }} />
                          Market Avg
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded-sm inline-block" style={{ background: 'rgba(59,130,246,0.35)' }} />
                          Competitors
                        </div>
                      </div>
                    </div>
                  );
                })()}
            </SectionCard>
        </div>

        
        <div>
            <SectionCard title="Pricing Opportunities" subtitle="AI-driven rate recommendations">
                <div className="space-y-4 mt-2">
                    {primaryPrice > marketAvg * 1.2 ? (
                        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="text-red-400 mt-0.5" size={16} />
                                <div>
                                    <h4 className="text-sm font-semibold text-red-100">Rate is highly uncompetitive</h4>
                                    <p className="text-xs text-red-200/70 mt-1">
                                        You are priced {((primaryPrice - marketAvg) / marketAvg * 100).toFixed(0)}% above the market average while demand is moderate. Consider running a flash sale to secure base occupancy.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : primaryPrice < marketAvg * 0.9 ? (
                        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                            <div className="flex items-start gap-3">
                                <TrendingUp className="text-green-400 mt-0.5" size={16} />
                                <div>
                                    <h4 className="text-sm font-semibold text-green-100">Opportunity to push rate</h4>
                                    <p className="text-xs text-green-200/70 mt-1">
                                        You are priced {Math.abs((primaryPrice - marketAvg) / marketAvg * 100).toFixed(0)}% below the market average. Competitors are selling out. You can safely increase rates by ₹500 tonight.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                            <div className="flex items-start gap-3">
                                <Activity className="text-blue-400 mt-0.5" size={16} />
                                <div>
                                    <h4 className="text-sm font-semibold text-blue-100">Perfectly Positioned</h4>
                                    <p className="text-xs text-blue-200/70 mt-1">
                                        Your rate is exactly in line with the market average. Hold rates steady and monitor competitor sell-outs over the next 4 hours.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </SectionCard>
        </div>
      </div>
    </div>
  );
}
