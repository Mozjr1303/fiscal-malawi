import { FileText, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import toast from 'react-hot-toast';

// Extend jsPDF with autotable types
interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDF;
}

interface Transaction {
  id: string;
  amount: number;
  timestamp: string;
  paymentMethod: string;
}

interface Anomaly {
  transactionId: string;
  anomalyScore: number;
}

interface Props {
  transactions: Transaction[];
  anomalies: Anomaly[];
}

export default function ReportGenerator({ transactions, anomalies }: Props) {
  const generatePDF = () => {
    toast.loading('Compiling financial data and generating PDF...', { id: 'report-toast' });
    const doc = new jsPDF() as jsPDFWithAutoTable;
    const date = new Date().toLocaleDateString();

    // 1. Header
    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42); // Navy color
    doc.text('FiscalTech Financial Report', 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${date}`, 14, 30);
    doc.text(`Report Period: Monthly Overview`, 14, 35);

    // 2. Summary Stats
    const totalVolume = transactions.reduce((sum, tx) => sum + tx.amount, 0);
    const totalAnomalies = anomalies.length;

    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text('Executive Summary', 14, 50);
    
    doc.setFontSize(11);
    doc.text(`Total Transaction Volume: MK ${totalVolume.toLocaleString()}`, 14, 60);
    doc.text(`Total Transactions Processed: ${transactions.length}`, 14, 67);
    doc.text(`Anomalies Detected (AI): ${totalAnomalies}`, 14, 74);
    
    if (totalAnomalies > 0) {
        doc.setTextColor(239, 68, 68); // Danger color
        doc.text(`⚠️ Warning: ${totalAnomalies} suspicious transactions require immediate review.`, 14, 82);
    }

    // 3. Transactions Table
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(14);
    doc.text('Transaction Ledger', 14, 95);

    const tableRows = transactions.map(tx => [
      tx.id.substring(0, 8),
      new Date(tx.timestamp).toLocaleString(),
      tx.paymentMethod.replace('_', ' ').toUpperCase(),
      `MK ${tx.amount.toFixed(2)}`
    ]);

    doc.autoTable({
      startY: 100,
      head: [['ID', 'Date/Time', 'Method', 'Amount']],
      body: tableRows,
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] }, // Accent color
    });

    // 4. Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
      doc.text('Confidential - Fiscal Integration System', 14, doc.internal.pageSize.height - 10);
    }

    // Save PDF
    doc.save(`FiscalTech_Report_${date.replace(/\//g, '-')}.pdf`);
    toast.success('Report downloaded successfully!', { id: 'report-toast' });
  };

  return (
    <div className="card col-span-12 animate-fade-in" style={{ 
        marginTop: '1.5rem', 
        background: 'linear-gradient(90deg, var(--bg-secondary) 0%, rgba(59, 130, 246, 0.05) 100%)',
        border: '1px solid rgba(59, 130, 246, 0.2)'
    }}>
      <div className="flex justify-between items-center">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
              background: 'var(--accent-primary)', 
              padding: '0.75rem', 
              borderRadius: '0.75rem',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
          }}>
            <FileText size={24} color="white" />
          </div>
          <div>
            <h3 style={{ margin: 0, color: 'white' }}>Financial Compliance Reporting</h3>
            <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.7 }}>Generate audited PDF statements for accounting and reconciliation.</p>
          </div>
        </div>
        
        <button className="btn btn-primary" onClick={generatePDF} style={{ padding: '0.8rem 1.5rem', gap: '0.75rem' }}>
          <Download size={18} />
          Export PDF Statement
        </button>
      </div>
    </div>
  );
}
