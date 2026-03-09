'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useRef } from 'react';

export default function FrozenTaxBands() {
  const [selectedSalary, setSelectedSalary] = useState(60000);
  const [projectionYears, setProjectionYears] = useState<0 | 5 | 10>(0);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [hoveredPointIdx, setHoveredPointIdx] = useState<number | null>(null);
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

  const calculateTaxData = (salary: number) => {
    const impacts: { [key: number]: { [key: number]: number } } = {
      30000: { 2015: 0, 2018: 50, 2021: 100, 2024: 800, 2026: 1507 },
      45000: { 2015: 0, 2018: 100, 2021: 200, 2024: 1000, 2026: 1507 },
      60000: { 2015: 0, 2018: 200, 2021: 400, 2024: 3000, 2026: 5903 },
      80000: { 2015: 0, 2018: 300, 2021: 600, 2024: 5000, 2026: 8565 },
      100000: { 2015: 0, 2018: 350, 2021: 700, 2024: 5200, 2026: 8565 },
      150000: { 2015: 0, 2018: 400, 2021: 800, 2024: 2500, 2026: 4522 },
    };
    return impacts[salary] || impacts[60000];
  };

  const getGraphDataPoints = (salary: number, projectionYears: 0 | 5 | 10) => {
    const taxData = calculateTaxData(salary);
    const historicalYears = [2015, 2018, 2021, 2024, 2026];
    const historicalValues = historicalYears.map(year => taxData[year as keyof typeof taxData] || 0);

    if (projectionYears === 0) {
      return { years: historicalYears, values: historicalValues };
    }

    // Project forward assuming annual tax burden increases at current rate
    const annualIncrease = (taxData[2026] - taxData[2024]) / 2; // Average annual increase
    const futureYears = [2026, 2031, 2036].slice(0, projectionYears === 5 ? 2 : 3);
    const futureValues = futureYears.map((year, idx) =>
      taxData[2026] + (annualIncrease * (year - 2026))
    );

    return { years: historicalYears.concat(futureYears.slice(1)), values: historicalValues.concat(futureValues.slice(1)) };
  };

  const taxData = calculateTaxData(selectedSalary);
  const graphData = getGraphDataPoints(selectedSalary, projectionYears);

  // Get the current or projected cumulative value
  const currentValue = graphData.values[graphData.values.length - 1];
  const currentYear = graphData.years[graphData.years.length - 1];
  const stats = { cumulative: Math.round(currentValue), annual: Math.round(currentValue / Math.max(currentYear - 2015, 1)), year: currentYear };

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 w-full z-[9999] backdrop-blur-sm bg-white/95 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex gap-3 items-center hover:opacity-90 transition">
            <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full" style={{transform: 'skew(-20deg) rotate(-15deg)'}}>
                <text x="50" y="70" fontSize="80" fontWeight="900" fill="#2563c6" textAnchor="middle" fontFamily="Inter, sans-serif">F</text>
              </svg>
            </div>
            <span className="text-3xl font-bold text-gray-900">FutureMe</span>
          </Link>

          <nav className="hidden md:flex gap-8 text-gray-700">
            {navItems.map((item) => (
              <div key={item.label} className="relative group" onMouseEnter={() => handleDropdownOpen(item.label)} onMouseLeave={() => handleDropdownClose()}>
                <button className={`px-4 py-2 rounded-full transition ${openDropdown === item.label ? 'bg-gray-100 text-gray-900' : 'hover:text-gray-900'}`}>
                  {item.label}
                </button>
              </div>
            ))}
          </nav>

          <Link href="/" className="text-gray-700 hover:text-gray-900 transition font-medium">
            ← Back Home
          </Link>
        </div>

        {/* Mega Menu */}
        {openDropdown && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onMouseEnter={() => handleDropdownOpen(openDropdown)}
            onMouseLeave={() => handleDropdownClose()}
            className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 z-[9998]"
          >
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex flex-wrap gap-x-12 gap-y-0">
                {navItems.find((nav) => nav.label === openDropdown)?.items.map((subItem) => (
                  <Link key={subItem.title} href={subItem.href} className="group flex flex-col items-center justify-center py-2">
                    <div className="text-gray-900 group-hover:text-gray-600 transition font-medium text-sm text-center">{subItem.title}</div>
                    <div className="h-0.5 w-0 group-hover:w-full bg-gray-900 transition-all duration-300 mt-1"></div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </header>

      {/* Main Content */}
      <div className="pt-28 px-4 pb-20 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-4 leading-tight">
              Frozen Tax Bands
            </h1>
            <p className="text-lg text-gray-600">
              Interactive visualization of the 60% tax trap and frozen threshold impact on your taxes.
            </p>
          </div>

          {/* What Are Frozen Tax Bands */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What Are Frozen Tax Bands?</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Tax thresholds should increase with inflation to keep pace with wage growth. However, since April 2021, the UK government has frozen these thresholds. This means more of your income falls into higher tax brackets purely due to inflation, not real growth. This is called "fiscal drag."
            </p>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <p className="text-gray-600 text-sm mb-2">Personal Allowance</p>
                <p className="text-2xl font-bold text-gray-900">£12,570</p>
                <p className="text-xs text-gray-500 mt-1">Frozen since 2021</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <p className="text-gray-600 text-sm mb-2">Basic Rate Threshold</p>
                <p className="text-2xl font-bold text-gray-900">£50,270</p>
                <p className="text-xs text-gray-500 mt-1">Frozen since 2021</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <p className="text-gray-600 text-sm mb-2">Additional Rate</p>
                <p className="text-2xl font-bold text-gray-900">£125,140</p>
                <p className="text-xs text-gray-500 mt-1">Reduced from £150k</p>
              </div>
            </div>
          </div>

          {/* Impact Calculator */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Extra Tax You're Paying</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-gray-900 font-semibold mb-3">Your Salary</label>
                <div className="flex gap-2 flex-wrap">
                  {[30000, 45000, 60000, 80000, 100000, 150000].map((salary) => (
                    <button
                      key={salary}
                      onClick={() => setSelectedSalary(salary)}
                      className={`px-4 py-2 rounded-lg transition font-medium ${
                        selectedSalary === salary
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      £{(salary / 1000).toFixed(0)}k
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-900 font-semibold mb-3">Time Horizon</label>
                <div className="flex gap-2">
                  {[
                    { label: 'Current (2026)', value: 0 },
                    { label: '+5 Years', value: 5 },
                    { label: '+10 Years', value: 10 },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setProjectionYears(option.value as 0 | 5 | 10)}
                      className={`px-4 py-2 rounded-lg transition font-medium ${
                        projectionYears === option.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <p className="text-gray-600 text-sm mb-2">Total Extra Tax {projectionYears > 0 ? 'Projected' : 'Paid'}</p>
                  <p className="text-4xl font-bold text-red-600">£{stats.cumulative.toLocaleString()}</p>
                  <p className="text-gray-600 text-xs mt-2">{projectionYears > 0 ? `Projected for ${stats.year}` : 'Since frozen thresholds began (2021)'}</p>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                  <p className="text-gray-600 text-sm mb-2">Annual Impact</p>
                  <p className="text-4xl font-bold text-orange-600">£{stats.annual.toLocaleString()}</p>
                  <p className="text-gray-600 text-xs mt-2">{projectionYears > 0 ? `Average from 2015 to ${stats.year}` : 'Average per year (2015-2026)'}</p>
                </div>
              </div>
            </div>

            {/* Cumulative Tax Impact Graph */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Cumulative Tax Impact Since 2015</h3>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 relative">
                <svg viewBox="0 0 700 400" className="w-full h-auto" style={{ minHeight: '300px' }}>
                  {/* Grid lines */}
                  {[0, 1, 2, 3, 4].map((i) => (
                    <line key={`h-${i}`} x1="70" y1={350 - i * 70} x2="650" y2={350 - i * 70} stroke="#e5e7eb" strokeWidth="1" />
                  ))}
                  {graphData.years.map((_, i) => (
                    <line key={`v-${i}`} x1={70 + i * (580 / (graphData.years.length - 1))} y1="350" x2={70 + i * (580 / (graphData.years.length - 1))} y2="30" stroke="#e5e7eb" strokeWidth="1" />
                  ))}

                  {/* Axes */}
                  <line x1="70" y1="350" x2="650" y2="350" stroke="#374151" strokeWidth="2" />
                  <line x1="70" y1="350" x2="70" y2="30" stroke="#374151" strokeWidth="2" />

                  {/* Y-axis labels */}
                  {[0, 1, 2, 3, 4].map((i) => (
                    <text key={`y-${i}`} x="60" y={358 - i * 70} textAnchor="end" fill="#4b5563" fontSize="12">
                      £{i * 5000}
                    </text>
                  ))}

                  {/* X-axis labels - years */}
                  {graphData.years.map((year, idx) => (
                    <text
                      key={`year-${idx}`}
                      x={70 + idx * (580 / (graphData.years.length - 1))}
                      y="375"
                      textAnchor="middle"
                      fill="#4b5563"
                      fontSize="12"
                    >
                      {year}
                    </text>
                  ))}

                  {/* Data line and points */}
                  {graphData.values.length > 0 && (
                    <>
                      <polyline
                        points={graphData.years
                          .map((_, idx) => {
                            const x = 70 + idx * (580 / (graphData.years.length - 1));
                            const y = 350 - Math.min((graphData.values[idx] / 5000) * 70, 320);
                            return `${x},${y}`;
                          })
                          .join(' ')}
                        fill="none"
                        stroke="#2563eb"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {graphData.years.map((_, idx) => {
                        const x = 70 + idx * (580 / (graphData.years.length - 1));
                        const y = 350 - Math.min((graphData.values[idx] / 5000) * 70, 320);
                        const isHovered = hoveredPointIdx === idx;
                        return (
                          <g key={`point-group-${idx}`}>
                            {/* Large invisible hover target */}
                            <circle
                              cx={x}
                              cy={y}
                              r="25"
                              fill="transparent"
                              cursor="pointer"
                              onMouseEnter={() => setHoveredPointIdx(idx)}
                              onMouseLeave={() => setHoveredPointIdx(null)}
                            />
                            {/* Vertical guide line on hover */}
                            {isHovered && (
                              <line x1={x} y1="350" x2={x} y2={y} stroke="#2563eb" strokeWidth="2" strokeDasharray="3,3" opacity="0.4" />
                            )}
                            {/* Highlighted point circle on hover */}
                            <circle
                              cx={x}
                              cy={y}
                              r={isHovered ? 8 : 5}
                              fill={isHovered ? '#1d4ed8' : '#2563eb'}
                              transition="all 0.2s ease"
                            />
                          </g>
                        );
                      })}
                    </>
                  )}

                  {/* Freeze marker line - 2021 */}
                  {projectionYears === 0 && (
                    <>
                      <line x1={70 + 2 * (580 / (graphData.years.length - 1))} y1="350" x2={70 + 2 * (580 / (graphData.years.length - 1))} y2="20" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,4" opacity="0.5" />
                      <text x={70 + 2 * (580 / (graphData.years.length - 1)) + 5} y="25" fill="#ef4444" fontSize="11" fontWeight="bold">Freeze began</text>
                    </>
                  )}
                </svg>

                {/* Tooltip */}
                {hoveredPointIdx !== null && (
                  <div className="absolute bg-gray-900 text-white px-3 py-2 rounded-lg text-sm shadow-lg pointer-events-none" style={{
                    left: `${70 + hoveredPointIdx * (580 / (graphData.years.length - 1)) * (700 / 700)}px`,
                    top: `${350 - Math.min((graphData.values[hoveredPointIdx] / 5000) * 70, 320) * (400 / 400) - 40}px`,
                    transform: 'translateX(-50%)',
                  }}>
                    <div className="font-semibold">{graphData.years[hoveredPointIdx]}</div>
                    <div>£{graphData.values[hoveredPointIdx].toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                    {hoveredPointIdx > 0 && (
                      <div className="text-xs text-gray-300">
                        £{Math.round((graphData.values[hoveredPointIdx] - graphData.values[hoveredPointIdx - 1]) / (graphData.years[hoveredPointIdx] - graphData.years[hoveredPointIdx - 1])).toLocaleString()}/year
                      </div>
                    )}
                  </div>
                )}
              </div>
              <p className="text-gray-600 text-sm mt-4">Historical data shows cumulative extra tax paid since 2015 for a £{(selectedSalary / 1000).toFixed(0)}k salary. The red line marks April 2021 when thresholds were frozen. {projectionYears > 0 && `With current trajectory, this could reach £${(stats.cumulative + (projectionYears / 5) * stats.cumulative).toLocaleString()} in ${projectionYears} years.`}</p>
            </div>
          </div>

          {/* Why It Matters */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Fiscal Drag</h3>
              <p className="text-gray-700">You move into higher tax brackets purely due to inflation, not real income growth. This silently increases your tax burden year after year.</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Lost Purchasing Power</h3>
              <p className="text-gray-700">You're paying more tax on the same real income. Your take-home pay doesn't keep up with inflation, so you can afford less over time.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
