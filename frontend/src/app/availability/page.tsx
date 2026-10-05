import { PageHeader, KpiCard, SectionCard, Badge } from '@/components/ui';
import { CalendarCheck, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { AvailabilityTrendChart } from '@/components/charts';

const AVAIL_DATA = [
  { date: 'Oct 7', available: 48, sold_out: 5 }, { date: 'Oct 8', available: 46, sold_out: 7 },
  { date: 'Oct 9', available: 44, sold_out: 9 }, { date: 'Oct 10', available: 47, sold_out: 6 },
  { date: 'Oct 11', available: 43, sold_out: 10 }, { date: 'Oct 12', available: 50, sold_out: 3 },
  { date: 'Oct 13', available: 47, sold_out: 6 },
];

const SOLD_OUT = ["Duke's Retreat", "Summit Hotel", "Della Resorts", "Sayaji Lonavala", "Hilton Shillim", "Novotel Imagica"];

export default function AvailabilityPage() {
  return (
    <div>
      <PageHeader
        title="Availability Intelligence"
        subtitle="Market availability pressure and sold-out tracking"
        breadcrumb={['OrbitEdge', 'Availability']}
      />

      <div className="px-8 grid grid-cols-4 gap-4 mb-6">
        <KpiCard label="Your Status" value="Available" subtext="Rooms available" icon={<CheckCircle size={16} />} highlight />
        <KpiCard label="Sold Out Now" value="6 / 53" subtext="Competitors fully booked" icon={<AlertTriangle size={16} />} />
        <KpiCard label="Low Availability" value="8 / 53" subtext="Last few rooms" icon={<TrendingUp size={16} />} />
        <KpiCard label="Market Fill Rate" value="72%" change={4.1} subtext="vs last week" icon={<CalendarCheck size={16} />} />
      </div>

      <div className="px-8 grid grid-cols-2 gap-4 mb-6">
        <SectionCard title="Availability Trend" subtitle="Available vs sold-out properties over time">
          <AvailabilityTrendChart data={AVAIL_DATA} />
        </SectionCard>
        <SectionCard title="Currently Sold Out" subtitle="Competitors with no availability right now" noPad>
          <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
            {SOLD_OUT.map((name, i) => (
              <div key={i} className="flex items-center justify-between px-6 py-3.5">
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{name}</span>
                <Badge variant="sold-out">Sold Out</Badge>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
