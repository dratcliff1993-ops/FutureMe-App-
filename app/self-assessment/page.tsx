'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useRef } from 'react';

export default function SelfAssessment() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

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
        <div className="absolute inset-0 bg-gradient-to-b from-purple-600/30 to-black"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
        >
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4">Self Assessment Made Simple</h1>
          <p className="text-lg text-white/90 max-w-2xl">
            Understand deadlines, who needs to file, and how to report your income correctly.
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 w-full pt-8 pb-16">
        {/* Do I Need to File */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-3xl p-8 border border-blue-500/20"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Do You Need to File Self Assessment?</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-blue-400 font-semibold mb-4 text-lg">You MUST file if:</h3>
              <ul className="space-y-3 text-white/80 text-sm">
                <li className="flex gap-3">
                  <span className="text-green-400 font-bold">✓</span> Self-employed (turnover &gt; £1,000)
                </li>
                <li className="flex gap-3">
                  <span className="text-green-400 font-bold">✓</span> Taxable income &gt; £100,000
                </li>
                <li className="flex gap-3">
                  <span className="text-green-400 font-bold">✓</span> Rental income (£1,000+)
                </li>
                <li className="flex gap-3">
                  <span className="text-green-400 font-bold">✓</span> Dividend income &gt; £1,000
                </li>
                <li className="flex gap-3">
                  <span className="text-green-400 font-bold">✓</span> Untaxed interest (after £1k allowance)
                </li>
                <li className="flex gap-3">
                  <span className="text-green-400 font-bold">✓</span> Trustees or beneficiaries
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-purple-400 font-semibold mb-4 text-lg">You DON'T need to file if:</h3>
              <ul className="space-y-3 text-white/80 text-sm">
                <li className="flex gap-3">
                  <span className="text-red-400 font-bold">✗</span> Employee earning &lt; £100k
                </li>
                <li className="flex gap-3">
                  <span className="text-red-400 font-bold">✗</span> Tax paid via PAYE entirely
                </li>
                <li className="flex gap-3">
                  <span className="text-red-400 font-bold">✗</span> All income in ISAs
                </li>
                <li className="flex gap-3">
                  <span className="text-red-400 font-bold">✗</span> No trading income
                </li>
                <li className="flex gap-3">
                  <span className="text-red-400 font-bold">✗</span> HMRC hasn't sent notice
                </li>
                <li className="flex gap-3">
                  <span className="text-red-400 font-bold">✗</span> Only receive employment income
                </li>
              </ul>
            </div>
          </div>
          <p className="text-white/70 text-sm p-4 bg-white/5 rounded-lg border border-white/10">
            💡 <strong>Tip:</strong> Even if you don't need to file, you can still submit a return to claim a refund or adjust your tax code.
          </p>
        </motion.div>

        {/* Key Deadlines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Important Deadlines</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-red-500/20 rounded-2xl p-6 border border-red-500/40">
              <h3 className="text-red-300 font-semibold mb-2 text-lg">5 April</h3>
              <p className="text-white/70 text-sm mb-4">End of UK tax year</p>
              <p className="text-white/50 text-xs">New tax year begins 6 April. Last day to make contributions to previous year's pension.</p>
            </div>
            <div className="bg-orange-500/20 rounded-2xl p-6 border border-orange-500/40">
              <h3 className="text-orange-300 font-semibold mb-2 text-lg">31 October</h3>
              <p className="text-white/70 text-sm mb-4">Paper return deadline</p>
              <p className="text-white/50 text-xs">Last day to submit paper Self Assessment return (6 months after tax year end)</p>
            </div>
            <div className="bg-blue-500/20 rounded-2xl p-6 border border-blue-500/40">
              <h3 className="text-blue-300 font-semibold mb-2 text-lg">31 January</h3>
              <p className="text-white/70 text-sm mb-4">Online deadline & tax due</p>
              <p className="text-white/50 text-xs">Last day to file online return and pay tax in full. Second payment on account due.</p>
            </div>
          </div>
        </motion.div>

        {/* Allowable Expenses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 bg-white/5 rounded-3xl p-8 border border-white/10"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Common Allowable Business Expenses</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: 'Home Office', items: ['Rent/mortgage proportion', 'Council tax share', 'Utilities', 'Internet'] },
              { title: 'Travel', items: ['Business mileage (45p/mile)', 'Trains/flights', 'Parking & tolls', 'Vehicle insurance'] },
              { title: 'Equipment & Materials', items: ['Computer/laptop', 'Software & apps', 'Tools & machinery', 'Raw materials'] },
              { title: 'Professional Fees', items: ['Accountant/bookkeeper', 'Legal advice', 'Professional memberships', 'Training courses'] },
              { title: 'General Expenses', items: ['Stationery', 'Phone & broadband', 'Client entertainment', 'Subscriptions'] },
              { title: 'Stock & Inventory', items: ['Goods for resale', 'Stock purchased', 'Opening & closing values', 'Depreciation'] },
            ].map((category) => (
              <div key={category.title} className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="text-white font-semibold mb-3">{category.title}</h3>
                <ul className="space-y-2 text-white/70 text-sm">
                  {category.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-blue-400">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-yellow-500/20 rounded-lg border border-yellow-500/40">
            <p className="text-yellow-300 text-sm">
              ⚠️ <strong>Keep records:</strong> You must keep invoices and receipts for at least 5 years. HMRC can ask for evidence at any time.
            </p>
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
          <h2 className="text-2xl font-bold text-white mb-6">Common Self Assessment Mistakes</h2>
          <div className="space-y-4">
            {[
              {
                title: 'Missing the deadline',
                description: 'Late filing penalties start at £100 immediately after 31 Jan. After 3 months, it\'s 5% of the tax owed.',
              },
              {
                title: 'Not keeping records',
                description: 'HMRC can request evidence up to 5 years later. Without documentation, you can\'t claim business expenses.',
              },
              {
                title: 'Forgetting to declare all income',
                description: 'Including small amounts of interest, dividends, and freelance work. HMRC can see bank deposits.',
              },
              {
                title: 'Over-claiming expenses',
                description: 'Only claim expenses that are wholly and exclusively for the business. Personal expenses are not allowable.',
              },
              {
                title: 'Not updating address',
                description: 'If HMRC sends notices to the wrong address and you miss deadlines, penalties still apply.',
              },
              {
                title: 'Mixing personal and business accounts',
                description: 'Commingling makes it harder to prove what was business expense vs personal spending.',
              },
            ].map((mistake, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 rounded-xl p-4 border border-white/10 cursor-pointer hover:bg-white/10 transition"
                onClick={() => setExpandedItem(expandedItem === `mistake-${idx}` ? null : `mistake-${idx}`)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-red-300 font-semibold">{mistake.title}</h3>
                    <p className="text-white/70 text-sm mt-1">{mistake.description}</p>
                  </div>
                  <span className="text-2xl text-red-400">!</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Penalties */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 bg-white/5 rounded-3xl p-8 border border-white/10"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Self Assessment Penalties Timeline</h2>
          <div className="space-y-3">
            <div className="flex gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="text-red-400 font-bold text-lg min-w-24">Immediate</div>
              <div>
                <p className="text-white font-semibold text-sm mb-1">£100 late filing penalty</p>
                <p className="text-white/70 text-xs">Applies automatically after 31 January deadline</p>
              </div>
            </div>
            <div className="flex gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="text-orange-400 font-bold text-lg min-w-24">3 months</div>
              <div>
                <p className="text-white font-semibold text-sm mb-1">5% of tax owed</p>
                <p className="text-white/70 text-xs">If still not filed after 3 months</p>
              </div>
            </div>
            <div className="flex gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="text-orange-400 font-bold text-lg min-w-24">6 months</div>
              <div>
                <p className="text-white font-semibold text-sm mb-1">Another 5% of tax owed</p>
                <p className="text-white/70 text-xs">Total penalty now 10% of tax owed</p>
              </div>
            </div>
            <div className="flex gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="text-red-400 font-bold text-lg min-w-24">12 months</div>
              <div>
                <p className="text-white font-semibold text-sm mb-1">Further £300 or 5% (whichever is higher)</p>
                <p className="text-white/70 text-xs">Plus interest on any unpaid tax from due date</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-3xl p-8 border border-emerald-500/20"
        >
          <h2 className="text-2xl font-bold text-white mb-6">How to Make Self Assessment Easier</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-emerald-400 font-semibold mb-2 flex items-center gap-2">
                <span className="text-lg">📱</span> Use Tax Software
              </h3>
              <p className="text-white/70 text-sm">
                Use HMRC-approved software (many free options available). They guide you through step-by-step.
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-emerald-400 font-semibold mb-2 flex items-center gap-2">
                <span className="text-lg">📊</span> Keep Digital Records
              </h3>
              <p className="text-white/70 text-sm">
                Use accounting software to categorize expenses throughout the year, not just at deadline.
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-emerald-400 font-semibold mb-2 flex items-center gap-2">
                <span className="text-lg">🗂️</span> Organize Documents
              </h3>
              <p className="text-white/70 text-sm">
                Scan receipts and invoices into folders. Use a simple spreadsheet if software seems too much.
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-emerald-400 font-semibold mb-2 flex items-center gap-2">
                <span className="text-lg">⏰</span> File Early
              </h3>
              <p className="text-white/70 text-sm">
                File by 31 December if you want a refund for that tax year. But 31 January is the main deadline.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
