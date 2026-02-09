import React, { useState } from 'react';
import { Hash, Clock, CheckCircle, ExternalLink, Copy, Blocks, Shield, Globe, AlertCircle } from 'lucide-react';

type ActiveView = 'home' | 'ngo-upload' | 'validation' | 'blockchain' | 'marketplace' | 'admin';

interface BlockchainRegistryProps {
  onNavigate: (view: ActiveView) => void;
}

export function BlockchainRegistry({ onNavigate }: BlockchainRegistryProps) {
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);

  const blockchainEntries = [
    {
      id: '0x1a2b3c4d5e6f',
      projectName: 'Sundarbans Mangrove Conservation',
      ngo: 'EcoRestore India',
      timestamp: '2024-01-15T10:30:00Z',
      blockNumber: 18542187,
      gasUsed: '0.0023 ETH',
      carbonCredits: 2500,
      status: 'confirmed',
      verificationHash: '0x7f8e9d0c1b2a3f4e5d6c7b8a9f0e1d2c3b4a5f6e',
    },
    {
      id: '0x2b3c4d5e6f7a',
      projectName: 'Kerala Backwater Restoration',
      ngo: 'Coastal Guard Foundation',
      timestamp: '2024-01-14T15:45:00Z',
      blockNumber: 18542156,
      gasUsed: '0.0019 ETH',
      carbonCredits: 1800,
      status: 'confirmed',
      verificationHash: '0x8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b',
    },
    {
      id: '0x3c4d5e6f7a8b',
      projectName: 'Gujarat Salt Marsh Protection',
      ngo: 'Blue Ocean Initiative',
      timestamp: '2024-01-13T09:15:00Z',
      blockNumber: 18542098,
      gasUsed: '0.0021 ETH',
      carbonCredits: 3200,
      status: 'pending',
      verificationHash: '0x9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c',
    },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return CheckCircle;
      case 'pending':
        return Clock;
      default:
        return AlertCircle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-500/20 text-emerald-400';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400';
      default:
        return 'bg-red-500/20 text-red-400';
    }
  };

  return (
    <div className="pt-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">Blockchain Registry</h1>
            <p className="text-xl text-white/70">Immutable records of verified blue carbon projects</p>
          </div>
          <button
            onClick={() => onNavigate('marketplace')}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Trade Credits
          </button>
        </div>

        {/* Network Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Blocks', value: '18,542,187', icon: Blocks, color: 'blue' },
            { label: 'Verified Projects', value: '2,847', icon: Shield, color: 'emerald' },
            { label: 'Network Nodes', value: '156', icon: Globe, color: 'purple' },
            { label: 'Gas Price', value: '12 Gwei', icon: Hash, color: 'orange' },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <Icon className={`h-8 w-8 text-${stat.color}-400 mb-3`} />
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-white/70 text-sm">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Blockchain Entries */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 overflow-hidden">
          <div className="p-6 border-b border-white/20">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Hash className="h-6 w-6 mr-3 text-blue-400" />
              Recent Blockchain Transactions
            </h2>
          </div>
          
          <div className="divide-y divide-white/10">
            {blockchainEntries.map((entry) => {
              const StatusIcon = getStatusIcon(entry.status);
              const isExpanded = selectedTransaction === entry.id;
              
              return (
                <div key={entry.id} className="p-6 hover:bg-white/5 transition-all duration-300">
                  <div 
                    className="cursor-pointer"
                    onClick={() => setSelectedTransaction(isExpanded ? null : entry.id)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-xl ${getStatusColor(entry.status)}`}>
                          <StatusIcon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-white">{entry.projectName}</h3>
                          <p className="text-white/70">{entry.ngo}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-emerald-400 font-bold text-lg">{entry.carbonCredits.toLocaleString()} Credits</div>
                        <div className="text-white/60 text-sm">Block #{entry.blockNumber.toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6 text-sm text-white/70">
                      <div className="flex items-center space-x-1">
                        <Hash className="h-4 w-4" />
                        <span className="font-mono">{entry.id}</span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(entry.id);
                          }}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{new Date(entry.timestamp).toLocaleString()}</span>
                      </div>
                      <div>Gas: {entry.gasUsed}</div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="mt-6 pt-6 border-t border-white/20 grid md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-white font-semibold mb-4">Transaction Details</h4>
                        <div className="space-y-3">
                          <div className="bg-white/5 rounded-lg p-4">
                            <div className="text-white/60 text-sm mb-1">Verification Hash</div>
                            <div className="font-mono text-blue-400 text-sm flex items-center">
                              <span className="truncate">{entry.verificationHash}</span>
                              <button 
                                onClick={() => copyToClipboard(entry.verificationHash)}
                                className="ml-2 text-blue-400 hover:text-blue-300"
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <div className="bg-white/5 rounded-lg p-4">
                            <div className="text-white/60 text-sm mb-1">AI Validation Score</div>
                            <div className="text-emerald-400 font-semibold">98.5% (High Confidence)</div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-white font-semibold mb-4">Smart Contract Actions</h4>
                        <div className="space-y-3">
                          <button className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2">
                            <CheckCircle className="h-5 w-5" />
                            <span>Mint Carbon Tokens</span>
                          </button>
                          <button className="w-full border border-white/30 text-white py-3 rounded-lg font-medium hover:bg-white/10 transition-all duration-300 flex items-center justify-center space-x-2">
                            <ExternalLink className="h-5 w-5" />
                            <span>View on Explorer</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Network Visualization */}
        <div className="mt-12 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-3xl p-8 border border-white/20">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Live Network Activity</h3>
            <div className="flex items-center justify-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="h-4 w-4 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-white">New Block: #18,542,198</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-4 w-4 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-white">TPS: 2,847</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-4 w-4 bg-purple-500 rounded-full animate-pulse"></div>
                <span className="text-white">Active Validators: 156</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}