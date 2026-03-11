'use client';

import React, { useState, useEffect } from 'react';

interface NewsArticle {
  id: string;
  title: string;
  source: string;
  publishedAt: string;
  url: string;
}

export default function NewsTicker() {
  const [news, setNews] = useState<NewsArticle[]>([
    {
      id: '1',
      title: 'Bank of England Holds Interest Rates at 5.25%',
      source: 'BBC News',
      publishedAt: '2h ago',
      url: '#'
    },
    {
      id: '2',
      title: 'FTSE 100 Rises on Banking Sector Gains',
      source: 'Financial Times',
      publishedAt: '4h ago',
      url: '#'
    },
    {
      id: '3',
      title: 'Inflation Falls to 3.9% in Latest Data',
      source: 'The Times',
      publishedAt: '6h ago',
      url: '#'
    }
  ]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/news');
        const data = await response.json();
        if (data.articles && data.articles.length > 0) {
          const formattedNews = data.articles.map((article: any) => {
            const date = new Date(article.publishedAt);
            const now = new Date();
            const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
            let timeAgo = 'just now';
            if (seconds < 3600) timeAgo = `${Math.floor(seconds / 60)}m ago`;
            else if (seconds < 86400) timeAgo = `${Math.floor(seconds / 3600)}h ago`;
            else timeAgo = `${Math.floor(seconds / 86400)}d ago`;

            return {
              id: article.id || article.title,
              title: article.title,
              source: article.source,
              publishedAt: timeAgo,
              url: article.url
            };
          });
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
    <div className="w-full bg-black border-b border-blue-600 overflow-hidden">
      <style>{`
        @keyframes newsScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .news-scroll {
          animation: newsScroll 400s linear infinite;
        }
        .news-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="h-12 flex items-center overflow-hidden">
        <div className="news-scroll flex gap-8 whitespace-nowrap">
          {[...news, ...news, ...news, ...news, ...news, ...news, ...news, ...news, ...news, ...news].map((article, idx) => (
            <a
              key={idx}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 min-w-max hover:opacity-80 transition-opacity group"
            >
              <span className="text-white text-xs font-bold uppercase tracking-wider group-hover:text-blue-400">
                {article.source}
              </span>
              <span className="text-white text-sm group-hover:text-blue-300 font-medium max-w-md truncate">
                {article.title}
              </span>
              <span className="text-white/50 text-xs">
                {article.publishedAt}
              </span>
              <span className="text-white/30 text-xs mx-2">•</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
