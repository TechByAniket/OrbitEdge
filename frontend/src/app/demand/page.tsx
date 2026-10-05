import { PageHeader, KpiCard, SectionCard, EmptyState, fmtINR } from '@/components/ui';
import { DemandChart, AvailabilityTrendChart } from '@/components/charts';
import { Activity, Zap, BarChart3, AlertTriangle } from 'lucide-react';

const DEMAND_DATA = [
  { date: 'Oct 7', demand: 55 }, { date: 'Oct 8', demand: 62 }, { date: 'Oct 9', demand: 48 },
  { date: 'Oct 10', demand: 75 }, { date: 'Oct 11', demand: 68 }, { date: 'Oct 12', demand: 82 },
  { date: 'Oct 13', demand: 71 },
];

const AVAIL_DATA = [
  { date: 'Oct 7', available: 48, sold_out: 5 }, { date: 'Oct 8', available: 46, sold_out: 7 },
  { date: 'Oct 9', available: 44, sold_out: 9 }, { date: 'Oct 10', available: 47, sold_out: 6 },
  { date: 'Oct 11', available: 43, sold_out: 10 }, { date: 'Oct 12', available: 50, sold_out: 3 },
  { date: 'Oct 13', available: 47, sold_out: 6 },
];

const VELOCITY_DATA = [
  { name: 'Della Resorts', velocity: 94, est_bookings: 28 },
  { name: 'Hilton Shillim', velocity: 91, est_bookings: 12 },
  { name: 'Summit Hotel', velocity: 89, est_bookings: 21 },
  { name: "Duke's Retreat", velocity: 84, est_bookings: 18 },
  { name: 'Sayaji Lonavala', velocity: 76, est_bookings: 24 },
  { name: 'ELITE HOTEL', velocity: 71, est_bookings: 19, isPrimary: true },
  { name: 'Fern Hill', velocity: 66, est_bookings: 15 },
  { name: 'Rhythm Lonavala', velocity: 58, est_bookings: 12 },
];

export default function DemandPage() {
  return (
    <div>
      <PageHeader
        title="Demand Intelligence"
        subtitle="Availability pressure, booking velocity, and demand signals"
        breadcrumb={['OrbitEdge', 'Demand']}
      />

      <div className="px-8 grid grid-cols-4 gap-4 mb-6">
        <KpiCard label="Your Demand Score" value="71 / 100" change={8.4} subtext="High demand" icon={<Activity size={16} />} highlight />
        <KpiCard label="Market Demand Avg" value="72 / 100" change={4.2} subtext="Strong weekend" icon={<BarChart3 size={16} />} />
        <KpiCard label="Sold Out Now" value="6 props" subtext="Highest pressure" icon={<AlertTriangle size={16} />} />
        <KpiCard label="Est. Booking Velocity" value="19/day" change={12.0} subtext="Your property" icon={<Zap size={16} />} />
      </div>

      <div className="px-8 grid grid-cols-2 gap-4 mb-6">
        <SectionCard title="Demand Signal Trend" subtitle="Market availability pressure 0–100">
          <DemandChart data={DEMAND_DATA} />
        </SectionCard>
        <SectionCard title="Availability Trend" subtitle="Available vs sold out properties per day">
          <AvailabilityTrendChart data={AVAIL_DATA} />
        </SectionCard>
      </div>

      <div className="px-8 mb-8">
        <SectionCard title="Booking Velocity Rankings" subtitle="Estimated daily bookings — sorted by velocity score" noPad>
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                {['#', 'Property', 'Velocity Score', 'Est. Bookings / Day', 'Demand Bar'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider"
                    style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {VELOCITY_DATA.map((v, i) => (
                <tr key={v.name} className="border-b hover:bg-white/[0.02] transition-colors"
                  style={{ borderColor: 'var(--border-subtle)', background: v.isPrimary ? 'rgba(59,130,246,0.04)' : undefined }}>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                  <td className="px-4 py-3 text-sm font-medium"
                    style={{ color: v.isPrimary ? 'var(--brand)' : 'var(--text-primary)' }}>
                    {v.isPrimary && <span className="inline-block w-1.5 h-1.5 rounded-full mr-2 bg-blue-400" />}
                    {v.name}
                  </td>
                  <td className="px-4 py-3 text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{v.velocity}/100</td>
                  <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>~{v.est_bookings}</td>
                  <td className="px-4 py-3 w-40">
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-overlay)' }}>
                      <div className="h-full rounded-full"
                        style={{
                          width: `${v.velocity}%`,
                          background: v.velocity > 80 ? 'var(--demand-high)' : v.velocity > 60 ? 'var(--demand-medium)' : 'var(--demand-low)'
                        }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>
      </div>
    </div>
  );
}
