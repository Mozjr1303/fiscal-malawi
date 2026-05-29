import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../config';
import { RefreshCw, Banknote, Activity, AlertTriangle, Search, Filter, Calendar } from 'lucide-react';
import TransactionList from '../components/TransactionList';
import AnomalyAlerts from '../components/AnomalyAlerts';
import Charts from '../components/Charts';
import Integrations from '../components/Integrations';
import ReportGenerator from '../components/ReportGenerator';
import Skeleton from '../components/Skeleton';
import PaymentGenerator from '../components/PaymentGenerator';
import './Dashboard.css';

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  
  useEffect(() => {
    const txRef = searchParams.get('tx_ref');
    const amount = searchParams.get('amount');
    const email = searchParams.get('email');
    const status = searchParams.get('status');

    if (txRef && (status === 'success' || !status)) {
      toast.success(`Payment verified! Reference: ${txRef}`, {
        duration: 5000,
        icon: '✅'
      });
      
      // Resilience Strategy: If the tunnel was down, we manually 'push' the success to the backend
      const syncPayment = async () => {
        try {
          const token = localStorage.getItem('token');
          // Optimistically try to register the transaction if it was missed by the webhook
          if (amount) {
            await axios.post(`${API_BASE_URL}/api/transactions`, {
              id: txRef,
              amount: parseFloat(amount),
              paymentMethod: 'paychangu_recovery',
              timestamp: new Date().toISOString()
            }, { headers: { Authorization: `Bearer ${token}` } });
          }
          fetchData(); // Refresh the list
        } catch (err) {
          // If it fails with 400/409, it likely already exists via webhook, which is fine
          fetchData();
        }
      };

      syncPayment();

      // Clear the params so they don't toast again on refresh
      const newParams = new URLSearchParams(searchParams);
      ['tx_ref', 'amount', 'email', 'status'].forEach(p => newParams.delete(p));
      setSearchParams(newParams);
    } else if (status === 'cancelled') {
      toast.error('Payment was cancelled');
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('status');
      setSearchParams(newParams);
    }
  }, [searchParams]);
  
  // Search and Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMethod, setFilterMethod] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Apply Filters
  const filteredTransactions = transactions.filter((tx: any) => {
    const matchesSearch = tx.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         tx.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMethod = filterMethod === 'all' || tx.paymentMethod === filterMethod;
    
    let matchesDate = true;
    if (dateRange.start) matchesDate = matchesDate && new Date(tx.timestamp) >= new Date(dateRange.start);
    if (dateRange.end) matchesDate = matchesDate && new Date(tx.timestamp) <= new Date(dateRange.end + 'T23:59:59');
    
    return matchesSearch && matchesMethod && matchesDate;
  });

  const totalVolume = filteredTransactions.reduce((acc: number, tx: any) => acc + tx.amount, 0);

  const stats = loading ? [
    { label: <Skeleton width="80px" />, value: <Skeleton width="120px" height="2rem" />, icon: <div className="skeleton" style={{ width: '48px', height: '48px', borderRadius: '50%' }}></div>, change: <Skeleton width="40px" /> },
    { label: <Skeleton width="80px" />, value: <Skeleton width="120px" height="2rem" />, icon: <div className="skeleton" style={{ width: '48px', height: '48px', borderRadius: '50%' }}></div>, change: <Skeleton width="40px" /> },
    { label: <Skeleton width="80px" />, value: <Skeleton width="120px" height="2rem" />, icon: <div className="skeleton" style={{ width: '48px', height: '48px', borderRadius: '50%' }}></div>, change: <Skeleton width="40px" /> }
  ] : [
    { label: 'Total Volume', value: `MK ${totalVolume.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: <Banknote size={24} color="var(--success)" />, change: 'Filtered' },
    { label: 'Transactions', value: filteredTransactions.length.toString(), icon: <Activity size={24} color="var(--accent-primary)" />, change: 'Matching' },
    { label: 'Anomalies Detected', value: anomalies.length.toString(), icon: <AlertTriangle size={24} color="var(--warning)" />, change: 'Total' }
  ];

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [txRes, anRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/transactions`, config),
        axios.get(`${API_BASE_URL}/api/transactions/anomalies`, config)
      ]);

      if (anRes.data.length > anomalies.length && !loading) {
        toast.error(`Security Alert: ${anRes.data.length - anomalies.length} new anomalies detected!`, {
            duration: 5000,
            icon: '⚠️'
        });
      }
      
      setTransactions(txRes.data);
      setAnomalies(anRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to sync with real-time servers');
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Overview</h1>
          <p>Real-time fiscal monitoring and anomaly detection.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block' }}>Integration API Key</span>
            <code style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>{localStorage.getItem('apiKey') || 'Log out and back in to see key'}</code>
          </div>
          <button className="btn" style={{ background: 'rgba(234, 179, 8, 0.1)', color: 'var(--warning)', border: '1px solid rgba(234, 179, 8, 0.2)' }} 
            onClick={() => {
              const ref = prompt('Enter Transaction Reference (e.g. SENTINEL-...)');
              if (ref) {
                const url = new URL(window.location.href);
                url.searchParams.set('tx_ref', ref);
                // Also set a dummy amount so the sync logic triggers
                url.searchParams.set('amount', '0'); 
                window.location.href = url.toString();
              }
            }}>
            <AlertTriangle size={18} />
            Recover Payment
          </button>
          <button className="btn btn-primary" onClick={fetchData} disabled={loading}>
            <RefreshCw size={18} className={loading ? 'spinner' : ''} />
            {loading ? 'Syncing...' : 'Refresh Data'}
          </button>
        </div>
      </header>

      <div className="card col-span-12 filter-bar animate-fade-in" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="search-input-wrapper" style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Search transactions by ID or method..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 3rem', background: 'var(--bg-tertiary)', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}
            />
          </div>
          
          <div className="filter-select-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={18} color="var(--text-secondary)" />
            <select 
              value={filterMethod} 
              onChange={(e) => setFilterMethod(e.target.value)}
              style={{ padding: '0.75rem', background: 'var(--bg-tertiary)', borderRadius: '0.5rem', border: '1px solid var(--border-color)', color: 'white' }}
            >
              <option value="all">All Methods</option>
              <option value="mobile_money">Airtel/Mpamba</option>
              <option value="credit_card">Card Payments</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="cash">Cash</option>
            </select>
          </div>

          <div className="date-filter-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={18} color="var(--text-secondary)" />
            <input 
              type="date" 
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              style={{ padding: '0.75rem', background: 'var(--bg-tertiary)', borderRadius: '0.5rem', border: '1px solid var(--border-color)', color: 'white' }}
            />
            <span style={{ color: 'var(--text-secondary)' }}>to</span>
            <input 
              type="date" 
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              style={{ padding: '0.75rem', background: 'var(--bg-tertiary)', borderRadius: '0.5rem', border: '1px solid var(--border-color)', color: 'white' }}
            />
          </div>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-icon-wrapper">
              {stat.icon}
            </div>
            <div className="stat-info">
              <div className="stat-label">{stat.label}</div>
              <h3 className="stat-value">{stat.value}</h3>
              <span className={`stat-change ${typeof stat.change === 'string' && stat.change.includes('+') ? 'text-success' : 'text-warning'}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <ReportGenerator transactions={transactions} anomalies={anomalies} />

      <Charts data={[]} loading={loading} />

      <div className="dashboard-grid">
        <TransactionList transactions={filteredTransactions} loading={loading} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <AnomalyAlerts anomalies={anomalies} loading={loading} />
          <PaymentGenerator />
        </div>
        <Integrations />
      </div>
    </div>
  );
}
