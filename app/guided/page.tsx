'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useGuideStore } from '@/lib/stores/useGuideStore';
import FutureSelfAvatar from '@/components/FutureSelfAvatar';

interface RecommendationItemType {
  title: string;
  description: string;
  checklist: string[];
  links?: { text: string; href: string }[];
  timeline?: string;
}

interface ModalState {
  isOpen: boolean;
  recommendation: RecommendationItemType | null;
  category: string;
  checkedItems: { [key: string]: boolean };
}

export default function GuidedQuestionnaire() {
  const { step, answers, recommendations, setStep, setAnswer, toggleMultiSelect, setRecommendations, reset } = useGuideStore();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    recommendation: null,
    category: '',
    checkedItems: {},
  });
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const openModal = (rec: RecommendationItemType, category: string) => {
    const storageKey = `rec-${rec.title}`;
    const savedChecked = localStorage.getItem(storageKey);
    const checkedItems = savedChecked ? JSON.parse(savedChecked) : {};

    setModalState({
      isOpen: true,
      recommendation: rec,
      category,
      checkedItems,
    });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, recommendation: null, category: '', checkedItems: {} });
  };

  const toggleChecklistItem = (index: number) => {
    const rec = modalState.recommendation;
    if (!rec) return;

    const storageKey = `rec-${rec.title}`;
    const newChecked = { ...modalState.checkedItems, [index]: !modalState.checkedItems[index] };
    localStorage.setItem(storageKey, JSON.stringify(newChecked));

    setModalState(prev => ({
      ...prev,
      checkedItems: newChecked,
    }));
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

  useEffect(() => {
    // Reset on first load (check if this is initial page load)
    const hasInitialized = localStorage.getItem('guide-initialized');
    if (!hasInitialized) {
      reset();
      localStorage.setItem('guide-initialized', 'true');
    }
  }, [reset]);

  interface RecommendationItem {
    title: string;
    description: string;
    checklist: string[];
    links?: { text: string; href: string }[];
    timeline?: string;
  }

  interface RecommendationsType {
    immediate: RecommendationItem[];
    shortTerm: RecommendationItem[];
    mediumTerm: RecommendationItem[];
    longTerm: RecommendationItem[];
  }

  const generateRecommendations = () => {
    const recs: RecommendationsType = {
      immediate: [],
      shortTerm: [],
      mediumTerm: [],
      longTerm: [],
    };

    // Analyze financial health
    const hasHighIncomeDebt = answers.debts.includes('credit') || answers.debts.includes('mixed');
    const lowSavings = answers.savings === 'none' || answers.savings === 'some';
    const highIncome = answers.income === 'over-75' || answers.income === '50-75' || answers.income === '75-100' || answers.income === '100-150' || answers.income === 'over-150';
    const veryHighIncome = answers.income === '100-150' || answers.income === 'over-150';
    const isSelfEmployed = answers.currentSituation === 'self-employed';

    // IMMEDIATE ACTIONS - Priority 1
    if (lowSavings) {
      recs.immediate.push({
        title: 'Build Your Emergency Fund',
        description: 'Establish a safety net of 3-6 months expenses before investing.',
        checklist: [
          'Calculate 3-6 months of essential expenses',
          'Open a high-yield savings account (e.g., Marcus, Chip)',
          'Set up automatic monthly transfers (even £50/month counts)',
          'Keep fund separate from everyday account',
          'Aim for £1,000-£3,000 as first target',
        ],
        links: [
          { text: 'Compare savings rates', href: '/savings' },
          { text: 'Emergency fund guide', href: '/expert' },
        ],
      });
    }

    if (hasHighIncomeDebt) {
      recs.immediate.push({
        title: 'Create a Debt Repayment Plan',
        description: 'Tackle high-interest debt strategically using the avalanche or snowball method.',
        checklist: [
          'List all debts with interest rates',
          'Calculate total interest you\'ll pay',
          'Choose avalanche (highest rate first) or snowball (smallest balance first)',
          'Set up additional payments on high-interest debt',
          'Consider 0% balance transfer cards if eligible',
        ],
        links: [
          { text: 'Debt repayment strategies', href: '/expert' },
          { text: 'Credit card comparison', href: '/' },
        ],
      });
    }

    if (isSelfEmployed && !answers.debts.includes('none')) {
      recs.immediate.push({
        title: 'Set Up Tax-Efficient Record Keeping',
        description: 'Self-employed income requires quarterly tax planning and record management.',
        checklist: [
          'Register with HMRC Self Assessment (if not done)',
          'Set up dedicated business bank account',
          'Use accounting software (FreeAgent, Xero)',
          'Track all expenses and receipts',
          'Set aside 30% of net income for tax',
        ],
        links: [
          { text: 'Self Assessment guide', href: '/self-assessment' },
          { text: 'Tax allowances for self-employed', href: '/tax-allowances' },
        ],
      });
    }

    // SHORT-TERM ACTIONS (1-3 months)
    if (answers.shortTerm.includes('save')) {
      recs.shortTerm.push({
        title: 'Maximize Tax-Free Savings',
        description: 'Use ISAs to grow savings without paying tax on interest.',
        checklist: [
          'Choose between Cash ISA or Flexible ISA',
          'Open Cash ISA account (fixed or variable rate)',
          'Pay in up to £20,000/year tax-free',
          'Compare rates: Chip, Marcus, Chase, Chip',
          'Set reminders to review rates annually',
        ],
        links: [
          { text: 'ISA rate comparison', href: '/' },
          { text: 'ISA tax benefits explained', href: '/tax-allowances' },
        ],
      });
    }

    if (answers.shortTerm.includes('property')) {
      recs.shortTerm.push({
        title: 'Plan Your Property Purchase',
        description: `Target deposit of £${highIncome ? '25,000-50,000' : '10,000-20,000'}. First-Time Buyer ISAs offer tax relief.`,
        checklist: [
          'Calculate total deposit needed (5-20% of property price)',
          'Open First-Time Buyer ISA (£4,000 govt bonus)',
          'Get mortgage agreement in principle',
          'Research first-time buyer schemes (Help to Buy, Lifetime ISA)',
          'Save on a structured timeline with milestones',
        ],
        links: [
          { text: 'First-Time Buyer ISA info', href: '/tax-allowances' },
          { text: 'Mortgage calculators', href: '/' },
        ],
      });
    }

    // MEDIUM-TERM ACTIONS (3-12 months)
    if (answers.mediumTerm.includes('invest')) {
      recs.mediumTerm.push({
        title: 'Start Investing for Growth',
        description: `With ${lowSavings ? 'your emergency fund in place' : 'adequate savings'}, begin building wealth through investments.`,
        checklist: [
          'Open Stocks & Shares ISA (tax-free growth)',
          'Choose low-cost platform (Vanguard, iShares, Fidelity)',
          'Start with index funds or ETFs',
          `Start small: £${highIncome ? '500' : '100'}/month is realistic`,
          'Understand risk vs. timeframe (20+ years = higher risk OK)',
        ],
        links: [
          { text: 'Investment guide for beginners', href: '/expert' },
          { text: 'Platform comparison', href: '/' },
        ],
      });
    }

    if (answers.mediumTerm.includes('pension')) {
      const employedText = answers.currentSituation === 'employed'
        ? 'Check your employer match (often 3-5% free money)'
        : 'Self-employed? You get tax relief on contributions';

      recs.mediumTerm.push({
        title: 'Optimize Your Pension',
        description: `${employedText}. Boost contributions to maximize tax relief.`,
        checklist: [
          answers.currentSituation === 'employed'
            ? 'Review current pension statement'
            : 'Register for self-employed pension',
          `Increase contributions by £${answers.income === 'over-75' ? '200' : '50'}/month`,
          'Understand tax relief (20-40% depending on income)',
          'Check Annual Allowance (£60k) and Lifetime Allowance',
          'Review investment options within pension',
        ],
        links: [
          { text: 'Pension planning guide', href: '/pension-planning' },
          { text: 'Tax relief explained', href: '/tax-allowances' },
        ],
      });
    }

    // LONG-TERM ACTIONS (1+ years)
    if (answers.longTerm.includes('wealth')) {
      recs.longTerm.push({
        title: 'Build Long-Term Wealth Strategy',
        description: 'Create a diversified portfolio across tax-efficient vehicles.',
        checklist: [
          'Define wealth goal (£500k? £1M?) and timeline',
          'Split investments: ISA (£20k/year), Pension (£60k/year), GIA',
          'Build diversified portfolio: UK index, international, bonds',
          'Automate monthly investments (removes emotion)',
          'Review and rebalance annually',
        ],
        links: [
          { text: 'Wealth building strategies', href: '/expert' },
          { text: 'Investment portfolio guide', href: '/' },
        ],
      });
    }

    if (answers.longTerm.includes('retire')) {
      recs.longTerm.push({
        title: 'Plan Your Retirement',
        description: `Calculate how much you need: ${veryHighIncome ? '£50-75k' : highIncome ? '£40-50k' : '£25-30k'}/year is common target.`,
        checklist: [
          'Calculate retirement spending needs',
          'Project State Pension age and amount',
          'Use 4% rule: £1M = £40k/year withdrawal',
          'Estimate pension pot needed',
          'Set up monthly tracker and review annually',
        ],
        links: [
          { text: 'Retirement calculator', href: '/expert' },
          { text: 'Pension planning', href: '/pension-planning' },
        ],
      });
    }

    // HIGH-INCOME EARNER STRATEGIES (100k+)
    if (veryHighIncome && answers.income === '100-150') {
      recs.mediumTerm.push({
        title: 'Avoid the 60% Tax Trap',
        description: 'Between £100k-£125k, you lose your personal allowance, creating an effective 60% tax rate. Strategic pension contributions can neutralise this.',
        checklist: [
          'Understand: Every £2 earned above £100k loses £1 allowance = 60% effective tax',
          'Calculate personal allowance loss (£50k ÷ 2)',
          'Contribute to pension to reduce net income below £100k if possible',
          'Use salary sacrifice arrangements (employer NI savings)',
          'Consider trading allowance if self-employed (up to £1k/year)',
          'Review dividends vs salary for company directors',
        ],
        links: [
          { text: 'Personal allowance guidance', href: '/tax-allowances' },
          { text: 'Pension planning for high earners', href: '/pension-planning' },
          { text: 'Income tax calculator', href: '/income-tax' },
        ],
      });
    }

    if (veryHighIncome && answers.income === 'over-150') {
      recs.longTerm.push({
        title: 'Advanced Tax Planning for Very High Earners',
        description: 'At 150k+, additional rate tax (45%) and dividend tax planning become critical. Maximise all tax-efficient vehicles.',
        checklist: [
          'Max out pension contributions (£60k/year Annual Allowance)',
          'Maximise ISA allowance (£20k/year tax-free)',
          'Consider gift aid on charity donations (gets basic rate relief)',
          'If self-employed: Split income optimally (salary vs dividends)',
          'Track dividend allowance (£500/year at basic rate)',
          'Review Lifetime ISA for first-time buyer property (£4k free)',
          'Explore premium bond holdings (no tax on winnings)',
        ],
        links: [
          { text: 'Tax planning for 150k+ earners', href: '/expert' },
          { text: 'Investment ISA strategies', href: '/tax-allowances' },
          { text: 'Pension Annual Allowance', href: '/pension-planning' },
        ],
      });
    }

    // Fallback if no selections
    if (recs.immediate.length === 0) {
      recs.immediate.push({
        title: 'Review Your Financial Situation',
        description: 'Take the first step with a comprehensive financial health check.',
        checklist: [
          'Calculate net worth (assets - debts)',
          'Review all accounts and statements',
          'List all debts with interest rates',
          'Identify monthly income vs. expenses',
          'Meet with a financial advisor',
        ],
        links: [
          { text: 'Full financial audit', href: '/financial-audit' },
        ],
      });
    }

    setRecommendations(recs);
  };

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      generateRecommendations();
      setStep(6);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleRestart = () => {
    reset();
    localStorage.removeItem('guide-initialized');
  };

  // Modal Component
  const RecommendationModal = () => {
    if (!modalState.isOpen || !modalState.recommendation) return null;

    const rec = modalState.recommendation;
    const colorMap: { [key: string]: { text: string; bg: string; border: string; check: string } } = {
      immediate: { text: 'text-red-300', bg: 'bg-red-500/5', border: 'border-red-500/30', check: 'text-red-400' },
      shortTerm: { text: 'text-orange-300', bg: 'bg-orange-500/5', border: 'border-orange-500/30', check: 'text-orange-400' },
      mediumTerm: { text: 'text-blue-300', bg: 'bg-blue-500/5', border: 'border-blue-500/30', check: 'text-blue-400' },
      longTerm: { text: 'text-purple-300', bg: 'bg-purple-500/5', border: 'border-purple-500/30', check: 'text-purple-400' },
    };
    const colors = colorMap[modalState.category] || colorMap.immediate;

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className={`${colors.bg} backdrop-blur-xl border ${colors.border} rounded-3xl max-w-2xl max-h-[80vh] overflow-y-auto p-8 w-full`}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className={`text-3xl font-bold ${colors.text} mb-2`}>{rec.title}</h2>
                <p className="text-gray-300">{rec.description}</p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white transition text-2xl font-light"
              >
                ✕
              </button>
            </div>

            {rec.checklist && rec.checklist.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-4">Action Checklist</h3>
                <ul className="space-y-3">
                  {rec.checklist.map((item, i) => (
                    <li
                      key={i}
                      onClick={() => toggleChecklistItem(i)}
                      className="flex gap-3 cursor-pointer p-2 rounded-lg hover:bg-white/5 transition items-start"
                    >
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition ${
                        modalState.checkedItems[i] ? `border-${modalState.category === 'immediate' ? 'red' : modalState.category === 'shortTerm' ? 'orange' : modalState.category === 'mediumTerm' ? 'blue' : 'purple'}-400 bg-${modalState.category === 'immediate' ? 'red' : modalState.category === 'shortTerm' ? 'orange' : modalState.category === 'mediumTerm' ? 'blue' : 'purple'}-500/20` : 'border-white/40'
                      }`}>
                        {modalState.checkedItems[i] && <span className="text-sm font-bold text-white">✓</span>}
                      </div>
                      <span className={`${modalState.checkedItems[i] ? 'text-gray-400 line-through' : 'text-gray-200'}`}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {rec.links && rec.links.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-4">Resources</h3>
                <div className="flex flex-wrap gap-2">
                  {rec.links.map((link, i) => (
                    <Link
                      key={i}
                      href={link.href}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition ${colors.text} bg-white/10 hover:bg-white/20`}
                    >
                      {link.text} →
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={closeModal}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-2xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition"
            >
              Got it, close
            </button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      <RecommendationModal />
      {/* Hero Video Background */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/frozen-tax-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900/90"></div>
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation */}
      <header className="fixed top-0 w-full z-[9999] backdrop-blur-sm bg-black/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
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

          <Link href="/" className="text-[#f5f1ed] hover:text-[#f5f1ed]/70 transition font-medium">
            ← Back Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 pt-32 pb-24 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
              Your Financial Guide
            </h1>
            <p className="text-lg text-gray-300">
              Answer a few questions and we'll create a personalized roadmap for your goals.
            </p>
          </motion.div>

          {/* Progress Indicator */}
          {step < 6 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-12"
            >
              <div className="flex gap-2 justify-center mb-6">
                {[1, 2, 3, 4, 5].map((s) => (
                  <motion.div
                    key={s}
                    className={`h-2 flex-1 rounded-full transition-all ${
                      s <= step ? 'bg-gradient-to-r from-blue-400 to-cyan-400' : 'bg-white/20'
                    }`}
                    layoutId={`progress-${s}`}
                  />
                ))}
              </div>
              <p className="text-center text-gray-400 text-sm font-medium">Step {step} of 5</p>
            </motion.div>
          )}

          {/* Question Cards */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-8"
              >
                <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 md:p-10 shadow-2xl">
                  <h2 className="text-3xl font-bold text-white mb-2">Where are you now?</h2>
                  <p className="text-gray-300 mb-8">Tell us about your current financial situation.</p>

                  <div className="space-y-4">
                    {[
                      { value: 'student', label: 'Student or early career' },
                      { value: 'employed', label: 'Employed with steady income' },
                      { value: 'self-employed', label: 'Self-employed or freelance' },
                      { value: 'between', label: 'Between jobs or transitioning' },
                    ].map((option) => (
                      <motion.button
                        key={option.value}
                        onClick={() => setAnswer('currentSituation', option.value)}
                        className={`w-full p-4 rounded-2xl text-left font-semibold transition-all border-2 backdrop-blur-sm ${
                          answers.currentSituation === option.value
                            ? 'border-blue-400 bg-blue-500/20 text-white shadow-lg shadow-blue-500/20'
                            : 'border-white/20 bg-white/5 text-gray-200 hover:border-white/40 hover:bg-white/10'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {option.label}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-8"
              >
                <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 md:p-10 shadow-2xl">
                  <h2 className="text-3xl font-bold text-white mb-2">Income & Savings</h2>
                  <p className="text-gray-300 mb-8">Help us understand your financial capacity.</p>

                  <div className="space-y-8">
                    <div>
                      <label className="block text-white font-semibold mb-4">Annual income range</label>
                      <div className="space-y-3">
                        {[
                          { value: 'under-25', label: 'Under £25,000' },
                          { value: '25-50', label: '£25,000 - £50,000' },
                          { value: '50-75', label: '£50,000 - £75,000' },
                          { value: '75-100', label: '£75,000 - £100,000' },
                          { value: '100-150', label: '£100,000 - £150,000' },
                          { value: 'over-150', label: 'Over £150,000' },
                        ].map((option) => (
                          <motion.button
                            key={option.value}
                            onClick={() => setAnswer('income', option.value)}
                            className={`w-full p-3 rounded-xl text-left font-medium transition-all border-2 backdrop-blur-sm ${
                              answers.income === option.value
                                ? 'border-blue-400 bg-blue-500/20 text-white'
                                : 'border-white/20 bg-white/5 text-gray-200 hover:border-white/40'
                            }`}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {option.label}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-4">Current savings</label>
                      <div className="space-y-3">
                        {[
                          { value: 'none', label: 'Just getting started' },
                          { value: 'some', label: '£1,000 - £10,000' },
                          { value: 'good', label: '£10,000 - £50,000' },
                          { value: 'substantial', label: 'Over £50,000' },
                        ].map((option) => (
                          <motion.button
                            key={option.value}
                            onClick={() => setAnswer('savings', option.value)}
                            className={`w-full p-3 rounded-xl text-left font-medium transition-all border-2 backdrop-blur-sm ${
                              answers.savings === option.value
                                ? 'border-blue-400 bg-blue-500/20 text-white'
                                : 'border-white/20 bg-white/5 text-gray-200 hover:border-white/40'
                            }`}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {option.label}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-8"
              >
                <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 md:p-10 shadow-2xl">
                  <h2 className="text-3xl font-bold text-white mb-2">Current Debts</h2>
                  <p className="text-gray-300 mb-8">Which apply to you? (Select all that apply)</p>

                  <div className="space-y-4">
                    {[
                      { value: 'none', label: 'No outstanding debts' },
                      { value: 'student-loan', label: 'Student loans only' },
                      { value: 'credit', label: 'Credit cards or personal loans' },
                      { value: 'mortgage', label: 'Mortgage' },
                      { value: 'mixed', label: 'Multiple types of debt' },
                    ].map((option) => (
                      <motion.button
                        key={option.value}
                        onClick={() => toggleMultiSelect('debts', option.value)}
                        className={`w-full p-4 rounded-2xl text-left font-semibold transition-all border-2 backdrop-blur-sm flex items-center gap-3 ${
                          answers.debts.includes(option.value)
                            ? 'border-blue-400 bg-blue-500/20 text-white shadow-lg shadow-blue-500/20'
                            : 'border-white/20 bg-white/5 text-gray-200 hover:border-white/40 hover:bg-white/10'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                            answers.debts.includes(option.value)
                              ? 'border-blue-300 bg-blue-400'
                              : 'border-white/40'
                          }`}
                        >
                          {answers.debts.includes(option.value) && <span className="text-sm">✓</span>}
                        </div>
                        {option.label}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-8"
              >
                <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 md:p-10 shadow-2xl">
                  <h2 className="text-3xl font-bold text-white mb-2">Next 1-5 Years</h2>
                  <p className="text-gray-300 mb-8">What's important to you? (Select all that apply)</p>

                  <div className="space-y-8">
                    <div>
                      <p className="text-gray-300 font-semibold text-sm mb-4 uppercase tracking-wide opacity-80">Short-term (0-1 year)</p>
                      <div className="space-y-3">
                        {[
                          { value: 'save', label: 'Build savings' },
                          { value: 'property', label: 'Save for property deposit' },
                          { value: 'reduce-debt', label: 'Pay off high-interest debt' },
                        ].map((option) => (
                          <motion.button
                            key={option.value}
                            onClick={() => toggleMultiSelect('shortTerm', option.value)}
                            className={`w-full p-3 rounded-xl text-left font-medium transition-all border-2 backdrop-blur-sm flex items-center gap-3 ${
                              answers.shortTerm.includes(option.value)
                                ? 'border-blue-400 bg-blue-500/20 text-white'
                                : 'border-white/20 bg-white/5 text-gray-200 hover:border-white/40'
                            }`}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div
                              className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                                answers.shortTerm.includes(option.value)
                                  ? 'border-blue-300 bg-blue-400'
                                  : 'border-white/40'
                              }`}
                            >
                              {answers.shortTerm.includes(option.value) && <span className="text-xs">✓</span>}
                            </div>
                            {option.label}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-gray-300 font-semibold text-sm mb-4 uppercase tracking-wide opacity-80">Medium-term (1-5 years)</p>
                      <div className="space-y-3">
                        {[
                          { value: 'invest', label: 'Start investing' },
                          { value: 'pension', label: 'Boost pension contributions' },
                          { value: 'business', label: 'Start a side business' },
                        ].map((option) => (
                          <motion.button
                            key={option.value}
                            onClick={() => toggleMultiSelect('mediumTerm', option.value)}
                            className={`w-full p-3 rounded-xl text-left font-medium transition-all border-2 backdrop-blur-sm flex items-center gap-3 ${
                              answers.mediumTerm.includes(option.value)
                                ? 'border-blue-400 bg-blue-500/20 text-white'
                                : 'border-white/20 bg-white/5 text-gray-200 hover:border-white/40'
                            }`}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div
                              className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                                answers.mediumTerm.includes(option.value)
                                  ? 'border-blue-300 bg-blue-400'
                                  : 'border-white/40'
                              }`}
                            >
                              {answers.mediumTerm.includes(option.value) && <span className="text-xs">✓</span>}
                            </div>
                            {option.label}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="step-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-8"
              >
                <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 md:p-10 shadow-2xl">
                  <h2 className="text-3xl font-bold text-white mb-2">Long-term Vision</h2>
                  <p className="text-gray-300 mb-8">Where do you want to be in 5+ years? (Select all that apply)</p>

                  <div className="space-y-4">
                    {[
                      { value: 'wealth', label: 'Build significant wealth' },
                      { value: 'retire', label: 'Early retirement or financial independence' },
                      { value: 'passive-income', label: 'Generate passive income' },
                      { value: 'education', label: 'Fund education for dependents' },
                      { value: 'flexibility', label: 'Have financial flexibility & freedom' },
                    ].map((option) => (
                      <motion.button
                        key={option.value}
                        onClick={() => toggleMultiSelect('longTerm', option.value)}
                        className={`w-full p-4 rounded-2xl text-left font-semibold transition-all border-2 backdrop-blur-sm flex items-center gap-3 ${
                          answers.longTerm.includes(option.value)
                            ? 'border-blue-400 bg-blue-500/20 text-white shadow-lg shadow-blue-500/20'
                            : 'border-white/20 bg-white/5 text-gray-200 hover:border-white/40 hover:bg-white/10'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                            answers.longTerm.includes(option.value)
                              ? 'border-blue-300 bg-blue-400'
                              : 'border-white/40'
                          }`}
                        >
                          {answers.longTerm.includes(option.value) && <span className="text-sm">✓</span>}
                        </div>
                        {option.label}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 6 && recommendations && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-8"
              >
                <div className="space-y-6">
                  {/* Immediate Actions */}
                  {recommendations.immediate.length > 0 && (
                    <div className="bg-white/10 backdrop-blur-2xl border border-red-500/30 rounded-3xl p-8 shadow-2xl">
                      <h3 className="text-2xl font-bold text-red-300 mb-2">Immediate Actions</h3>
                      <p className="text-gray-400 mb-6">Start these now</p>
                      <div className="space-y-6">
                        {recommendations.immediate.map((rec, idx) => (
                          <button
                            key={idx}
                            onClick={() => openModal(rec, 'immediate')}
                            className="w-full border border-red-500/20 bg-red-500/5 rounded-2xl p-6 backdrop-blur-sm hover:bg-red-500/10 hover:border-red-500/40 transition text-left"
                          >
                            <h4 className="text-lg font-bold text-red-200 mb-2">{rec.title}</h4>
                            <p className="text-gray-300 mb-4">{rec.description}</p>
                            <p className="text-xs text-red-300/70 mt-4">Click to see detailed checklist and resources →</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Short-term */}
                  {recommendations.shortTerm.length > 0 && (
                    <div className="bg-white/10 backdrop-blur-2xl border border-orange-500/30 rounded-3xl p-8 shadow-2xl">
                      <h3 className="text-2xl font-bold text-orange-300 mb-2">Next 1-3 Months</h3>
                      <p className="text-gray-400 mb-6">Quick wins and foundation building</p>
                      <div className="space-y-6">
                        {recommendations.shortTerm.map((rec, idx) => (
                          <button
                            key={idx}
                            onClick={() => openModal(rec, 'shortTerm')}
                            className="w-full border border-orange-500/20 bg-orange-500/5 rounded-2xl p-6 backdrop-blur-sm hover:bg-orange-500/10 hover:border-orange-500/40 transition text-left"
                          >
                            <h4 className="text-lg font-bold text-orange-200 mb-2">{rec.title}</h4>
                            <p className="text-gray-300 mb-4">{rec.description}</p>
                            <p className="text-xs text-orange-300/70">Click to see detailed checklist and resources →</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Medium-term */}
                  {recommendations.mediumTerm.length > 0 && (
                    <div className="bg-white/10 backdrop-blur-2xl border border-blue-500/30 rounded-3xl p-8 shadow-2xl">
                      <h3 className="text-2xl font-bold text-blue-300 mb-2">3-12 Months</h3>
                      <p className="text-gray-400 mb-6">Sustained growth and optimization</p>
                      <div className="space-y-6">
                        {recommendations.mediumTerm.map((rec, idx) => (
                          <button
                            key={idx}
                            onClick={() => openModal(rec, 'mediumTerm')}
                            className="w-full border border-blue-500/20 bg-blue-500/5 rounded-2xl p-6 backdrop-blur-sm hover:bg-blue-500/10 hover:border-blue-500/40 transition text-left"
                          >
                            <h4 className="text-lg font-bold text-blue-200 mb-2">{rec.title}</h4>
                            <p className="text-gray-300 mb-4">{rec.description}</p>
                            <p className="text-xs text-blue-300/70">Click to see detailed checklist and resources →</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Long-term */}
                  {recommendations.longTerm.length > 0 && (
                    <div className="bg-white/10 backdrop-blur-2xl border border-purple-500/30 rounded-3xl p-8 shadow-2xl">
                      <h3 className="text-2xl font-bold text-purple-300 mb-2">Long-term (1+ Years)</h3>
                      <p className="text-gray-400 mb-6">Wealth building and legacy</p>
                      <div className="space-y-6">
                        {recommendations.longTerm.map((rec, idx) => (
                          <button
                            key={idx}
                            onClick={() => openModal(rec, 'longTerm')}
                            className="w-full border border-purple-500/20 bg-purple-500/5 rounded-2xl p-6 backdrop-blur-sm hover:bg-purple-500/10 hover:border-purple-500/40 transition text-left"
                          >
                            <h4 className="text-lg font-bold text-purple-200 mb-2">{rec.title}</h4>
                            <p className="text-gray-300 mb-4">{rec.description}</p>
                            <p className="text-xs text-purple-300/70">Click to see detailed checklist and resources →</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Start Over Button */}
                  <button
                    onClick={handleRestart}
                    className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg"
                  >
                    Start Over
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Recommendation Modal */}
          <AnimatePresence>
            {modalState.isOpen && modalState.recommendation && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-[9998] flex items-center justify-center p-4"
                onClick={closeModal}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-slate-900 border border-white/20 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                >
                  <div className="p-8">
                    {/* Title with category color */}
                    <div className={`mb-6 pb-6 border-b ${
                      modalState.category === 'immediate' ? 'border-red-500/30' :
                      modalState.category === 'shortTerm' ? 'border-orange-500/30' :
                      modalState.category === 'mediumTerm' ? 'border-blue-500/30' :
                      'border-purple-500/30'
                    }`}>
                      <h2 className={`text-3xl font-bold mb-2 ${
                        modalState.category === 'immediate' ? 'text-red-300' :
                        modalState.category === 'shortTerm' ? 'text-orange-300' :
                        modalState.category === 'mediumTerm' ? 'text-blue-300' :
                        'text-purple-300'
                      }`}>
                        {modalState.recommendation.title}
                      </h2>
                      <p className="text-gray-300">{modalState.recommendation.description}</p>
                    </div>

                    {/* Checklist */}
                    {modalState.recommendation.checklist && modalState.recommendation.checklist.length > 0 && (
                      <div className="mb-8">
                        <h3 className="text-xl font-semibold text-white mb-4">Action Items</h3>
                        <div className="space-y-3">
                          {modalState.recommendation.checklist.map((item, idx) => (
                            <motion.button
                              key={idx}
                              onClick={() => toggleChecklistItem(idx)}
                              className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition text-left"
                            >
                              <div className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                modalState.checkedItems[idx]
                                  ? 'bg-blue-500 border-blue-500'
                                  : 'border-white/30'
                              }`}>
                                {modalState.checkedItems[idx] && <span className="text-white text-sm">✓</span>}
                              </div>
                              <span className={`${modalState.checkedItems[idx] ? 'line-through text-gray-400' : 'text-gray-200'}`}>
                                {item}
                              </span>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Links */}
                    {modalState.recommendation.links && modalState.recommendation.links.length > 0 && (
                      <div className="mb-8">
                        <h3 className="text-xl font-semibold text-white mb-4">Helpful Resources</h3>
                        <div className="space-y-2">
                          {modalState.recommendation.links.map((link, idx) => (
                            <a
                              key={idx}
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block p-3 rounded-lg bg-white/5 hover:bg-white/10 text-blue-300 hover:text-blue-200 transition"
                            >
                              {link.text} →
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Close Button */}
                    <button
                      onClick={closeModal}
                      className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition"
                    >
                      Got it, close
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          {step < 6 && (
            <motion.div className="flex gap-4 mt-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <button
                onClick={handleBack}
                disabled={step === 1}
                className="flex-1 px-6 py-3 rounded-xl font-semibold transition border border-white/30 text-white hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed backdrop-blur-sm"
              >
                ← Back
              </button>

              <button
                onClick={handleNext}
                disabled={
                  (step === 1 && !answers.currentSituation) ||
                  (step === 2 && (!answers.income || !answers.savings)) ||
                  (step === 3 && answers.debts.length === 0)
                }
                className="flex-1 px-6 py-3 rounded-xl font-semibold transition bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {step === 5 ? 'See My Roadmap' : 'Continue →'}
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}
