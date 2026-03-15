'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  source: string;
  url: string;
  imageUrl?: string;
  publishedAt: string;
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString();
}

export default function FinanceNews() {
  const [news, setNews] = useState<NewsArticle[]>([]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/news-stream');
        const articles = await response.json();

        if (Array.isArray(articles) && articles.length > 0) {
          const formattedNews = articles.map((article: any) => ({
            id: article.id || article.title,
            title: article.title,
            description: article.description,
            source: article.source,
            url: article.url,
            imageUrl: article.imageUrl,
            publishedAt: formatTimeAgo(article.publishedAt)
          }));
          setNews(formattedNews);
        }
      } catch (error) {
        console.error('Failed to fetch news:', error);
      }
    };

    // Fetch news immediately
    fetchNews();

    // Refetch every 5 minutes
    const interval = setInterval(fetchNews, 300000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black text-slate-900">Personal Finance News</h2>
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-2 hover:bg-slate-100 rounded-lg transition"
              aria-label="Scroll left"
            >
              ←
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 hover:bg-slate-100 rounded-lg transition"
              aria-label="Scroll right"
            >
              →
            </button>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scroll-smooth pb-4"
          style={{ scrollBehavior: 'smooth' }}
        >
          {news.map((article) => (
            <Link
              key={article.id}
              href={article.url}
              target="_blank"
              className="flex-shrink-0 w-96 group bg-slate-50 rounded-lg overflow-hidden border border-slate-200 hover:border-primary-600 hover:shadow-lg transition duration-300"
            >
              <div className="p-5 h-full flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary-600">
                    {article.source}
                  </span>
                  <span className="text-xs text-slate-500">{article.publishedAt}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary-600 transition line-clamp-2">
                  {article.title}
                </h3>

                <p className="text-sm text-slate-600 line-clamp-3 group-hover:text-slate-900 transition flex-grow">
                  {article.description}
                </p>

                <div className="mt-4 flex items-center text-primary-600 text-sm font-semibold group-hover:gap-2 transition">
                  Read more →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
