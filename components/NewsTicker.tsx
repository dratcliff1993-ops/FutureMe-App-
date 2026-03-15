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
        const response = await fetch('/api/news-stream');

        if (!response.ok) {
          console.error('News API returned status:', response.status);
          return;
        }

        const data = await response.json();
        console.log('Ticker fetched articles:', data?.length);

        if (Array.isArray(data) && data.length > 0) {
          const formattedNews = data.map((article: any) => {
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
              source: article.source || 'News',
              publishedAt: timeAgo,
              url: article.url
            };
          });
          setNews(formattedNews);
          console.log('Ticker updated with', formattedNews.length, 'articles');
        }
      } catch (error) {
        console.error('Failed to fetch ticker news:', error instanceof Error ? error.message : error);
      }
    };

    fetchNews();
    const interval = setInterval(fetchNews, 300000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 border-y border-cyan-500/50 overflow-hidden backdrop-blur-sm">
      <style>{`
        @keyframes newsScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: inset 0 0 10px rgba(6, 182, 212, 0.1);
          }
          50% {
            box-shadow: inset 0 0 20px rgba(6, 182, 212, 0.2);
          }
        }
        .news-scroll {
          animation: newsScroll 400s linear infinite;
        }
        .news-scroll:hover {
          animation-play-state: paused;
        }
        .ticker-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
        .live-indicator {
          width: 8px;
          height: 8px;
          background: #06b6d4;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            box-shadow: 0 0 0 0 rgba(6, 182, 212, 0.7);
          }
          50% {
            opacity: 0.8;
          }
          100% {
            opacity: 1;
            box-shadow: 0 0 0 8px rgba(6, 182, 212, 0);
          }
        }
      `}</style>

      <div className="h-16 flex items-center overflow-hidden ticker-glow px-4">
        <div className="flex items-center gap-3 mr-4">
          <div className="live-indicator"></div>
          <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest">LIVE</span>
        </div>

        <div className="news-scroll flex gap-12 whitespace-nowrap">
          {[...news, ...news, ...news, ...news, ...news, ...news, ...news, ...news, ...news, ...news].map((article, idx) => (
            <a
              key={idx}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 min-w-max hover:opacity-100 opacity-90 transition-all duration-300 group px-3 py-2 rounded-lg hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/30"
            >
              <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest group-hover:text-cyan-300 whitespace-nowrap">
                {article.source}
              </span>
              <span className="h-1 w-1 bg-cyan-400 rounded-full opacity-50 group-hover:opacity-100"></span>
              <span className="text-white text-sm group-hover:text-cyan-200 font-medium max-w-lg truncate">
                {article.title}
              </span>
              <span className="text-cyan-500/60 text-xs group-hover:text-cyan-400 whitespace-nowrap">
                {article.publishedAt}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
