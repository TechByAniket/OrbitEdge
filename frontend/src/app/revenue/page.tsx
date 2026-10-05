import { PageHeader, KpiCard, SectionCard, Badge, fmtINR } from '@/components/ui';
import { DollarSign, TrendingUp, BarChart3, Zap } from 'lucide-react';
import { api } from '@/lib/api';

const DEMO_REVENUE_TREND = [
  { month: 'Jul', you: 1240000, market_avg: 1100000 },
  { month: 'Aug', you: 1580000, market_avg: 1350000 },
  { month: 'Sep', you: 1420000, market_avg: 1280000 },
  { month: 'Oct (partial)', you: 630000, market_avg: 570000 },
];

export default async function RevenuePage() {
  const summary = await api.getDashboardSummary().catch(() => null);
  const competitorsData = await api.getCompetitorsRanking().catch(() => []);
  
  const market = summary?.market || {};
  const primaryInfo = summary?.primary?.info || {};
  const primaryMetrics = summary?.primary?.metrics || {};

  const primaryPrice = primaryInfo?.price?.[0]?.price || 0;
  const marketAvg = market?.avg_market_price || 0;
  
  const estRevenueToday = primaryMetrics?.estimated_gross_booking_value || 0;
  const yourDemand = primaryMetrics?.booking_velocity || 0;
  
  // Calculate a rough Est RevPAR (Revenue Per Available Room)
  // Total est revenue / total tracked properties (market average proxy)
  const estRevPAR = marketAvg ? marketAvg * (yourDemand / 100) : 0;
  
  // Revenue Opportunity: What if you priced at market average and hit 90% demand?
  const maxPotentialRev = marketAvg * 0.9 * 30; // rough 30 room assumption
  const currentRev = primaryPrice * (yourDemand / 100) * 30;
  const revOpportunity = Math.max(0, maxPotentialRev - currentRev);

  // Sort competitors by Estimated Revenue
  const sortedByRevenue = [...competitorsData].sort((a, b) => (b.est_revenue || 0) - (a.est_revenue || 0)).slice(0, 20);

  return (
    <div>
      <PageHeader
        title="Revenue Intelligence"
        subtitle={`Estimated revenue, RevPAR, and revenue opportunity signals · ${primaryInfo?.property_name || 'Primary Hotel'}`}
        breadcrumb={['OrbitEdge', 'Revenue']}
      />

      <div className="px-8 grid grid-cols-4 gap-4 mb-6">
        <KpiCard 
          label="Est. Revenue 7 Days" 
          value={fmtINR(estRevenueToday)} 
          change={0} 
          subtext="Based on demand" 
          icon={<DollarSign size={16} />} 
          highlight 
        />
        <KpiCard 
          label="Est. RevPAR" 
          value={fmtINR(estRevPAR)} 
          change={0} 
          subtext="Revenue per available room" 
          icon={<BarChart3 size={16} />} 
        />
        <KpiCard 
          label="Market Avg Price" 
          value={fmtINR(marketAvg)} 
          change={0} 
          subtext="across tracked properties" 
          icon={<TrendingUp size={16} />} 
        />
        <KpiCard 
          label="Revenue Opportunity" 
          value={fmtINR(revOpportunity)} 
          subtext="If positioned at market avg" 
          icon={<Zap size={16} />} 
        />
      </div>

      <div className="px-8 grid grid-cols-2 gap-4 mb-8">
        <SectionCard 
            title="Monthly Revenue Trend" 
            subtitle="Estimated revenue vs market average"
            actions={<Badge variant="brand">Demo Data</Badge>}
        >
          <div className="space-y-4 mt-2">
            {DEMO_REVENUE_TREND.map(r => (
              <div key={r.month}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{r.month}</span>
                  <div className="flex gap-4">
                    <span style={{ color: 'var(--text-secondary)' }}>Market: {fmtINR(r.market_avg)}</span>
                    <span style={{ color: 'var(--brand)' }}>You: {fmtINR(r.you)}</span>
                  </div>
                </div>
                <div className="h-2 rounded-full flex overflow-hidden" style={{ background: 'var(--bg-overlay)' }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${(r.market_avg / 2000000) * 100}%`, background: 'var(--text-muted)' }} />
                </div>
                <div className="h-2 rounded-full flex overflow-hidden mt-1" style={{ background: 'var(--bg-overlay)' }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${(r.you / 2000000) * 100}%`, background: 'var(--brand)' }} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
        
        <SectionCard title="Competitor Revenue Estimates" subtitle="Top 20 properties by estimated GBV (7 Days)" noPad>
          <div className="overflow-x-auto max-h-[65vh] overflow-y-auto custom-scrollbar">
            <table className="w-full relative">
              <thead className="sticky top-0 z-10" style={{ background: 'var(--bg-surface)' }}>
                <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                {['#', 'Property', 'Est Revenue', 'Demand Bar'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider"
                    style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedByRevenue.length === 0 ? (
                <tr>
                    <td colSpan={4} className="text-center py-8 text-sm text-gray-500">No properties tracked</td>
                </tr>
              ) : sortedByRevenue.map((v, i) => (
                <tr key={v.id} className="border-b hover:bg-white/[0.02] transition-colors"
                  style={{ borderColor: 'var(--border-subtle)', background: v.is_primary ? 'rgba(59,130,246,0.04)' : undefined }}>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                  <td className="px-4 py-3 text-sm font-medium"
                    style={{ color: v.is_primary ? 'var(--brand)' : 'var(--text-primary)' }}>
                    {v.is_primary && <span className="inline-block w-1.5 h-1.5 rounded-full mr-2 bg-blue-400" />}
                    {v.name}
                  </td>
                  <td className="px-4 py-3 text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{fmtINR(v.est_revenue || 0)}</td>
                  <td className="px-4 py-3 w-40">
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-overlay)' }}>
                      <div className="h-full rounded-full"
                        style={{
                          width: `${Math.min(100, (v.est_revenue || 0) / ((v.est_revenue || 1) + 10000) * 100)}%`,
                          background: 'var(--brand)'
                        }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
