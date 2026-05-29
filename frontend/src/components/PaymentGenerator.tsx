import { useState } from 'react';
import { CreditCard, Send, ExternalLink, Loader2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_BASE_URL, PUBLIC_TUNNEL_URL } from '../config';

export default function PaymentGenerator() {
  const [amount, setAmount] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState('');

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return toast.error('Please enter a valid amount');
    if (!email) return toast.error('Please enter a customer email');

    setLoading(true);
    try {
      console.log('--- Generating Payment Link ---');
      console.log('Origin:', window.location.origin);
      console.log('Return URL:', window.location.origin + '/dashboard');
      
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_BASE_URL}/api/paychangu/initialize`, 
        { 
          amount: parseFloat(amount), 
          email,
          callback_url: `${PUBLIC_TUNNEL_URL}/api/paychangu/webhook`, 
          return_url: `http://localhost:5173/dashboard?amount=${amount}&email=${email}` // Use localhost for redirect compatibility
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCheckoutUrl(res.data.checkout_url);
      toast.success('Payment link generated!');
    } catch (error: any) {
      console.error('Error generating link:', error);
      toast.error(error.response?.data?.error || 'Failed to generate payment link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card col-span-4 animate-fade-in" style={{ height: 'fit-content' }}>
      <div className="flex items-center gap-3 mb-6">
        <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '0.75rem', borderRadius: '0.75rem' }}>
          <CreditCard size={24} color="var(--accent-primary)" />
        </div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Quick Test Payment</h2>
      </div>

      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        Generate a live PayChangu link to test the fiscal sentinel in real-time.
      </p>

      {!checkoutUrl ? (
        <form onSubmit={handleCreateLink} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="input-group">
            <label style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>
              Amount (MK)
            </label>
            <input 
              type="number" 
              placeholder="e.g. 5000" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', width: '100%' }}
            />
          </div>

          <div className="input-group">
            <label style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>
              Customer Email
            </label>
            <input 
              type="email" 
              placeholder="customer@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', width: '100%' }}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', padding: '1rem', marginTop: '0.5rem' }}>
            {loading ? <Loader2 className="spinner" size={20} /> : <><Send size={18} /> Generate Payment Link</>}
          </button>
        </form>
      ) : (
        <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '1rem', border: '1px dashed var(--success)' }}>
          <p style={{ fontWeight: '700', color: 'var(--success)', marginBottom: '1rem' }}>Link Ready!</p>
          <a 
            href={checkoutUrl} 
            target="_blank" 
            rel="noreferrer" 
            className="btn btn-primary"
            style={{ width: '100%', marginBottom: '1rem' }}
          >
            Pay Now <ExternalLink size={18} />
          </a>
          <button 
            onClick={() => setCheckoutUrl('')} 
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Create another link
          </button>
        </div>
      )}
    </div>
  );
}
