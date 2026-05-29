import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import Skeleton from './Skeleton';

interface Transaction {
  id: string;
  amount: number;
  timestamp: string;
  paymentMethod: string;
  status?: string;
}

interface Props {
  transactions: Transaction[];
  loading?: boolean;
}

export default function TransactionList({ transactions, loading }: Props) {
  if (loading) {
    return (
      <div className="card col-span-8 animate-fade-in">
        <h2 className="mb-4">Recent Transactions</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Date & Time</th>
                <th>Method</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i}>
                  <td><Skeleton width="60px" /></td>
                  <td><Skeleton width="120px" /></td>
                  <td><Skeleton width="80px" /></td>
                  <td><Skeleton width="70px" /></td>
                  <td><Skeleton width="60px" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  return (
    <div className="card col-span-8 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2>Recent Transactions</h2>
        <button className="btn" style={{ padding: '0.5rem 1rem', background: 'var(--bg-tertiary)', color: 'white' }}>
          View All
        </button>
      </div>
      
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Date & Time</th>
              <th>Method</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                  #{tx.id.substring(0, 8)}
                </td>
                <td>{new Date(tx.timestamp).toLocaleString()}</td>
                <td>
                  <span style={{ textTransform: 'capitalize' }}>{tx.paymentMethod}</span>
                </td>
                <td style={{ fontWeight: '600', color: tx.amount > 0 ? 'white' : 'var(--text-secondary)' }}>
                  MK {tx.amount.toFixed(2)}
                </td>
                <td>
                  <span className={`status-tag ${tx.status === 'success' ? 'status-success' : 'status-warning'}`}>
                    {tx.status || 'Completed'}
                  </span>
                </td>
              </tr>
            ))}
            
            {transactions.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
                  No recent transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
