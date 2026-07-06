'use client';
import React, { useState } from 'react';
import { Wallet, ArrowUpRight, ArrowDownLeft, TrendingUp, Play, Coins, DollarSign, Clock, Filter, X } from 'lucide-react';

export default function SawaflixWallet() {
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showAddCoins, setShowAddCoins] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const earnings = [
    { title: 'Subscription Earnings', amount: 22000, icon: TrendingUp, color: 'bg-blue-500' },
    { title: 'Ad Revenue', amount: 11500, icon: Play, color: 'bg-green-500' },
    { title: 'Pay-Per-View', amount: 8400, icon: DollarSign, color: 'bg-purple-500' },
    { title: 'Tips (SawaCoins)', amount: 3300, icon: Coins, color: 'bg-yellow-500' }
  ];

  const transactions = [
    { id: 1, type: 'credit', title: 'Ad Revenue', amount: 1500, date: 'Today', status: 'Completed' },
    { id: 2, type: 'credit', title: 'PPV Earnings', amount: 2000, date: 'Yesterday', status: 'Completed' },
    { id: 3, type: 'debit', title: 'Withdrawal - MTN', amount: 10000, date: '2 days ago', status: 'Completed' },
    { id: 4, type: 'credit', title: 'Subscription Revenue', amount: 5000, date: '3 days ago', status: 'Completed' },
    { id: 5, type: 'credit', title: 'Tips Received', amount: 800, date: '4 days ago', status: 'Completed' }
  ];

  const providers = [
    { id: 'mtn', name: 'MTN Mobile Money', color: 'bg-yellow-400' },
    { id: 'orange', name: 'Orange Money', color: 'bg-orange-500' },
    { id: 'nexttel', name: 'Nexttel', color: 'bg-blue-600' }
  ];

  const coinPackages = [
    { amount: 500, coins: 500 },
    { amount: 1000, coins: 1000 },
    { amount: 2000, coins: 2000 },
    { amount: 5000, coins: 5000 }
  ];

  const totalBalance = earnings.reduce((sum, item) => sum + item.amount, 0);

  const handleWithdraw = () => {
    if (selectedProvider && amount && phoneNumber) {
      alert(`Withdrawal of ${amount} XAF to ${selectedProvider.toUpperCase()} (${phoneNumber}) initiated!`);
      setShowWithdraw(false);
      setSelectedProvider('');
      setAmount('');
      setPhoneNumber('');
    }
  };

  const handleAddCoins = (packageAmount) => {
    if (selectedProvider) {
      alert(`Purchase of ${packageAmount} XAF SawaCoins via ${selectedProvider.toUpperCase()} initiated!`);
      setShowAddCoins(false);
      setSelectedProvider('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0F1F] via-[#111726] to-[#0A0F1F] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold flex items-center gap-3">
            <Wallet className="w-7 h-7 sm:w-8 sm:h-8 text-[#FF2E2E]" />
            SawaFlix Wallet
          </h1>
          <p className="text-gray-400 mt-2 text-sm sm:text-base">Manage your earnings and transactions</p>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-br from-[#FF2E2E] to-[#D50000] rounded-2xl sm:rounded-3xl p-6 sm:p-8 mb-6 sm:mb-8 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-white/80 text-sm sm:text-base mb-2">Total Balance</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">{totalBalance.toLocaleString()} XAF</h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowWithdraw(true)}
                className="bg-white text-[#FF2E2E] px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
                Withdraw
              </button>
              <button
                onClick={() => setShowAddCoins(true)}
                className="bg-white/10 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Coins className="w-4 h-4 sm:w-5 sm:h-5" />
                Add SawaCoins
              </button>
            </div>
          </div>
        </div>

        {/* Earnings Summary */}
        <div className="mb-6 sm:mb-8">
          <h3 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#FF2E2E]" />
            Earnings Summary
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {earnings.map((earning, index) => {
              const Icon = earning.icon;
              return (
                <div
                  key={index}
                  className="bg-[#151B2E] rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:bg-[#1a2238] transition-all cursor-pointer shadow-lg"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`${earning.color} p-2 sm:p-3 rounded-lg`}>
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                  </div>
                  <p className="text-gray-400 text-xs sm:text-sm mb-1">{earning.title}</p>
                  <p className="text-xl sm:text-2xl font-bold">{earning.amount.toLocaleString()} XAF</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-[#151B2E] rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
            <h3 className="text-lg sm:text-xl font-bold flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#FF2E2E]" />
              Recent Transactions
            </h3>
            <button className="bg-[#1a2238] px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-[#1f2842] transition-all w-full sm:w-auto justify-center">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 sm:p-4 bg-[#1a2238] rounded-lg sm:rounded-xl hover:bg-[#1f2842] transition-all"
              >
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <div className={`p-2 sm:p-3 rounded-lg ${transaction.type === 'credit' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                    {transaction.type === 'credit' ? (
                      <ArrowDownLeft className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm sm:text-base truncate">{transaction.title}</p>
                    <p className="text-xs sm:text-sm text-gray-400">{transaction.date}</p>
                  </div>
                </div>
                <div className="text-right ml-2 flex-shrink-0">
                  <p className={`font-bold text-sm sm:text-base ${transaction.type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                    {transaction.type === 'credit' ? '+' : '-'}{transaction.amount.toLocaleString()} XAF
                  </p>
                  <span className="inline-block px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs mt-1">
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Withdraw Modal */}
        {showWithdraw && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#151B2E] rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl sm:text-2xl font-bold">Withdraw Funds</h3>
                <button onClick={() => setShowWithdraw(false)} className="text-gray-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Select Provider</label>
                  <div className="space-y-2">
                    {providers.map((provider) => (
                      <button
                        key={provider.id}
                        onClick={() => setSelectedProvider(provider.id)}
                        className={`w-full p-4 rounded-xl border-2 transition-all ${
                          selectedProvider === provider.id
                            ? 'border-[#FF2E2E] bg-[#FF2E2E]/10'
                            : 'border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 ${provider.color} rounded-lg`}></div>
                          <span className="font-semibold">{provider.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="6XX XXX XXX"
                    className="w-full bg-[#1a2238] border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF2E2E] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Amount (XAF)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full bg-[#1a2238] border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF2E2E] transition-all"
                  />
                </div>

                <button
                  onClick={handleWithdraw}
                  disabled={!selectedProvider || !amount || !phoneNumber}
                  className="w-full bg-[#FF2E2E] text-white py-3 rounded-xl font-semibold hover:bg-[#D50000] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm Withdrawal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add SawaCoins Modal */}
        {showAddCoins && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#151B2E] rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl sm:text-2xl font-bold">Add SawaCoins</h3>
                <button onClick={() => setShowAddCoins(false)} className="text-gray-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Select Provider</label>
                  <div className="space-y-2">
                    {providers.map((provider) => (
                      <button
                        key={provider.id}
                        onClick={() => setSelectedProvider(provider.id)}
                        className={`w-full p-4 rounded-xl border-2 transition-all ${
                          selectedProvider === provider.id
                            ? 'border-[#FF2E2E] bg-[#FF2E2E]/10'
                            : 'border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 ${provider.color} rounded-lg`}></div>
                          <span className="font-semibold">{provider.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Select Package</label>
                  <div className="grid grid-cols-2 gap-3">
                    {coinPackages.map((pkg) => (
                      <button
                        key={pkg.amount}
                        onClick={() => handleAddCoins(pkg.amount)}
                        disabled={!selectedProvider}
                        className="bg-[#1a2238] p-4 rounded-xl hover:bg-[#1f2842] transition-all disabled:opacity-50 disabled:cursor-not-allowed border-2 border-transparent hover:border-[#FF2E2E]"
                      >
                        <Coins className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                        <p className="font-bold text-lg">{pkg.coins}</p>
                        <p className="text-sm text-gray-400">{pkg.amount} XAF</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}