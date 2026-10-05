import { PageHeader, SectionCard, Badge } from '@/components/ui';
import { BrainCircuit, Lightbulb, TrendingUp, AlertTriangle, BarChart3 } from 'lucide-react';

const INSIGHTS = [
  {
    type: 'opportunity',
    icon: <TrendingUp size={18} />,
    title: 'Weekend Pricing Opportunity',
    detail: 'With 6 of 53 competitors currently sold out for this weekend, demand is significantly elevated. Your current rate of ₹4,500 is below your demand-adjusted optimal range of ₹5,000–₹5,500. Consider raising rates by ₹400–₹600 for Friday and Saturday nights.',
    impact: 'High',
    confidence: 87,
  },
  {
    type: 'alert',
    icon: <AlertTriangle size={18} />,
    title: 'Rate Parity Risk',
    detail: 'Summit Hotel and Della Resorts have raised their prices significantly in the last 48 hours. If you remain at ₹4,500, you may attract price-sensitive guests at the expense of perceived quality positioning. A moderate rate increase would strengthen your competitive position.',
    impact: 'Medium',
    confidence: 74,
  },
  {
    type: 'insight',
    icon: <BarChart3 size={18} />,
    title: 'Weekday Demand Softness',
    detail: 'Your demand score drops from 71 on weekends to an estimated 42 on Monday–Wednesday. Competitors in the ₹3,000–₹4,000 bracket are maintaining higher weekday occupancy. Consider a weekday promotional rate of ₹3,800 to compete more effectively in the mid-week segment.',
    impact: 'Low',
    confidence: 68,
  },
  {
    type: 'opportunity',
    icon: <Lightbulb size={18} />,
    title: 'Add-on Revenue Potential',
    detail: 'Properties offering breakfast packages are commanding an average premium of ₹800–₹1,200 per booking. With your current occupancy pattern, introducing a \'Bed & Breakfast\' package at ₹4,900 could generate an estimated ₹12,000–₹18,000 in additional monthly revenue.',
    impact: 'High',
    confidence: 81,
  },
];

const impactColors: Record<string, string> = { High: 'var(--positive)', Medium: 'var(--warning)', Low: 'var(--text-muted)' };

export default function AIAdvisorPage() {
  return (
    <div>
      <PageHeader
        title="AI Advisor"
        subtitle="Market-driven intelligence and pricing recommendations"
        breadcrumb={['OrbitEdge', 'AI Advisor']}
        actions={<Badge variant="brand">Powered by OrbitEdge AI</Badge>}
      />

      <div className="px-8 mb-6">
        <div className="rounded-xl border p-6"
          style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.06))', borderColor: 'rgba(59,130,246,0.2)' }}>
          <div className="flex items-center gap-3 mb-3">
            <BrainCircuit size={20} style={{ color: 'var(--brand)' }} />
            <span className="font-semibold text-sm" style={{ color: 'var(--brand)' }}>Market Summary · Today</span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            The Lonavala/Khandala market is showing <strong style={{ color: 'var(--positive)' }}>elevated demand</strong> this weekend,
            with 6 competitors fully booked. Your current rate of <strong style={{ color: 'var(--text-primary)' }}>₹4,500</strong> is
            positioned 8.4% above the market average, which is reasonable given your rating advantage (4.4★ vs market avg 4.2★).
            There are active pricing opportunities you should review below.
          </p>
        </div>
      </div>

      <div className="px-8 space-y-4 mb-8">
        {INSIGHTS.map((ins, i) => (
          <SectionCard key={i}>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center"
                style={{
                  background: ins.type === 'opportunity' ? 'rgba(16,185,129,0.1)' : ins.type === 'alert' ? 'rgba(239,68,68,0.1)' : 'rgba(59,130,246,0.1)',
                  color: ins.type === 'opportunity' ? 'var(--positive)' : ins.type === 'alert' ? 'var(--negative)' : 'var(--brand)',
                }}>
                {ins.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>{ins.title}</h3>
                  <Badge variant={ins.impact === 'High' ? 'positive' : ins.impact === 'Medium' ? 'warning' : 'neutral'}>
                    {ins.impact} Impact
                  </Badge>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{ins.detail}</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>AI Confidence:</span>
                  <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-overlay)' }}>
                    <div className="h-full rounded-full" style={{ width: `${ins.confidence}%`, background: 'var(--brand)' }} />
                  </div>
                  <span className="text-xs font-medium" style={{ color: 'var(--brand)' }}>{ins.confidence}%</span>
                </div>
              </div>
            </div>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}
