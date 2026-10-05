import { PageHeader, KpiCard, SectionCard, Badge, EmptyState } from '@/components/ui';
import { CalendarCheck, TrendingUp, AlertTriangle, CheckCircle, Activity } from 'lucide-react';
import { AvailabilityTrendChart } from '@/components/charts';
import { api } from '@/lib/api';

const DEMO_AVAIL_DATA = [
  { date: 'Oct 7', available: 48, sold_out: 5 }, { date: 'Oct 8', available: 46, sold_out: 7 },
  { date: 'Oct 9', available: 44, sold_out: 9 }, { date: 'Oct 10', available: 47, sold_out: 6 },
  { date: 'Oct 11', available: 43, sold_out: 10 }, { date: 'Oct 12', available: 50, sold_out: 3 },
  { date: 'Oct 13', available: 47, sold_out: 6 },
];

export default async function AvailabilityPage() {
  const summary = await api.getDashboardSummary().catch(() => null);
  const competitorsData = await api.getCompetitorsRanking().catch(() => []);
  
  const primaryInfo = summary?.primary?.info || {};
  const primaryAvailability = primaryInfo?.observations?.[0]?.available_units === 0 ? 'Sold Out' : 'Available';

  const soldOutCompetitors = competitorsData.filter(c => c.availability === 'Sold Out' && !c.is_primary);
  const totalTracked = summary?.total_properties_tracked || 54;
  const soldOutCount = soldOutCompetitors.length;
  
  // Calculate Market Fill Rate (rough estimate based on sold out)
  const fillRate = totalTracked ? ((soldOutCount / totalTracked) * 100).toFixed(1) : '0.0';

  return (
    <div>
      <PageHeader
        title="Availability Intelligence"
        subtitle={`Market availability pressure and sold-out tracking · ${primaryInfo?.property_name || 'Primary Hotel'}`}
        breadcrumb={['OrbitEdge', 'Availability']}
      />

      <div className="px-8 grid grid-cols-4 gap-4 mb-6">
        <KpiCard 
          label="Your Status" 
          value={primaryAvailability} 
          subtext="Rooms available" 
          icon={primaryAvailability === 'Sold Out' ? <AlertTriangle size={16} /> : <CheckCircle size={16} />} 
          highlight 
        />
        <KpiCard 
          label="Sold Out Now" 
          value={`${soldOutCount} / ${totalTracked}`} 
          subtext="Competitors fully booked" 
          icon={<AlertTriangle size={16} />} 
        />
        <KpiCard 
          label="Availability Pressure" 
          value={`${summary?.market?.market_demand_score?.toFixed(0) || 0} / 100`} 
          subtext="Demand Score" 
          icon={<TrendingUp size={16} />} 
        />
        <KpiCard 
          label="Market Fill Rate" 
          value={`${fillRate}%`} 
          change={0} 
          subtext="Sold out percentage" 
          icon={<CalendarCheck size={16} />} 
        />
      </div>

      <div className="px-8 grid grid-cols-2 gap-4 mb-6">
        <SectionCard 
            title="Availability Trend" 
            subtitle="Available vs sold-out properties over time"
            actions={<Badge variant="brand">Demo Data</Badge>}
        >
          <AvailabilityTrendChart data={DEMO_AVAIL_DATA} />
        </SectionCard>
        
        <SectionCard title="Currently Sold Out" subtitle="Competitors with no availability right now" noPad>
          {soldOutCompetitors.length === 0 ? (
            <div className="p-8">
              <EmptyState 
                icon={<Activity size={24} />} 
                title="No sold-out properties" 
                description="All tracked competitors currently have availability." 
              />
            </div>
          ) : (
            <div className="divide-y max-h-96 overflow-y-auto" style={{ borderColor: 'var(--border-subtle)' }}>
              {soldOutCompetitors.map((c, i) => (
                <div key={i} className="flex items-center justify-between px-6 py-3.5 hover:bg-white/[0.02] transition-colors">
                  <div>
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{c.name}</span>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{c.type} · {c.location}</div>
                  </div>
                  <Badge variant="sold-out">Sold Out</Badge>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
