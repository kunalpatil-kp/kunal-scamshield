import React, { useState } from 'react';
import {
  Newspaper,
  Search,
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  Filter,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FRAUD_NEWS_ARTICLES } from '../../data/mockData';
import { NewsArticle, ScamCategory } from '../../types';

export const FraudNewsCenter: React.FC = () => {
  const { openNews, openSimulation, playSound } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    'all',
    'UPI Fraud',
    'Investment Fraud',
    'Deepfake & Voice',
    'Refund Scam',
    'QR Code Scam',
    'KYC Scam',
    'OTP Fraud'
  ];

  const filteredNews = FRAUD_NEWS_ARTICLES.filter((article) => {
    const matchesSearch =
      article.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' ||
      article.category.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
            <Newspaper className="w-3.5 h-3.5 text-blue-600" />
            <span>Cybercrime Threat Bulletins</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Fraud News & Case Studies Center
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm max-w-xl">
            Real incident investigations curated from national cybercrime desks and RBI advisories. Turn real victim ordeals into preventative immunity.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-red-50 border border-red-100 max-w-xs self-start md:self-auto space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-red-900">
            <ShieldAlert className="w-4 h-4 text-red-600" />
            <span>Pan-India Alert Active</span>
          </div>
          <p className="text-[11px] text-red-800 leading-snug">
            Surge in "Digital Arrest" video calls targeting pensioners across Tier 1 & 2 cities.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search city, scam syndicate, amount lost..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl capitalize shrink-0 transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat === 'all' ? 'All Alerts' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* News Articles Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredNews.map((article) => (
          <div
            key={article.id}
            className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-red-50 text-red-700 border border-red-100">
                  {article.riskLevel} ALERT
                </span>
                <span className="text-xs font-bold text-blue-600">{article.category}</span>
              </div>

              <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                {article.headline}
              </h3>

              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {article.location}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {article.date}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                {article.summary}
              </p>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Reported Fraud Amount:</span>
                <span className="font-extrabold text-red-600">{article.estimatedLoss}</span>
              </div>
            </div>

            <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">{article.readTime}</span>
              <button
                onClick={() => openNews(article)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
              >
                <span>Read Full Case Study</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
