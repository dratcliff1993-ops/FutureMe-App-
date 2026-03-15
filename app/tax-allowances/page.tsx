'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useRef } from 'react';

export default function TaxAllowances() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [expandedAllowance, setExpandedAllowance] = useState<string | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  const navItems = [
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
  ];

  const allowances = [
    {
      id: 'isa',
      name: 'ISA (Individual Savings Account)',
      limit: '£20,000',
      types: ['Cash ISA', 'Stocks & Shares ISA', 'Lifetime ISA (up to £4,000/year)', 'Junior ISA (for children)'],
      taxTreatment: 'All interest, dividends and growth is completely tax-free',
      key: 'Cash',
      deadline: 'Continuous - any time during tax year',
      missed: 'Use it or lose it - unused allowance cannot be carried forward',
    },
    {
      id: 'cgt',
      name: 'Capital Gains Tax (CGT) Annual Exemption',
      limit: '£3,000',
      types: ['Sale of property (second homes)', 'Sale of shares/investments', 'Antiques and collectibles', 'Business asset relief'],
      taxTreatment: 'First £3,000 of gains each year tax-free. Above that: 20% (basic rate) or 24% (higher rate)',
      key: 'Savings',
      deadline: 'Report by 31 Jan of following tax year',
      missed: 'Cannot be carried forward to next year',
    },
    {
      id: 'dividend',
      name: 'Dividend Tax-Free Allowance',
      limit: '£500',
      types: ['Company dividends received', 'REITs dividends', 'Unit trust distributions'],
      taxTreatment: 'First £500 is tax-free. Above that: 8.75% (basic), 33.75% (higher), 39.35% (additional)',
      key: 'Income',
      deadline: 'Report by 31 Jan of following tax year',
      missed: 'Unused allowance cannot be carried forward',
    },
    {
      id: 'trading',
      name: 'Trading Allowance (Self-Employed)',
      limit: '£1,000',
      types: ['Self-employment income', 'Freelance income', 'Gig economy work', 'Side business income'],
      taxTreatment: 'First £1,000 is tax-free. Can choose between this or actual expenses (higher saves more)',
      key: 'Business',
      deadline: 'Claim on Self Assessment return',
      missed: 'Can claim in other years if eligible',
    },
    {
      id: 'property',
      name: 'Property Income Allowance',
      limit: '£1,000',
      types: ['Rental income from room rental', 'Holiday let income', 'Furnished holiday accommodation'],
      taxTreatment: 'First £1,000 is tax-free. Choose between this or actual expenses',
      key: 'Property',
      deadline: 'Report on Self Assessment return',
      missed: 'Can claim in other years if eligible',
    },
    {
      id: 'marriage',
      name: 'Marriage Allowance',
      limit: '£252/year',
      types: ['Transfer unused allowance between married couples', 'Only where one spouse earns below £12,570'],
      taxTreatment: 'Non-working or low-earning spouse transfers unused allowance to higher earner',
      key: 'Transfer',
      deadline: 'Can claim from date of marriage',
      missed: 'Can claim back 4 years in arrears',
    },
  ];

  return (
    <main className="min-h-screen bg-black w-full">
      {/* Navigation Header */}
      <header className="fixed top-0 w-full z-[9999] backdrop-blur-sm bg-black/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex gap-3 items-center">
            <Link href="/" className="flex gap-3 items-center">
              <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full" style={{transform: 'skew(-20deg) rotate(-15deg)'}}>
                  <text x="50" y="70" fontSize="80" fontWeight="900" fill="#2563c6" textAnchor="middle" fontFamily="Inter, sans-serif">F</text>
                </svg>
              </div>
              <div className="text-3xl font-bold text-[#f5f1ed]">FutureMe</div>
            </Link>
          </div>
          <nav className="hidden md:flex gap-8 text-[#f5f1ed] overflow-visible">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative group overflow-visible"
                onMouseEnter={() => handleDropdownOpen(item.label)}
                onMouseLeave={() => handleDropdownClose()}
              >
                <button className={`px-4 py-2 rounded-full transition ${openDropdown === item.label ? 'bg-black/30 text-[#f5f1ed]' : 'hover:text-[#f5f1ed]/70'}`}>
                  {item.label}
                </button>
              </div>
            ))}
          </nav>
          <div className="flex gap-4 items-center">
            <button className="text-[#f5f1ed] hover:text-[#f5f1ed]/70 transition text-sm">Log in</button>
            <button className="bg-white text-primary-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition text-sm">Sign up</button>
          </div>
        </div>

        {/* Mega Menu Dropdown */}
        {openDropdown && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onMouseEnter={() => {
              if (closeTimeoutRef.current) {
                clearTimeout(closeTimeoutRef.current);
                closeTimeoutRef.current = null;
              }
            }}
            onMouseLeave={() => handleDropdownClose()}
            className="absolute top-full left-0 right-0 bg-black/80 backdrop-blur-md border-b border-white/10 overflow-visible z-50"
          >
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex flex-wrap gap-x-12 gap-y-0">
                {navItems
                  .find((item) => item.label === openDropdown)
                  ?.items.map((subItem) => (
                    <Link
                      key={subItem.title}
                      href={subItem.href}
                      className="group flex flex-col items-center justify-center py-2"
                    >
                      <div className="text-white group-hover:text-white/80 transition font-medium text-sm text-center">
                        {subItem.title}
                      </div>
                      <div className="h-0.5 w-0 group-hover:w-full bg-white transition-all duration-300 mt-1"></div>
                    </Link>
                  ))}
              </div>
            </div>
          </motion.div>
        )}
      </header>

      {/* Hero Section */}
      <div className="relative w-full h-80 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-600/30 to-black"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
        >
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4">Tax Allowances 2025/26</h1>
          <p className="text-lg text-white/90 max-w-2xl">
            See all the tax-free allowances HMRC gives you and how to maximize them.
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 w-full pt-8 pb-16">
        {/* Quick Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Key Allowances at a Glance</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-blue-500/20 rounded-2xl p-6 border border-blue-500/40 hover:border-blue-500/60 transition cursor-pointer"
              onClick={() => setExpandedAllowance(expandedAllowance === 'isa' ? null : 'isa')}>
              <p className="text-blue-300 text-xs uppercase tracking-wide mb-2">ISA</p>
              <p className="text-white text-3xl font-bold">£20,000</p>
              <p className="text-white/70 text-xs mt-2">Tax-free growth in investments</p>
            </div>

            <div className="bg-purple-500/20 rounded-2xl p-6 border border-purple-500/40 hover:border-purple-500/60 transition cursor-pointer"
              onClick={() => setExpandedAllowance(expandedAllowance === 'cgt' ? null : 'cgt')}>
              <p className="text-purple-300 text-xs uppercase tracking-wide mb-2">Capital Gains Tax</p>
              <p className="text-white text-3xl font-bold">£3,000</p>
              <p className="text-white/70 text-xs mt-2">Tax-free gains on asset sales</p>
            </div>

            <div className="bg-green-500/20 rounded-2xl p-6 border border-green-500/40 hover:border-green-500/60 transition cursor-pointer"
              onClick={() => setExpandedAllowance(expandedAllowance === 'dividend' ? null : 'dividend')}>
              <p className="text-green-300 text-xs uppercase tracking-wide mb-2">Dividends</p>
              <p className="text-white text-3xl font-bold">£500</p>
              <p className="text-white/70 text-xs mt-2">Tax-free dividend income</p>
            </div>

            <div className="bg-orange-500/20 rounded-2xl p-6 border border-orange-500/40 hover:border-orange-500/60 transition cursor-pointer"
              onClick={() => setExpandedAllowance(expandedAllowance === 'trading' ? null : 'trading')}>
              <p className="text-orange-300 text-xs uppercase tracking-wide mb-2">Trading Allowance</p>
              <p className="text-white text-3xl font-bold">£1,000</p>
              <p className="text-white/70 text-xs mt-2">Tax-free self-employment income</p>
            </div>

            <div className="bg-pink-500/20 rounded-2xl p-6 border border-pink-500/40 hover:border-pink-500/60 transition cursor-pointer"
              onClick={() => setExpandedAllowance(expandedAllowance === 'property' ? null : 'property')}>
              <p className="text-pink-300 text-xs uppercase tracking-wide mb-2">Property Income</p>
              <p className="text-white text-3xl font-bold">£1,000</p>
              <p className="text-white/70 text-xs mt-2">Tax-free rental income</p>
            </div>

            <div className="bg-rose-500/20 rounded-2xl p-6 border border-rose-500/40 hover:border-rose-500/60 transition cursor-pointer"
              onClick={() => setExpandedAllowance(expandedAllowance === 'marriage' ? null : 'marriage')}>
              <p className="text-rose-300 text-xs uppercase tracking-wide mb-2">Marriage Allowance</p>
              <p className="text-white text-3xl font-bold">£252</p>
              <p className="text-white/70 text-xs mt-2">Tax saving if transferring allowance</p>
            </div>
          </div>
        </motion.div>

        {/* Detailed Allowances */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Detailed Guide to Each Allowance</h2>
          <div className="space-y-4">
            {allowances.map((allowance, idx) => (
              <motion.div
                key={allowance.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                viewport={{ once: true }}
                onClick={() => setExpandedAllowance(expandedAllowance === allowance.id ? null : allowance.id)}
                className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden cursor-pointer hover:bg-white/10 transition"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-lg mb-2">{allowance.name}</h3>
                      <p className="text-white font-bold text-2xl text-blue-400">{allowance.limit}</p>
                    </div>
                    <div className="text-2xl opacity-50 group-hover:opacity-100 transition">
                      {expandedAllowance === allowance.id ? '−' : '+'}
                    </div>
                  </div>

                  {expandedAllowance === allowance.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-6 pt-6 border-t border-white/10 space-y-4"
                    >
                      <div>
                        <p className="text-white/70 text-xs uppercase tracking-wide mb-2">Types of income covered:</p>
                        <ul className="space-y-1">
                          {allowance.types.map((type, i) => (
                            <li key={i} className="text-white/80 text-sm flex gap-2">
                              <span className="text-blue-400">•</span> {type}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <p className="text-white/70 text-xs uppercase tracking-wide mb-2">Tax treatment:</p>
                        <p className="text-white/80 text-sm">{allowance.taxTreatment}</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                          <p className="text-white/70 text-xs uppercase tracking-wide mb-1">Deadline</p>
                          <p className="text-white/80 text-sm font-medium">{allowance.deadline}</p>
                        </div>
                        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                          <p className="text-white/70 text-xs uppercase tracking-wide mb-1">If you miss it</p>
                          <p className="text-white/80 text-sm font-medium">{allowance.missed}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Personal Allowance Taper */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-3xl p-8 border border-blue-500/20"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Personal Allowance Taper (High Earners)</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-blue-400 font-semibold mb-4">Standard Personal Allowance</h3>
              <div className="space-y-3">
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-white/70 text-xs uppercase tracking-wide mb-1">Amount</p>
                  <p className="text-white font-bold text-2xl">£12,570</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-white/70 text-xs uppercase tracking-wide mb-1">Applies if</p>
                  <p className="text-white/80 text-sm">Adjusted income under £100,000</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-cyan-400 font-semibold mb-4">Tapered Personal Allowance</h3>
              <div className="space-y-3">
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-white/70 text-xs uppercase tracking-wide mb-1">Taper rate</p>
                  <p className="text-white font-bold text-2xl">£1 per £2 over £100k</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-white/70 text-xs uppercase tracking-wide mb-1">Reduced to zero at</p>
                  <p className="text-white/80 text-sm">£125,140 adjusted income</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-500/20 rounded-lg border border-blue-500/40">
            <p className="text-blue-300 text-sm">
              📌 <strong>Adjusted income</strong> = Total income minus certain reliefs (e.g. pension contributions). This is higher than taxable income!
            </p>
          </div>
        </motion.div>

        {/* ISA Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 bg-white/5 rounded-3xl p-8 border border-white/10"
        >
          <h2 className="text-2xl font-bold text-white mb-6">ISA Types Explained</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-500/10 rounded-2xl p-6 border border-green-500/20">
              <h3 className="text-green-400 font-semibold mb-3 text-lg">Cash ISA</h3>
              <div className="space-y-2 text-white/80 text-sm">
                <p>• Interest earned is completely tax-free</p>
                <p>• Money available whenever you need it</p>
                <p>• Currently better rates than taxable savings</p>
                <p>• Max £20k/year (separate from S&S ISA)</p>
              </div>
            </div>

            <div className="bg-purple-500/10 rounded-2xl p-6 border border-purple-500/20">
              <h3 className="text-purple-400 font-semibold mb-3 text-lg">Stocks & Shares ISA</h3>
              <div className="space-y-2 text-white/80 text-sm">
                <p>• Dividends and capital gains completely tax-free</p>
                <p>• Invest in shares, funds, ETFs, bonds</p>
                <p>• Higher growth potential long-term</p>
                <p>• Max £20k/year (combined with Cash ISA)</p>
              </div>
            </div>

            <div className="bg-blue-500/10 rounded-2xl p-6 border border-blue-500/20">
              <h3 className="text-blue-400 font-semibold mb-3 text-lg">Lifetime ISA (Age 18-39)</h3>
              <div className="space-y-2 text-white/80 text-sm">
                <p>• Government adds 25% bonus on your contributions</p>
                <p>• £4,000/year max (£1,000 bonus from government)</p>
                <p>• For first home purchase or retirement at 60+</p>
                <p>• Part of your £20k annual limit</p>
              </div>
            </div>

            <div className="bg-pink-500/10 rounded-2xl p-6 border border-pink-500/20">
              <h3 className="text-pink-400 font-semibold mb-3 text-lg">Junior ISA (Under 18)</h3>
              <div className="space-y-2 text-white/80 text-sm">
                <p>• Parents save tax-free for children</p>
                <p>• £9,000/year limit (separate from adult ISA)</p>
                <p>• Child controls it at age 16</p>
                <p>• Own separate £20k limit to grow</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Common Mistakes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-3xl p-8 border border-red-500/20"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Common Mistakes People Make</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: 'Not using ISA allowance', desc: 'Leaving £20k unused each year means losing tax-free growth forever' },
              { title: 'Forgetting the £500 dividend allowance', desc: 'Even small amounts of dividends count - this is a free allowance' },
              { title: 'Mixing ISA accounts', desc: 'Can only pay into one Cash ISA and one S&S ISA per tax year (not both)' },
              { title: 'Not claiming Marriage Allowance', desc: 'One partner can transfer their unused allowance for up to £252/year' },
              { title: 'Claiming too many allowances', desc: 'Trading allowance OR actual expenses (not both) - choose whichever saves more' },
              { title: 'Missing the deadline', desc: 'Some allowances reset on 5 April - unused balance is lost forever' },
            ].map((mistake, idx) => (
              <div key={idx} className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="text-red-300 font-semibold mb-2 flex items-center gap-2">
                  <span className="text-lg">!</span> {mistake.title}
                </h3>
                <p className="text-white/70 text-sm">{mistake.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Key Dates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-3xl p-8 border border-emerald-500/20"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Important Dates 2025/26</h2>
          <div className="space-y-3">
            {[
              { date: '5 April 2025', event: 'End of current tax year', note: 'Tax year 2024/25 ends' },
              { date: '6 April 2025', event: 'Start of new tax year', note: 'Tax year 2025/26 begins - all allowances reset' },
              { date: '31 December 2025', event: 'ISA deadline for claim', note: 'File Self Assessment for early tax refund claim' },
              { date: '31 January 2026', event: 'Tax deadline', note: 'Self Assessment deadline & tax payment due' },
              { date: '5 April 2026', event: 'End of 2025/26 tax year', note: 'Last day to use annual allowances from this year' },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="text-emerald-400 font-bold text-sm min-w-32">{item.date}</div>
                <div>
                  <p className="text-white font-semibold text-sm">{item.event}</p>
                  <p className="text-white/70 text-xs mt-1">{item.note}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
