import { PageHeader, SectionCard, Badge } from '@/components/ui';
import { Activity, Clock, Server, CheckCircle2, XCircle } from 'lucide-react';
import { api } from '@/lib/api';

export default async function TrackingPage() {
  let runs = [];
  try {
    const res = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000') + '/api/tracking/status?limit=20', { cache: 'no-store' });
    if (res.ok) {
      runs = await res.json();
    }
  } catch (e) {
    // Ignore error
  }

  return (
    <div>
      <PageHeader
        title="Tracking History"
        subtitle="View the status of recent market intelligence tracking cycles"
        breadcrumb={['OrbitEdge', 'Tracking']}
      />

      <div className="px-8 mb-8">
        <SectionCard title="Recent Tracking Runs" subtitle="Showing the last 20 automated or manual runs">
          <div className="overflow-x-auto max-h-[65vh] overflow-y-auto custom-scrollbar">
            <table className="w-full relative">
              <thead className="sticky top-0 z-10" style={{ background: 'var(--bg-surface)' }}>
                <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                  {['Run ID', 'Status', 'Start Time', 'Completion Time', 'Properties', 'Success Rate'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider"
                      style={{ color: 'var(--text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {runs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-sm text-gray-500">
                      No tracking runs found. Start a run from the Overview dashboard.
                    </td>
                  </tr>
                ) : (
                  runs.map((run: any) => {
                    const successRate = run.total_properties > 0 
                      ? Math.round((run.successful_properties / run.total_properties) * 100) 
                      : 0;
                    
                    return (
                      <tr key={run.id} className="border-b last:border-0" style={{ borderColor: 'var(--border-subtle)' }}>
                        <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
                          {run.id.substring(0, 8)}...
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={run.status === 'COMPLETED' ? 'positive' : run.status === 'RUNNING' ? 'warning' : 'negative'}>
                            {run.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-primary)' }}>
                          {new Date(run.created_at).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {run.completed_at ? new Date(run.completed_at).toLocaleString() : '-'}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-3">
                            <span className="flex items-center gap-1 text-gray-500"><Server size={12} /> {run.total_properties}</span>
                            <span className="flex items-center gap-1 text-green-500"><CheckCircle2 size={12} /> {run.successful_properties}</span>
                            <span className="flex items-center gap-1 text-red-500"><XCircle size={12} /> {run.failed_properties}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-1.5 rounded-full overflow-hidden bg-gray-800">
                              <div className="h-full bg-green-500" style={{ width: `${successRate}%` }} />
                            </div>
                            <span className="text-xs text-gray-400">{successRate}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
