import { PageHeader, KpiCard, SectionCard, EmptyState, fmtINR, Badge } from '@/components/ui';
import { DemandChart, AvailabilityTrendChart } from '@/components/charts';
import { Activity, Zap, BarChart3, AlertTriangle } from 'lucide-react';
import { api } from '@/lib/api';

const DEMO_DEMAND_DATA = [
  { date: 'Oct 7', demand: 55 }, { date: 'Oct 8', demand: 62 }, { date: 'Oct 9', demand: 48 },
  { date: 'Oct 10', demand: 75 }, { date: 'Oct 11', demand: 68 }, { date: 'Oct 12', demand: 82 },
  { date: 'Oct 13', demand: 71 },
];

const DEMO_AVAIL_DATA = [
  { date: 'Oct 7', available: 48, sold_out: 5 }, { date: 'Oct 8', available: 46, sold_out: 7 },
  { date: 'Oct 9', available: 44, sold_out: 9 }, { date: 'Oct 10', available: 47, sold_out: 6 },
  { date: 'Oct 11', available: 43, sold_out: 10 }, { date: 'Oct 12', available: 50, sold_out: 3 },
  { date: 'Oct 13', available: 47, sold_out: 6 },
];

export default async function DemandPage() {
  const summary = await api.getDashboardSummary().catch(() => null);
  const competitorsData = await api.getCompetitorsRanking().catch(() => []);
  
  const market = summary?.market || {};
  const primaryInfo = summary?.primary?.info || {};
  const primaryMetrics = summary?.primary?.metrics || {};

  const marketDemandAvg = market?.market_demand_score || 0;
  const yourDemand = primaryMetrics?.booking_velocity || 0;
  const soldOutCount = competitorsData.filter(c => c.availability === 'Sold Out' && !c.is_primary).length;

  // Sort competitors by demand (booking_velocity) descending for the Rankings table
  const sortedByVelocity = [...competitorsData].sort((a, b) => (b.demand || 0) - (a.demand || 0)).slice(0, 20);

  return (
    <div>
      <PageHeader
        title="Demand Intelligence"
        subtitle={`Availability pressure, booking velocity, and demand signals · ${primaryInfo?.property_name || 'Primary Hotel'}`}
        breadcrumb={['OrbitEdge', 'Demand']}
      />

      <div className="px-8 grid grid-cols-4 gap-4 mb-6">
        <KpiCard 
          label="Your Demand Score" 
          value={`${yourDemand.toFixed(0)} / 100`} 
          change={0} 
          subtext="Your velocity" 
          icon={<Activity size={16} />} 
          highlight 
        />
        <KpiCard 
          label="Market Demand Avg" 
          value={`${marketDemandAvg.toFixed(0)} / 100`} 
          change={0} 
          subtext="Market average" 
          icon={<BarChart3 size={16} />} 
        />
        <KpiCard 
          label="Sold Out Now" 
          value={`${soldOutCount} props`} 
          subtext="Highest pressure" 
          icon={<AlertTriangle size={16} />} 
        />
        <KpiCard 
          label="Est. Booking Velocity" 
          value={`${(yourDemand / 10).toFixed(1)}/day`} 
          change={0} 
          subtext="Estimated rooms sold" 
          icon={<Zap size={16} />} 
        />
      </div>

      <div className="px-8 grid grid-cols-2 gap-4 mb-6">
        <SectionCard 
            title="Demand Signal Trend" 
            subtitle="Market availability pressure 0–100"
            actions={<Badge variant="brand">Demo Data</Badge>}
        >
          <DemandChart data={DEMO_DEMAND_DATA} />
        </SectionCard>
        <SectionCard 
            title="Availability Trend" 
            subtitle="Available vs sold out properties per day"
            actions={<Badge variant="brand">Demo Data</Badge>}
        >
          <AvailabilityTrendChart data={DEMO_AVAIL_DATA} />
        </SectionCard>
      </div>

      <div className="px-8 mb-8">
        <SectionCard title="Booking Velocity Rankings" subtitle="Estimated daily bookings — sorted by velocity score" noPad>
          <div className="overflow-x-auto max-h-[65vh] overflow-y-auto custom-scrollbar">
            <table className="w-full relative">
              <thead className="sticky top-0 z-10" style={{ background: 'var(--bg-surface)' }}>
                <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                {['#', 'Property', 'Velocity Score', 'Est. Bookings / Day', 'Demand Bar'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider"
                    style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedByVelocity.length === 0 ? (
                <tr>
                    <td colSpan={5} className="text-center py-8 text-sm text-gray-500">No properties tracked</td>
                </tr>
              ) : sortedByVelocity.map((v, i) => (
                <tr key={v.id} className="border-b hover:bg-white/[0.02] transition-colors"
                  style={{ borderColor: 'var(--border-subtle)', background: v.is_primary ? 'rgba(59,130,246,0.04)' : undefined }}>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                  <td className="px-4 py-3 text-sm font-medium"
                    style={{ color: v.is_primary ? 'var(--brand)' : 'var(--text-primary)' }}>
                    {v.is_primary && <span className="inline-block w-1.5 h-1.5 rounded-full mr-2 bg-blue-400" />}
                    {v.name}
                  </td>
                  <td className="px-4 py-3 text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{(v.demand || 0).toFixed(0)}/100</td>
                  <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>~{((v.demand || 0) / 10).toFixed(1)}</td>
                  <td className="px-4 py-3 w-40">
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-overlay)' }}>
                      <div className="h-full rounded-full"
                        style={{
                          width: `${Math.min(100, v.demand || 0)}%`,
                          background: (v.demand || 0) > 80 ? 'var(--demand-high)' : (v.demand || 0) > 60 ? 'var(--demand-medium)' : 'var(--demand-low)'
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
