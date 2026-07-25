'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, Play, Sparkles, Layers, Eye, Sparkle } from 'lucide-react';
import { fetchAds } from '@/lib/api';
import { Ad } from '@/lib/types';

export default function AdSearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAds() {
      setLoading(true);
      const brandFilter = selectedBrand === 'All' ? undefined : selectedBrand;
      const data = await fetchAds(brandFilter);
      setAds(data);
      setLoading(false);
    }
    loadAds();
  }, [selectedBrand]);

  const filteredAds = ads.filter(ad => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const summary = ad.analysis?.strategic_summary?.toLowerCase() || '';
    const hook = ad.analysis?.hook_type?.toLowerCase() || '';
    const brand = ad.brand.name.toLowerCase();
    return summary.includes(query) || hook.includes(query) || brand.includes(query);
  });

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Qdrant Hybrid Vector Search Engine</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Semantic Competitor Ad Library</h1>
        <p className="text-sm text-slate-400">
          Search thousands of competitor creatives using natural language visual intent, hook mechanics, or specific color themes.
        </p>
      </div>

      {/* Search Bar & Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-4 shadow-xl">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search e.g. 'King Robert in boiling lava', 'Pink cube disco combo', 'Freezing castle makeover'..."
            className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors shadow-inner"
          />
          <Search className="w-5 h-5 text-amber-400 absolute left-4 top-3.5" />
        </div>

        {/* Brand Filter Chips */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" /> Filter Brand:
            </span>
            {['All', 'Royal Match', 'Gardenscapes', 'Toon Blast', 'Match Factory'].map((brand) => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedBrand === brand
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/5 hover:bg-slate-800'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>

          <span className="text-xs font-semibold text-slate-400">
            Showing <strong className="text-amber-400">{filteredAds.length}</strong> matching creatives
          </span>
        </div>
      </div>

      {/* Ads Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold">Running Qdrant Dense Vector Search...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAds.map((ad) => (
            <Link
              key={ad.id}
              href={`/ads/${ad.id}`}
              className="glass-panel rounded-2xl overflow-hidden border border-white/10 group hover:border-amber-500/50 transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-video bg-slate-900 overflow-hidden">
                <img
                  src={ad.thumbnail_url || "https://images.unsplash.com/photo-1563089145-599997674d42?w=600"}
                  alt={ad.brand.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-slate-900/90 backdrop-blur-md text-[10px] font-bold text-amber-400 border border-amber-500/30">
                    {ad.brand.name}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-slate-900/90 backdrop-blur-md text-[10px] font-bold text-slate-300 border border-white/10">
                    {ad.platform}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-xs font-semibold text-white px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm">
                    {ad.duration_seconds}s
                  </span>
                  <div className="p-2.5 rounded-full bg-amber-500 text-slate-950 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                    <Play className="w-4 h-4 fill-slate-950" />
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20">
                    {ad.analysis?.hook_type || "Failed Gameplay"}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    {(ad.estimated_impressions / 1000000).toFixed(1)}M
                  </span>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {ad.analysis?.strategic_summary || "High converting peril rescue creative."}
                </p>

                {/* Color Palette Strip */}
                {ad.analysis?.dominant_colors && (
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Dominant HSL:</span>
                    <div className="flex items-center gap-1.5">
                      {ad.analysis.dominant_colors.map((color, cIdx) => (
                        <div
                          key={cIdx}
                          className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                          style={{ backgroundColor: color.hex }}
                          title={`${color.name} (${color.hex})`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

    </div>
  );
}
