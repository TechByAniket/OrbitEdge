import { PageHeader, SectionCard, Badge, EmptyState, fmtINR } from '@/components/ui';
import { Bell, TrendingUp, TrendingDown, AlertTriangle, Info, CheckCircle, Activity } from 'lucide-react';
import { api } from '@/lib/api';

const icons: Record<string, React.ReactNode> = {
  PRICE_INCREASE: <TrendingUp size={16} />,
  PRICE_DECREASE: <TrendingDown size={16} />,
  SOLD_OUT: <AlertTriangle size={16} />,
  AVAILABILITY_DECREASE: <TrendingDown size={16} />,
  AVAILABILITY_INCREASE: <TrendingUp size={16} />,
  DEFAULT: <Info size={16} />,
};

const severityColor: Record<string, string> = {
  HIGH: 'var(--negative)',
  MEDIUM: 'var(--warning)',
  LOW: 'var(--brand)',
  DEFAULT: 'var(--text-muted)'
};

export default async function AlertsPage() {
  const alerts = await api.getAlerts().catch(() => []);
  const unreadCount = alerts.filter((a: any) => !a.is_read).length;

  return (
    <div>
      <PageHeader
        title="Alerts"
        subtitle={`${unreadCount} unread alerts · Market intelligence monitoring`}
        breadcrumb={['OrbitEdge', 'Alerts']}
        actions={unreadCount > 0 ? <Badge variant="negative">{unreadCount} New</Badge> : null}
      />

      <div className="px-8 mb-8">
        <SectionCard noPad>
          {alerts.length === 0 ? (
            <div className="p-8">
              <EmptyState 
                icon={<Bell size={24} />} 
                title="No recent alerts" 
                description="Run the tracker to detect market movements and pricing changes." 
              />
            </div>
          ) : (
            <div className="p-6">
              <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
                {alerts.map((alert: any) => {
                  const isRead = alert.is_read;
                  const severity = alert.severity || 'DEFAULT';
                  const type = alert.event_type || 'DEFAULT';
                  const time = new Date(alert.created_at).toLocaleString();
                  const title = alert.alert_type || alert.alert_title || 'Market Alert';
                  const message = alert.message || alert.alert_message || '';

                  // Helper to colorize numbers, currencies, and percentages based on context
                  const colorizeText = (text: string, eventType: string) => {
                    const parts = text.split(/(₹\d+(?:,\d+)*(?:\.\d+)?|[+-\u2212]?\d+(?:\.\d+)?%|\b\d+\b)/g);
                    return parts.map((part, i) => {
                      if (/(₹\d+(?:,\d+)*(?:\.\d+)?|[+-\u2212]?\d+(?:\.\d+)?%|\b\d+\b)/.test(part)) {
                        let color = 'var(--brand)'; // default blue
                        
                        // If it explicitly has a + or is a currency in a price increase
                        if (part.includes('+') || (eventType === 'PRICE_INCREASE' && part.startsWith('₹'))) {
                          color = 'var(--positive)';
                        } 
                        // If it explicitly has a - or is a currency in a price decrease
                        else if (part.includes('-') || part.includes('\u2212') || (eventType === 'PRICE_DECREASE' && part.startsWith('₹'))) {
                          color = 'var(--negative)';
                        }

                        return <span key={i} className="font-semibold" style={{ color }}>{part}</span>;
                      }
                      return part;
                    });
                  };
                  
                  return (
                    <div key={alert.id}
                      className="rounded-xl border p-5 flex items-start gap-4 transition-all hover:border-blue-500/30"
                      style={{ 
                        borderColor: 'var(--border)', 
                        background: 'var(--bg-surface)', 
                        opacity: isRead ? 0.75 : 1 
                      }}>
                      <div className="mt-0.5 flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ background: `${severityColor[severity] || severityColor.DEFAULT}15`, color: severityColor[severity] || severityColor.DEFAULT }}>
                        {icons[type] || icons.DEFAULT}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{colorizeText(title, type)}</div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {!isRead && <span className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" style={{ background: 'var(--brand)' }} />}
                            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{time}</span>
                          </div>
                        </div>
                        <div className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{colorizeText(message, type)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
