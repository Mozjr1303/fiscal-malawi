import { AlertTriangle, ShieldCheck } from 'lucide-react';
import Skeleton from './Skeleton';

interface Anomaly {
  id: string;
  transactionId: string;
  anomalyScore: number;
  reason: string;
  timestamp: string;
}

interface Props {
  anomalies: Anomaly[];
  loading?: boolean;
}

export default function AnomalyAlerts({ anomalies, loading }: Props) {
  if (loading) {
    return (
      <div className="card col-span-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <h2 className="mb-4">Anomaly Alerts</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton" style={{ height: '100px', width: '100%', borderRadius: '0.75rem' }}></div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="card col-span-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
      <div className="flex justify-between items-center mb-4">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertTriangle color="var(--warning)" size={24} />
          Anomaly Alerts
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {anomalies.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-secondary)' }}>
            <ShieldCheck size={48} color="var(--success)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <p>No anomalies detected recently.</p>
            <p style={{ fontSize: '0.85rem' }}>System is operating normally.</p>
          </div>
        ) : (
          anomalies.map((anomaly) => (
            <div key={anomaly.id} style={{
              background: 'rgba(239, 68, 68, 0.05)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '0.75rem',
              padding: '1rem',
              borderLeft: '4px solid var(--danger)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong style={{ color: 'white' }}>Tx: #{anomaly.transactionId.substring(0, 8)}</strong>
                <span className="status-tag status-danger">
                  Score: {(anomaly.anomalyScore * 100).toFixed(1)}%
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {new Date(anomaly.timestamp).toLocaleString()}
              </p>
              {anomaly.reason && (
                <p style={{ fontSize: '0.85rem', color: 'var(--warning)', marginTop: '0.5rem', fontWeight: '500' }}>
                   AI Insight: {anomaly.reason}
                </p>
              )}
              <div style={{ marginTop: '0.75rem' }}>
                <button className="btn" style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem', background: 'var(--bg-tertiary)', color: 'white' }}>
                  Investigate
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
