'use client';
import { useState } from 'react';
import { Play, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function RunTrackingButton() {
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const router = useRouter();

  const handleRunTracking = async () => {
    setStatus('running');
    try {
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000') + '/api/tracking/start', {
        method: 'POST',
      });
      if (res.ok) {
        setStatus('success');
        setTimeout(() => {
          setStatus('idle');
          router.refresh();
        }, 3000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3000);
      }
    } catch (e) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <button 
      onClick={handleRunTracking}
      disabled={status === 'running'}
      className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg font-medium transition-colors"
      style={{ 
        background: status === 'error' ? 'var(--negative-bg)' : status === 'success' ? 'var(--positive-bg)' : 'var(--brand)', 
        color: status === 'error' ? 'var(--negative)' : status === 'success' ? 'var(--positive)' : 'white' 
      }}
    >
      {status === 'idle' && <><Play size={14} fill="currentColor" /> Run Tracking</>}
      {status === 'running' && <><Loader2 size={14} className="animate-spin" /> Tracking Market...</>}
      {status === 'success' && <><CheckCircle size={14} /> Run Started</>}
      {status === 'error' && <><AlertTriangle size={14} /> Error Starting</>}
    </button>
  );
}
