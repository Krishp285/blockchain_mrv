import React from 'react';
import { ArrowRight, Leaf, Shield, Globe, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

type ActiveView = 'home' | 'ngo-upload' | 'validation' | 'blockchain' | 'marketplace' | 'admin';

interface HeroProps {
  onNavigate: (view: ActiveView) => void;
}

export function Hero({ onNavigate }: HeroProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        type: "spring" as const, 
        stiffness: 50 
      } 
    },
  };

  const stats = [
    { value: '2.5M', label: 'Tons CO₂ Sequestered', icon: Leaf, color: 'text-emerald-400' },
    { value: '450+', label: 'Projects Verified', icon: Shield, color: 'text-blue-400' },
    { value: '12', label: 'Coastal States', icon: Globe, color: 'text-cyan-400' },
    { value: '₹850Cr', label: 'Credits Traded', icon: TrendingUp, color: 'text-purple-400' },
  ];

  return (
    <div className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-ocean-900">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541675154750-0444c7d51e8e?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-ocean-900 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-20 mask-image-gradient"></div>
        
        {/* Animated Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] animate-pulse-glow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 z-10 text-center">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={item} className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400 text-sm font-medium tracking-wide">Next Gen Carbon Registry</span>
          </motion.div>

          <motion.h1 variants={item} className="text-6xl md:text-8xl font-bold mb-8 leading-tight tracking-tight">
            Blue Carbon <br />
            <span
              className="text-emerald-300 bg-clip-text bg-gradient-to-r from-neon-cyan via-blue-400 to-purple-400 animate-shimmer bg-[length:200%_100%]"
              style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              Revolution
            </span>
          </motion.h1>

          <motion.p variants={item} className="text-xl md:text-2xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            The world's first blockchain-powered registry for coastal ecosystem restoration. Transparent, verifiable, and trusted.
          </motion.p>

          <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
            <button
              onClick={() => onNavigate('ngo-upload')}
              className="group relative px-8 py-4 bg-neon-cyan text-ocean-900 rounded-xl font-bold text-lg hover:shadow-[0_0_20px_rgba(100,255,218,0.4)] transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                Start Project
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button
              onClick={() => onNavigate('marketplace')}
              className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-bold text-lg hover:bg-white/10 hover:border-neon-cyan/50 transition-all duration-300 backdrop-blur-sm"
            >
              Explore Market
            </button>
          </motion.div>
        </motion.div>

        {/* Floating Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 z-20">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
                className="glass-card p-6 rounded-2xl text-left group hover:-translate-y-2"
              >
                <div className={`p-3 rounded-lg bg-white/5 w-fit mb-4 group-hover:scale-110 transition-transform duration-300 ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="text-3xl font-display font-bold text-white mb-1">{stat.value}</div>
                <div className="text-slate-400 text-sm font-medium">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-slate-500 text-xs tracking-widest uppercase">Scroll to Explore</span>
        <div className="w-0.5 h-12 bg-gradient-to-b from-neon-cyan to-transparent"></div>
      </motion.div>
    </div>
  );
}