'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import WorkplaceSelector from '@/components/FindHome/Form/WorkplaceSelector';
import CommuteSlider from '@/components/FindHome/Form/CommuteSlider';
import LifestyleCards from '@/components/FindHome/Form/LifestyleCards';
import SearchButton from '@/components/FindHome/Form/SearchButton';
import NeighborhoodCardList from '@/components/FindHome/Results/NeighborhoodCardList';
import NeighborhoodDetail from '@/components/FindHome/Results/NeighborhoodDetail';
import LoadingState from '@/components/FindHome/Shared/LoadingState';
import { useFindHomeStore } from '@/lib/stores/useFindHomeStore';

export default function FindHomePage() {
  const { filteredNeighborhoods, loading, error } = useFindHomeStore();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const formSectionRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const navItems = [
    {
      label: 'Finances',
      items: [
        { title: 'Student Loans', href: '#' },
        { title: 'Plan 1 & 2', href: '#' },
        { title: 'Plan 4 & 5', href: '#' },
        { title: 'Repayment Calculator', href: '#' },
      ],
    },
    {
      label: 'Savings',
      items: [
        { title: 'Cash ISAs', href: '#' },
        { title: 'Fixed Rate Accounts', href: '#' },
        { title: 'Premium Bonds', href: '#' },
        { title: 'Savings Comparison', href: '#' },
      ],
    },
    {
      label: 'Investing',
      items: [
        { title: 'Stocks & Shares ISAs', href: '#' },
        { title: 'Investment Funds', href: '#' },
        { title: 'ETFs & Bonds', href: '#' },
        { title: 'Portfolio Builder', href: '#' },
      ],
    },
    {
      label: 'Taxes',
      items: [
        { title: 'Income Tax', href: '/income-tax' },
        { title: 'Self Assessment', href: '/self-assessment' },
        { title: 'Pension Planning', href: '/pension-planning' },
        { title: 'Tax Allowances', href: '/tax-allowances' },
        { title: 'Frozen Tax Bands', href: '/frozen-tax-bands' },
      ],
    },
    {
      label: 'Find Home',
      items: [
        { title: 'Neighborhood Search', href: '/find-home' },
      ],
    },
  ];

  const handleDropdownClose = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 100);
  };

  const handleDropdownOpen = (label: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setOpenDropdown(label);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="fixed top-0 w-full z-[9999] backdrop-blur-sm bg-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between overflow-x-hidden">
          {/* Logo */}
          <Link href="/" className="flex gap-2 sm:gap-3 items-center">
            <div className="w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full" style={{transform: 'skew(-20deg) rotate(-15deg)'}}>
                <text x="50" y="70" fontSize="80" fontWeight="900" fill="#2563c6" textAnchor="middle" fontFamily="Inter, sans-serif">F</text>
              </svg>
            </div>
            <div className="text-xl sm:text-3xl font-bold text-[#f5f1ed]">FutureMe</div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8 text-[#f5f1ed] overflow-x-hidden items-center">
            {navItems.map((item) => (
              <div key={item.label} className="relative group overflow-visible" onMouseEnter={() => handleDropdownOpen(item.label)} onMouseLeave={() => handleDropdownClose()}>
                <button className={`px-4 py-2 rounded-full transition ${openDropdown === item.label ? 'bg-black/30 text-[#f5f1ed]' : 'hover:text-[#f5f1ed]/70'}`}>
                  {item.label}
                </button>
              </div>
            ))}
            <div className="h-6 border-l border-white/20 mx-2"></div>
            <Link href="/calculator-help" className="text-[#f5f1ed] hover:text-white transition font-medium">FAQs</Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex gap-2 sm:gap-4 items-center">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-[#f5f1ed] hover:text-white transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button className="text-xs sm:text-base text-[#f5f1ed] hover:text-[#f5f1ed]/70 transition">Log in</button>
            <button className="bg-white text-blue-600 px-3 sm:px-6 py-1 sm:py-2 text-xs sm:text-base rounded-full font-semibold hover:bg-gray-100 transition">Sign up</button>
          </div>
        </div>

        {/* Dropdown Menu */}
        {openDropdown && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onMouseEnter={() => handleDropdownOpen(openDropdown)} onMouseLeave={() => handleDropdownClose()} className="absolute top-full left-0 right-0 bg-black/80 backdrop-blur-md border-b border-white/10 overflow-visible z-[9998]">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex flex-wrap gap-x-12 gap-y-0">
                {navItems.find((nav) => nav.label === openDropdown)?.items.map((subItem) => (
                  <Link key={subItem.title} href={subItem.href} className="group flex flex-col items-center justify-center py-2">
                    <div className="text-white group-hover:text-white/80 transition font-medium text-sm text-center">{subItem.title}</div>
                    <div className="h-0.5 w-0 group-hover:w-full bg-white transition-all duration-300 mt-1"></div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="md:hidden bg-black/90 backdrop-blur-md border-b border-white/10 overflow-hidden">
            <div className="px-4 py-4 flex flex-col gap-4">
              {navItems.map((item) => (
                <div key={item.label}>
                  <button onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)} className="text-[#f5f1ed] font-medium text-sm w-full text-left py-2 hover:text-white transition">{item.label}</button>
                  {openDropdown === item.label && (
                    <div className="pl-4 flex flex-col gap-2 mt-2">
                      {item.items.map((subItem) => (
                        <Link key={subItem.title} href={subItem.href} className="text-[#f5f1ed]/70 text-sm py-1 hover:text-white transition" onClick={() => setMobileMenuOpen(false)}>{subItem.title}</Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Link href="/calculator-help" className="text-[#f5f1ed] hover:text-white transition font-medium text-sm py-2">FAQs</Link>
            </div>
          </motion.div>
        )}
      </header>

      {/* Main Content - Add padding for fixed header */}
      <div className="pt-16">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/find-home-hero.jpg"
            alt="Find your perfect neighborhood"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/60"></div>
        </div>

        {/* Gradient Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-12 items-center">
            {/* Headline */}
            <div className="text-white space-y-6 max-w-2xl">
              <div>
                <h1 className="text-5xl sm:text-6xl font-black leading-tight mb-4">
                  Find your
                  <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> perfect home</span>
                </h1>
                <p className="text-xl text-slate-300 max-w-lg">
                  Stop searching blindly. Use data to discover neighborhoods that match your lifestyle, budget, and commute.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-slate-300">Score neighborhoods by commute & livability</span>
              </div>

              <div className="flex gap-3">
                <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-slate-300">Filter by budget, walkability & amenities</span>
              </div>

              <div className="flex gap-3">
                <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-slate-300">See real data on safety, culture & nightlife</span>
              </div>
            </div>
          </div>

          {/* Get Started Button - Fixed to viewport bottom */}
          <button
            onClick={scrollToForm}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center gap-2 text-white hover:text-blue-300 transition group"
          >
            <span className="text-sm font-semibold">Get Started</span>
            <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-20 bg-slate-950 py-0" ref={formSectionRef}>
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl sticky top-24 p-6 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">Your Preferences</h2>
                  <p className="text-sm text-slate-400">
                    Tell us what you're looking for
                  </p>
                </div>

                <div className="border-t border-slate-700/50 pt-4">
                  <WorkplaceSelector />
                </div>

                <div className="border-t border-slate-700/50 pt-4">
                  <CommuteSlider />
                </div>

                <div className="border-t border-slate-700/50 pt-4">
                  <LifestyleCards />
                </div>

                <div className="border-t border-slate-700/50 pt-4">
                  <SearchButton />
                </div>

                {/* Results Summary */}
                {filteredNeighborhoods.length > 0 && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                    <p className="text-sm text-emerald-300">
                      ✅ Found <strong>{filteredNeighborhoods.length}</strong> neighborhoods
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Results Section */}
            <div className="lg:col-span-2">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}

              {loading ? (
                <LoadingState />
              ) : filteredNeighborhoods.length > 0 ? (
                <NeighborhoodCardList />
              ) : (
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-12 text-center">
                  <div className="text-5xl mb-4">🏘️</div>
                  <h3 className="text-2xl font-bold text-white mb-2">Ready to explore?</h3>
                  <p className="text-slate-400 mb-6">
                    Use the form to find neighborhoods that match your lifestyle.
                  </p>
                  <ul className="text-left inline-block text-sm text-slate-400 space-y-2">
                    <li className="flex gap-2">
                      <span className="text-blue-400">→</span> Select your workplace
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-400">→</span> Set your commute preference
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-400">→</span> Tell us about your lifestyle
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-400">→</span> Discover neighborhoods
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <NeighborhoodDetail />
      </div>
    </div>
  );
}
