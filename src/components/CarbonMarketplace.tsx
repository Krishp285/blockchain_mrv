import React, { useState } from 'react';
import { ShoppingCart, TrendingUp, Award, Star, Filter, Search, Leaf } from 'lucide-react';
import sampleCertificate from '../assets/sample-certificate.svg';

type ActiveView = 'home' | 'ngo-upload' | 'validation' | 'blockchain' | 'marketplace' | 'admin';

interface CarbonMarketplaceProps {
  onNavigate: (view: ActiveView) => void;
}

export function CarbonMarketplace({ onNavigate }: CarbonMarketplaceProps) {
  const [selectedCredit, setSelectedCredit] = useState<number | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [impactNote, setImpactNote] = useState<string | null>(null);

  const carbonCredits = [
    {
      id: 1,
      projectName: 'Sundarbans Mangrove Conservation',
      location: 'West Bengal, India',
      creditsAvailable: 2500,
      pricePerCredit: 45,
      rating: 4.9,
      ngo: 'EcoRestore India',
      ecosystemType: 'Mangroves',
      verificationDate: '2024-01-15',
      additionalInfo: {
        area: '75 hectares',
        co2PerCredit: '1 ton',
        methodology: 'VM0033',
        vintage: '2024',
      },
    },
    {
      id: 2,
      projectName: 'Kerala Backwater Restoration',
      location: 'Kerala, India',
      creditsAvailable: 1800,
      pricePerCredit: 52,
      rating: 4.8,
      ngo: 'Coastal Guard Foundation',
      ecosystemType: 'Seagrass',
      verificationDate: '2024-01-14',
      additionalInfo: {
        area: '45 hectares',
        co2PerCredit: '1 ton',
        methodology: 'VM0033',
        vintage: '2024',
      },
    },
    {
      id: 3,
      projectName: 'Odisha Coastal Wetland Recovery',
      location: 'Odisha, India',
      creditsAvailable: 3200,
      pricePerCredit: 38,
      rating: 4.7,
      ngo: 'Marine Ecosystem Trust',
      ecosystemType: 'Salt Marshes',
      verificationDate: '2024-01-12',
      additionalInfo: {
        area: '120 hectares',
        co2PerCredit: '1 ton',
        methodology: 'VM0033',
        vintage: '2024',
      },
    },
  ];

  const marketStats = [
    { label: 'Total Volume', value: '₹2.3B', change: '+12.5%', color: 'emerald' },
    { label: 'Avg Price', value: '₹3,420', change: '+8.2%', color: 'blue' },
    { label: 'Active Projects', value: '847', change: '+15.7%', color: 'purple' },
    { label: 'Credits Traded', value: '156K', change: '+22.1%', color: 'orange' },
  ];

  return (
    <div className="pt-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">Carbon Credit Marketplace</h1>
            <p className="text-xl text-white/70">Trade verified blue carbon credits from coastal restoration projects</p>
          </div>
          <button
            onClick={() => onNavigate('admin')}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Admin Panel
          </button>
        </div>

        {/* Market Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {marketStats.map((stat, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <div className="text-white/70 text-sm">{stat.label}</div>
                <div className={`text-${stat.color}-400 text-sm font-medium`}>{stat.change}</div>
              </div>
              <div className="text-3xl font-bold text-white">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
            <input
              type="text"
              placeholder="Search projects, NGOs, or locations..."
              className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center space-x-2 bg-white/10 border border-white/20 rounded-xl px-6 py-3 text-white hover:bg-white/15 transition-all duration-300">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </button>
        </div>

        {/* Credits Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {carbonCredits.map((credit) => (
            <div 
              key={credit.id} 
              className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 overflow-hidden hover:bg-white/15 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              onClick={() => setSelectedCredit(selectedCredit === credit.id ? null : credit.id)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Leaf className="h-6 w-6 text-emerald-400" />
                    <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-sm font-medium">
                      {credit.ecosystemType}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-white font-medium">{credit.rating}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{credit.projectName}</h3>
                <p className="text-white/70 mb-4">{credit.location}</p>

                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-2xl font-bold text-emerald-400">₹{credit.pricePerCredit}</div>
                    <div className="text-white/60 text-sm">per credit</div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-semibold">{credit.creditsAvailable.toLocaleString()}</div>
                    <div className="text-white/60 text-sm">available</div>
                  </div>
                </div>

                <button className="w-full bg-gradient-to-r from-blue-500 to-emerald-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2">
                  <ShoppingCart className="h-5 w-5" />
                  <span>Purchase Credits</span>
                </button>
              </div>

              {/* Expanded Details */}
              {selectedCredit === credit.id && (
                <div className="border-t border-white/20 p-6 bg-white/5">
                  <h4 className="text-white font-semibold mb-4">Project Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-white/60 mb-1">Area Restored</div>
                      <div className="text-white font-medium">{credit.additionalInfo.area}</div>
                    </div>
                    <div>
                      <div className="text-white/60 mb-1">CO₂ per Credit</div>
                      <div className="text-white font-medium">{credit.additionalInfo.co2PerCredit}</div>
                    </div>
                    <div>
                      <div className="text-white/60 mb-1">Methodology</div>
                      <div className="text-white font-medium">{credit.additionalInfo.methodology}</div>
                    </div>
                    <div>
                      <div className="text-white/60 mb-1">Vintage Year</div>
                      <div className="text-white font-medium">{credit.additionalInfo.vintage}</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex space-x-3">
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        setShowCertificate(true);
                      }}
                      className="flex-1 bg-blue-500/20 text-blue-400 py-2 rounded-lg text-sm font-medium hover:bg-blue-500/30 transition-all duration-300"
                    >
                      View Certificate
                    </button>
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        setImpactNote('Impact tracking queued. A detailed report will be available after verification.');
                      }}
                      className="flex-1 bg-emerald-500/20 text-emerald-400 py-2 rounded-lg text-sm font-medium hover:bg-emerald-500/30 transition-all duration-300"
                    >
                      Track Impact
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {impactNote && (
          <div className="mt-6 bg-emerald-500/10 border border-emerald-400/30 text-emerald-200 rounded-2xl px-5 py-4">
            {impactNote}
          </div>
        )}

        {/* Market Insights */}
        <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl p-8 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">Market Insights</h3>
            <TrendingUp className="h-8 w-8 text-purple-400" />
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">+47%</div>
              <div className="text-white/70">Price Growth (YoY)</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">₹3.2B</div>
              <div className="text-white/70">Market Cap</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-2">156K</div>
              <div className="text-white/70">Monthly Volume</div>
            </div>
          </div>
        </div>
      </div>

      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h3 className="text-lg font-semibold text-white">Sample Certificate</h3>
              <button
                onClick={() => setShowCertificate(false)}
                className="text-white/70 hover:text-white transition"
              >
                Close
              </button>
            </div>
            <div className="p-6">
              <img
                src={sampleCertificate}
                alt="Sample Blue Carbon Certificate"
                className="w-full rounded-xl border border-white/10"
              />
              <p className="text-white/60 text-sm mt-4">
                This is a sample certificate used for demo purposes only.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}