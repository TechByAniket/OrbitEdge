import { PageHeader, SectionCard, Badge } from '@/components/ui';
import { Sparkles, AlertTriangle, TrendingUp, Info } from 'lucide-react';

// Fetch insights directly from the API endpoint
async function getInsights() {
    try {
        const res = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000') + '/api/ai/insights', { next: { revalidate: 60 }});
        if (!res.ok) return [];
        return res.json();
    } catch {
        return [];
    }
}

export default async function AiAdvisorPage() {
  const insights = await getInsights();

  return (
    <div>
      <PageHeader
        title="AI Revenue Advisor"
        subtitle="Automated market intelligence and rate recommendations"
        breadcrumb={['OrbitEdge', 'AI Advisor']}
        actions={
          <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg border"
            style={{ borderColor: 'var(--brand)', color: 'var(--brand)', background: 'rgba(59,130,246,0.1)' }}>
            <Sparkles size={12} />
            OrbitEdge AI Active
          </div>
        }
      />

      <div className="px-8 max-w-4xl mx-auto space-y-6 pb-12">
        {insights.map((insight: any) => {
            const isWarning = insight.type === 'warning';
            const isOpportunity = insight.type === 'opportunity';
            
            return (
                <SectionCard key={insight.id} noPad>
                    <div className="p-6 flex items-start gap-4">
                        <div className={`p-3 rounded-xl flex-shrink-0 ${isWarning ? 'bg-red-500/10 text-red-500' : isOpportunity ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}`}>
                            {isWarning ? <AlertTriangle size={24} /> : isOpportunity ? <TrendingUp size={24} /> : <Info size={24} />}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{insight.title}</h3>
                                <Badge variant={isWarning ? 'negative' : isOpportunity ? 'positive' : 'brand'}>{insight.impact} Impact</Badge>
                            </div>
                            <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                {insight.content}
                            </p>
                            <div className="mt-4 flex gap-3">
                                {isOpportunity && (
                                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors">
                                        Review Rate Changes
                                    </button>
                                )}
                                <button className="px-4 py-2 border border-gray-700 hover:bg-gray-800 text-gray-300 text-xs font-semibold rounded-lg transition-colors">
                                    Dismiss Insight
                                </button>
                            </div>
                        </div>
                    </div>
                </SectionCard>
            )
        })}
      </div>
    </div>
  );
}
