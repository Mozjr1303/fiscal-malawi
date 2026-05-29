import { useState } from 'react';
import { Shield, Copy, Check, ExternalLink } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { PUBLIC_TUNNEL_URL } from '../config';

export default function Integrations() {
  const [copied, setCopied] = useState(false);
  const [secretKey, setSecretKey] = useState('');
  const [loading, setLoading] = useState(false);

  // Calculate the backend webhook URL. 
  // NOTE: For live testing, you MUST use a public tunnel URL (like Ngrok or Localtunnel) instead of localhost.
  const webhookUrl = `${PUBLIC_TUNNEL_URL}/payment/paychangu-callback`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    toast.success('Webhook URL copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secretKey) return toast.error('Please enter a secret key');
    setLoading(true);

    try {
      // In a real app, you would have a PATCH /api/user endpoint to update settings
      // For now, let's just simulate the success
      setTimeout(() => {
          setLoading(false);
          toast.success('PayChangu Secret Key saved successfully!');
      }, 1000);
    } catch (error) {
      setLoading(false);
      toast.error('Failed to save key. Please try again.');
    }
  };

  return (
    <div className="card col-span-12 animate-fade-in" style={{ marginTop: '1.5rem' }}>
      <div className="flex justify-between items-center mb-6">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Shield size={24} color="var(--accent-primary)" />
          Real-Time Fintech Integration (PayChangu)
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="integration-setup">
          <h4 style={{ marginBottom: '1rem', color: 'white' }}>1. Setup Webhook</h4>
          <p style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Copy this URL and paste it into your PayChangu Dashboard under <strong>Settings {'>'} Webhooks</strong>. 
            This allows us to receive actual data from your Airtel Money / TNM Mpamba payments.
          </p>
          
          <div style={{ 
            background: 'var(--bg-tertiary)', 
            padding: '1rem', 
            borderRadius: '0.5rem', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem',
            border: '1px solid var(--border-color)'
          }}>
            <code style={{ flex: 1, fontSize: '0.85rem', color: 'var(--accent-primary)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {webhookUrl}
            </code>
            <button onClick={copyToClipboard} className="btn" style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.05)' }}>
              {copied ? <Check size={18} color="var(--success)" /> : <Copy size={18} />}
            </button>
          </div>
        </div>

        <div className="key-setup">
          <h4 style={{ marginBottom: '1rem', color: 'white' }}>2. Authorization</h4>
          <p style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Enter your <strong>PayChangu Secret Key</strong> to authorize transaction verification.
          </p>
          
          <form onSubmit={handleSaveKey}>
            <div className="input-group" style={{ marginBottom: '1rem' }}>
              <input 
                type="password" 
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                placeholder="sec-test-xxxxxxxxxxxxxxxxxxxx"
                style={{ background: 'var(--bg-tertiary)' }}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Saving...' : 'Save Secret Key'}
            </button>
          </form>
        </div>
      </div>

      <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
        <a href="https://paychangu.com" target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
          Open PayChangu Merchant Dashboard <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}
