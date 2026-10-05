import { PageHeader, SectionCard, Badge } from '@/components/ui';
import { Bell, TrendingUp, TrendingDown, AlertTriangle, Info, CheckCircle } from 'lucide-react';

const ALERTS = [
  { id: 1, type: 'price_surge', severity: 'warning', title: 'Summit Hotel price surge', desc: 'Summit Hotel increased price by ₹800 (+18.2%) in the last 6 hours.', time: '2h ago', read: false },
  { id: 2, type: 'sold_out', severity: 'negative', title: '6 competitors sold out', desc: 'Duke\'s Retreat, Summit, Della, Sayaji, Hilton, Novotel are fully booked for this weekend.', time: '3h ago', read: false },
  { id: 3, type: 'above_market', severity: 'brand', title: 'You are above market average', desc: 'Your current rate (₹4,500) is 8.4% above the market average (₹4,150).', time: '6h ago', read: false },
  { id: 4, type: 'price_drop', severity: 'positive', title: 'Fern Hill dropped price', desc: 'Fern Hill Resort decreased rate by ₹400 (−9.5%). This may indicate soft demand in the budget tier.', time: '4h ago', read: true },
  { id: 5, type: 'info', severity: 'neutral', title: 'Weekly tracking completed', desc: 'All 54 properties tracked successfully. 2 properties had temporary navigation errors and were retried.', time: '1d ago', read: true },
];

const icons: Record<string, React.ReactNode> = {
  price_surge: <TrendingUp size={16} />,
  sold_out: <AlertTriangle size={16} />,
  above_market: <Info size={16} />,
  price_drop: <TrendingDown size={16} />,
  info: <CheckCircle size={16} />,
};

const severityColor: Record<string, string> = {
  warning: 'var(--warning)',
  negative: 'var(--negative)',
  brand: 'var(--brand)',
  positive: 'var(--positive)',
  neutral: 'var(--text-muted)',
};

export default function AlertsPage() {
  const unread = ALERTS.filter(a => !a.read).length;

  return (
    <div>
      <PageHeader
        title="Alerts"
        subtitle={`${unread} unread alerts · Monitoring 54 properties`}
        breadcrumb={['OrbitEdge', 'Alerts']}
        actions={<Badge variant="negative">{unread} New</Badge>}
      />

      <div className="px-8 mb-8">
        <SectionCard noPad>
          <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {ALERTS.map(alert => (
              <div key={alert.id}
                className="flex items-start gap-4 px-6 py-5 hover:bg-white/[0.02] transition-colors"
                style={{ opacity: alert.read ? 0.65 : 1 }}>
                <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: `${severityColor[alert.severity]}15`, color: severityColor[alert.severity] }}>
                  {icons[alert.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{alert.title}</div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!alert.read && <span className="w-2 h-2 rounded-full" style={{ background: 'var(--brand)' }} />}
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{alert.time}</span>
                    </div>
                  </div>
                  <div className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>{alert.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
