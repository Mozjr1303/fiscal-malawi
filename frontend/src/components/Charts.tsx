import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Skeleton from './Skeleton';

interface Props {
  data: any[];
  loading?: boolean;
}

export default function Charts({ data, loading }: Props) {
  if (loading) {
    return (
      <div className="card col-span-12 animate-fade-in" style={{ animationDelay: '0.2s', marginBottom: '1.5rem' }}>
        <h2 className="mb-4">Volume Trends (24h)</h2>
        <Skeleton height="300px" width="100%" />
      </div>
    );
  }
  // Use actual data if provided, otherwise empty
  const chartData = data || [];

  if (chartData.length === 0) {
    return (
      <div className="card col-span-12 animate-fade-in" style={{ animationDelay: '0.2s', marginBottom: '1.5rem', textAlign: 'center', padding: '4rem' }}>
        <h2 style={{ color: 'var(--text-secondary)', opacity: 0.5 }}>Waiting for transaction data to build analytics...</h2>
        <p>Your charts will appear here automatically as soon as your first real payment arrives.</p>
      </div>
    );
  }

  return (
    <div className="card col-span-12 animate-fade-in" style={{ animationDelay: '0.2s', marginBottom: '1.5rem' }}>
      <div className="flex justify-between items-center mb-6">
        <h2>Transaction Volume Trends</h2>
        <select style={{ background: 'var(--bg-tertiary)', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '0.5rem' }}>
          <option>Today</option>
          <option>Last 7 Days</option>
          <option>This Month</option>
        </select>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }}>
        <div className="col-span-8" style={{ height: '300px' }}>
          <h4 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Revenue over time</h4>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="var(--text-secondary)" />
              <YAxis stroke="var(--text-secondary)" />
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '0.5rem' }}
                itemStyle={{ color: 'var(--accent-primary)' }}
              />
              <Area type="monotone" dataKey="total" stroke="var(--accent-primary)" fillOpacity={1} fill="url(#colorTotal)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="col-span-4" style={{ height: '300px' }}>
          <h4 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Transaction Count</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--text-secondary)" />
              <Tooltip 
                cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '0.5rem' }}
              />
              <Bar dataKey="count" fill="var(--success)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
