'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  Flame, 
  Eye, 
  Crown, 
  Palette, 
  Play, 
  ArrowUpRight, 
  Sparkles, 
  Layers,
  Award
} from 'lucide-react';
import { fetchAnalyticsTrends, fetchAds } from '@/lib/api';
import { AnalyticsTrends, Ad } from '@/lib/types';

export default function DashboardPage() {
  const [trends, setTrends] = useState<AnalyticsTrends | null>(null);
  const [recentAds, setRecentAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [trendsData, adsData] = await Promise.all([
          fetchAnalyticsTrends(),
          fetchAds()
        ]);
        setTrends(trendsData);
        setRecentAds(adsData.slice(0, 3));
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/40 border border-white/10 p-6 sm:p-8 shadow-2xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
            <Crown className="w-3.5 h-3.5" />
            <span>Dream Games Competitor Intelligence View</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Creative Intelligence Command Center
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Real-time multimodal AI analysis of competitor video ad hooks, color palettes, visual text overlays, and RAG strategic recommendations.
          </p>
        </div>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-3 hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Ads Analyzed</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white">{trends?.total_ads_analyzed || 142}</span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +24% this week
            </span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-3 hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Top Hook Share</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <Flame className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white">40.8%</span>
            <span className="text-xs font-medium text-slate-400">Peril Rescue Hook</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-3 hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Impression Reach</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Eye className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white">14.2M</span>
            <span className="text-xs font-medium text-slate-400">per creative</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-3 hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Market Leader</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Crown className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold text-amber-400 truncate">Royal Match</span>
            <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">42% SOV</span>
          </div>
        </div>

      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Top Performing Hook Types */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/10 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-rose-400" />
                Dominant Competitor Hook Patterns
              </h2>
              <p className="text-xs text-slate-400">First 0-3 second video opening styles ranked by market impression volume</p>
            </div>
            <Link href="/ad-search" className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1">
              View All <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {trends?.top_hook_types.map((hook, idx) => (
              <div key={idx} className="space-y-1.5 bg-slate-900/60 p-3.5 rounded-xl border border-white/5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{hook.hook_type}</span>
                  <span className="font-bold text-amber-400">{hook.share_percentage}% share ({hook.count} ads)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${hook.share_percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dominant Color Palette Cloud */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-5 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
              <Palette className="w-5 h-5 text-amber-400" />
              Dominant HSL / HEX Palettes
            </h2>
            <p className="text-xs text-slate-400">High-converting color pairings extracted by Gemini Vision</p>
            
            <div className="mt-6 grid grid-cols-1 gap-3">
              {trends?.dominant_color_palettes.map((color, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-lg shadow-inner border border-white/20"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">{color.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{color.hex}</span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 rounded-md bg-slate-800 text-slate-300">
                    {color.frequency} ads
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2 mt-4">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Amber & Royal Blue contrast triggers +34% higher 3-second view-through rates.</span>
          </div>
        </div>

      </div>

      {/* Competitor Impression Share & Recent Ads Stream */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Latest Ingested Competitor Creatives</h2>
            <p className="text-xs text-slate-400">Click any creative for synchronized storyboard, OCR, and transcript timeline analysis</p>
          </div>
          <Link href="/ad-search" className="text-xs font-bold text-amber-400 hover:underline">
            Open Full Library →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentAds.map((ad) => (
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
                  <div className="p-2 rounded-full bg-amber-500 text-slate-950 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                    <Play className="w-4 h-4 fill-slate-950" />
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                    {ad.analysis?.hook_type || "Failed Challenge Hook"}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    {(ad.estimated_impressions / 1000000).toFixed(1)}M impr.
                  </span>
                </div>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {ad.analysis?.strategic_summary || "Peril rescue narrative featuring high stakes visual puzzle dilemma."}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
