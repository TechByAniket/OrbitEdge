'use client';
import { useState } from 'react';
import { Users, CalendarDays, BedDouble, CalendarSync, Plus, X, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui';

export function ScenarioManager({ initialScenarios }: { initialScenarios: any[] }) {
  const [scenarios, setScenarios] = useState(initialScenarios);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    scenario_name: '',
    guests: 2,
    rooms: 1,
    stay_duration: 1,
    date_type: 'weekday',
    is_active: true
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000') + '/api/scenarios/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const newScenario = await res.json();
        setScenarios([...scenarios, newScenario]);
        setIsModalOpen(false);
        setFormData({ scenario_name: '', guests: 2, rooms: 1, stay_duration: 1, date_type: 'weekday', is_active: true });
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000') + `/api/scenarios/${id}/active?is_active=${!currentStatus}`, {
        method: 'PATCH',
      });
      if (res.ok) {
        setScenarios(scenarios.map(s => s.id === id ? { ...s, is_active: !currentStatus } : s));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          The tracker runs a scrape cycle for all active scenarios below.
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 text-xs px-4 py-2 rounded-lg font-medium transition-colors text-white"
          style={{ background: 'var(--brand)' }}
        >
          <Plus size={14} /> Add Scenario
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[65vh] overflow-y-auto custom-scrollbar pr-2 items-start">
        {scenarios.map((scenario: any) => (
          <div key={scenario.id} className="border rounded-lg p-5" style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{scenario.scenario_name}</h3>
              <button onClick={() => toggleActive(scenario.id, scenario.is_active)}>
                <Badge variant={scenario.is_active ? 'positive' : 'neutral'}>
                  {scenario.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </button>
            </div>
            
            <div className="space-y-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <div className="flex items-center gap-2">
                <Users size={16} style={{ color: 'var(--text-muted)' }} />
                <span>{scenario.guests} Guests</span>
              </div>
              <div className="flex items-center gap-2">
                <BedDouble size={16} style={{ color: 'var(--text-muted)' }} />
                <span>{scenario.rooms} Room(s)</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays size={16} style={{ color: 'var(--text-muted)' }} />
                <span>{scenario.stay_duration} Night(s)</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarSync size={16} style={{ color: 'var(--text-muted)' }} />
                <span className="capitalize">{scenario.date_type} Date</span>
              </div>
            </div>
          </div>
        ))}
        
        {scenarios.length === 0 && (
          <div className="col-span-3 text-center py-8 text-sm text-gray-500">
            No scenarios configured in the database.
          </div>
        )}
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl p-6 shadow-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Create New Scenario</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ color: 'var(--text-muted)' }} className="hover:opacity-70 transition-opacity">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Scenario Name</label>
                <input required type="text" value={formData.scenario_name} onChange={e => setFormData({...formData, scenario_name: e.target.value})} 
                  placeholder="e.g. Family Weekend" 
                  className="w-full text-sm px-3 py-2 rounded-lg border outline-none focus:ring-1 focus:ring-blue-500" 
                  style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Guests</label>
                  <input required type="number" min="1" value={formData.guests} onChange={e => setFormData({...formData, guests: parseInt(e.target.value)})} 
                    className="w-full text-sm px-3 py-2 rounded-lg border outline-none focus:ring-1 focus:ring-blue-500" 
                    style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Rooms</label>
                  <input required type="number" min="1" value={formData.rooms} onChange={e => setFormData({...formData, rooms: parseInt(e.target.value)})} 
                    className="w-full text-sm px-3 py-2 rounded-lg border outline-none focus:ring-1 focus:ring-blue-500" 
                    style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Nights (Duration)</label>
                  <input required type="number" min="1" value={formData.stay_duration} onChange={e => setFormData({...formData, stay_duration: parseInt(e.target.value)})} 
                    className="w-full text-sm px-3 py-2 rounded-lg border outline-none focus:ring-1 focus:ring-blue-500" 
                    style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Date Type</label>
                  <select value={formData.date_type} onChange={e => setFormData({...formData, date_type: e.target.value})} 
                    className="w-full text-sm px-3 py-2 rounded-lg border outline-none focus:ring-1 focus:ring-blue-500" 
                    style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                    <option value="weekday">Weekday</option>
                    <option value="weekend">Weekend</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium rounded-lg" style={{ color: 'var(--text-secondary)' }}>
                  Cancel
                </button>
                <button disabled={loading} type="submit" className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-white disabled:opacity-50 transition-colors" style={{ background: 'var(--brand)' }}>
                  {loading ? <Loader2 size={16} className="animate-spin" /> : 'Create Scenario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
