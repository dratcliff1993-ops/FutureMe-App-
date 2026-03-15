'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import { Space_Grotesk } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['400', '600', '700'] });

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
    <main className={`${spaceGrotesk.className} min-h-screen bg-white w-full`}>
      {/* Navigation Header */}
      <header className="fixed top-0 w-full z-[9999] backdrop-blur-sm bg-white/95 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex gap-3 items-center">
            <Link href="/" className="flex gap-3 items-center">
              <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full" style={{transform: 'skew(-20deg) rotate(-15deg)'}}>
                  <text x="50" y="70" fontSize="80" fontWeight="900" fill="#2563c6" textAnchor="middle" fontFamily="Inter, sans-serif">F</text>
                </svg>
              </div>
              <div className="text-3xl font-bold text-gray-900">FutureMe</div>
            </Link>
          </div>
          <nav className="hidden md:flex gap-8 text-gray-700 overflow-visible">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative group overflow-visible"
                onMouseEnter={() => handleDropdownOpen(item.label)}
                onMouseLeave={() => handleDropdownClose()}
              >
                <button className={`px-4 py-2 rounded-full transition ${openDropdown === item.label ? 'bg-gray-100 text-gray-900' : 'hover:text-gray-900'}`}>
                  {item.label}
                </button>
              </div>
            ))}
          </nav>
          <div className="flex gap-4 items-center">
            <button className="text-gray-700 hover:text-gray-900 transition text-sm">Log in</button>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition text-sm">Sign up</button>
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
            className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 overflow-visible z-50"
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
                      <div className="text-gray-900 group-hover:text-gray-600 transition font-medium text-sm text-center">
                        {subItem.title}
                      </div>
                      <div className="h-0.5 w-0 group-hover:w-full bg-gray-900 transition-all duration-300 mt-1"></div>
                    </Link>
                  ))}
              </div>
            </div>
          </motion.div>
        )}
      </header>

      {/* Hero Section */}
      <div className="relative w-full min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/self-assessment-hero.jpg"
            alt="Self Assessment"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/70"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight max-w-3xl">
              Self Assessment Made Simple
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg sm:text-xl text-slate-200 max-w-2xl mb-8 leading-relaxed"
          >
            Understand deadlines, who needs to file, and how to report your income correctly. Get expert guidance on deductions, penalties, and everything you need to know about UK Self Assessment.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex gap-4 flex-wrap"
          >
            <button className="px-8 py-3 bg-white text-slate-900 font-semibold rounded-full hover:bg-slate-100 transition">
              Get Started
            </button>
            <button className="px-8 py-3 border border-white text-white font-semibold rounded-full hover:bg-white/10 transition">
              Learn More
            </button>
          </motion.div>
        </div>
      </div>

      <div className="bg-white w-full">
      <div className="max-w-7xl mx-auto px-4 w-full py-16">
        {/* Do I Need to File */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-12">Do You Need to File Self Assessment?</h2>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-slate-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-gray-900 font-bold mb-6 text-lg">You MUST file if:</h3>
              <ul className="space-y-3 text-gray-700 text-sm">
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold flex-shrink-0">✓</span> Self-employed (turnover &gt; £1,000)
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold flex-shrink-0">✓</span> Taxable income &gt; £100,000
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold flex-shrink-0">✓</span> Rental income (£1,000+)
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold flex-shrink-0">✓</span> Dividend income &gt; £1,000
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold flex-shrink-0">✓</span> Untaxed interest (after £1k allowance)
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold flex-shrink-0">✓</span> Trustees or beneficiaries
                </li>
              </ul>
            </div>
            <div className="bg-slate-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-gray-900 font-bold mb-6 text-lg">You DON'T need to file if:</h3>
              <ul className="space-y-3 text-gray-700 text-sm">
                <li className="flex gap-3">
                  <span className="text-slate-400 font-bold flex-shrink-0">✗</span> Employee earning &lt; £100k
                </li>
                <li className="flex gap-3">
                  <span className="text-slate-400 font-bold flex-shrink-0">✗</span> Tax paid via PAYE entirely
                </li>
                <li className="flex gap-3">
                  <span className="text-slate-400 font-bold flex-shrink-0">✗</span> All income in ISAs
                </li>
                <li className="flex gap-3">
                  <span className="text-slate-400 font-bold flex-shrink-0">✗</span> No trading income
                </li>
                <li className="flex gap-3">
                  <span className="text-slate-400 font-bold flex-shrink-0">✗</span> HMRC hasn't sent notice
                </li>
                <li className="flex gap-3">
                  <span className="text-slate-400 font-bold flex-shrink-0">✗</span> Only receive employment income
                </li>
              </ul>
            </div>
          </div>
          <div className="text-gray-700 text-sm p-6 bg-blue-50 rounded-xl border border-blue-200">
            <span className="text-lg mr-2">💡</span><strong>Tip:</strong> Even if you don't need to file, you can still submit a return to claim a refund or adjust your tax code.
          </div>
        </motion.div>

        {/* Image Break - Digital Tools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="my-16"
        >
          <img
            src="/self-assessment-tablet.jpg"
            alt="Digital record keeping"
            className="w-full h-80 object-cover rounded-2xl shadow-sm"
          />
        </motion.div>

        {/* Key Deadlines */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-12">Important Deadlines</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-gray-900 font-black text-2xl mb-2">5 April</h3>
              <p className="text-gray-700 font-semibold text-sm mb-3">End of UK tax year</p>
              <p className="text-gray-600 text-sm">New tax year begins 6 April. Last day to make contributions to previous year's pension.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-gray-900 font-black text-2xl mb-2">31 October</h3>
              <p className="text-gray-700 font-semibold text-sm mb-3">Paper return deadline</p>
              <p className="text-gray-600 text-sm">Last day to submit paper Self Assessment return (6 months after tax year end)</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-8 border border-blue-200 shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-gray-900 font-black text-2xl mb-2">31 January</h3>
              <p className="text-gray-700 font-semibold text-sm mb-3">Online deadline & tax due</p>
              <p className="text-gray-600 text-sm">Last day to file online return and pay tax in full. Second payment on account due.</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Allowable Expenses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Common Allowable Business Expenses</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: 'Home Office', items: ['Rent/mortgage proportion', 'Council tax share', 'Utilities', 'Internet'] },
              { title: 'Travel', items: ['Business mileage (45p/mile)', 'Trains/flights', 'Parking & tolls', 'Vehicle insurance'] },
              { title: 'Equipment & Materials', items: ['Computer/laptop', 'Software & apps', 'Tools & machinery', 'Raw materials'] },
              { title: 'Professional Fees', items: ['Accountant/bookkeeper', 'Legal advice', 'Professional memberships', 'Training courses'] },
              { title: 'General Expenses', items: ['Stationery', 'Phone & broadband', 'Client entertainment', 'Subscriptions'] },
              { title: 'Stock & Inventory', items: ['Goods for resale', 'Stock purchased', 'Opening & closing values', 'Depreciation'] },
            ].map((category) => (
              <div key={category.title} className="bg-slate-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-gray-900 font-semibold mb-3">{category.title}</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  {category.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-gray-400">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-gray-900 text-sm">
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
          className="mb-16 bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Common Self Assessment Mistakes</h2>
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
                className="bg-slate-50 rounded-lg p-4 border border-gray-200 cursor-pointer hover:bg-gray-50 transition"
                onClick={() => setExpandedItem(expandedItem === `mistake-${idx}` ? null : `mistake-${idx}`)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-gray-900 font-semibold">{mistake.title}</h3>
                    <p className="text-gray-700 text-sm mt-1">{mistake.description}</p>
                  </div>
                  <span className="text-2xl text-gray-400">!</span>
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
          className="mb-16 bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Self Assessment Penalties Timeline</h2>
          <div className="space-y-3">
            <div className="flex gap-4 p-4 bg-slate-50 rounded-lg border border-gray-200">
              <div className="text-gray-900 font-bold text-lg min-w-24">Immediate</div>
              <div>
                <p className="text-gray-900 font-semibold text-sm mb-1">£100 late filing penalty</p>
                <p className="text-gray-700 text-xs">Applies automatically after 31 January deadline</p>
              </div>
            </div>
            <div className="flex gap-4 p-4 bg-slate-50 rounded-lg border border-gray-200">
              <div className="text-gray-900 font-bold text-lg min-w-24">3 months</div>
              <div>
                <p className="text-gray-900 font-semibold text-sm mb-1">5% of tax owed</p>
                <p className="text-gray-700 text-xs">If still not filed after 3 months</p>
              </div>
            </div>
            <div className="flex gap-4 p-4 bg-slate-50 rounded-lg border border-gray-200">
              <div className="text-gray-900 font-bold text-lg min-w-24">6 months</div>
              <div>
                <p className="text-gray-900 font-semibold text-sm mb-1">Another 5% of tax owed</p>
                <p className="text-gray-700 text-xs">Total penalty now 10% of tax owed</p>
              </div>
            </div>
            <div className="flex gap-4 p-4 bg-slate-50 rounded-lg border border-gray-200">
              <div className="text-gray-900 font-bold text-lg min-w-24">12 months</div>
              <div>
                <p className="text-gray-900 font-semibold text-sm mb-1">Further £300 or 5% (whichever is higher)</p>
                <p className="text-gray-700 text-xs">Plus interest on any unpaid tax from due date</p>
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
          className="mb-16 bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8">How to Make Self Assessment Easier</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-gray-900 font-semibold mb-2 flex items-center gap-2">
                <span className="text-lg">📱</span> Use Tax Software
              </h3>
              <p className="text-gray-700 text-sm">
                Use HMRC-approved software (many free options available). They guide you through step-by-step.
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-gray-900 font-semibold mb-2 flex items-center gap-2">
                <span className="text-lg">📊</span> Keep Digital Records
              </h3>
              <p className="text-gray-700 text-sm">
                Use accounting software to categorize expenses throughout the year, not just at deadline.
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-gray-900 font-semibold mb-2 flex items-center gap-2">
                <span className="text-lg">🗂️</span> Organize Documents
              </h3>
              <p className="text-gray-700 text-sm">
                Scan receipts and invoices into folders. Use a simple spreadsheet if software seems too much.
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-gray-900 font-semibold mb-2 flex items-center gap-2">
                <span className="text-lg">⏰</span> File Early
              </h3>
              <p className="text-gray-700 text-sm">
                File by 31 December if you want a refund for that tax year. But 31 January is the main deadline.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      </div>
    </main>
  );
}
