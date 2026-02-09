import React, { useState, useEffect } from 'react';
import { Waves, Upload, Shield, Blocks, ShoppingCart, Settings, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type ActiveView = 'home' | 'ngo-upload' | 'validation' | 'blockchain' | 'marketplace' | 'admin';

interface NavigationProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
}

export function Navigation({ activeView, onNavigate }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', icon: Waves },
    { id: 'ngo-upload', label: 'Upload', icon: Upload },
    { id: 'validation', label: 'Verify', icon: Shield },
    { id: 'blockchain', label: 'Registry', icon: Blocks },
    { id: 'marketplace', label: 'Market', icon: ShoppingCart },
    { id: 'admin', label: 'Admin', icon: Settings },
  ];

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'py-4' : 'py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`relative rounded-2xl transition-all duration-500 ${
            isScrolled 
              ? 'bg-ocean-900/80 backdrop-blur-xl border border-white/10 shadow-lg shadow-ocean-900/50 px-6 py-3' 
              : 'px-0'
          }`}>
            <div className="flex items-center justify-between">
              <button
                onClick={() => onNavigate('home')}
                className="flex items-center space-x-3 group"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-neon-cyan/20 blur-lg rounded-full group-hover:bg-neon-cyan/40 transition-all duration-300"></div>
                  <Waves className="h-8 w-8 text-neon-cyan relative z-10" />
                </div>
                <span className="font-display font-bold text-xl text-white tracking-wide group-hover:text-neon-cyan transition-colors">
                  Blue<span className="text-neon-cyan">Carbon</span>
                </span>
              </button>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-1">
                {navItems.slice(1).map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onNavigate(item.id as ActiveView)}
                      className={`relative px-4 py-2 rounded-xl flex items-center space-x-2 transition-all duration-300 group overflow-hidden ${
                        isActive ? 'text-neon-cyan' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="nav-pill"
                          className="absolute inset-0 bg-white/5 border border-white/10 rounded-xl"
                          initial={false}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      <Icon className={`h-4 w-4 relative z-10 ${isActive ? 'text-neon-cyan' : 'group-hover:text-neon-blue'}`} />
                      <span className="text-sm font-medium relative z-10">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                  <div className="h-2 w-2 bg-neon-cyan rounded-full animate-pulse-glow"></div>
                  <span className="text-xs font-mono text-neon-cyan">LIVE_NET</span>
                </div>
                <button className="hidden md:block bg-gradient-to-r from-neon-cyan to-neon-blue text-ocean-900 px-5 py-2 rounded-xl font-bold text-sm hover:shadow-[0_0_20px_rgba(100,255,218,0.3)] hover:scale-105 transition-all duration-300">
                  Connect Wallet
                </button>
                <button 
                  className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-ocean-900/95 backdrop-blur-xl md:hidden pt-28 px-4"
          >
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id as ActiveView);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-4 p-4 rounded-xl border ${
                    activeView === item.id 
                      ? 'bg-white/10 border-neon-cyan/30 text-neon-cyan'
                      : 'border-white/5 text-slate-400'
                  }`}
                >
                  <item.icon className="h-6 w-6" />
                  <span className="text-lg font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}