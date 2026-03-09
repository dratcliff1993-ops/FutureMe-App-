'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useRef } from 'react';

export default function PensionPlanning() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [salary, setSalary] = useState(50000);
  const [contribution, setContribution] = useState(5000);
  const [method, setMethod] = useState<'salary-sacrifice' | 'relief'>('salary-sacrifice');

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

  const calculateTaxRelief = () => {
    if (method === 'salary-sacrifice') {
      const newSalary = salary - contribution;
      const incomeTax = Math.max(0, (newSalary - 12570) * 0.20);
      const standardTax = Math.max(0, (salary - 12570) * 0.20);
      const taxSaving = standardTax - incomeTax;
      return { taxSaving, netCost: contribution - taxSaving, pensionPot: contribution };
    } else {
      const baseTaxRate = salary > 50270 ? 0.40 : 0.20;
      const taxSaving = contribution * baseTaxRate;
      const netCost = contribution - taxSaving;
      const pensionPot = contribution + taxSaving;
      return { taxSaving, netCost, pensionPot };
    }
  };

  const { taxSaving, netCost, pensionPot } = calculateTaxRelief();
  const annualAllowance = 60000;
  const allowanceUsed = (contribution / annualAllowance * 100).toFixed(0);
  const statePension = 221.20 * 52;

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
        <div className="absolute inset-0 bg-gradient-to-b from-pink-600/30 to-black"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
        >
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4">Pension Planning & Tax Relief</h1>
          <p className="text-lg text-white/90 max-w-2xl">
            See how pension contributions save you tax and build your retirement wealth.
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 w-full pt-8 pb-16">
        {/* Tax Relief Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 bg-gradient-to-r from-pink-500/10 to-rose-500/10 rounded-3xl p-8 border border-pink-500/20"
        >
          <h2 className="text-2xl font-bold text-white mb-6">How Much Tax Relief Will You Get?</h2>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Inputs */}
            <div className="space-y-6">
              <div>
                <label className="block text-white/70 text-sm mb-2">Annual Salary</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="range"
                    min="0"
                    max="200000"
                    step="5000"
                    value={salary}
                    onChange={(e) => setSalary(Number(e.target.value))}
                    className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-white font-semibold min-w-32 text-right">£{salary.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Pension Contribution</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="range"
                    min="0"
                    max={Math.min(60000, salary)}
                    step="500"
                    value={contribution}
                    onChange={(e) => setContribution(Number(e.target.value))}
                    className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-white font-semibold min-w-32 text-right">£{contribution.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-3">Contribution Method</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setMethod('salary-sacrifice')}
                    className={`flex-1 px-4 py-2 rounded-lg text-sm transition ${method === 'salary-sacrifice' ? 'bg-pink-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
                  >
                    Salary Sacrifice
                  </button>
                  <button
                    onClick={() => setMethod('relief')}
                    className={`flex-1 px-4 py-2 rounded-lg text-sm transition ${method === 'relief' ? 'bg-pink-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
                  >
                    Relief at Source
                  </button>
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <p className="text-white/70 text-xs mb-2">
                  {method === 'salary-sacrifice'
                    ? 'Reduces your salary before tax is calculated. Better for NI savings.'
                    : 'You pay in, tax relief added automatically. Standard method for most people.'}
                </p>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-4 flex flex-col justify-center">
              <div className="bg-pink-500/20 rounded-xl p-4 border border-pink-500/40">
                <p className="text-pink-300 text-xs uppercase tracking-wide mb-1">Tax Saving</p>
                <p className="text-3xl font-bold text-pink-400">£{Math.round(taxSaving).toLocaleString()}</p>
                <p className="text-pink-300/60 text-xs mt-1">Annual tax relief</p>
              </div>
              <div className="bg-purple-500/20 rounded-xl p-4 border border-purple-500/40">
                <p className="text-purple-300 text-xs uppercase tracking-wide mb-1">Net Cost to You</p>
                <p className="text-3xl font-bold text-purple-400">£{Math.round(netCost).toLocaleString()}</p>
                <p className="text-purple-300/60 text-xs mt-1">What you actually pay</p>
              </div>
              <div className="bg-indigo-500/20 rounded-xl p-4 border border-indigo-500/40">
                <p className="text-indigo-300 text-xs uppercase tracking-wide mb-1">Pension Pot Receives</p>
                <p className="text-3xl font-bold text-indigo-400">£{Math.round(pensionPot).toLocaleString()}</p>
                <p className="text-indigo-300/60 text-xs mt-1">Going into your pension</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="text-white/70 text-sm">
              <strong>Annual Allowance Used:</strong> {allowanceUsed}% of £60,000 limit
            </div>
            <div className="h-2 flex-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-300"
                style={{ width: `${Math.min(100, parseInt(allowanceUsed))}%` }}
              ></div>
            </div>
          </div>
        </motion.div>

        {/* Contribution Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 bg-white/5 rounded-3xl p-8 border border-white/10"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Pension Contribution Methods</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-blue-500/10 rounded-2xl p-6 border border-blue-500/20">
              <h3 className="text-blue-400 font-semibold mb-4 text-lg">Salary Sacrifice</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-white/70 text-xs uppercase tracking-wide text-blue-300 mb-1">How it works</p>
                  <p className="text-white/80 text-sm">Your employer deducts contribution from your salary before tax.</p>
                </div>
                <div>
                  <p className="text-white/70 text-xs uppercase tracking-wide text-blue-300 mb-1">Tax saving</p>
                  <p className="text-white/80 text-sm">Income tax + National Insurance (7.8-10.75%)</p>
                </div>
                <div>
                  <p className="text-white/70 text-xs uppercase tracking-wide text-blue-300 mb-1">Best for</p>
                  <p className="text-white/80 text-sm">Employees. Saves both income tax AND NI.</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-500/10 rounded-2xl p-6 border border-purple-500/20">
              <h3 className="text-purple-400 font-semibold mb-4 text-lg">Relief at Source</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-white/70 text-xs uppercase tracking-wide text-purple-300 mb-1">How it works</p>
                  <p className="text-white/80 text-sm">You pay in, pension gets 20% tax relief automatically added.</p>
                </div>
                <div>
                  <p className="text-white/70 text-xs uppercase tracking-wide text-purple-300 mb-1">Tax saving</p>
                  <p className="text-white/80 text-sm">Income tax only (basic rate 20%)</p>
                </div>
                <div>
                  <p className="text-white/70 text-xs uppercase tracking-wide text-purple-300 mb-1">Best for</p>
                  <p className="text-white/80 text-sm">Self-employed & employees without salary sacrifice.</p>
                </div>
              </div>
            </div>

            <div className="bg-orange-500/10 rounded-2xl p-6 border border-orange-500/20">
              <h3 className="text-orange-400 font-semibold mb-4 text-lg">Net Pay Arrangement</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-white/70 text-xs uppercase tracking-wide text-orange-300 mb-1">How it works</p>
                  <p className="text-white/80 text-sm">Pay contribution from net salary after tax. Claim higher rate relief.</p>
                </div>
                <div>
                  <p className="text-white/70 text-xs uppercase tracking-wide text-orange-300 mb-1">Tax saving</p>
                  <p className="text-white/80 text-sm">Claim higher rate relief (20-45%) via tax return</p>
                </div>
                <div>
                  <p className="text-white/70 text-xs uppercase tracking-wide text-orange-300 mb-1">Best for</p>
                  <p className="text-white/80 text-sm">Higher rate taxpayers who want extra relief.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Annual Allowance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-3xl p-8 border border-orange-500/20"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Annual Allowance & Carry Forward</h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-orange-400 font-semibold mb-4">2025/26 Annual Allowance</h3>
              <div className="space-y-3">
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-white/70 text-xs uppercase tracking-wide mb-1">Standard Limit</p>
                  <p className="text-white font-bold text-2xl">£60,000</p>
                  <p className="text-white/50 text-xs mt-2">Per tax year into all your pensions combined</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-white/70 text-xs uppercase tracking-wide mb-1">Alternative (Tapered)</p>
                  <p className="text-white font-bold text-2xl">Down to £10,000</p>
                  <p className="text-white/50 text-xs mt-2">If adjusted income &gt; £260,000</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-amber-400 font-semibold mb-4">Carry Forward (Last 3 Years)</h3>
              <div className="space-y-3">
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-white/70 text-xs uppercase tracking-wide mb-1">Unused Allowance</p>
                  <p className="text-white font-bold text-lg">Can carry forward</p>
                  <p className="text-white/50 text-xs mt-2">If you didn't use full allowance in previous 3 tax years</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-white/70 text-xs uppercase tracking-wide mb-1">Potential Total</p>
                  <p className="text-white font-bold text-2xl">Up to £240,000</p>
                  <p className="text-white/50 text-xs mt-2">Current year (£60k) + 3 prior years (£180k)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-orange-500/20 rounded-lg border border-orange-500/40">
            <p className="text-orange-300 text-sm">
              ⚠️ <strong>Exceed the allowance?</strong> You'll pay a tax charge on the excess. No penalty if within your limit or covered by carry-forward allowance.
            </p>
          </div>
        </motion.div>

        {/* State Pension */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 bg-white/5 rounded-3xl p-8 border border-white/10"
        >
          <h2 className="text-2xl font-bold text-white mb-6">State Pension Overview (2025/26)</h2>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-emerald-500/10 rounded-2xl p-6 border border-emerald-500/20">
              <h3 className="text-emerald-300 font-semibold mb-2">Full State Pension</h3>
              <p className="text-3xl font-bold text-emerald-400 mb-2">£{statePension.toLocaleString()}</p>
              <p className="text-white/70 text-sm mb-3">Per year (£{(statePension/12).toFixed(2)}/month)</p>
              <p className="text-white/50 text-xs">Based on 35+ years National Insurance contributions</p>
            </div>

            <div className="bg-blue-500/10 rounded-2xl p-6 border border-blue-500/20">
              <h3 className="text-blue-300 font-semibold mb-2">State Pension Age</h3>
              <p className="text-3xl font-bold text-blue-400 mb-2">66-67</p>
              <p className="text-white/70 text-sm mb-3">Increasing gradually to age 68</p>
              <p className="text-white/50 text-xs">Check your personal state pension age via HMRC</p>
            </div>

            <div className="bg-pink-500/10 rounded-2xl p-6 border border-pink-500/20">
              <h3 className="text-pink-300 font-semibold mb-2">NI Contributions</h3>
              <p className="text-3xl font-bold text-pink-400 mb-2">35 Years</p>
              <p className="text-white/70 text-sm mb-3">Required for full pension</p>
              <p className="text-white/50 text-xs">Home responsibilities and carer credits may count</p>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <h3 className="text-white font-semibold mb-3">Why save in a pension?</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex gap-3">
                <span className="text-emerald-400 font-bold text-lg">+</span>
                <div>
                  <p className="text-white font-medium">State pension covers basics only</p>
                  <p className="text-white/50 text-xs">Average full pension is below median private pension pots</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-emerald-400 font-bold text-lg">+</span>
                <div>
                  <p className="text-white font-medium">Tax relief boosts contributions</p>
                  <p className="text-white/50 text-xs">Get 20-45% free money from tax relief</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-emerald-400 font-bold text-lg">+</span>
                <div>
                  <p className="text-white font-medium">Compound growth over decades</p>
                  <p className="text-white/50 text-xs">Starting early means much larger pension pot at retirement</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-emerald-400 font-bold text-lg">+</span>
                <div>
                  <p className="text-white font-medium">Employer contributions</p>
                  <p className="text-white/50 text-xs">Many employers match or exceed your contributions</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 bg-gradient-to-r from-indigo-500/10 to-blue-500/10 rounded-3xl p-8 border border-indigo-500/20"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Next Steps for Your Pension</h2>
          <div className="space-y-3">
            {[
              { num: 1, title: 'Check your provider', desc: 'Know which pension you\'re in and what fees you\'re paying' },
              { num: 2, title: 'Review investment choices', desc: 'Ensure your risk level matches your age and goals' },
              { num: 3, title: 'Maximize your contributions', desc: 'Increase contributions to use your full annual allowance' },
              { num: 4, title: 'Check for employer match', desc: 'Ensure you\'re getting any available employer contributions' },
              { num: 5, title: 'Plan your retirement income', desc: 'Use a calculator to estimate your needed pension pot' },
            ].map((step) => (
              <div key={step.num} className="flex gap-4 p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition">
                <div className="w-8 h-8 flex items-center justify-center bg-indigo-500 text-white rounded-full font-bold flex-shrink-0 text-sm">
                  {step.num}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{step.title}</p>
                  <p className="text-white/70 text-xs mt-1">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
