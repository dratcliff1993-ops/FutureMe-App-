'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ExpertHub() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [expandedTool, setExpandedTool] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 500;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

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

  const tools = [
    {
      title: 'Income Tax Calculator',
      description: 'Advanced tax calculator featuring pension relief calculations, salary sacrifice optimization, multi-country support, and real-time tax liability estimation. Includes support for multiple income sources, investment gains, and personalized tax efficiency strategies.',
      icon: '💰',
      href: '/income-tax',
      color: 'from-blue-500/20 to-cyan-500/20',
      border: 'border-blue-500/30',
      badge: 'Most Popular',
      image: '/calculator.jpg',
    },
    {
      title: 'Frozen Tax Bands',
      description: 'Interactive visualization of the 60% tax trap and frozen threshold impact on your taxes. Understand how frozen personal allowances affect higher earners and explore strategies to mitigate the additional tax burden on your income.',
      icon: '❄️',
      href: '/frozen-tax-bands',
      color: 'from-cyan-500/20 to-blue-500/20',
      border: 'border-cyan-500/30',
      badge: 'Complex Topic',
      image: '/frozen-tax-analytics.jpg',
    },
    {
      title: 'Tax Allowances Guide',
      description: 'Comprehensive breakdown of personal allowances, marriage allowance transfers, adjustments, and proven strategies on how to maximize your tax relief. Learn about trading allowances, blind person relief, and other lesser-known deductions.',
      icon: '📋',
      href: '/tax-allowances',
      color: 'from-purple-500/20 to-pink-500/20',
      border: 'border-purple-500/30',
      badge: 'Interactive',
      image: '/tax-allowances-planning.jpg',
    },
    {
      title: 'Pension Planning',
      description: 'Strategic pension contribution planning including lifetime allowance considerations, tax relief optimization, retirement income projections, and withdrawal strategies. Plan your pension alongside other financial goals for maximum tax efficiency.',
      icon: '🏦',
      href: '/pension-planning',
      color: 'from-orange-500/20 to-red-500/20',
      border: 'border-orange-500/30',
      badge: 'Essential',
    },
    {
      title: 'Self Assessment Helper',
      description: 'Step-by-step guidance for completing your Self Assessment tax return accurately and efficiently. Includes common mistakes to avoid, documentation requirements, submission deadlines, and tips for claiming all eligible expenses and reliefs.',
      icon: '📝',
      href: '/self-assessment',
      color: 'from-green-500/20 to-emerald-500/20',
      border: 'border-green-500/30',
      badge: 'Guidance',
    },
    {
      title: 'Financial Audit Checklist',
      description: 'Comprehensive 7-section framework to audit and organize your complete financial situation. Covers assets, liabilities, cash flow analysis, net worth calculation, tax compliance, insurance review, and actionable planning steps for financial optimization.',
      icon: '✅',
      href: '/financial-audit',
      color: 'from-indigo-500/20 to-violet-500/20',
      border: 'border-indigo-500/30',
      badge: 'Foundational',
    },
  ];

  return (
    <main className="min-h-screen bg-white">

      {/* Header */}
      <header className="fixed top-0 w-full z-[9999] backdrop-blur-sm bg-white/95 border-b border-gray-200">
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
            <span className="text-3xl font-bold text-gray-900">FutureMe</span>
          </Link>

          <nav className="hidden md:flex gap-8 text-gray-700 overflow-visible">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative group overflow-visible"
                onMouseEnter={() => handleDropdownOpen(item.label)}
                onMouseLeave={() => handleDropdownClose()}
              >
                <button className={`px-4 py-2 rounded-full transition ${
                  openDropdown === item.label
                    ? 'bg-gray-100 text-gray-900'
                    : 'hover:text-gray-900'
                }`}>
                  {item.label}
                </button>
              </div>
            ))}
          </nav>

          <Link href="/" className="text-gray-700 hover:text-gray-900 transition font-medium">
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
            className="absolute top-full left-0 right-0 bg-white backdrop-blur-md border-b border-gray-200 overflow-visible z-[9998]"
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

      {/* Hero Section with Video */}
      <div className="w-full overflow-hidden relative z-0 mt-16">
        {/* Background Video */}
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/27025-361798595.mp4" type="video/mp4" />
          </video>
          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/75 to-black/50"></div>
        </div>

        {/* Content Container */}
        <div className="relative min-h-[400px] flex items-center">
          <div className="max-w-7xl mx-auto w-full px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl lg:text-6xl font-black text-white mb-6 leading-tight max-w-2xl">
                Advanced Financial Optimization
              </h1>
              <p className="text-xl text-white/80 mb-8 max-w-2xl leading-relaxed">
                Powerful tools and calculators designed to help you master taxes, optimize investments, and plan your financial future.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 text-center"
          >
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-4 leading-tight">
              Expert Financial Tools
            </h1>
            <p className="text-lg text-gray-600">
              Advanced optimization suite with powerful calculators and strategic planning tools
            </p>
          </motion.div>

          {/* Tools Carousel */}
          <div className="relative">
            <div
              ref={carouselRef}
              className="flex gap-6 overflow-x-auto scroll-smooth pb-2"
              style={{ scrollBehavior: 'smooth' }}
            >
              {tools.map((tool, idx) => (
                <motion.div
                  key={tool.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex-shrink-0 w-full md:max-w-md lg:max-w-md"
                >
                  <Link href={tool.href}>
                    <button className="w-full h-full text-left group">
                      <div className={`bg-gradient-to-br ${tool.color} rounded-3xl p-12 h-full flex flex-col hover:shadow-lg transition-shadow min-h-[550px]`}>
                        <h3 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                          {tool.title}
                        </h3>

                        <p className="text-sm text-gray-700 leading-relaxed">
                          {tool.description}
                        </p>

                        <div className="flex-grow" />

                        {tool.image && (
                          <img
                            src={tool.image}
                            alt={tool.title}
                            className="w-full h-auto object-cover rounded-xl mt-8 mx-auto"
                          />
                        )}
                      </div>
                    </button>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={() => scroll('left')}
              className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-2 hover:bg-gray-50 transition"
            >
              <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scroll('right')}
              className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-2 hover:bg-gray-50 transition"
            >
              <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-16 bg-gradient-to-r from-blue-50 to-cyan-50 backdrop-blur-xl border-2 border-blue-200 rounded-3xl p-8 md:p-12 text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Not Sure Where to Start?</h2>
            <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
              Try our guided questionnaire to get personalized recommendations based on your financial situation.
            </p>
            <Link href="/guided">
              <button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg">
                Start Financial Guide
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
