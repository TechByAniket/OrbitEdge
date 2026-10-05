import { PageHeader, SectionCard, Badge } from '@/components/ui';
import { api } from '@/lib/api';
import { ScenarioManager } from './ScenarioManager';

export default async function ScenariosPage() {
  let scenarios = [];
  try {
    const res = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000') + '/api/scenarios/', { cache: 'no-store' });
    if (res.ok) {
      scenarios = await res.json();
    }
  } catch (e) {
    // Ignore error
  }

  return (
    <div>
      <PageHeader
        title="Booking Scenarios"
        subtitle="Configure the booking parameters used by the tracking orchestrator"
        breadcrumb={['OrbitEdge', 'Scenarios']}
      />

      <div className="px-8 mb-8">
        <SectionCard title="Active Scenarios">
          <ScenarioManager initialScenarios={scenarios} />
        </SectionCard>
      </div>
    </div>
  );
}
