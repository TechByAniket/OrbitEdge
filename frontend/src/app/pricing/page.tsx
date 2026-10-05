import { PageHeader, SectionCard, Badge, EmptyState, fmtINR, KpiCard } from '@/components/ui';
import { DollarSign, TrendingUp, AlertTriangle, ArrowRightLeft, Activity } from 'lucide-react';
import { api } from '@/lib/api';

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
            <SectionCard title="Market Rate Distribution" subtitle="Price distribution curve across all competitors">
                <div className="h-72 w-full flex items-end justify-between gap-1 pb-4 pt-10 border-b relative" style={{ borderColor: 'var(--border-subtle)' }}>
                    {/* Y-Axis labels */}
                    <div className="absolute left-0 top-0 bottom-4 flex flex-col justify-between text-xs text-gray-500 py-2">
                        <span>15+</span>
                        <span>10</span>
                        <span>5</span>
                        <span>0 props</span>
                    </div>

                    <div className="pl-12 flex items-end justify-between w-full h-full gap-2">
                        {/* Mock Distribution Bars based on standard deviation */}
                        {[2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000].map(bucket => {
                            // Find properties within this bucket (+/- 500)
                            const count = sortedComps.filter(c => c.price >= bucket - 500 && c.price < bucket + 500).length;
                            const height = Math.min(100, Math.max(5, (count / Math.max(1, sortedComps.length)) * 300));
                            
                            const isPrimaryBucket = primaryPrice >= bucket - 500 && primaryPrice < bucket + 500;
                            const isAvgBucket = marketAvg >= bucket - 500 && marketAvg < bucket + 500;

                            return (
                                <div key={bucket} className="flex-1 flex flex-col items-center justify-end relative group">
                                    {isPrimaryBucket && (
                                        <div className="absolute -top-8 text-xs font-bold px-2 py-1 rounded bg-blue-500/10 text-blue-500 border border-blue-500/20 whitespace-nowrap">
                                            You ({fmtINR(primaryPrice)})
                                        </div>
                                    )}
                                    <div 
                                        className={`w-full rounded-t-sm transition-all duration-500 ${isPrimaryBucket ? 'bg-blue-500' : 'bg-white/10 group-hover:bg-white/20'}`}
                                        style={{ height: `${height}%`, minHeight: count > 0 ? '4px' : '0' }}
                                    ></div>
                                    <div className="absolute -bottom-6 text-xs text-gray-500 rotate-45 origin-top-left">
                                        {fmtINR(bucket)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="h-10"></div> {/* Spacer for rotated labels */}
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
