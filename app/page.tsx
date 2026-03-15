'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import NewsTicker from '@/components/NewsTicker';
import FinanceNews from '@/components/FinanceNews';

export default function Home() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [dropdownPos, setDropdownPos] = useState({ x: 0, y: 0 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chartProgress, setChartProgress] = useState(1);
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);
  const chartRef = React.useRef<SVGPolylineElement>(null);
  const chartSectionRef = React.useRef<HTMLDivElement>(null);
  const closeTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

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

  // Tax Calculator State
  const [salary, setSalary] = useState(60000);
  const [bonus, setBonus] = useState(0);
  const [dividends, setDividends] = useState(0);
  const [pension, setPension] = useState(0);
  const [pensionType, setPensionType] = useState<'amount' | 'percentage'>('amount');
  const [pensionPercentage, setPensionPercentage] = useState(0);
  const [reliefMethod, setReliefMethod] = useState<'salary-sacrifice' | 'net-relief'>('salary-sacrifice');
  const [employerContribution, setEmployerContribution] = useState(0);
  const [employerContributionType, setEmployerContributionType] = useState<'amount' | 'percentage'>('percentage');
  const [employerContributionPercentage, setEmployerContributionPercentage] = useState(0);
  const [giftAid, setGiftAid] = useState(0);
  const [tradingAllowance, setTradingAllowance] = useState(0);
  const [taxCode, setTaxCode] = useState('1257L');
  const [taxYear] = useState('2026/27');
  const [country, setCountry] = useState('England');
  const [studentLoan, setStudentLoan] = useState('None');
  const [inflationFromYear, setInflationFromYear] = useState(2016);
  const [investmentAmount, setInvestmentAmount] = useState(20000);
  const [investmentYears, setInvestmentYears] = useState(20);
  const [monthlyContribution, setMonthlyContribution] = useState(0);
  const [reliefSectionExpanded, setReliefSectionExpanded] = useState(false);
  const [settingsSectionExpanded, setSettingsSectionExpanded] = useState(false);

  // Reset chart animation when investment inputs change
  useEffect(() => {
    setChartProgress(0);
    const timer = setTimeout(() => setChartProgress(1), 100);
    return () => clearTimeout(timer);
  }, [investmentAmount, investmentYears, monthlyContribution]);

  // Parse tax code to get personal allowance
  const getPersonalAllowanceFromTaxCode = (code: string): number => {
    if (!code || code === '0T' || code === '0T ') return 0;
    const match = code.match(/^(\d+)([LMN])$/i);
    if (match) {
      return parseInt(match[1]) * 10;
    }
    return 12570; // Default to standard allowance
  };

  // Calculate tax if thresholds had risen with inflation (20.6% since 2021)
  const calculateIndexedTax = (grossIncome: number): number => {
    const INFLATION_ADJUSTMENT = 1.206; // 20.6% inflation since April 2021
    const frozenPA = 12570;
    const frozenBRT = 50270;
    const frozenHRT = 125140;

    // Indexed thresholds
    const indexedPA = Math.round(frozenPA * INFLATION_ADJUSTMENT);
    const indexedBRT = Math.round(frozenBRT * INFLATION_ADJUSTMENT);
    const indexedHRT = Math.round(frozenHRT * INFLATION_ADJUSTMENT);

    let tax = 0;
    const taxableIncome = Math.max(0, grossIncome - indexedPA);

    if (taxableIncome > 0) {
      const basicRateAmount = Math.min(taxableIncome, Math.max(0, indexedBRT - indexedPA));
      tax += basicRateAmount * 0.20;

      if (taxableIncome > basicRateAmount) {
        const higherRateAmount = Math.min(taxableIncome - basicRateAmount, Math.max(0, indexedHRT - indexedBRT));
        tax += higherRateAmount * 0.40;

        if (taxableIncome - basicRateAmount > higherRateAmount) {
          const additionalRateAmount = taxableIncome - basicRateAmount - higherRateAmount;
          tax += additionalRateAmount * 0.45;
        }
      }
    }

    return Math.round(tax);
  };

  // Inflation data for calculator
  const inflationData: { [key: number]: { [key: string]: number } } = {
    2016: {
      bread: 0.85, milk: 0.38, eggs: 1.80, coffee: 3.50,
      petrol: 1.09, diesel: 1.12, flight: 120, train: 89,
      electricity: 85, smartphone: 650
    },
    2017: {
      bread: 0.95, milk: 0.42, eggs: 1.95, coffee: 3.75,
      petrol: 1.15, diesel: 1.22, flight: 128, train: 95,
      electricity: 95, smartphone: 720
    },
    2018: {
      bread: 1.05, milk: 0.48, eggs: 2.10, coffee: 3.95,
      petrol: 1.25, diesel: 1.35, flight: 135, train: 102,
      electricity: 105, smartphone: 780
    },
    2019: {
      bread: 1.10, milk: 0.52, eggs: 2.25, coffee: 4.15,
      petrol: 1.30, diesel: 1.42, flight: 142, train: 110,
      electricity: 112, smartphone: 810
    },
    2020: {
      bread: 1.20, milk: 0.58, eggs: 2.40, coffee: 4.40,
      petrol: 1.18, diesel: 1.28, flight: 128, train: 105,
      electricity: 125, smartphone: 850
    },
    2021: {
      bread: 1.26, milk: 0.60, eggs: 2.55, coffee: 4.60,
      petrol: 1.32, diesel: 1.38, flight: 138, train: 115,
      electricity: 135, smartphone: 860
    },
    2022: {
      bread: 1.32, milk: 0.62, eggs: 2.72, coffee: 4.85,
      petrol: 1.48, diesel: 1.55, flight: 155, train: 125,
      electricity: 150, smartphone: 870
    },
    2023: {
      bread: 1.35, milk: 0.63, eggs: 2.88, coffee: 5.20,
      petrol: 1.55, diesel: 1.62, flight: 165, train: 131,
      electricity: 160, smartphone: 875
    },
    2024: {
      bread: 1.41, milk: 0.66, eggs: 3.05, coffee: 5.45,
      petrol: 1.61, diesel: 1.68, flight: 172, train: 135,
      electricity: 168, smartphone: 882
    },
    2025: {
      bread: 1.38, milk: 0.65, eggs: 3.05, coffee: 5.65,
      petrol: 1.62, diesel: 1.68, flight: 178, train: 138,
      electricity: 172, smartphone: 880
    },
    2026: {
      bread: 1.45, milk: 0.68, eggs: 3.20, coffee: 5.80,
      petrol: 1.68, diesel: 1.72, flight: 185, train: 142,
      electricity: 180, smartphone: 899
    }
  };

  const calculateInflationPercent = (fromYear: number, item: string): string => {
    const fromPrice = inflationData[fromYear]?.[item] || inflationData[2016][item];
    const toPrice = inflationData[2026][item];
    if (fromPrice === 0) return '0%';
    const percent = Math.round(((toPrice - fromPrice) / fromPrice) * 100);
    return `${percent > 0 ? '+' : ''}${percent}%`;
  };

  const getInflationPrice = (fromYear: number, item: string): string => {
    const fromPrice = inflationData[fromYear]?.[item] || inflationData[2016][item];
    const toPrice = inflationData[2026][item];
    return `£${fromPrice.toFixed(2)} → £${toPrice.toFixed(2)}`;
  };

  // Investment calculation with monthly contributions
  const calculateInvestmentOutcome = (principal: number, annualRate: number, years: number, monthly: number = 0): number => {
    const monthlyRate = annualRate / 12;
    const months = years * 12;

    // Future value of principal
    const principalFV = principal * Math.pow(1 + monthlyRate, months);

    // Future value of monthly contributions (annuity)
    const monthlyFV = monthly > 0 ? monthly * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate : 0;

    return Math.round(principalFV + monthlyFV);
  };

  const cashIsaOutcome = calculateInvestmentOutcome(investmentAmount, 0.045, investmentYears, monthlyContribution); // 4.5% midpoint
  const ssIsaOutcome = calculateInvestmentOutcome(investmentAmount, 0.085, investmentYears, monthlyContribution); // 8.5% midpoint

  // Use the higher outcome as reference for scaling both lines
  const maxOutcome = Math.max(cashIsaOutcome, ssIsaOutcome);

  // Generate polyline points for chart
  const generatePolylinePoints = (principal: number, annualRate: number, years: number, refMaxValue: number, monthly: number = 0): string => {
    const xStart = 10, xEnd = 400;
    const yStart = 220, yRange = 210;
    const points = [];

    for (let year = 0; year <= years; year++) {
      const value = calculateInvestmentOutcome(principal, annualRate, year, monthly);
      const xPos = xStart + ((xEnd - xStart) * (year / years));
      const yPos = yStart - ((value - principal) / (refMaxValue - principal)) * yRange;
      points.push(`${xPos.toFixed(0)},${yPos.toFixed(0)}`);
    }
    return points.join(' ');
  };

  const cashIsaPoints = generatePolylinePoints(investmentAmount, 0.045, investmentYears, maxOutcome, monthlyContribution);
  const ssIsaPoints = generatePolylinePoints(investmentAmount, 0.085, investmentYears, maxOutcome, monthlyContribution);

  // Tax calculation function
  const calculateTaxes = () => {
    const totalIncome = salary + bonus + dividends;
    const personalAllowanceFromCode = getPersonalAllowanceFromTaxCode(taxCode);
    // Calculate effective pension contribution
    const effectivePension = pensionType === 'percentage'
      ? Math.round((salary + bonus) * (pensionPercentage / 100))
      : pension;

    // Calculate employer pension contribution
    const effectiveEmployerPension = employerContributionType === 'percentage'
      ? Math.round((salary + bonus) * (employerContributionPercentage / 100))
      : employerContribution;

    // For salary sacrifice, pension reduces NI calculation; for net relief, it doesn't
    const niBaseSalary = reliefMethod === 'salary-sacrifice'
      ? Math.max(0, salary + bonus - effectivePension)
      : salary + bonus;
    const taxableIncome = Math.max(0, totalIncome - effectivePension - tradingAllowance);

    // Calculate marginal tax rate based on income
    let marginalRate = 0;
    if (country === 'Scotland') {
      const remaining = Math.max(0, taxableIncome - personalAllowanceFromCode);
      if (remaining > 112570) marginalRate = 0.47;
      else if (remaining > 112570 - 25140 && taxableIncome > 100000) marginalRate = 0.60; // Tax trap
      else if (remaining > 112570) marginalRate = 0.42;
      else if (remaining > 60092) marginalRate = 0.21;
      else if (remaining > 2430) marginalRate = 0.20;
      else if (remaining > 0) marginalRate = 0.19;
      else marginalRate = 0;
    } else {
      const remaining = Math.max(0, taxableIncome - personalAllowanceFromCode);
      if (remaining > 125140) marginalRate = 0.45;
      else if (remaining > 100000 && remaining <= 125140) marginalRate = 0.60; // Tax trap (allowance taper)
      else if (remaining > 50270) marginalRate = 0.40;
      else if (remaining > 0) marginalRate = 0.20;
      else marginalRate = 0;
    }
    // Dividend allowance 2026/27: £500
    const dividendAllowance = 500;
    const dividendTaxable = Math.max(0, dividends - dividendAllowance);

    let incomeTax = 0;
    let basicTax = 0;
    let higherTax = 0;
    let additionalTax = 0;
    let niContribution = 0;
    let studentLoanRepayment = 0;
    let personalAllowanceUsed = 0;
    let taxTrapEffect = 0;

    // Calculate actual personal allowance (affected by 60% trap if over £100k)
    let effectivePersonalAllowance = personalAllowanceFromCode;
    if (taxableIncome > 100000) {
      const taperAmount = Math.floor((taxableIncome - 100000) / 2);
      effectivePersonalAllowance = Math.max(0, personalAllowanceFromCode - taperAmount);
      taxTrapEffect = taperAmount * 0.60; // 60% effective rate on taper
    }

    // Income Tax Calculation
    if (country === 'Scotland') {
      // Scotland 2026/27
      const remaining = Math.max(0, taxableIncome - effectivePersonalAllowance);
      personalAllowanceUsed = personalAllowanceFromCode - Math.max(0, personalAllowanceFromCode - effectivePersonalAllowance);

      if (remaining > 0) {
        const starterBand = Math.min(remaining, 15000 - effectivePersonalAllowance);
        incomeTax += starterBand * 0.19;

        if (remaining > starterBand) {
          const basicBand = Math.min(remaining - starterBand, 43662 - 15000);
          basicTax = basicBand * 0.20;
          incomeTax += basicTax;
        }

        if (remaining > (15000 - effectivePersonalAllowance + 43662 - 15000)) {
          const intermediateBand = Math.min(
            remaining - (15000 - effectivePersonalAllowance + 43662 - 15000),
            75000 - 43662
          );
          incomeTax += intermediateBand * 0.21;
        }

        if (remaining > (75000 - effectivePersonalAllowance)) {
          const higherBand = Math.min(remaining - (75000 - effectivePersonalAllowance), 50140);
          higherTax = higherBand * 0.42;
          incomeTax += higherTax;
        }

        if (remaining > (125140 - effectivePersonalAllowance)) {
          const topBand = remaining - (125140 - effectivePersonalAllowance);
          additionalTax = topBand * 0.47;
          incomeTax += additionalTax;
        }
      }
    } else {
      // England, Wales & NI 2026/27
      const remaining = Math.max(0, taxableIncome - effectivePersonalAllowance);
      personalAllowanceUsed = personalAllowanceFromCode - Math.max(0, personalAllowanceFromCode - effectivePersonalAllowance);

      if (remaining > 0) {
        const basicBand = Math.min(remaining, 50270 - effectivePersonalAllowance);
        basicTax = basicBand * 0.20;
        incomeTax += basicTax;

        if (remaining > basicBand) {
          const higherBand = Math.min(remaining - basicBand, 125140 - 50270);
          higherTax = higherBand * 0.40;
          incomeTax += higherTax;
        }

        if (remaining > (125140 - effectivePersonalAllowance)) {
          const additionalBand = remaining - (125140 - effectivePersonalAllowance);
          additionalTax = additionalBand * 0.45;
          incomeTax += additionalTax;
        }
      }
    }

    // National Insurance 2026/27
    // 8% on £12,584 to £50,284 (approx £242-£967/week)
    // 2% on earnings above £50,284
    const niThreshold = 12584;
    const niUpperBand = 50284;

    if (niBaseSalary > niThreshold) {
      const niBasic = Math.min(niBaseSalary - niThreshold, niUpperBand - niThreshold);
      niContribution += niBasic * 0.08;

      if (niBaseSalary > niUpperBand) {
        niContribution += (niBaseSalary - niUpperBand) * 0.02;
      }
    }

    // Student Loan Repayment
    if (studentLoan !== 'None') {
      let loanThreshold = 0;
      let loanRate = 0;

      switch (studentLoan) {
        case 'Plan 1':
          loanThreshold = 22015;
          loanRate = 0.09;
          break;
        case 'Plan 2':
          loanThreshold = 27285;
          loanRate = 0.09;
          break;
        case 'Plan 4':
          loanThreshold = 27285;
          loanRate = 0.09;
          break;
        case 'Plan 5':
          loanThreshold = 49130;
          loanRate = 0.06;
          break;
      }

      if (salary > loanThreshold) {
        studentLoanRepayment = (salary - loanThreshold) * loanRate;
      }
    }

    // Calculate tax relief based on method and marginal rate
    let taxRelief = 0;
    let niRelief = 0;
    if (reliefMethod === 'salary-sacrifice') {
      // Tax relief at marginal rate + NI saving
      taxRelief = effectivePension * marginalRate;
      niRelief = effectivePension * 0.08;
    } else {
      // Net relief: basic tax relief only (20% or user's marginal rate if higher)
      taxRelief = effectivePension * Math.max(0.20, marginalRate);
    }

    const totalDeductions = incomeTax + niContribution + studentLoanRepayment;
    const takeHomeBeforePension = totalIncome - totalDeductions;
    const takeHome = takeHomeBeforePension - (reliefMethod === 'net-relief' ? effectivePension : effectivePension);
    const effectiveTaxRate = totalIncome > 0 ? (totalDeductions / totalIncome) * 100 : 0;
    const totalPensionSavings = effectivePension + effectiveEmployerPension;

    return {
      grossIncome: totalIncome,
      incomeTax: Math.round(incomeTax),
      basicTax: Math.round(basicTax),
      higherTax: Math.round(higherTax),
      additionalTax: Math.round(additionalTax),
      niContribution: Math.round(niContribution),
      studentLoanRepayment: Math.round(studentLoanRepayment),
      takeHome: Math.round(takeHome),
      monthlyTakeHome: Math.round(takeHome / 12),
      effectiveTaxRate: effectiveTaxRate.toFixed(2),
      totalDeductions: Math.round(totalDeductions),
      taxTrapEffect: Math.round(taxTrapEffect),
      effectivePersonalAllowance: Math.round(effectivePersonalAllowance),
      personalAllowanceUsed: Math.round(personalAllowanceUsed),
      effectivePension: Math.round(effectivePension),
      effectiveEmployerPension: Math.round(effectiveEmployerPension),
      taxRelief: Math.round(taxRelief),
      niRelief: Math.round(niRelief),
      marginalRate: Math.round(marginalRate * 100),
      totalReliefPercent: reliefMethod === 'salary-sacrifice' ? Math.round((marginalRate + 0.08) * 100) : Math.round(Math.max(0.20, marginalRate) * 100),
      totalPensionSavings: Math.round(totalPensionSavings),
      takeHomeBeforePension: Math.round(takeHomeBeforePension),
    };
  };

  const taxes = calculateTaxes();

  React.useEffect(() => {
    const handleScroll = () => {
      if (!chartSectionRef.current) return;

      const rect = chartSectionRef.current.getBoundingClientRect();
      const elementTop = rect.top;
      const elementHeight = rect.height;
      const windowHeight = window.innerHeight;

      // Animation completes by midway through section
      const progress = Math.max(0, Math.min(1, (windowHeight - elementTop) / (windowHeight + elementHeight / 2)));
      setChartProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <main className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="fixed top-0 w-full z-[9999] backdrop-blur-sm bg-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between overflow-x-hidden">
          <div className="flex gap-2 sm:gap-3 items-center">
            {/* FutureMe Logo */}
            <div className="w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center flex-shrink-0">
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
            <div className="text-xl sm:text-3xl font-bold text-[#f5f1ed]">FutureMe</div>
          </div>
          <nav
            className="hidden md:flex gap-8 text-[#f5f1ed] overflow-x-hidden items-center"
          >
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative group overflow-visible"
                onMouseEnter={() => handleDropdownOpen(item.label)}
                onMouseLeave={() => handleDropdownClose()}
              >
                <button
                  className={`px-4 py-2 rounded-full transition ${
                    openDropdown === item.label
                      ? 'bg-black/30 text-[#f5f1ed]'
                      : 'hover:text-[#f5f1ed]/70'
                  }`}
                >
                  {item.label}
                </button>
              </div>
            ))}
            <div className="h-6 border-l border-white/20 mx-2"></div>
            <Link href="/calculator-help" className="text-[#f5f1ed] hover:text-white transition font-medium">
              FAQs
            </Link>
          </nav>
          <div className="flex gap-2 sm:gap-4 items-center">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-[#f5f1ed] hover:text-white transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button className="text-xs sm:text-base text-[#f5f1ed] hover:text-[#f5f1ed]/70 transition">Log in</button>
            <button className="bg-white text-primary-600 px-3 sm:px-6 py-1 sm:py-2 text-xs sm:text-base rounded-full font-semibold hover:bg-gray-100 transition">
              Sign up
            </button>
          </div>
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

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-black/90 backdrop-blur-md border-b border-white/10 overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-4">
              {navItems.map((item) => (
                <div key={item.label}>
                  <button onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)} className="text-[#f5f1ed] font-medium text-sm w-full text-left py-2 hover:text-white transition">
                    {item.label}
                  </button>
                  {openDropdown === item.label && (
                    <div className="pl-4 flex flex-col gap-2 mt-2">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.title}
                          href={subItem.href}
                          className="text-[#f5f1ed]/70 text-sm py-1 hover:text-white transition"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Link href="/calculator-help" className="text-[#f5f1ed] hover:text-white transition font-medium text-sm py-2">
                FAQs
              </Link>
            </div>
          </motion.div>
        )}
      </header>

      {/* Hero Section - Two Column Layout */}
      <div className="w-full overflow-hidden relative z-0">
        {/* Background Video */}
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/140828-776043783.mp4" type="video/mp4" />
          </video>
          {/* Heavy Dark Gradient Overlay - Dark on left, lighter on right */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/40"></div>
        </div>

        {/* Content Container */}
        <div className="relative min-h-[550px] flex items-center pt-16 sm:pt-0">
          <div className="max-w-7xl mx-auto w-full px-6 lg:px-12">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight text-[#f5f1ed] max-w-lg tracking-tight">
              Your modern<br />financial advisor<motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-5xl lg:text-6xl font-bold text-[#f5f1ed]"
              >
                .
              </motion.span>
            </h1>
            <p className="text-sm sm:text-lg text-[#f5f1ed] mb-8 leading-relaxed max-w-2xl">
              Figuring out taxes, investing, and saving shouldn't be a solo mission. FutureMe is the jargon-free hub designed to bridge the UK's advice gap. We're changing that.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Link href="/guided" className="group">
                <button className="min-w-[140px] bg-white text-primary-600 px-6 sm:px-8 py-2 sm:py-3 rounded-full font-extrabold hover:bg-gray-100 transition shadow-lg text-sm sm:text-base">
                  Guide Me
                </button>
              </Link>
              <Link href="/expert" className="group">
                <button className="min-w-[140px] bg-black/15 backdrop-blur-md text-[#f5f1ed] px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold border border-white/40 hover:bg-black/25 transition text-sm sm:text-base">
                  Expert Mode
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bifurcated Track Selection - Neomorphic Design */}
      <div className="py-6 px-4 bg-[#f5f1ed]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-3">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-2 leading-tight">
              Finances{' '}
              <span className="relative inline-block">
                shouldn't
                <span className="absolute bottom-0 left-0 h-1 bg-primary-600" style={{animation: 'underlineSlide 3.5s ease-in-out forwards'}}></span>
              </span>
              {' '}be<br className="md:hidden" /> this confusing
            </h2>
            <style>{`
              @keyframes underlineSlide {
                0% {
                  width: 0%;
                  left: 0;
                }
                100% {
                  width: 100%;
                  left: 0;
                }
              }
            `}</style>
          </div>

          {/* UK Financial Reality Stats */}
          <div className="mt-2 mb-0">
            <StatsAnimation />
          </div>

        </div>
      </div>

      {/* News Ticker */}
      <NewsTicker />
      <FinanceNews />

      {/* Feature Section - Why It Pays to Invest */}
      <div className="py-24 px-4 bg-gradient-to-b from-black to-slate-950 border-t border-white/10 chart-section" ref={chartSectionRef}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">Why it pays to invest</h2>
            <p className="text-base text-white/70 max-w-3xl mx-auto leading-relaxed">
              Stocks & Shares ISAs historically deliver 7-10% annual returns vs 4-5% from Cash ISAs. See the difference compound over time.
            </p>
          </div>

          {/* Chart with Content */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            {/* CTA Content */}
            <div className="flex flex-col flex-1">
              <div className="mb-4 space-y-4">
                <div>
                  <label className="text-white/70 text-xs font-medium mb-2 block uppercase tracking-wide">Initial Investment (£)</label>
                  <input type="text" inputMode="numeric" value={investmentAmount.toString()} onChange={(e) => {const num = parseInt(e.target.value.replace(/[^\d]/g, '')) || 0; setInvestmentAmount(Math.max(0, num));}} className="bg-white/8 rounded-lg px-4 py-3 text-white text-sm w-full focus:outline-none focus:ring-2 focus:ring-white/30 shadow-sm transition" placeholder="10000" />
                </div>
                <div>
                  <label className="text-white/70 text-xs font-medium mb-2 block uppercase tracking-wide">Investment Period (years)</label>
                  <input type="number" value={investmentYears} onChange={(e) => setInvestmentYears(e.target.value === '' ? 0 : Math.max(0, parseInt(e.target.value) || 0))} className="bg-white/8 rounded-lg px-4 py-3 text-white text-sm w-full focus:outline-none focus:ring-2 focus:ring-white/30 shadow-sm transition" placeholder="years" />
                </div>
                <div>
                  <label className="text-white/70 text-xs font-medium mb-2 block uppercase tracking-wide">Monthly Contribution (£)</label>
                  <input type="text" inputMode="numeric" value={monthlyContribution.toString()} onChange={(e) => {const num = parseInt(e.target.value.replace(/[^\d]/g, '')) || 0; setMonthlyContribution(Math.max(0, num));}} className="bg-white/8 rounded-lg px-4 py-3 text-white text-sm w-full focus:outline-none focus:ring-2 focus:ring-white/30 shadow-sm transition" placeholder="0" />
                </div>
              </div>

              {/* Comparison */}
              <div className="space-y-3">
                <div className="bg-white/5 rounded-xl p-4 shadow-sm">
                  <p className="text-white/60 text-xs font-medium uppercase tracking-wide mb-2">Cash ISA Annual Return</p>
                  <p className="text-xl font-semibold text-white">4-5%</p>
                  <p className="text-white/50 text-xs mt-2">{investmentYears}y outcome: £{cashIsaOutcome.toLocaleString()}</p>
                </div>
                <div className="bg-emerald-500/15 rounded-xl p-4 shadow-sm">
                  <p className="text-emerald-300/90 text-xs font-medium uppercase tracking-wide mb-2">S&S ISA Average Return</p>
                  <p className="text-xl font-semibold text-emerald-300">7-10%</p>
                  <p className="text-emerald-300/70 text-xs mt-2">{investmentYears}y outcome: £{ssIsaOutcome.toLocaleString()}</p>
                </div>
              </div>

              {/* Why Invest Explanation - Animated */}
              <div className="mt-8 pt-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2 }}
                  viewport={{ once: true }}
                  className="bg-white/5 rounded-xl p-5 shadow-sm"
                >
                  <h4 className="text-white font-semibold mb-4 text-sm">Why It Pays To Invest</h4>
                  <div className="space-y-4">
                    {[
                      { label: 'Compound Growth', value: 'Each year your investment grows, and the growth itself starts earning returns. Over 20 years, this exponential effect can turn modest investments into substantial wealth.' },
                      { label: 'Inflation Protection', value: 'Money in savings loses purchasing power over time due to inflation. Investing in stocks and bonds helps your wealth keep pace with or exceed inflation, protecting your future buying power.' },
                      { label: 'Long-term Wealth', value: 'Regular monthly contributions combined with compound growth create powerful wealth accumulation. Even small amounts invested consistently grow into life-changing sums over decades.' },
                    ].map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: idx * 0.2 }}
                        viewport={{ once: true, margin: '0px 0px -100px 0px' }}
                        className="flex gap-3"
                      >
                        <div className="text-emerald-400 text-xl flex-shrink-0">✓</div>
                        <div>
                          <p className="text-white/80 text-sm font-medium">{item.label}</p>
                          <p className="text-white/50 text-sm mt-1">{item.value}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Chart */}
            <div className="flex justify-center flex-1">
              <div className="w-full bg-white/5 rounded-xl p-6 flex flex-col relative shadow-sm">
                {/* Chart Header */}
                <div className="mb-6">
                  <div>
                    <p className="text-white/60 text-xs uppercase tracking-wide font-medium">Initial Investment</p>
                    <h3 className="text-2xl font-semibold text-white mt-1">£{investmentAmount.toLocaleString()}</h3>
                    <p className="text-white/50 text-xs mt-2">Compound growth over {investmentYears} years</p>
                  </div>
                </div>

                {/* Chart SVG */}
                <div className="h-64 flex items-center justify-center" onMouseMove={(e) => {
                  const svg = e.currentTarget.querySelector('svg');
                  if (!svg) return;
                  const rect = svg.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 400;
                  // Map x (10-395) to year (0-investmentYears)
                  const year = Math.round(((x - 10) / 385) * investmentYears);
                  if (year >= 0 && year <= investmentYears) {
                    setHoveredYear(year);
                  }
                }} onMouseLeave={() => setHoveredYear(null)}>
                  <svg key={`${investmentAmount}-${investmentYears}`} viewBox="-35 0 435 260" className="w-full h-full cursor-crosshair" style={{filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.1))'}}>
                    {/* Y-axis labels - £ amounts */}
                    {(() => {
                      const yPositions = [224, 192, 160, 128, 96, 64, 32];
                      const minValue = investmentAmount;
                      const maxValue = maxOutcome;
                      const increment = (maxValue - minValue) / 6;
                      return yPositions.map((yPos, idx) => {
                        const value = minValue + (idx * increment);
                        const label = value >= 1000 ? `£${(value / 1000).toFixed(0)}k` : `£${value}`;
                        return (
                          <text key={idx} x="-15" y={yPos + 3} fontSize="10" fill="rgba(255,255,255,0.6)" fontFamily="Arial, sans-serif" textAnchor="end">
                            {label}
                          </text>
                        );
                      });
                    })()}

                    {/* Grid lines */}
                    <line x1="5" y1="32" x2="400" y2="32" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                    <line x1="5" y1="64" x2="400" y2="64" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                    <line x1="5" y1="96" x2="400" y2="96" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                    <line x1="5" y1="128" x2="400" y2="128" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                    <line x1="5" y1="160" x2="400" y2="160" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                    <line x1="5" y1="192" x2="400" y2="192" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

                    {/* Axes */}
                    <line x1="5" y1="10" x2="5" y2="220" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
                    <line x1="5" y1="220" x2="400" y2="220" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />

                    {/* S&S ISA Line - Green */}
                    <polyline
                      points={ssIsaPoints}
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        strokeDasharray: 700,
                        strokeDashoffset: 700 - (chartProgress * 700),
                        transition: 'stroke-dashoffset 0.1s ease-out'
                      }}
                    />

                    {/* Cash ISA Line - White */}
                    <polyline
                      points={cashIsaPoints}
                      fill="none"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        strokeDasharray: 700,
                        strokeDashoffset: 700 - (chartProgress * 700),
                        transition: 'stroke-dashoffset 0.1s ease-out'
                      }}
                    />

                    {/* Hover line and values */}
                    {hoveredYear !== null && (() => {
                      const xPos = 10 + (hoveredYear / investmentYears) * 385;
                      const ssIsaValue = calculateInvestmentOutcome(investmentAmount, 0.085, hoveredYear, monthlyContribution);
                      const cashIsaValue = calculateInvestmentOutcome(investmentAmount, 0.045, hoveredYear, monthlyContribution);
                      const maxSsIsa = calculateInvestmentOutcome(investmentAmount, 0.085, investmentYears, monthlyContribution);
                      const maxCashIsa = calculateInvestmentOutcome(investmentAmount, 0.045, investmentYears, monthlyContribution);
                      const maxOutcome = Math.max(maxSsIsa, maxCashIsa);
                      const yStart = 220, yRange = 210;
                      const ssIsaYPos = yStart - ((ssIsaValue - investmentAmount) / (maxOutcome - investmentAmount)) * yRange;
                      const cashIsaYPos = yStart - ((cashIsaValue - investmentAmount) / (maxOutcome - investmentAmount)) * yRange;
                      return (
                        <>
                          {/* Vertical hover line */}
                          <line
                            x1={xPos}
                            y1="10"
                            x2={xPos}
                            y2="220"
                            stroke="rgba(255,255,255,0.3)"
                            strokeWidth="2"
                            strokeDasharray="5,5"
                          />

                          {/* Data point indicators */}
                          {/* S&S ISA point */}
                          <circle
                            cx={xPos}
                            cy={ssIsaYPos}
                            r="5"
                            fill="#22c55e"
                          />

                          {/* Cash ISA point */}
                          <circle
                            cx={xPos}
                            cy={cashIsaYPos}
                            r="5"
                            fill="white"
                          />

                          {/* Value boxes */}
                          <g>
                            {/* S&S ISA value */}
                            <rect x={xPos - 35} y="5" width="70" height="18" rx="3" fill="rgba(34,197,94,0.2)" stroke="#22c55e" strokeWidth="1" />
                            <text x={xPos} y="16" fontSize="11" fill="#22c55e" textAnchor="middle" fontWeight="bold">
                              £{ssIsaValue.toLocaleString()}
                            </text>

                            {/* Cash ISA value */}
                            <rect x={xPos - 35} y="235" width="70" height="18" rx="3" fill="rgba(255,255,255,0.1)" stroke="white" strokeWidth="1" />
                            <text x={xPos} y="246" fontSize="11" fill="white" textAnchor="middle" fontWeight="bold">
                              £{cashIsaValue.toLocaleString()}
                            </text>
                          </g>
                        </>
                      );
                    })()}

                    {/* Legend */}
                    <g>
                      <line x1="10" y1="240" x2="30" y2="240" stroke="#22c55e" strokeWidth="2" />
                      <text x="35" y="243" fontSize="10" fill="rgba(255,255,255,0.7)">S&S ISA</text>

                      <line x1="100" y1="240" x2="120" y2="240" stroke="white" strokeWidth="2" />
                      <text x="125" y="243" fontSize="10" fill="rgba(255,255,255,0.7)">Cash ISA</text>
                    </g>
                  </svg>
                </div>

                {/* Chart Footer */}
                <div className="mt-4 flex justify-between text-xs text-white/50 px-2">
                  <span>Year 0</span>
                  <span>Year {investmentYears}</span>
                </div>

                {/* Compounding Breakdown - Below Chart */}
                {investmentYears > 0 && (
                  <div className="mt-8 space-y-3">
                    <p className="text-white/60 text-xs uppercase tracking-widest">Power of Compounding</p>

                    {/* Cash ISA Breakdown */}
                    <div className="bg-white/5 rounded-lg p-4 shadow-sm">
                      <p className="text-white/80 text-sm font-semibold mb-3">Cash ISA</p>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-white/60">You invested:</span>
                          <span className="text-white/80 font-medium">£{(investmentAmount + monthlyContribution * 12 * investmentYears).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">Interest earned:</span>
                          <span className="text-emerald-400 font-medium">£{(cashIsaOutcome - investmentAmount - monthlyContribution * 12 * investmentYears).toLocaleString()}</span>
                        </div>
                        <div className="border-t border-white/10 pt-2 flex justify-between">
                          <span className="text-white font-semibold">Total return:</span>
                          <span className="text-emerald-400 font-bold">{((cashIsaOutcome / (investmentAmount + monthlyContribution * 12 * investmentYears) - 1) * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>

                    {/* S&S ISA Breakdown */}
                    <div className="bg-emerald-500/10 rounded-lg p-4 shadow-sm">
                      <p className="text-emerald-300 text-sm font-semibold mb-3">S&S ISA</p>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-white/60">You invested:</span>
                          <span className="text-white/80 font-medium">£{(investmentAmount + monthlyContribution * 12 * investmentYears).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">Interest earned:</span>
                          <span className="text-emerald-400 font-medium">£{(ssIsaOutcome - investmentAmount - monthlyContribution * 12 * investmentYears).toLocaleString()}</span>
                        </div>
                        <div className="border-t border-emerald-500/20 pt-2 flex justify-between">
                          <span className="text-white font-semibold">Total return:</span>
                          <span className="text-emerald-400 font-bold">{((ssIsaOutcome / (investmentAmount + monthlyContribution * 12 * investmentYears) - 1) * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Button & Description */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <button className="bg-emerald-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-emerald-600 transition w-full md:w-auto">
                    Open S&S ISA
                  </button>
                  <p className="text-white/60 text-xs mt-4 leading-relaxed">
                    Chart shows percentage growth to account for compounding effects. The left axis shows £ amounts for reference.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tax Calculator Section - Distinct Section */}
      <div className="py-24 px-4 bg-white border-t border-gray-200">
        <style>{`
          .calc-card {
            background: #f9fafb !important;
            border: 1px solid #e5e7eb !important;
            border-radius: 1rem !important;
            padding: 1rem !important;
          }
          .calc-card h3 {
            color: #111827 !important;
          }
          .calc-input {
            background: white !important;
            border: 1px solid #d1d5db !important;
            color: #000000 !important;
            border-radius: 0.5rem !important;
            padding: 0.5rem 0.75rem !important;
          }
          .calc-input::placeholder {
            color: #9ca3af !important;
          }
          .calc-input:focus {
            border-color: #3b82f6 !important;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
            outline: none !important;
          }
        `}</style>
        <div className="max-w-7xl mx-auto" id="how-im-taxed">
          {/* Intro Section - Revolut Inspired */}
          <div className="grid lg:grid-cols-2 gap-12 items-start mb-8">
            <div className="pt-0">
              <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 leading-tight mt-0">
                How I'm Taxed
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="ml-1 text-6xl md:text-7xl font-black text-slate-900"
                >
                  .
                </motion.span>
              </h2>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed max-w-lg">
                Understand your exact tax liability with our advanced calculator. Get instant insights into your income tax, National Insurance, and take-home pay.
              </p>
            </div>

            <div className="flex justify-center">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full rounded-2xl shadow-2xl"
              >
                <source src="/7821854-hd_1920_1080_30fps.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-slate-900 mb-8">Income Tax Calculator</h2>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Inputs */}
            <div className="lg:col-span-1 space-y-4">
              <div className="calc-card">
                <h3 className="font-bold mb-3 text-sm">Income Details</h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Annual Salary</label>
                    <input type="number" placeholder="Enter amount" value={salary || ''} onChange={(e) => setSalary(e.target.value === '' ? 0 : Number(e.target.value))} className="calc-input w-full text-sm" />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Bonus / Additional Income</label>
                    <input type="number" placeholder="Enter amount" value={bonus || ''} onChange={(e) => setBonus(e.target.value === '' ? 0 : Number(e.target.value))} className="calc-input w-full text-sm" />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Dividend Income</label>
                    <input type="number" placeholder="Enter amount" value={dividends || ''} onChange={(e) => setDividends(e.target.value === '' ? 0 : Number(e.target.value))} className="calc-input w-full text-sm" />
                    <p className="text-xs text-gray-600 mt-1">First £500 is tax-free (2026/27 allowance)</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
                <button
                  onClick={() => setReliefSectionExpanded(!reliefSectionExpanded)}
                  className="w-full flex items-center justify-between hover:opacity-80 transition"
                >
                  <h3 className="text-slate-900 font-bold text-sm">Reliefs & Allowances</h3>
                  <svg className={`w-5 h-5 text-slate-900 transition-transform ${reliefSectionExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>

                {reliefSectionExpanded && (
                <div className="space-y-3 mt-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Relief Method</label>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <button onClick={() => setReliefMethod('salary-sacrifice')} className={`p-2 rounded-lg border-2 text-xs font-medium transition text-left ${reliefMethod === 'salary-sacrifice' ? 'bg-blue-50 border-blue-600 text-blue-900' : 'bg-gray-50 border-gray-200 text-gray-700'}`}>
                        <div className="font-semibold">Salary Sacrifice</div>
                        <div className="text-xs opacity-70">Reduces tax & NI</div>
                      </button>
                      <button onClick={() => setReliefMethod('net-relief')} className={`p-2 rounded-lg border-2 text-xs font-medium transition text-left ${reliefMethod === 'net-relief' ? 'bg-blue-50 border-blue-600 text-blue-900' : 'bg-gray-50 border-gray-200 text-gray-700'}`}>
                        <div className="font-semibold">Net Relief</div>
                        <div className="text-xs opacity-70">Tax relief only</div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-gray-700 text-sm font-medium">Your Contributions</label>
                      <div className="flex gap-2">
                        <button onClick={() => { setPensionType('amount'); setPensionPercentage(0); }} className={`px-3 py-1 text-xs rounded font-medium transition ${pensionType === 'amount' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                          £
                        </button>
                        <button onClick={() => { setPensionType('percentage'); setPension(0); }} className={`px-3 py-1 text-xs rounded font-medium transition ${pensionType === 'percentage' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                          %
                        </button>
                      </div>
                    </div>
                    {pensionType === 'amount' ? (
                      <input type="number" placeholder="Enter amount (£)" value={pension || ''} onChange={(e) => setPension(e.target.value === '' ? 0 : Number(e.target.value))} className="calc-input w-full text-sm" />
                    ) : (
                      <input type="number" placeholder="Enter percentage (%)" min="0" max="100" value={pensionPercentage || ''} onChange={(e) => setPensionPercentage(e.target.value === '' ? 0 : Number(e.target.value))} className="calc-input w-full text-sm" />
                    )}
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-gray-700 text-sm font-medium">Employer Contribution</label>
                      <div className="flex gap-2">
                        <button onClick={() => { setEmployerContributionType('amount'); setEmployerContributionPercentage(0); }} className={`px-3 py-1 text-xs rounded font-medium transition ${employerContributionType === 'amount' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                          £
                        </button>
                        <button onClick={() => { setEmployerContributionType('percentage'); setEmployerContribution(0); }} className={`px-3 py-1 text-xs rounded font-medium transition ${employerContributionType === 'percentage' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                          %
                        </button>
                      </div>
                    </div>
                    {employerContributionType === 'percentage' ? (
                      <input type="number" placeholder="Enter percentage (%)" min="0" max="100" value={employerContributionPercentage || ''} onChange={(e) => setEmployerContributionPercentage(e.target.value === '' ? 0 : Number(e.target.value))} className="calc-input w-full text-sm" />
                    ) : (
                      <input type="number" placeholder="Enter amount (£)" value={employerContribution || ''} onChange={(e) => setEmployerContribution(e.target.value === '' ? 0 : Number(e.target.value))} className="calc-input w-full text-sm" />
                    )}
                  </div>

                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-900 text-xs font-semibold mb-3">💰 Impact on Take-Home:</p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-green-700 text-xs">Your contribution:</span>
                        <span className="text-green-900 font-bold text-sm">£{(pensionType === 'percentage' ? Math.round((salary + bonus) * (pensionPercentage / 100)) : pension).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-emerald-600">
                        <span className="text-emerald-700 text-xs font-semibold">✓ Tax relief ({taxes.marginalRate}%):</span>
                        <span className="text-emerald-700 font-bold text-sm">+£{Math.round((pensionType === 'percentage' ? Math.round((salary + bonus) * (pensionPercentage / 100)) : pension) * (taxes.marginalRate / 100)).toLocaleString()}</span>
                      </div>
                      {reliefMethod === 'salary-sacrifice' && (
                        <div className="flex justify-between items-center text-emerald-600">
                          <span className="text-emerald-700 text-xs font-semibold">✓ NI saving (8%):</span>
                          <span className="text-emerald-700 font-bold text-sm">+£{Math.round((pensionType === 'percentage' ? Math.round((salary + bonus) * (pensionPercentage / 100)) : pension) * 0.08).toLocaleString()}</span>
                        </div>
                      )}
                      <div className="border-t border-green-200 pt-2 flex justify-between items-center">
                        <span className="text-green-700 text-xs font-semibold">Net cost to you ({reliefMethod === 'salary-sacrifice' ? `${100 - (taxes.marginalRate + 8)}%` : `${100 - Math.max(20, taxes.marginalRate)}%`}):</span>
                        <span className="text-green-900 font-bold text-sm">£{Math.round((pensionType === 'percentage' ? Math.round((salary + bonus) * (pensionPercentage / 100)) : pension) * ((reliefMethod === 'salary-sacrifice' ? 1 - (taxes.marginalRate / 100) - 0.08 : 1 - Math.max(0.20, taxes.marginalRate / 100)))).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-blue-600 pt-2">
                        <span className="text-blue-700 text-xs font-semibold">+ Employer contribution:</span>
                        <span className="text-blue-900 font-bold text-sm">£{(employerContributionType === 'percentage' ? Math.round((salary + bonus) * (employerContributionPercentage / 100)) : employerContribution).toLocaleString()}</span>
                      </div>
                      <div className="border-t border-green-200 pt-2 flex justify-between items-center bg-green-100 p-2 rounded">
                        <span className="text-green-800 text-xs font-bold">Total pension: </span>
                        <span className="text-green-900 font-bold text-sm">£{((pensionType === 'percentage' ? Math.round((salary + bonus) * (pensionPercentage / 100)) : pension) + (employerContributionType === 'percentage' ? Math.round((salary + bonus) * (employerContributionPercentage / 100)) : employerContribution)).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Gift Aid Donations</label>
                    <input type="number" placeholder="Enter amount" value={giftAid || ''} onChange={(e) => setGiftAid(e.target.value === '' ? 0 : Number(e.target.value))} className="calc-input w-full text-sm" />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Trading Allowance</label>
                    <input type="number" placeholder="Enter amount" value={tradingAllowance || ''} onChange={(e) => setTradingAllowance(e.target.value === '' ? 0 : Number(e.target.value))} className="calc-input w-full text-sm" />
                  </div>
                </div>
                )}
              </div>

              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
                <button
                  onClick={() => setSettingsSectionExpanded(!settingsSectionExpanded)}
                  className="w-full flex items-center justify-between hover:opacity-80 transition"
                >
                  <h3 className="text-slate-900 font-bold text-sm">Settings</h3>
                  <svg className={`w-5 h-5 text-slate-900 transition-transform ${settingsSectionExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>

                {settingsSectionExpanded && (
                <div className="space-y-3 mt-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Tax Year</label>
                    <select className="calc-input w-full text-sm">
                      <option>2025/26</option>
                      <option>2024/25</option>
                      <option>2023/24</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Country</label>
                    <select value={country} onChange={(e) => setCountry(e.target.value)} className="calc-input w-full text-sm">
                      <option value="England">England, Wales & NI</option>
                      <option value="Scotland">Scotland</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Student Loan Plan</label>
                    <select value={studentLoan} onChange={(e) => setStudentLoan(e.target.value)} className="calc-input w-full text-sm">
                      <option>None</option>
                      <option>Plan 1</option>
                      <option>Plan 2</option>
                      <option>Plan 4</option>
                      <option>Plan 5</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Tax Code</label>
                    <input type="text" placeholder="e.g. 1257L" value={taxCode} onChange={(e) => setTaxCode(e.target.value.toUpperCase())} className="calc-input w-full text-sm uppercase" maxLength={5} />
                    <p className="text-gray-600 text-xs mt-1">Your HMRC tax code (e.g. 1257L, 0T). This determines your personal allowance.</p>
                  </div>
                </div>
                )}
              </div>
            </div>

            {/* Right Column - Results */}
            <div className="lg:col-span-2 space-y-4">
              {/* Main Results */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <p className="text-gray-600 text-sm mb-1">Gross Income</p>
                  <p className="text-3xl font-bold text-slate-900">£{taxes.grossIncome.toLocaleString()}</p>
                </div>

                <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200">
                  <p className="text-emerald-700 text-sm mb-1">Take Home Pay</p>
                  <p className="text-3xl font-bold text-emerald-600">£{taxes.takeHome.toLocaleString()}</p>
                  <p className="text-emerald-600/70 text-xs mt-1">Per month: £{taxes.monthlyTakeHome.toLocaleString()}</p>
                </div>
              </div>

              {/* Summary */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-red-50 rounded-2xl p-4 border border-red-200">
                  <p className="text-red-700 text-sm mb-1">Total Income Tax</p>
                  <p className="text-2xl font-bold text-red-600">£{taxes.incomeTax.toLocaleString()}</p>
                </div>

                <div className="bg-orange-50 rounded-2xl p-4 border border-orange-200">
                  <p className="text-orange-700 text-sm mb-1">National Insurance</p>
                  <p className="text-2xl font-bold text-orange-600">£{taxes.niContribution.toLocaleString()}</p>
                </div>

                <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
                  <p className="text-blue-700 text-sm mb-1">Effective Tax Rate</p>
                  <p className="text-2xl font-bold text-blue-600">{taxes.effectiveTaxRate}%</p>
                </div>
              </div>


              {/* Tax Breakdown */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <h3 className="text-slate-900 font-bold mb-4">Tax Breakdown</h3>

                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <div>
                      <p className="text-gray-900 text-sm">Personal Allowance</p>
                      <p className="text-gray-600 text-xs">£0 - £{taxes.effectivePersonalAllowance.toLocaleString()}</p>
                    </div>
                    <p className="text-green-600 font-semibold">-</p>
                  </div>

                  {taxes.basicTax > 0 && (
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                      <div>
                        <p className="text-gray-900 text-sm">Income Tax (Basic Rate)</p>
                        <p className="text-gray-600 text-xs">20% on £{taxes.effectivePersonalAllowance.toLocaleString()} - £50,270</p>
                      </div>
                      <p className="text-red-600 font-semibold">£{taxes.basicTax.toLocaleString()}</p>
                    </div>
                  )}

                  {taxes.higherTax > 0 && (
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                      <div>
                        <p className="text-gray-900 text-sm">Income Tax (Higher Rate)</p>
                        <p className="text-gray-600 text-xs">{country === 'Scotland' ? '42%' : '40%'} on £50,271+</p>
                      </div>
                      <p className="text-red-600 font-semibold">£{taxes.higherTax.toLocaleString()}</p>
                    </div>
                  )}

                  {taxes.taxTrapEffect > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="relative py-1 px-2 border-b border-red-200 bg-red-50 rounded group cursor-help overflow-hidden">
                      <div>
                        <p className="text-red-700 text-sm font-semibold">60% Tax Trap Effect</p>
                        <p className="text-red-600 text-xs">You lose £1 of personal allowance for every £2 earned between £100k-£125.14k, creating an effective 60% tax rate in this band. Hover for details.</p>
                      </div>

                      {/* Tooltip */}
                      <div className="absolute bottom-full left-0 mb-2 w-72 hidden group-hover:block bg-red-900 text-white text-xs p-3 rounded-lg shadow-lg z-50">
                        <p className="font-semibold mb-2">Why 60%?</p>
                        <p className="mb-2">Between £100,000-£125,140, you lose £1 of personal allowance for every £2 earned:</p>
                        <ul className="space-y-1 text-red-100">
                          <li>• Income tax: 20-40%</li>
                          <li>• National insurance loss: 2%</li>
                          <li>• Higher rate tax: additional rate</li>
                          <li className="font-semibold text-red-50 pt-1">= 60% effective rate</li>
                        </ul>
                        <p className="mt-2"><span className="font-semibold">Solution:</span> Increase pension by £{Math.round(taxes.taxTrapEffect / 0.60).toLocaleString()} to recover allowance</p>
                      </div>
                    </motion.div>
                  )}

                  {taxes.additionalTax > 0 && (
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                      <div>
                        <p className="text-gray-900 text-sm">Income Tax (Additional Rate)</p>
                        <p className="text-gray-600 text-xs">{country === 'Scotland' ? '47%' : '45%'} on £125,140+</p>
                      </div>
                      <p className="text-red-600 font-semibold">£{taxes.additionalTax.toLocaleString()}</p>
                    </div>
                  )}

                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <div>
                      <p className="text-gray-900 text-sm">National Insurance (Class 1 Employees)</p>
                      <p className="text-gray-600 text-xs">8-10% on earnings above £12,570</p>
                    </div>
                    <p className="text-orange-600 font-semibold">£{taxes.niContribution.toLocaleString()}</p>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-900 text-sm">Student Loan Repayment</p>
                      <p className="text-gray-600 text-xs">{studentLoan}: {studentLoan !== 'None' ? '6-9%' : 'N/A'}</p>
                    </div>
                    <p className="text-blue-600 font-semibold">£{taxes.studentLoanRepayment.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Pension Optimization */}
              {pension > 0 && (
                <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200">
                  <h3 className="text-emerald-900 font-bold mb-4 flex items-center gap-2">
                    <span className="text-lg">💰</span> Pension Opportunity
                  </h3>
                  <p className="text-emerald-700 text-sm mb-4">
                    Every £1 you contribute to your pension reduces your tax bill:
                  </p>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-3 border-b border-emerald-200">
                      <span className="text-emerald-700 text-sm">Your marginal tax rate:</span>
                      <span className="text-emerald-900 font-bold text-lg">{taxes.marginalRate}%</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-emerald-200">
                      <span className="text-emerald-700 text-sm">If you contribute £5,000:</span>
                      <span className="text-emerald-900 font-bold text-lg">Save ~£{Math.round(5000 * (taxes.marginalRate / 100)).toLocaleString()}</span>
                    </div>
                    <div className="bg-emerald-100 p-3 rounded-lg flex justify-between items-center">
                      <span className="text-emerald-800 text-sm font-semibold">Net cost to you:</span>
                      <span className="text-emerald-900 font-bold text-lg">£{Math.round(5000 * (1 - taxes.marginalRate / 100)).toLocaleString()}</span>
                    </div>
                    <p className="text-emerald-600 text-xs italic pt-2">You invest £5k but only £{Math.round(5000 * (1 - taxes.marginalRate / 100)).toLocaleString()} comes from your take-home. The rest is a tax saving!</p>
                  </div>
                </div>
              )}

              {/* Frozen Tax Bands Impact */}
              {salary > 0 && (
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <h3 className="text-slate-900 font-bold mb-4 flex items-center gap-2">
                  <span className="text-lg">❄️</span> Impact of Frozen Tax Bands
                </h3>
                <p className="text-gray-700 text-sm mb-4">
                  Since 2021, personal allowance and tax bands have been frozen. Here's how this affects your tax bill:
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 text-xs mb-2">Current System (Frozen)</p>
                    <p className="text-2xl font-bold text-red-600">£{taxes.incomeTax.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs mb-2">If Indexed to Inflation (2021-2026)</p>
                    <p className="text-2xl font-bold text-green-600">£{calculateIndexedTax(taxes.grossIncome).toLocaleString()}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-slate-900 font-semibold">
                    Extra tax due to frozen bands: <span className="text-lg text-orange-600">£{(taxes.incomeTax - calculateIndexedTax(taxes.grossIncome)).toLocaleString()}</span>
                  </p>
                  <p className="text-gray-600 text-xs mt-2">
                    Extra tax you pay this year due to frozen thresholds since April 2021.
                  </p>
                  <Link href="/frozen-tax-bands" className="text-blue-600 hover:text-blue-700 text-xs mt-3 inline-block">
                    Click here for more detail →
                  </Link>
                </div>
              </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Inflation Calculator Section */}
      <InflationCalculator />

      {/* Carousel Section - Bottom of Page */}
      <div className="bg-white py-16 px-4 border-t border-gray-200">
        <div className="max-w-7xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 text-center mb-2">
            Explore More
          </h2>
          <p className="text-slate-600 text-center">
            Dive deeper into financial planning
          </p>
        </div>
        <div className="max-w-7xl mx-auto">
          <CarouselSection />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            {/* Logo */}
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full" style={{transform: 'skew(-20deg) rotate(-15deg)'}}>
                  <text
                    x="50"
                    y="70"
                    fontSize="80"
                    fontWeight="900"
                    fill="#f5f1ed"
                    textAnchor="middle"
                    fontFamily="Inter, sans-serif"
                  >
                    F
                  </text>
                </svg>
              </div>
              <div className="text-xl font-bold text-[#f5f1ed]">FutureMe</div>
            </div>

            {/* Social Links */}
            <div className="flex gap-6 items-center">
              <a href="#" className="text-white/60 hover:text-white transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.6l-5.165-6.75-5.868 6.75h-3.308l7.732-8.835L.424 2.25h6.7l4.676 6.482 5.341-6.482zM17.534 20.766h1.885L6.455 3.75H4.431l13.103 17.016z" />
                </svg>
              </a>
              <a href="#" className="text-white/60 hover:text-white transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.722-2.004 1.418-.103.249-.129.597-.129.946v5.441h-3.554s.05-8.824 0-9.739h3.554v1.379c.43-.664 1.199-1.608 2.920-1.608 2.134 0 3.734 1.398 3.734 4.402v5.566zM5.337 9.432c-1.144 0-1.915-.758-1.915-1.707 0-.951.768-1.708 1.959-1.708 1.188 0 1.913.757 1.939 1.708 0 .949-.751 1.707-1.983 1.707zm1.946 11.02H3.393V9.956h3.89v10.496zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                </svg>
              </a>
              <a href="#" className="text-white/60 hover:text-white transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a href="#" className="text-white/60 hover:text-white transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.385 4.859-7.181 4.859-3.796 0-7.182-2.165-7.182-4.859a3.5 3.5 0 0 1 1.55-2.851c-.505-.368-1.291-.571-2.157-.571a1.754 1.754 0 1 1 0-3.508c.681 0 1.302.28 1.749.521 2.773-1.626 6.335-1.513 8.877.21l-.567-2.66c-.463.1-1.023.157-1.607.157-.868 0-1.696-.183-2.404-.537l-.412-1.937c1.153-.645 2.911-.745 3.852-.745zm2.468 9.75a1.754 1.754 0 1 0 0 3.508 1.754 1.754 0 0 0 0-3.508zm-9.753 0a1.754 1.754 0 1 0 0 3.508 1.754 1.754 0 0 0 0-3.508z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center text-white/60 text-sm">
            <p>© 2025 FutureMe.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

function InflationCalculator() {
  const [selectedYear, setSelectedYear] = React.useState(2016);
  const [activeCategory, setActiveCategory] = React.useState('all');
  const [thenAmount, setThenAmount] = React.useState(1000);
  const [itemDetailName, setItemDetailName] = React.useState<string | null>(null);
  const [hoveredYear, setHoveredYear] = React.useState<number | null>(null);

  const items = [
    { name: 'Pint of milk', cat: 'food', 2010: 0.45, 2015: 0.44, 2016: 0.43, 2018: 0.44, 2020: 0.42, 2022: 0.58, 2026: 0.82 },
    { name: 'Dozen eggs', cat: 'food', 2010: 2.15, 2015: 2.20, 2016: 2.10, 2018: 2.05, 2020: 2.15, 2022: 2.30, 2026: 3.10 },
    { name: 'Coffee (250g)', cat: 'food', 2010: 2.60, 2015: 3.10, 2016: 3.25, 2018: 3.50, 2020: 3.80, 2022: 4.20, 2026: 5.40 },
    { name: 'Loaf of bread', cat: 'food', 2010: 1.15, 2015: 1.05, 2016: 1.00, 2018: 1.05, 2020: 1.07, 2022: 1.25, 2026: 1.85 },
    { name: 'Petrol (Litre)', cat: 'transport', 2010: 1.18, 2015: 1.12, 2016: 1.08, 2018: 1.25, 2020: 1.15, 2022: 1.65, 2026: 1.37 },
    { name: 'Diesel (Litre)', cat: 'transport', 2010: 1.20, 2015: 1.15, 2016: 1.09, 2018: 1.30, 2020: 1.20, 2022: 1.75, 2026: 1.65 },
    { name: 'London-Manc train', cat: 'transport', 2010: 72.00, 2015: 79.00, 2016: 82.00, 2018: 88.00, 2020: 94.00, 2022: 105.00, 2026: 135.00 },
    { name: 'Europe flight', cat: 'transport', 2010: 105.00, 2015: 115.00, 2016: 110.00, 2018: 125.00, 2020: 130.00, 2022: 145.00, 2026: 175.00 },
    { name: 'Electricity/month', cat: 'utilities', 2010: 42.00, 2015: 48.00, 2016: 50.00, 2018: 55.00, 2020: 62.00, 2022: 110.00, 2026: 165.00 },
    { name: 'Gas/month', cat: 'utilities', 2010: 55.00, 2015: 58.00, 2016: 55.00, 2018: 52.00, 2020: 48.00, 2022: 95.00, 2026: 115.00 },
    { name: 'Broadband/month', cat: 'utilities', 2010: 18.00, 2015: 22.00, 2016: 25.00, 2018: 28.00, 2020: 30.00, 2022: 32.00, 2026: 38.00 },
    { name: 'Gym membership', cat: 'utilities', 2010: 32.00, 2015: 35.00, 2016: 38.00, 2018: 40.00, 2020: 42.00, 2022: 45.00, 2026: 55.00 },
    { name: 'Cinema ticket', cat: 'leisure', 2010: 5.95, 2015: 7.21, 2016: 7.41, 2018: 7.22, 2020: 8.50, 2022: 9.80, 2026: 13.50 },
    { name: 'Streaming/month', cat: 'leisure', 2010: 5.99, 2015: 6.99, 2016: 7.49, 2018: 7.99, 2020: 8.99, 2022: 9.99, 2026: 9.99 },
    { name: 'Restaurant meal', cat: 'leisure', 2010: 18.50, 2015: 21.00, 2016: 22.50, 2018: 24.00, 2020: 26.00, 2022: 29.50, 2026: 34.00 },
    { name: 'Pint of beer', cat: 'leisure', 2010: 2.95, 2015: 3.35, 2016: 3.45, 2018: 3.70, 2020: 3.95, 2022: 4.20, 2026: 5.80 },
  ];

  // Bank of England CPI index values (ONS data)
  // Index: 2010=89.42, 2015=100, 2016=100.66, 2018=105.92, 2020=108.74, 2022=121.70, Jan 2026=139.420
  const inflationByYear: { [key: number]: { cpi: number; purchasing: number; avg: number } } = {
    2010: { cpi: 0.559, purchasing: -0.358, avg: 56 },
    2015: { cpi: 0.3942, purchasing: -0.283, avg: 39 },
    2016: { cpi: 0.3847, purchasing: -0.278, avg: 38 },
    2018: { cpi: 0.3161, purchasing: -0.240, avg: 32 },
    2020: { cpi: 0.2814, purchasing: -0.220, avg: 28 },
    2022: { cpi: 0.1451, purchasing: -0.127, avg: 14 },
  };

  const itemDetails: { [key: string]: { reason: string; tips: (string | { text: string; link: string })[]; retailers?: { [key: string]: number } } } = {
    'Pint of milk': {
      reason: 'Milk prices have been relatively stable but impacted by feed costs, energy prices for production, and supply chain inflation. Recent increases driven by global commodity prices.',
      tips: ['Buy larger containers (2-3 litre) instead of pints', 'Check supermarket own-brands for significant savings', 'Plant-based alternatives sometimes offer better value'],
      retailers: { 'Lidl': 0.65, 'Aldi': 0.68, 'Tesco Superstore': 0.82, 'Tesco Local': 0.89, 'Sainsbury\'s': 0.85, 'Waitrose': 1.10 },
    },
    'Dozen eggs': {
      reason: 'Egg prices spiked due to avian flu reducing supply, higher feed and energy costs, and increased transportation expenses. Bird flu outbreaks in 2022-2023 caused major price jumps.',
      tips: ['Buy eggs when there are promotions', 'Check smaller local shops which may undercut supermarkets', 'Budget eggs are usually just as good quality'],
      retailers: { 'Lidl': 2.29, 'Aldi': 2.49, 'Tesco Superstore': 3.10, 'Tesco Local': 3.40, 'Sainsbury\'s': 3.20, 'Waitrose': 3.80 },
    },
    'Coffee (250g)': {
      reason: 'Global coffee commodity prices have risen significantly due to crop diseases, extreme weather in Brazil (top producer), and increased shipping costs since 2021.',
      tips: ['Buy bulk coffee beans when on sale and freeze', 'Switch to instant coffee or cheaper blends', 'Coffee shop prices have risen more than retail - home brewing saves 80%'],
      retailers: { 'Lidl': 2.49, 'Aldi': 2.79, 'Tesco Superstore': 4.20, 'Tesco Local': 4.85, 'Sainsbury\'s': 4.50, 'Waitrose': 5.99 },
    },
    'Loaf of bread': {
      reason: 'Bread prices jumped due to wheat price volatility, energy costs in bakeries, and the Ukraine conflict disrupting global grain supplies. 2022 saw the biggest spike.',
      tips: ['Bakery bread is often cheaper than branded loaves', 'Buy own-brand products which are 30-50% cheaper', 'Freezing bread extends shelf life significantly'],
      retailers: { 'Lidl': 0.95, 'Aldi': 1.05, 'Tesco Superstore': 1.85, 'Tesco Local': 2.15, 'Sainsbury\'s': 1.90, 'Waitrose': 2.50 },
    },
    'Petrol (Litre)': {
      reason: 'Petrol has remained volatile but relatively stable long-term due to stable crude oil prices. Recent increases from 2021-2022 were global energy crisis-driven.',
      tips: ['Use Petrol Prices app (petrolprices.com) to find cheapest stations', 'Improve fuel efficiency with regular servicing', 'Consider electric vehicles - compare at dft.gov.uk'],
    },
    'Diesel (Litre)': {
      reason: 'Diesel prices have increased more than petrol due to refinery constraints and higher global demand. Energy crisis impact was more severe for diesel.',
      tips: ['Same strategies as petrol - use price comparison apps', 'Maintain your vehicle regularly for fuel efficiency', 'Walking or cycling for short journeys saves significantly'],
    },
    'London-Manc train': {
      reason: 'Train fares have risen due to increased operating costs, energy inflation, staff wages, and rail investment. Lack of competition allows prices to rise faster than general inflation.',
      tips: [
        { text: 'Book advance tickets on Trainline (70% cheaper)', link: 'https://www.thetrainline.com/' },
        { text: 'Check railcard discounts for 1/3 off', link: 'https://www.railcard.co.uk/' },
        { text: 'Compare coach prices on FlixBus (50% cheaper)', link: 'https://www.flixbus.co.uk/' },
      ],
    },
    'Europe flight': {
      reason: 'Flight prices increased due to fuel surcharges, labour costs, airport fees inflation, and recovering demand post-2020. Budget airlines now charge for essentials.',
      tips: [
        { text: 'Set up price alerts on Google Flights', link: 'https://www.google.com/travel/flights' },
        'Fly mid-week (Tuesday-Thursday) for 20-30% savings',
        { text: 'Compare budget airlines (Ryanair, EasyJet)', link: 'https://www.ryanair.com/' },
        { text: 'Use Skyscanner to compare prices', link: 'https://www.skyscanner.co.uk/' }
      ],
    },
    'Electricity/month': {
      reason: 'Massive spike from energy crisis (2021-2023). Causes: Russian gas crisis, renewable investment lag, aging infrastructure, carbon tax increases, and supplier collapse costs.',
      tips: [
        { text: 'Switch suppliers - can save £200-400/year', link: 'https://www.moneysupermarket.com/gas-and-electricity/' },
        { text: 'Compare suppliers on Ofgem-backed price cap', link: 'https://www.ofgem.gov.uk/' },
        'Use Economy 7 if suitable for your usage pattern',
        'Install solar panels - grants available at energysavingtrust.org.uk'
      ],
    },
    'Gas/month': {
      reason: 'Similar to electricity - surged 2021-2023 due to Russian gas shortage, LNG costs, winter demand spikes, and infrastructure investment. Now stabilizing.',
      tips: [
        { text: 'Compare gas suppliers and switch', link: 'https://www.moneysupermarket.com/gas-and-electricity/' },
        'Regular boiler servicing improves efficiency by 5-10%',
        'Reduce thermostat by 1°C to save ~10% on bills',
        { text: 'Get home insulation grants', link: 'https://www.energysavingtrust.org.uk/' }
      ],
    },
    'Broadband/month': {
      reason: 'Broadband has stayed relatively stable as competition increased. Price inflation driven by faster speeds, better infrastructure investment, and bundling.',
      tips: [
        { text: 'Compare broadband deals on MoneySuperMarket', link: 'https://www.moneysupermarket.com/broadband/' },
        { text: 'Check Community Fibre availability', link: 'https://www.communityfibre.com/' },
        'Negotiate loyalty discount after introductory period ends',
      ],
    },
    'Gym membership': {
      reason: 'Gym prices increased as venues upgraded equipment and facilities, increased energy costs, and higher staff wages. Premium health trends increased willingness to pay more.',
      tips: ['Negotiate annual membership for 2-3 months free', 'Look for council leisure centres (50% cheaper)', 'Home workouts with YouTube are completely free'],
    },
    'Cinema ticket': {
      reason: 'Cinema prices rose to offset declining visitor numbers and higher operating costs (energy, staff, maintenance). Premium experiences (IMAX, Dolby) command higher prices.',
      tips: ['Visit off-peak screenings (weekday matinees)', 'Membership cards often offer significant discounts', 'Streaming services offer films at home for less'],
    },
    'Streaming/month': {
      reason: 'Streaming prices have stabilized/plateaued despite initial growth concerns. Services now focus on profitability over subscriber growth.',
      tips: [
        'Share family plans with friends (check T&Cs)',
        { text: 'Rotate subscriptions to save - Netflix, Disney+, Now TV', link: 'https://www.moneysupermarket.com/broadband/streaming-services/' },
        { text: 'Check free trials at JustWatch', link: 'https://www.justwatch.com/' }
      ],
    },
    'Restaurant meal': {
      reason: 'Restaurant prices increased rapidly (42% since 2010) due to staff wage pressure, food cost inflation, rising rent, and consumer willingness to pay more.',
      tips: [
        { text: 'Find discounts on Too Good To Go app', link: 'https://www.toogoodtogo.com/en-gb' },
        { text: 'Check set menus on TheFork for deals', link: 'https://www.thefork.com/' },
        'Eat lunch instead of dinner - often 40% cheaper',
        'Cook at home for family occasions and save 70%'
      ],
    },
    'Pint of beer': {
      reason: 'Pub prices increased due to energy costs, staff wages (up significantly), supplier inflation, and increased business rates post-2020.',
      tips: ['Buy from supermarkets instead of pubs (70% cheaper)', 'Visit pubs for happy hour specials', 'Host home gatherings instead of nights out'],
    },
  };

  const data = inflationByYear[selectedYear];
  const nowAmount = thenAmount * (1 + data.cpi);
  const lostPct = Math.round(Math.abs(data.purchasing) * 100);

  // Color interpolation from green to red based on percentage (0-60%)
  const getInflationColor = (avg: number) => {
    const maxPercent = 60;
    const ratio = Math.min(avg / maxPercent, 1);

    if (ratio < 0.33) {
      // Green to Yellow (0-33%)
      const scale = ratio / 0.33;
      const r = Math.round(34 + (255 - 34) * scale);
      const g = Math.round(197 + (193 - 197) * scale);
      const b = Math.round(94 + (60 - 94) * scale);
      return `rgb(${r}, ${g}, ${b})`;
    } else if (ratio < 0.67) {
      // Yellow to Orange (33-67%)
      const scale = (ratio - 0.33) / 0.34;
      const r = Math.round(255 + (217 - 255) * scale);
      const g = Math.round(193 + (119 - 193) * scale);
      const b = Math.round(60 + (40 - 60) * scale);
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      // Orange to Red (67-100%)
      const scale = (ratio - 0.67) / 0.33;
      const r = Math.round(217 + (220 - 217) * scale);
      const g = Math.round(119 + (38 - 119) * scale);
      const b = Math.round(40 + (38 - 40) * scale);
      return `rgb(${r}, ${g}, ${b})`;
    }
  };

  const pct = (then: number, now: number) => Math.round(((now - then) / then) * 100);
  const fmt = (n: number) => (n >= 100 ? '£' + Math.round(n).toLocaleString() : '£' + n.toFixed(2));
  const badgeClass = (p: number) => (p >= 60 ? 'high' : p >= 30 ? 'mid' : 'low');
  const barWidth = (p: number) => Math.min(p / 1.5, 100);

  const filteredItems = activeCategory === 'all' ? items : items.filter((i) => i.cat === activeCategory);

  return (
    <section className="py-20 px-4 bg-white border-t border-gray-200">
      <div className="max-w-6xl mx-auto">
        {/* Video Section - Flipped Layout */}
        <div className="grid lg:grid-cols-2 gap-12 items-start mb-6">
          <div className="flex justify-center order-2 lg:order-1">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full rounded-2xl shadow-2xl"
            >
              <source src="/inflation-calculator-video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <div className="order-1 lg:order-2">
            <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">
              What does your<br />
              money actually<br />
              buy today<motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-5xl md:text-6xl font-black text-slate-900"
              >
                .
              </motion.span>
            </h2>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed max-w-lg">
              See how UK inflation has eroded the real value of your money — and what everyday items now cost compared to when you started saving.
            </p>
          </div>
        </div>

        {/* Year Pills */}
        <div className="mb-12">
          <div className="text-sm font-semibold text-gray-700 mb-3">Compare from</div>
          <div className="flex flex-wrap gap-2">
            {[2010, 2015, 2016, 2018, 2020, 2022].map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                  selectedYear === year
                    ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                    : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-600 hover:text-blue-600'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        {/* Hero Card */}
        <div className="bg-white border border-gray-200 rounded-3xl p-4 sm:p-8 mb-12 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 items-center">
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase mb-2">You had then</div>
              <div className="inline-block">
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900">£</span>
                  <input
                    type="number"
                    value={thenAmount}
                    onChange={(e) => setThenAmount(Number(e.target.value))}
                    className="text-3xl sm:text-4xl md:text-5xl font-black bg-transparent outline-none text-gray-900"
                    style={{ width: 'auto', maxWidth: '120px' }}
                  />
                </div>
                <div className="h-0.5 bg-gray-300 mb-3" />
                <div>
                  <span className="inline-block bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
                    {selectedYear}
                  </span>
                  <div className="text-xs text-gray-500 mt-3">
                    Data: <a href="https://www.bankofengland.co.uk/monetary-policy/inflation/inflation-calculator" target="_blank" rel="noopener noreferrer" className="text-gray-500 underline hover:text-gray-700">Bank of England</a> / <a href="https://www.ons.gov.uk/economy/inflationandpriceindices" target="_blank" rel="noopener noreferrer" className="text-gray-500 underline hover:text-gray-700">ONS</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden md:flex flex-col items-center justify-center gap-2 -ml-16">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-red-500 flex items-center justify-center text-white text-xl">
                📉
              </div>
              <span className="text-xs font-bold text-red-600 uppercase">+{data.avg}% CPI</span>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-xs font-semibold text-blue-600 uppercase mb-2">Equivalent today</div>
              <div className="inline-block">
                <div className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-3">
                  {nowAmount >= 1000 ? '£' + Math.round(nowAmount).toLocaleString() : fmt(nowAmount)}
                </div>
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="h-1 bg-blue-600 mb-3"
                />
                <div>
                  <span className="inline-block bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
                    2026
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Insight Cards */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Metrics <span className="text-sm font-normal">(Since {selectedYear})</span></h2>
        <div className="grid md:grid-cols-2 gap-4 mb-12">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Avg price increase</div>
            <div className="text-4xl font-black mb-1" style={{ color: getInflationColor(data.avg) }}>
              +{data.avg}%
            </div>
            <div className="text-sm text-gray-600">Across basket of common items</div>
            <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min((data.avg / 60) * 100, 100)}%`,
                  background: `linear-gradient(90deg, ${getInflationColor(data.avg)}, ${getInflationColor(data.avg)})`
                }}
              />
            </div>
          </div>
          <motion.div
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            whileHover={{ scale: 1.02 }}
            onClick={() => setItemDetailName('Real Wage Growth')}
          >
            <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Real wage growth</div>
            <div className="text-4xl font-black text-red-600 mb-1">−{Math.round(Math.abs(data.purchasing) * 100) / 10}%</div>
            <div className="text-sm text-gray-600">After accounting for inflation</div>
            <div className="mt-3 text-xs text-gray-500">
              <p>💡 Click to see detailed impact breakdown</p>
              <p className="mt-1 text-red-600 font-semibold">Your purchasing power lost: £{Math.round(1000 * Math.abs(data.purchasing)).toLocaleString()} per £1000</p>
            </div>
          </motion.div>
        </div>

        {/* Category Tabs */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Price changes by category</h3>
          <div className="flex overflow-x-auto gap-2 pb-2">
            {['all', 'food', 'transport', 'utilities', 'leisure'].map((cat) => {
              const labels: { [key: string]: string } = {
                all: '🧺 All',
                food: '🛒 Food',
                transport: '🚗 Transport',
                utilities: '💡 Utilities',
                leisure: '🎬 Leisure',
              };
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                    activeCategory === cat
                      ? 'bg-gray-900 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {labels[cat]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-12">
          {filteredItems.map((item) => {
            const selectedYearPrice = item[selectedYear as keyof typeof item] as number;
            const nowPrice = item[2026 as keyof typeof item] as number;
            const p = pct(selectedYearPrice, nowPrice);
            const bc = badgeClass(p);
            const bw = barWidth(p);
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setItemDetailName(item.name)}
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm cursor-pointer hover:shadow-md hover:border-blue-300 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="font-semibold text-gray-900 text-sm">{item.name}</span>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap ${
                      bc === 'high' ? 'bg-red-50 text-red-600' : bc === 'mid' ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'
                    }`}
                  >
                    {p > 0 ? '+' : ''}{p}%
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm mb-3">
                  <span className="text-gray-500">{fmt(selectedYearPrice)}</span>
                  <span className="text-gray-300">→</span>
                  <span className="font-bold text-gray-900">{fmt(nowPrice)}</span>
                </div>
                <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      bc === 'high' ? 'bg-gradient-to-r from-amber-400 to-red-500' : bc === 'mid' ? 'bg-gradient-to-r from-yellow-400 to-amber-500' : 'bg-gradient-to-r from-green-400 to-emerald-500'
                    }`}
                    style={{ width: `${bw}%` }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Bar */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-600 to-purple-600 rounded-3xl p-8 flex items-center justify-between gap-6 text-white">
          <div>
            <h3 className="text-2xl font-black mb-2">Beat inflation — start investing</h3>
            <p className="text-blue-100">A Cash ISA isn't keeping up. See how a Stocks & Shares ISA could protect your real wealth.</p>
          </div>
          <button className="flex-shrink-0 bg-white text-blue-600 px-6 py-3 rounded-full font-bold hover:shadow-lg transition-all">
            See ISA returns →
          </button>
        </div>
      </div>

      {/* Item Detail Modal */}
      {itemDetailName && (
        <>
          <style>{`
            .modal-scrollbar::-webkit-scrollbar {
              width: 8px;
            }
            .modal-scrollbar::-webkit-scrollbar-track {
              background: transparent;
            }
            .modal-scrollbar::-webkit-scrollbar-thumb {
              background: #d1d5db;
              border-radius: 4px;
            }
            .modal-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #9ca3af;
            }
          `}</style>
          <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 pt-20" onClick={() => setItemDetailName(null)}>
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl modal-scrollbar" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-center">
              <h2 className="text-3xl font-bold text-gray-900">{itemDetailName}</h2>
              <button onClick={() => setItemDetailName(null)} className="text-gray-500 hover:text-gray-900 text-2xl">×</button>
            </div>
            {/* Content */}
            <div className="px-8 py-6 space-y-6">
              {/* Price History Chart */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Price history (2010-2026)</h3>
                <div className="relative">
                  <svg viewBox="0 0 480 310" className="w-full border border-gray-200 rounded-lg bg-gray-50">
                    {(() => {
                      const item = items.find(i => i.name === itemDetailName);
                      if (!item) return null;

                      const years = [2010, 2015, 2016, 2018, 2020, 2022, 2026];
                      const prices = years.map(y => (item as any)[y] || 0);
                      const maxPrice = Math.max(...prices) * 1.15;

                      return (
                        <>
                          {/* Grid lines */}
                          <line x1="50" y1="250" x2="450" y2="250" stroke="#e5e7eb" strokeWidth="1" />
                          {[...Array(4)].map((_, i) => (
                            <line key={i} x1="50" y1={250 - (i + 1) * 50} x2="450" y2={250 - (i + 1) * 50} stroke="#f3f4f6" strokeWidth="1" />
                          ))}

                          {/* Axes */}
                          <line x1="50" y1="20" x2="50" y2="250" stroke="#d1d5db" strokeWidth="2" />
                          <line x1="50" y1="250" x2="450" y2="250" stroke="#d1d5db" strokeWidth="2" />

                          {/* Y-axis labels */}
                          {[0, 1, 2, 3, 4].map((i) => (
                            <text key={`y${i}`} x="45" y={255 - i * 50} fontSize="13" textAnchor="end" fill="#6b7280" fontWeight="500">
                              £{((maxPrice / 4) * i).toFixed(2)}
                            </text>
                          ))}

                          {/* Data line */}
                          <polyline
                            points={years.map((year, i) => {
                              const x = 50 + (i / (years.length - 1)) * 400;
                              const y = 250 - (prices[i] / maxPrice) * 200;
                              return `${x},${y}`;
                            }).join(' ')}
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />

                          {/* Highlight background for hovered year */}
                          {hoveredYear && (() => {
                            const idx = years.indexOf(hoveredYear);
                            const x = 50 + (idx / (years.length - 1)) * 400;
                            const colWidth = 400 / (years.length - 1);
                            return (
                              <rect x={x - colWidth / 2} y="15" width={colWidth} height="240" fill="#dbeafe" opacity="0.3" />
                            );
                          })()}

                          {/* Data points - larger and easier to see */}
                          {years.map((year, i) => {
                            const x = 50 + (i / (years.length - 1)) * 400;
                            const y = 250 - (prices[i] / maxPrice) * 200;
                            return (
                              <g key={year}>
                                <circle cx={x} cy={y} r={hoveredYear === year ? 6 : 4} fill={hoveredYear === year ? '#0ea5e9' : '#3b82f6'} style={{ transition: 'all 0.2s' }} />
                                <text x={x} y="268" fontSize="11" fontWeight={hoveredYear === year ? 'bold' : 'normal'} fill={hoveredYear === year ? '#0ea5e9' : '#6b7280'} textAnchor="middle">{year}</text>
                              </g>
                            );
                          })}

                          {/* Invisible wide areas for each year - easier to hover */}
                          {years.map((year, i) => {
                            const x = 50 + (i / (years.length - 1)) * 400;
                            const colWidth = 400 / (years.length - 1);
                            return (
                              <rect
                                key={`area-${year}`}
                                x={x - colWidth / 2}
                                y="10"
                                width={colWidth}
                                height="250"
                                fill="transparent"
                                style={{ cursor: 'pointer' }}
                                onMouseEnter={() => setHoveredYear(year)}
                                onMouseLeave={() => setHoveredYear(null)}
                              />
                            );
                          })}

                          {/* Hover line indicator */}
                          {hoveredYear && (() => {
                            const idx = years.indexOf(hoveredYear);
                            const x = 50 + (idx / (years.length - 1)) * 400;
                            const y = 250 - (prices[idx] / maxPrice) * 200;
                            return (
                              <line x1={x} y1={y} x2={x} y2="250" stroke="#0ea5e9" strokeWidth="3" opacity="0.8" />
                            );
                          })()}
                        </>
                      );
                    })()}
                  </svg>
                </div>

                {/* Year price cards below chart */}
                <div className="mt-4 grid grid-cols-7 gap-1">
                  {(() => {
                    const item = items.find(i => i.name === itemDetailName);
                    if (!item) return null;
                    const years = [2010, 2015, 2016, 2018, 2020, 2022, 2026];
                    return years.map((year) => (
                      <div
                        key={year}
                        onMouseEnter={() => setHoveredYear(year)}
                        onMouseLeave={() => setHoveredYear(null)}
                        className={`p-1.5 text-center cursor-pointer transition-all ${
                          hoveredYear === year
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 hover:text-blue-600'
                        }`}
                      >
                        <div className="text-xs font-normal text-gray-400">{year}</div>
                        <div className="text-sm font-medium">£{((item as any)[year] || 0).toFixed(2)}</div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Why prices increased</h3>
                <p className="text-gray-700">{itemDetails[itemDetailName]?.reason}</p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Money-saving strategies</h3>
                <ul className="space-y-2">
                  {itemDetails[itemDetailName]?.tips.map((tip, i) => {
                    const tipText = typeof tip === 'string' ? tip : tip.text;
                    const tipLink = typeof tip === 'object' ? tip.link : null;
                    return (
                      <li key={i} className="flex gap-3">
                        <span className="text-blue-600 font-bold">✓</span>
                        {tipLink ? (
                          <a href={tipLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer">
                            {tipText}
                          </a>
                        ) : (
                          <span className="text-gray-700">{tipText}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
              {itemDetails[itemDetailName]?.retailers && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Typical prices by retailer</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(itemDetails[itemDetailName]?.retailers || {}).map(([retailer, price]) => (
                      <div key={retailer} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                        <span className="text-gray-700 font-medium">{retailer}</span>
                        <span className="text-gray-900 font-bold">£{(price as number).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-3">💡 Typical 2026 prices. Prices vary by location and exact product</p>
                </div>
              )}
            </div>
          </div>
        </div>
        </>
      )}
    </section>
  );
}

function StatsAnimation() {
  const stats = [
    { number: '11%', label: 'of UK adults invest' },
    { number: '63%', label: 'own their home' },
    { number: '£15k', label: 'average household debt' },
    { number: '40%', label: 'can\'t afford a £200 emergency' },
    { number: '8.2M', label: 'adults lack a pension' },
  ];

  const [activeIdx, setActiveIdx] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % stats.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [stats.length]);

  return (
    <div className="py-8">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
        {stats.map((stat, idx) => (
          <div key={idx} className="text-center">
            <motion.div
              animate={{
                color: activeIdx === idx ? '#2563c6' : '#9ca3af',
                fontWeight: activeIdx === idx ? 900 : 400,
              }}
              transition={{
                duration: 0.5,
                ease: 'easeOut',
              }}
              className="text-4xl md:text-5xl"
            >
              {stat.number}
            </motion.div>
            <motion.p
              animate={{
                opacity: activeIdx === idx ? 1 : 0.5,
              }}
              transition={{
                duration: 0.5,
              }}
              className="text-slate-600 mt-2 text-sm"
            >
              {stat.label}
            </motion.p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CarouselSection() {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const tracks = [
    {
      title: 'Finances',
      description: 'Master your financial future with personalized tools and expert guidance.',
      cta: 'Get Started →',
      href: '/finances',
      bgImage: '/images/carousel-taxi.jpg',
      bgColor: 'from-slate-700 to-slate-900',
    },
    {
      title: 'Savings',
      description: 'Maximize your savings with ISA strategies and optimized accounts.',
      cta: 'Explore Savings →',
      href: '/savings',
      bgImage: '/images/guided-persona.jpg',
      bgColor: 'from-blue-600 to-blue-800',
    },
    {
      title: 'Investing',
      description: 'Build long-term wealth with tax-efficient investment strategies.',
      cta: 'Start Investing →',
      href: '/investing',
      bgImage: '/images/expert-persona.jpg',
      bgColor: 'from-purple-600 to-purple-800',
    },
    {
      title: 'Taxes',
      description: 'Understand tax planning, deductions, and optimize your returns.',
      cta: 'Tax Planning →',
      href: '/taxes',
      bgImage: '/images/taxes-persona.jpg',
      bgColor: 'from-emerald-600 to-emerald-800',
    },
  ];

  return (
    <div className="relative">
      <div className="flex items-center gap-4">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          className="flex-shrink-0 w-12 h-12 rounded-full border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white transition flex items-center justify-center z-10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Carousel Container */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-x-auto scroll-smooth snap-x snap-mandatory flex gap-6 scrollbar-hide"
          style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
        >
          {tracks.map((track) => (
            <div key={track.title} className="flex-shrink-0 w-full sm:w-96 md:w-[500px] snap-start">
              <Link href={track.href}>
                <motion.div
                  whileHover={{ y: -12 }}
                  className="cursor-pointer relative rounded-3xl h-80 overflow-hidden shadow-xl hover:shadow-2xl transition"
                >
                  {/* Background Image */}
                  {track.bgImage && (
                    <img
                      src={track.bgImage}
                      alt={track.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}

                  {/* Gradient Fallback */}
                  {!track.bgImage && <div className={`absolute inset-0 bg-gradient-to-br ${track.bgColor}`}></div>}

                  {/* Dark overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-between p-8">
                    {/* Bottom - Text */}
                    <div className="mt-auto">
                      <h3 className="text-3xl font-bold text-white mb-2">{track.title}</h3>
                      <p className="text-white/90 text-sm leading-relaxed mb-4">
                        {track.description}
                      </p>
                      <button className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-white/90 transition">
                        {track.cta}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          className="flex-shrink-0 w-12 h-12 rounded-full border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white transition flex items-center justify-center z-10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>


      {/* Hide scrollbar styles */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
