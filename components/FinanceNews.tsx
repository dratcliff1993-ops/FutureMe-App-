'use client';

import React, { useState, useEffect } from 'react';
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
  const [news, setNews] = useState<NewsArticle[]>([
    {
      id: '1',
      title: 'Bank of England Holds Interest Rates at 5.25%',
      description: 'The Bank of England maintained its base rate, signaling a pause in the tightening cycle as inflation continues to cool.',
      source: 'BBC News',
      url: '#',
      publishedAt: '2 hours ago'
    },
    {
      id: '2',
      title: 'FTSE 100 Rises on Banking Sector Gains',
      description: 'London Stock Exchange hits 8-month high as major banks report strong quarterly earnings.',
      source: 'Financial Times',
      url: '#',
      publishedAt: '4 hours ago'
    },
    {
      id: '3',
      title: 'Inflation Falls to 3.9% in Latest Data',
      description: 'Consumer prices continue their downward trend, bringing relief to households and policymakers.',
      source: 'The Times',
      url: '#',
      publishedAt: '6 hours ago'
    },
  ]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/news');
        const data = await response.json();
        if (data.articles && data.articles.length > 0) {
          const formattedNews = data.articles.slice(0, 3).map((article: any) => ({
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

    fetchNews();
    const interval = setInterval(fetchNews, 300000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-black text-slate-900 mb-8">Market News & Updates</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((article) => (
            <Link
              key={article.id}
              href={article.url}
              target="_blank"
              className="group bg-slate-50 rounded-lg overflow-hidden border border-slate-200 hover:border-primary-600 hover:shadow-lg transition duration-300"
            >
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary-600">
                    {article.source}
                  </span>
                  <span className="text-xs text-slate-500">{article.publishedAt}</span>
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary-600 transition line-clamp-2">
                  {article.title}
                </h3>
                
                <p className="text-sm text-slate-600 line-clamp-2 group-hover:text-slate-900 transition">
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
