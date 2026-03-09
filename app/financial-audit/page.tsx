'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function FinancialAudit() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
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
    <main className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="fixed top-0 w-full z-[9999] backdrop-blur-sm bg-black/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between overflow-visible">
          <Link href="/" className="flex gap-3 items-center hover:opacity-90 transition">
            <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full" style={{transform: 'skew(-20deg) rotate(-15deg)'}}>
                <text
                  x="50"
                  y="70"
                  fontSize="80"
                  fontWeight="900"
                  fill="#2563c6"
                  textAnchor="middle"
                  fontFamily="Inter, sans-serif"
                >
                  F
                </text>
              </svg>
            </div>
            <span className="text-3xl font-bold text-[#f5f1ed]">FutureMe</span>
          </Link>

          <nav className="hidden md:flex gap-8 text-[#f5f1ed] overflow-visible">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative group overflow-visible"
                onMouseEnter={() => handleDropdownOpen(item.label)}
                onMouseLeave={() => handleDropdownClose()}
              >
                <button className={`px-4 py-2 rounded-full transition ${
                  openDropdown === item.label
                    ? 'bg-black/30 text-[#f5f1ed]'
                    : 'hover:text-[#f5f1ed]/70'
                }`}>
                  {item.label}
                </button>
              </div>
            ))}
          </nav>

          <Link href="/" className="text-[#f5f1ed] hover:text-[#f5f1ed]/70 transition font-medium">
            ← Back Home
          </Link>
        </div>

        {/* Mega Menu Dropdown */}
        {openDropdown && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onMouseEnter={() => handleDropdownOpen(openDropdown)}
            onMouseLeave={() => handleDropdownClose()}
            className="absolute top-full left-0 right-0 bg-black/80 backdrop-blur-md border-b border-white/10 overflow-visible z-[9998]"
          >
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex flex-wrap gap-x-12 gap-y-0">
                {navItems
                  .find((nav) => nav.label === openDropdown)
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

      {/* Main Content */}
      <div className="pt-28 px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-black text-[#f5f1ed] mb-4 leading-tight">
              Complete Financial Audit
            </h1>
            <p className="text-lg text-gray-300">
              A comprehensive step-by-step guide to assess and organise your complete financial situation.
            </p>
          </div>

          {/* Section 1: Assets & Income */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-6">
            <h2 className="text-3xl font-bold text-white mb-4">1. Assets & Income Inventory</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-200 mb-3">Cash & Savings Accounts</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>☐ List all current/savings accounts with balances</li>
                  <li>☐ Record account types (current, ISA, fixed-rate, etc.)</li>
                  <li>☐ Note interest rates and annual interest earned</li>
                  <li>☐ Identify which institutions hold each account</li>
                  <li>☐ Check if any accounts are old/forgotten (help reunite)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-200 mb-3">Investments & Pensions</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>☐ List all investment accounts (Stocks & Shares ISAs, GIAs)</li>
                  <li>☐ Record current values and holdings</li>
                  <li>☐ Gather pension statements (workplace & personal)</li>
                  <li>☐ Note pension provider names and contact info</li>
                  <li>☐ Record pension fund values and projected retirement income</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-200 mb-3">Income Sources</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>☐ Document gross annual salary/wages</li>
                  <li>☐ List bonus/commission amounts (past 3 years)</li>
                  <li>☐ Record self-employment/freelance income</li>
                  <li>☐ Note investment income (dividends, interest)</li>
                  <li>☐ Include rental income or other sources</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 2: Liabilities & Debts */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-6">
            <h2 className="text-3xl font-bold text-white mb-4">2. Debts & Liabilities</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-200 mb-3">Outstanding Debts</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>☐ List all credit cards with balances and interest rates</li>
                  <li>☐ Record personal loans (amount, lender, rate, term)</li>
                  <li>☐ Document overdrafts or other short-term borrowing</li>
                  <li>☐ Include student loan details and repayment plan</li>
                  <li>☐ Note mortgage details (lender, balance, rate, term left)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-200 mb-3">Debt Analysis</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>☐ Calculate total debt amount</li>
                  <li>☐ Identify highest interest rate debts</li>
                  <li>☐ Rank debts by interest cost (most expensive first)</li>
                  <li>☐ Calculate total interest paid if no extra payments made</li>
                  <li>☐ Determine priority repayment order (avalanche vs snowball)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 3: Monthly Cash Flow */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-6">
            <h2 className="text-3xl font-bold text-white mb-4">3. Monthly Cash Flow Analysis</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-200 mb-3">Monthly Income</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>☐ Calculate net monthly take-home pay (after tax)</li>
                  <li>☐ Include regular bonuses/commissions (divide annual by 12)</li>
                  <li>☐ Add investment income and other regular payments</li>
                  <li>☐ Total all monthly income sources</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-200 mb-3">Monthly Expenses</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>☐ Track housing costs (mortgage/rent, council tax, utilities)</li>
                  <li>☐ Record transport (car payment, insurance, fuel, public transport)</li>
                  <li>☐ Document food & groceries spending</li>
                  <li>☐ List subscriptions (gym, streaming, insurance, phone)</li>
                  <li>☐ Include debt repayments and minimum payments</li>
                  <li>☐ Add discretionary spending (entertainment, dining out)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-200 mb-3">Monthly Summary</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>☐ Total monthly income</li>
                  <li>☐ Total monthly expenses</li>
                  <li>☐ Calculate surplus/deficit (income - expenses)</li>
                  <li>☐ Identify areas where spending could be reduced</li>
                  <li>☐ Determine monthly savings capacity</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 4: Net Worth Calculation */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-6">
            <h2 className="text-3xl font-bold text-white mb-4">4. Calculate Your Net Worth</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-200 mb-3">Assets</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>☐ Cash & savings accounts total</li>
                  <li>☐ Investment account values</li>
                  <li>☐ Pension fund values</li>
                  <li>☐ Property value (if owned)</li>
                  <li>☐ Vehicle values (if significant)</li>
                  <li>☐ Total Assets = Sum of all above</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-200 mb-3">Liabilities</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>☐ Credit card balances</li>
                  <li>☐ Personal loans outstanding</li>
                  <li>☐ Mortgage balance remaining</li>
                  <li>☐ Student loans balance</li>
                  <li>☐ Total Liabilities = Sum of all debts</li>
                </ul>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4 mt-4">
                <p className="text-lg font-semibold text-white">
                  Net Worth = Total Assets - Total Liabilities
                </p>
                <p className="text-gray-300 mt-2">Track this annually to monitor wealth growth</p>
              </div>
            </div>
          </div>

          {/* Section 5: Tax & Compliance */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-6">
            <h2 className="text-3xl font-bold text-white mb-4">5. Tax & Compliance Check</h2>
            <div className="space-y-4">
              <ul className="space-y-2 text-gray-300">
                <li>☐ Confirm current tax code is correct</li>
                <li>☐ Check if Self Assessment registration is needed</li>
                <li>☐ Review tax returns from last 3 years</li>
                <li>☐ Verify all income sources are registered with HMRC</li>
                <li>☐ Confirm pension contributions are being claimed</li>
                <li>☐ Check if eligible for Marriage Allowance (save up to £252/year)</li>
                <li>☐ Review student loan repayment plan</li>
                <li>☐ Ensure National Insurance record is up to date</li>
              </ul>
            </div>
          </div>

          {/* Section 6: Insurance & Protection */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-6">
            <h2 className="text-3xl font-bold text-white mb-4">6. Insurance & Protection Review</h2>
            <div className="space-y-4">
              <ul className="space-y-2 text-gray-300">
                <li>☐ Review life insurance coverage (critical if dependents)</li>
                <li>☐ Check income protection insurance (replaces income if ill)</li>
                <li>☐ Verify home insurance is adequate (building + contents)</li>
                <li>☐ Review car insurance - get annual quotes for cheaper deals</li>
                <li>☐ Check travel insurance needs</li>
                <li>☐ Confirm pet insurance (if applicable)</li>
                <li>☐ Review emergency fund - should equal 3-6 months expenses</li>
              </ul>
            </div>
          </div>

          {/* Section 7: Action Plan */}
          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-xl border border-blue-500/30 rounded-3xl p-8">
            <h2 className="text-3xl font-bold text-white mb-4">7. Create Your Action Plan</h2>
            <div className="space-y-4">
              <ul className="space-y-2 text-gray-300">
                <li>☐ Set 3-month goals (highest priority items to tackle)</li>
                <li>☐ Set 6-month goals (medium-term improvements)</li>
                <li>☐ Set 12-month goals (longer-term strategic moves)</li>
                <li>☐ Schedule quarterly reviews to track progress</li>
                <li>☐ Identify which recommendations to implement first</li>
                <li>☐ Set up automatic savings/debt repayments</li>
                <li>☐ Consider booking consultation with financial adviser</li>
              </ul>
            </div>
          </div>

          {/* Back to Questionnaire */}
          <div className="mt-12 text-center">
            <Link href="/guided" className="inline-block bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition">
              Back to Financial Guide
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
