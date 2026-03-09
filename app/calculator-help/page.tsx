'use client';

import Link from 'next/link';

export default function CalculatorHelp() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 backdrop-blur-sm bg-white/95 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex gap-3 items-center hover:opacity-90 transition">
            <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full" style={{transform: 'skew(-20deg) rotate(-15deg)'}}>
                <text x="50" y="70" fontSize="80" fontWeight="900" fill="#2563c6" textAnchor="middle" fontFamily="sans-serif">F</text>
              </svg>
            </div>
            <span className="text-3xl font-bold text-gray-900">FutureMe</span>
          </Link>
          <Link href="/" className="text-gray-700 hover:text-gray-900 transition font-medium">
            ← Back Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-28 px-4 pb-20 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-4 leading-tight">
              Calculator Help & Guides
            </h1>
            <p className="text-xl text-gray-600">
              Learn how our financial calculators work, what assumptions they use, and how to get the most accurate results.
            </p>
          </div>

          {/* Income Tax Calculator */}
          <section className="mb-12 pb-12 border-b border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">💰 Income Tax Calculator</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What It Calculates</h3>
                <p className="text-gray-700 mb-4">
                  This calculator estimates your UK income tax liability, National Insurance contributions, and take-home pay based on your income and personal circumstances. It uses 2026-27 tax rules for England, Wales, and Northern Ireland (Scotland has different rates).
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">📊 Assumptions & Limitations</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex gap-3">
                    <span className="text-blue-600 font-semibold">•</span>
                    <span><strong>Tax Year:</strong> Uses 2026-27 rules. Personal allowance £12,570, basic rate threshold £50,270</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-600 font-semibold">•</span>
                    <span><strong>Dividend Income:</strong> Shows separate allowance (£500) and tax rates (10.75%-39.35%) but doesn't fully separate dividend tax calculation from earned income</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-600 font-semibold">•</span>
                    <span><strong>Personal Savings Allowance:</strong> Not included - if you earn savings interest, tax liability may be understated</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-600 font-semibold">•</span>
                    <span><strong>Pension Relief:</strong> Uses marginal rate relief (standard and salary sacrifice methods included)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-600 font-semibold">•</span>
                    <span><strong>National Insurance:</strong> 8% on £12,584-£50,284; 2% above £50,284. Employee rates only (not self-employed)</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">✅ How to Use It Accurately</h3>
                <ol className="space-y-2 text-gray-700 list-decimal list-inside">
                  <li>Enter your gross annual salary (before tax)</li>
                  <li>Add bonuses/one-time payments if applicable</li>
                  <li>Include dividend income if you receive any</li>
                  <li>Use your actual tax code from your payslip (usually 1257L)</li>
                  <li>Select your country (affects tax rates - Scotland differs)</li>
                  <li>The calculator shows estimated tax. Compare against your payslip to verify accuracy</li>
                </ol>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-900">
                  <strong>⚠️ Not Tax Advice:</strong> This is an estimate only. For accurate tax planning, consult HMRC or a qualified tax advisor. Your actual tax may differ due to relief applications, trading allowances, or personal circumstances.
                </p>
              </div>
            </div>
          </section>

          {/* Frozen Tax Bands */}
          <section className="mb-12 pb-12 border-b border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">❄️ Frozen Tax Bands</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What It Shows</h3>
                <p className="text-gray-700 mb-4">
                  This visualization shows how much extra tax you're paying because UK tax thresholds have been frozen since April 2021. It compares your actual tax to what you'd pay if thresholds had risen with inflation (historical CPI).
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">📈 How The Calculation Works</h3>
                <ol className="space-y-2 text-gray-700 list-decimal list-inside">
                  <li><strong>Baseline (2015):</strong> Establishes a reference point when thresholds were higher</li>
                  <li><strong>Inflation Adjustment (20.6%):</strong> If thresholds had risen with ONS CPI (April 2021 - March 2026), personal allowance would be ~£15,157 instead of £12,570</li>
                  <li><strong>Tax Difference:</strong> Calculates extra tax paid at your salary level due to frozen thresholds</li>
                  <li><strong>Projections:</strong> Assumes inflation continues at current rate (2% annually going forward)</li>
                </ol>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">📊 Data Sources</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>
                    <strong>Inflation Rate (20.6%):</strong> <a href="https://www.ons.gov.uk/economy/inflationandpriceindices" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">ONS Consumer Price Index (CPI)</a>
                  </li>
                  <li>
                    <strong>Tax Rates:</strong> <a href="https://www.gov.uk/guidance/rates-and-thresholds-for-employers" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">HMRC Official Tax Rates & Thresholds</a>
                  </li>
                  <li>
                    <strong>Policy Context:</strong> <a href="https://commonslibrary.parliament.uk/research-briefings/cbp-8901/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">House of Commons Library - Tax Thresholds</a>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>📌 Key Fact:</strong> Frozen thresholds will stay until April 2031 (announced policy). This accumulates more fiscal drag over time, particularly affecting those earning £45k-£150k+.
                </p>
              </div>
            </div>
          </section>

          {/* General FAQ */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">❓ Frequently Asked Questions</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Why does the calculator differ from my payslip?</h3>
                <p className="text-gray-700">
                  Possible reasons: (1) Your tax code is different than standard, (2) You have reliefs/allowances not entered, (3) You earn savings interest or dividends (separate tax rules), (4) You have a student loan (reduces take-home), (5) Your employer pays pension contributions directly (not via salary sacrifice).
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What's fiscal drag?</h3>
                <p className="text-gray-700">
                  When tax thresholds don't rise with inflation, you pay higher tax on the same real income. For example, if you got a 3% raise but inflation was 3%, your real income didn't change—but more falls into higher tax brackets, so you pay more tax. This "silent tax rise" is fiscal drag.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How accurate are these calculators?</h3>
                <p className="text-gray-700">
                  Our calculators use official HMRC rates and ONS inflation data. They're accurate for straightforward income situations. However, they're estimates and don't account for every relief or special circumstance. For important decisions, verify against your payslip or consult a tax professional.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Are calculations updated for changes?</h3>
                <p className="text-gray-700">
                  Calculators use 2026-27 tax rules (updated March 2026). Tax rules change annually on 6 April. We update when new rates are announced, but always verify against GOV.UK for the most current information before making financial decisions.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I use this for tax planning?</h3>
                <p className="text-gray-700">
                  This is educational and estimating only. For tax planning (pensions, ISAs, reliefs), always consult a qualified tax advisor or accountant. They can advise on your specific circumstances and find strategies tailored to your situation.
                </p>
              </div>
            </div>
          </section>

          {/* Data Sources Footer */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">📋 Calculator Data Sources</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>✓ <a href="https://www.gov.uk/guidance/rates-and-thresholds-for-employers" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">HMRC Rates and Thresholds 2026-27</a></li>
              <li>✓ <a href="https://www.ons.gov.uk/economy/inflationandpriceindices" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Office for National Statistics (ONS) CPI Data</a></li>
              <li>✓ <a href="https://commonslibrary.parliament.uk/research-briefings/cbp-8901/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">House of Commons Library - Tax Thresholds</a></li>
              <li>✓ <a href="https://www.gov.uk/student-finance" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">UK Student Loan Repayment Rules</a></li>
            </ul>
            <p className="text-xs text-gray-500 mt-4">
              Last Updated: March 2026 | For current information, always check GOV.UK
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
