'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Play, 
  Pause, 
  ArrowLeft, 
  Flame, 
  Palette, 
  FileText, 
  ScanText, 
  Check, 
  Copy, 
  Sparkles, 
  Clock,
  Award
} from 'lucide-react';
import { fetchAdById } from '@/lib/api';
import { Ad } from '@/lib/types';

export default function AdDetailPage() {
  const params = useParams();
  const adId = params.id as string;

  const [ad, setAd] = useState<Ad | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    async function loadDetail() {
      const data = await fetchAdById(adId);
      setAd(data);
    }
    if (adId) loadDetail();
  }, [adId]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  if (!ad) {
    return (
      <div className="py-20 text-center text-slate-400">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-semibold">Loading Multimodal AI Breakdown...</p>
      </div>
    );
  }

  const analysis = ad.analysis;

  return (
    <div className="space-y-6">
      
      {/* Top Back Navigation & Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="space-y-1">
          <Link href="/ad-search" className="text-xs font-bold text-slate-400 hover:text-amber-400 flex items-center gap-1 mb-1">
            <ArrowLeft className="w-4 h-4" /> Back to Ad Library
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-white">{ad.brand.name} Creative Analysis</h1>
            <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-bold">
              {analysis?.hook_type || "Peril Challenge"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="px-3 py-1 rounded-xl bg-slate-900 border border-white/10 text-amber-400 font-bold">
            Hook Score: {analysis?.hook_score || 9.4} / 10
          </span>
          <span className="px-3 py-1 rounded-xl bg-slate-900 border border-white/10">
            {(ad.estimated_impressions / 1000000).toFixed(1)}M Impressions
          </span>
        </div>
      </div>

      {/* Main Grid: Video Player on Left, Timeline Breakdown on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Column: Video Player & Hex Color Palette (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative">
            <div className="relative aspect-[9/16] bg-black max-h-[580px] mx-auto overflow-hidden">
              <video
                ref={videoRef}
                src={ad.video_url}
                poster={ad.thumbnail_url}
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
                className="w-full h-full object-contain cursor-pointer"
                onClick={togglePlay}
              />
              
              {/* Play Overlay Button */}
              {!isPlaying && (
                <div 
                  onClick={togglePlay}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm cursor-pointer group"
                >
                  <div className="p-5 rounded-full bg-amber-500 text-slate-950 shadow-2xl group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 fill-slate-950 ml-1" />
                  </div>
                </div>
              )}
            </div>

            {/* Custom Control Strip */}
            <div className="p-4 bg-slate-900/90 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
              <button onClick={togglePlay} className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold">
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              </button>

              <div className="flex items-center gap-2 font-mono text-xs">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{currentTime.toFixed(1)}s / {ad.duration_seconds}s</span>
              </div>
            </div>
          </div>

          {/* Color Palette Panel */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Palette className="w-4 h-4 text-amber-400" />
              Extracted HSL & HEX Palette
            </h3>
            
            <div className="grid grid-cols-2 gap-2">
              {analysis?.dominant_colors?.map((color, idx) => (
                <button
                  key={idx}
                  onClick={() => copyToClipboard(color.hex)}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/5 transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md border border-white/20" style={{ backgroundColor: color.hex }} />
                    <span className="text-xs font-mono text-slate-200">{color.hex}</span>
                  </div>
                  {copiedHex === color.hex ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Timeline Breakdown, Transcript & OCR (7 cols) */}
        <div className="lg:col-span-7 space-y-6">

          {/* Executive Strategic Summary Box */}
          <div className="glass-panel p-5 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Gemini 1.5 Pro Multimodal Synthesis</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              {analysis?.strategic_summary || "Peril rescue narrative leveraging high stakes visual urgency."}
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-400">
              <span className="font-semibold text-slate-300">CTA Button Text:</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-bold border border-amber-500/20">
                "{analysis?.cta_text || "Download Free Today"}"
              </span>
            </div>
          </div>

          {/* Synchronized Storyboard Breakdown */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              Synchronized Storyboard Timeline
            </h3>

            <div className="space-y-3 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
              {analysis?.storyboard_breakdown?.map((scene, sIdx) => (
                <div 
                  key={sIdx}
                  className="relative pl-8 p-3.5 rounded-xl bg-slate-900/80 border border-white/5 space-y-1.5 hover:border-amber-500/40 transition-colors"
                >
                  <div className="absolute left-2 top-4 w-3 h-3 rounded-full bg-amber-500 border-2 border-slate-950 shadow-md" />
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-400 font-mono">{scene.timestamp}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">{scene.phase}</span>
                  </div>

                  <p className="text-xs text-slate-200 font-medium">{scene.description}</p>
                  
                  <p className="text-[11px] text-slate-400 italic">
                    <span className="font-semibold text-slate-300">Pacing:</span> {scene.pacing_note}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Transcript & OCR Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Faster-Whisper Transcript */}
            <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-3">
              <h4 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                <FileText className="w-4 h-4 text-blue-400" />
                Whisper Audio Transcript
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {analysis?.transcript?.map((t, idx) => (
                  <div key={idx} className="text-xs bg-slate-900/60 p-2 rounded-lg border border-white/5">
                    <span className="text-[10px] font-mono text-blue-400 font-bold block">{t.start}s - {t.end}s</span>
                    <p className="text-slate-300">"{t.text}"</p>
                  </div>
                ))}
              </div>
            </div>

            {/* OCR Visual Text Overlay */}
            <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-3">
              <h4 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                <ScanText className="w-4 h-4 text-emerald-400" />
                OCR Screen Text Overlay
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {analysis?.ocr_texts?.map((ocr, idx) => (
                  <div key={idx} className="text-xs bg-slate-900/60 p-2 rounded-lg border border-white/5">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold block">@{ocr.timestamp}s</span>
                    <p className="text-white font-bold">{ocr.text}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
