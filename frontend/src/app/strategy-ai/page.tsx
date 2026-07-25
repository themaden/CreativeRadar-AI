'use client';

import React, { useState } from 'react';
import { Bot, Send, Sparkles, Lightbulb, FileSpreadsheet, Layers, ShieldCheck, Download } from 'lucide-react';
import { triggerStrategyCopilot } from '@/lib/api';
import { StrategyCopilotResponse } from '@/lib/types';

export default function StrategyAIPage() {
  const [prompt, setPrompt] = useState('');
  const [targetBrand, setTargetBrand] = useState('Royal Match');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<StrategyCopilotResponse | null>(null);

  const presetPrompts = [
    "Royal Match için 3 yeni yüksek dönüşümlü reklam fikri üret.",
    "Son 3 ayın en popüler puzzle hook'ları neler?",
    "Boiling lava ve King Robert temalı creative brief hazırla."
  ];

  const handleGenerate = async (queryText?: string) => {
    const q = queryText || prompt;
    if (!q.trim()) return;
    setLoading(true);

    try {
      const res = await triggerStrategyCopilot(q, targetBrand);
      setResponse(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Page Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
          <Bot className="w-3.5 h-3.5" />
          <span>RAG-Powered Executive Strategy Engine</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">AI Strategy Copilot & Brief Generator</h1>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto">
          Query thousands of competitor creatives with RAG context to instantly generate CEO/CMO level ad briefs and creative scripts.
        </p>
      </div>

      {/* Query Bar */}
      <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4 shadow-2xl">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              placeholder="e.g. 'Royal Match için 3 yeni reklam fikri üret'..."
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-4 pr-12 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
            <button
              onClick={() => handleGenerate()}
              disabled={loading}
              className="absolute right-2 top-2 bottom-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
            >
              {loading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>

          <select
            value={targetBrand}
            onChange={(e) => setTargetBrand(e.target.value)}
            className="bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-3 text-xs text-white font-semibold focus:outline-none focus:border-amber-500"
          >
            <option value="Royal Match">Target: Royal Match</option>
            <option value="Gardenscapes">Target: Gardenscapes</option>
            <option value="Toon Blast">Target: Toon Blast</option>
          </select>
        </div>

        {/* Preset Prompt Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mr-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Presets:
          </span>
          {presetPrompts.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => { setPrompt(preset); handleGenerate(preset); }}
              className="px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs text-slate-300 border border-white/5 transition-all hover:border-amber-500/30"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Copilot Response Output */}
      {loading ? (
        <div className="glass-panel p-12 rounded-2xl border border-white/10 text-center space-y-3">
          <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <h3 className="text-base font-bold text-white">Running Qdrant Vector RAG Retrieval...</h3>
          <p className="text-xs text-slate-400">Synthesizing top competitor ad benchmarks & color pairing heuristics</p>
        </div>
      ) : response ? (
        <div className="space-y-6">
          
          {/* Executive Strategic Brief Document Card */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/30 bg-gradient-to-b from-slate-900 to-slate-950 space-y-6 shadow-2xl relative">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">AI Creative Brief & Strategic Document</h3>
                  <p className="text-xs text-slate-400">Generated from {response.retrieved_ad_ids.length} retrieved competitor benchmarks</p>
                </div>
              </div>

              <button 
                onClick={() => alert("Creative Brief exported as PDF / Markdown")}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 border border-white/10 transition-colors"
              >
                <Download className="w-4 h-4 text-amber-400" /> Export Brief
              </button>
            </div>

            {/* Strategic Report Text */}
            <div className="prose prose-invert max-w-none text-xs leading-relaxed space-y-4 text-slate-200">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5 font-mono text-slate-300 whitespace-pre-line">
                {response.strategic_report}
              </div>
            </div>

            {/* Recommended Creative Concepts */}
            <div className="space-y-4 pt-2">
              <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Recommended High-Conversion Concepts
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {response.recommended_concepts.map((concept, cIdx) => (
                  <div key={cIdx} className="p-5 rounded-2xl bg-slate-900/90 border border-white/10 space-y-3 hover:border-amber-500/40 transition-colors">
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-bold text-white">{concept.title}</h5>
                      <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                        {concept.target_hook}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Scene Script:</span>
                      <p className="text-xs text-slate-300 whitespace-pre-line font-mono bg-black/40 p-2.5 rounded-lg border border-white/5">
                        {concept.scene_script}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-2 border-t border-white/5">
                      <span className="text-slate-400 font-semibold">Recommended Palette:</span>
                      <div className="flex gap-1.5">
                        {concept.color_palette.map((hex, hIdx) => (
                          <div key={hIdx} className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: hex }} />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      ) : (
        <div className="glass-panel p-12 rounded-2xl border border-white/5 text-center space-y-2">
          <Bot className="w-10 h-10 text-amber-400 mx-auto opacity-80" />
          <h3 className="text-sm font-bold text-white">Ask AI Strategy Copilot Anything</h3>
          <p className="text-xs text-slate-400">Select a preset above or type your strategic question to synthesize competitor intelligence.</p>
        </div>
      )}

    </div>
  );
}
