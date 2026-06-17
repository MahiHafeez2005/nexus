import { useState } from 'react';

// Type definitions for transactions
type Transaction = {
  id: number;
  type: 'deposit' | 'withdraw' | 'transfer' | 'funding';
  amount: number;
  sender: string;
  receiver: string;
  status: 'pending' | 'completed' | 'failed';
  date: string;
};

export default function PaymentSection() {
  // State: Wallet balance
  const [balance, setBalance] = useState(25000);
  
  // State: Transaction history
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 1,
      type: 'deposit',
      amount: 5000,
      sender: 'Sarah Johnson',
      receiver: 'Your Wallet',
      status: 'completed',
      date: '2026-06-15 10:30 AM'
    },
    {
      id: 2,
      type: 'funding',
      amount: 15000,
      sender: 'Michael Rodriguez (Investor)',
      receiver: 'Your Startup',
      status: 'completed',
      date: '2026-06-14 2:15 PM'
    },
    {
      id: 3,
      type: 'transfer',
      amount: 2000,
      sender: 'Your Wallet',
      receiver: 'Sarah Chen (Team Member)',
      status: 'pending',
      date: '2026-06-13 9:00 AM'
    }
  ]);

  // State: Payment form
  const [paymentType, setPaymentType] = useState<'deposit' | 'withdraw' | 'transfer'>('deposit');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Handle payment submission
  const handlePayment = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    // Check if user has enough balance for withdraw/transfer
    if ((paymentType === 'withdraw' || paymentType === 'transfer') && numAmount > balance) {
      alert('Insufficient balance!');
      return;
    }

    // Create new transaction
    const newTransaction: Transaction = {
      id: transactions.length + 1,
      type: paymentType,
      amount: numAmount,
      sender: paymentType === 'deposit' ? 'External Account' : 'Your Wallet',
      receiver: paymentType === 'deposit' ? 'Your Wallet' : recipient || 'External Account',
      status: 'pending',
      date: new Date().toLocaleString()
    };

    // Update balance
    let newBalance = balance;
    if (paymentType === 'deposit') {
      newBalance = balance + numAmount;
    } else if (paymentType === 'withdraw' || paymentType === 'transfer') {
      newBalance = balance - numAmount;
    }

    // Update state
    setBalance(newBalance);
    setTransactions([newTransaction, ...transactions]);
    
    alert(`${paymentType.charAt(0).toUpperCase() + paymentType.slice(1)} of $${numAmount} initiated!`);
    
    // Reset form
    setAmount('');
    setRecipient('');
    setShowForm(false);
  };

  // Simulate funding deal (Investor → Entrepreneur)
  const handleFundingDeal = () => {
    const fundingAmount = 25000;
    const investor = 'Michael Rodriguez (Investor)';
    const entrepreneur = 'Sarah Johnson (Entrepreneur)';
    
    // Assuming user is entrepreneur (for demo)
    const isInvestor = false; // Change this based on your auth
    
    if (isInvestor) {
      if (balance < fundingAmount) {
        alert('Insufficient balance to fund this deal!');
        return;
      }
      setBalance(balance - fundingAmount);
      setTransactions([
        {
          id: transactions.length + 1,
          type: 'funding',
          amount: fundingAmount,
          sender: 'Your Wallet (Investor)',
          receiver: `${entrepreneur} (Startup)`,
          status: 'completed',
          date: new Date().toLocaleString()
        },
        ...transactions
      ]);
      alert(`✅ You have funded $${fundingAmount} to ${entrepreneur}!`);
    } else {
      setBalance(balance + fundingAmount);
      setTransactions([
        {
          id: transactions.length + 1,
          type: 'funding',
          amount: fundingAmount,
          sender: `${investor} (Investor)`,
          receiver: 'Your Wallet (Entrepreneur)',
          status: 'completed',
          date: new Date().toLocaleString()
        },
        ...transactions
      ]);
      alert(`🎉 You received $${fundingAmount} from ${investor}!`);
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'failed': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Get type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit': return '📥';
      case 'withdraw': return '📤';
      case 'transfer': return '↗️';
      case 'funding': return '💰';
      default: return '💳';
    }
  };

  return (
    <div className="space-y-6">
      {/* Wallet Balance Card */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm opacity-80">Wallet Balance</p>
            <h2 className="text-4xl font-bold mt-1">${balance.toLocaleString()}</h2>
            <p className="text-sm opacity-80 mt-2">Available for transactions</p>
          </div>
          <div className="bg-white/20 rounded-lg p-3">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        
        {/* Quick actions */}
        <div className="flex flex-wrap gap-3 mt-6">
          <button
            onClick={() => { setPaymentType('deposit'); setShowForm(true); }}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium"
          >
            + Deposit
          </button>
          <button
            onClick={() => { setPaymentType('withdraw'); setShowForm(true); }}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium"
          >
            - Withdraw
          </button>
          <button
            onClick={() => { setPaymentType('transfer'); setShowForm(true); }}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium"
          >
            ↕ Transfer
          </button>
          <button
            onClick={handleFundingDeal}
            className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-4 py-2 rounded-lg text-sm font-medium"
          >
            💰 Fund Deal
          </button>
        </div>
      </div>

      {/* Payment Form (conditional) */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-4">
            {paymentType.charAt(0).toUpperCase() + paymentType.slice(1)} Funds
          </h4>
          <div className="space-y-4">
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            
            {(paymentType === 'transfer' || paymentType === 'withdraw') && (
              <input
                type="text"
                placeholder={paymentType === 'transfer' ? "Recipient email/name" : "Bank account"}
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            )}
            
            <div className="flex gap-3">
              <button
                onClick={handlePayment}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium"
              >
                Confirm {paymentType}
              </button>
              <button
                onClick={() => { setShowForm(false); setAmount(''); setRecipient(''); }}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction History Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Transaction History</h3>
          <p className="text-sm text-gray-500">Recent transactions from your wallet</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sender</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receiver</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">
                    <span className="text-lg">{getTypeIcon(transaction.type)}</span>
                    <span className="ml-2 capitalize text-gray-900">{transaction.type}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    ${transaction.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{transaction.sender}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{transaction.receiver}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{transaction.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}