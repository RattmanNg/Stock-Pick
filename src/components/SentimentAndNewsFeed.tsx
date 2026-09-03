import React, { useState } from 'react';
import { Stock, AIAnalysisResult } from '../types';
import { 
  Sparkles, 
  MessageSquare, 
  FileText, 
  TrendingUp, 
  Users, 
  ShieldAlert, 
  CheckCircle2, 
  ExternalLink,
  RefreshCw,
  Award
} from 'lucide-react';

interface SentimentAndNewsFeedProps {
  stock: Stock;
  onTrade?: (type: 'BUY' | 'SELL', stock: Stock) => void;
}

export const SentimentAndNewsFeed: React.FC<SentimentAndNewsFeedProps> = ({
  stock,
  onTrade,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'ai' | 'analysts' | 'social' | 'press'>('ai');
  const [aiReport, setAiReport] = useState<AIAnalysisResult | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Trigger Gemini AI deep analysis synthesis
  const handleGenerateAiReport = async () => {
    setIsLoadingAi(true);
    setAiError(null);
    try {
      const response = await fetch('/api/stocks/ai-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: stock.symbol,
          name: stock.name,
          currentPrice: stock.price,
          changePercent: stock.changePercent,
          rsi: stock.rsi,
          macdSignal: stock.macd.histogram >= 0 ? 'Bullish Crossover' : 'Bearish Divergence',
          maTrend: stock.price > stock.movingAverages.ema50 ? 'Above 50-day EMA' : 'Below 50-day EMA',
          sentimentScore: stock.sentiment.score,
          analystConsensus: stock.analyst.consensus,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate AI intelligence report');
      }

      const data = await response.json();
      setAiReport(data);
    } catch (err: any) {
      setAiError(err.message || 'Error generating synthesis');
    } finally {
      setIsLoadingAi(false);
    }
  };

  // Automatically trigger if not yet generated for the selected stock
  React.useEffect(() => {
    setAiReport(null);
    handleGenerateAiReport();
  }, [stock.symbol]);

  return (
    <div className="space-y-6">
      {/* Sub-tab navigation header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveSubTab('ai')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              activeSubTab === 'ai'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-xs shadow-cyan-500/20'
                : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            AI Intelligence Synthesis
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('analysts')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              activeSubTab === 'analysts'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-xs shadow-cyan-500/20'
                : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Award className="h-3.5 w-3.5 text-blue-400" />
            Wall St. Analyst Ratings ({stock.analyst.analystCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('social')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              activeSubTab === 'social'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-xs shadow-cyan-500/20'
                : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5 text-purple-400" />
            Social Media Sentiment
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('press')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              activeSubTab === 'press'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-xs shadow-cyan-500/20'
                : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FileText className="h-3.5 w-3.5 text-amber-400" />
            Press Releases & Filings ({stock.pressReleases.length})
          </button>
        </div>

        <button
          type="button"
          onClick={handleGenerateAiReport}
          disabled={isLoadingAi}
          className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 transition"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoadingAi ? 'animate-spin' : ''}`} />
          Refresh Intelligence
        </button>
      </div>

      {/* Sub-tab 1: Institutional AI Synthesis */}
      {activeSubTab === 'ai' && (
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md p-6 shadow-xl shadow-black/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-cyan-500/20 border border-cyan-500/40 px-2 py-0.5 text-[10px] font-bold text-cyan-300">
                  GEMINI 3.8 FLASH INTELLIGENCE
                </span>
                <span className="text-xs text-slate-400">Institutional Cross-Platform Synthesis</span>
              </div>
              <h2 className="mt-1 text-lg font-bold text-slate-100">
                {stock.symbol} Investment Dossier & Multi-Source Analysis
              </h2>
            </div>

            {aiReport && (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase">Algorithmic Consensus</span>
                  <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                    aiReport.signal.includes('BUY') 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}>
                    {aiReport.signal}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase">Target Price</span>
                  <span className="font-mono text-sm font-bold text-cyan-400">
                    ${aiReport.targetPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {isLoadingAi ? (
            <div className="py-16 text-center">
              <RefreshCw className="mx-auto h-8 w-8 animate-spin text-cyan-400 mb-3" />
              <p className="text-sm font-semibold text-slate-100">
                Analyzing Press Releases, Analyst Upgrades, and Social Sentiment...
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Cross-referencing technical breakout patterns with Wall Street estimates for {stock.name}.
              </p>
            </div>
          ) : aiReport ? (
            <div className="mt-6 space-y-6">
              {/* Executive Action Card */}
              <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" /> Recommended Execution Strategy
                  </span>
                  <span className="text-xs font-mono font-semibold text-cyan-400">
                    Horizon: {aiReport.timeHorizon} (Confidence: {aiReport.confidenceScore}%)
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-200 leading-relaxed font-medium">
                  {aiReport.suggestedAction}
                </p>
              </div>

              {/* Multi-Source Synthesized Summaries */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-lg border border-slate-800 p-4 bg-slate-950/60">
                  <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5 mb-2">
                    <FileText className="h-4 w-4 text-amber-400" /> Corporate Press & SEC
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {aiReport.pressReleaseSummary}
                  </p>
                </div>

                <div className="rounded-lg border border-slate-800 p-4 bg-slate-950/60">
                  <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5 mb-2">
                    <Award className="h-4 w-4 text-blue-400" /> Wall Street Consensus
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {aiReport.analystConsensusSummary}
                  </p>
                </div>

                <div className="rounded-lg border border-slate-800 p-4 bg-slate-950/60">
                  <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5 mb-2">
                    <MessageSquare className="h-4 w-4 text-purple-400" /> Social Momentum
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {aiReport.socialSentimentSummary}
                  </p>
                </div>
              </div>

              {/* Catalysts & Risks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg border border-slate-800 p-4 bg-slate-950/40">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-3">
                    <TrendingUp className="h-4 w-4" /> Primary Upside Catalysts
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {aiReport.catalysts.map((cat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                        <span>{cat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-lg border border-slate-800 p-4 bg-slate-950/40">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5 mb-3">
                    <ShieldAlert className="h-4 w-4" /> Key Downside Risks
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {aiReport.risks.map((risk, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-slate-400">
              Could not generate report. Click Refresh Intelligence above to retry.
            </div>
          )}
        </div>
      )}

      {/* Sub-tab 2: Analyst Reports */}
      {activeSubTab === 'analysts' && (
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md p-6 shadow-xl shadow-black/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-100">
                Wall Street Consensus & Price Targets
              </h2>
              <p className="text-xs text-slate-400">
                Aggregated ratings from tier-1 investment banks and research desks.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded bg-blue-500/10 border border-blue-500/30 px-2.5 py-1 text-xs font-bold text-blue-300">
                Consensus: {stock.analyst.consensus}
              </span>
              <div className="font-mono text-sm font-bold text-slate-100">
                Avg Target: ${stock.analyst.targetPrice.toFixed(2)} (
                <span className="text-emerald-400">
                  +{(((stock.analyst.targetPrice / stock.price) - 1) * 100).toFixed(1)}% Upside
                </span>
                )
              </div>
            </div>
          </div>

          {/* Breakdown bar */}
          <div className="mt-5">
            <div className="flex justify-between text-xs mb-1.5 font-medium">
              <span className="text-emerald-400 font-semibold">
                {stock.analyst.buyCount} Buy ({Math.round((stock.analyst.buyCount / stock.analyst.analystCount) * 100)}%)
              </span>
              <span className="text-slate-400">
                {stock.analyst.holdCount} Hold
              </span>
              <span className="text-rose-400">
                {stock.analyst.sellCount} Sell
              </span>
            </div>
            <div className="h-3 w-full rounded-full bg-slate-950 border border-slate-800 flex overflow-hidden">
              <div style={{ width: `${(stock.analyst.buyCount / stock.analyst.analystCount) * 100}%` }} className="bg-emerald-500" />
              <div style={{ width: `${(stock.analyst.holdCount / stock.analyst.analystCount) * 100}%` }} className="bg-amber-400" />
              <div style={{ width: `${(stock.analyst.sellCount / stock.analyst.analystCount) * 100}%` }} className="bg-rose-500" />
            </div>
          </div>

          {/* Individual Firm Updates Table */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-medium">
                <tr>
                  <th className="py-2.5 px-3">Research Firm</th>
                  <th className="py-2.5 px-3">Rating</th>
                  <th className="py-2.5 px-3">Price Target</th>
                  <th className="py-2.5 px-3">Implied Return</th>
                  <th className="py-2.5 px-3 text-right">Published</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {stock.analyst.firms.map((item, idx) => {
                  const upside = ((item.targetPrice / stock.price - 1) * 100).toFixed(1);
                  return (
                    <tr key={idx} className="hover:bg-slate-800/30 transition">
                      <td className="py-3 px-3 font-semibold text-slate-100">{item.firm}</td>
                      <td className="py-3 px-3">
                        <span className="rounded bg-slate-800 border border-slate-700 px-2 py-0.5 font-medium text-slate-200">
                          {item.rating}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-100">
                        ${item.targetPrice.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 font-mono font-semibold text-emerald-400">
                        +{upside}%
                      </td>
                      <td className="py-3 px-3 text-right text-slate-400">{item.date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-tab 3: Social Media Sentiment */}
      {activeSubTab === 'social' && (
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md p-6 shadow-xl shadow-black/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-100">
                Social Media Sentiment & Community Pulse
              </h2>
              <p className="text-xs text-slate-400">
                Aggregated sentiment from retail trading forums (Reddit r/stocks, r/wallstreetbets) and FinTwit.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">24h Mentions:</span>
              <span className="font-mono text-sm font-bold text-cyan-400">
                {stock.sentiment.mentions24h.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-center">
              <span className="text-xs font-semibold text-emerald-300">Bullish Sentiment</span>
              <p className="font-mono text-2xl font-bold text-emerald-400 mt-1">
                {stock.sentiment.bullishPercent}%
              </p>
              <span className="text-[10px] text-slate-400">Retail buying bias</span>
            </div>

            <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-4 text-center">
              <span className="text-xs font-semibold text-rose-300">Bearish Sentiment</span>
              <p className="font-mono text-2xl font-bold text-rose-400 mt-1">
                {stock.sentiment.bearishPercent}%
              </p>
              <span className="text-[10px] text-slate-400">Short interest discussions</span>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-center">
              <span className="text-xs font-semibold text-slate-300">Neutral Sentiment</span>
              <p className="font-mono text-2xl font-bold text-slate-200 mt-1">
                {stock.sentiment.neutralPercent}%
              </p>
              <span className="text-[10px] text-slate-400">Holding & macro observation</span>
            </div>
          </div>

          {/* Trending Themes */}
          <div className="mt-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Trending Social Discourse Topics
            </h4>
            <div className="flex flex-wrap gap-2">
              {stock.sentiment.topThemes.map((theme, idx) => (
                <span
                  key={idx}
                  className="rounded-lg border border-purple-500/30 bg-purple-950/30 px-3 py-1 font-mono text-xs font-medium text-purple-300"
                >
                  #{theme}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab 4: Press Releases */}
      {activeSubTab === 'press' && (
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md p-6 shadow-xl shadow-black/40">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-base font-bold text-slate-100">
              Verified Press Releases & Regulatory SEC Filings
            </h2>
            <p className="text-xs text-slate-400">
              Direct corporate communications, 8-K filings, and commercial partnership disclosures.
            </p>
          </div>

          <div className="mt-4 divide-y divide-slate-800">
            {stock.pressReleases.map((pr) => (
              <div key={pr.id} className="py-4 first:pt-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded border border-amber-500/30 bg-amber-950/30 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                      {pr.category}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{pr.source}</span>
                  </div>
                  <span className="text-xs text-slate-400">{pr.time}</span>
                </div>
                <h3 className="mt-1.5 text-sm font-semibold text-slate-100 hover:text-cyan-400 transition cursor-pointer">
                  {pr.title}
                </h3>
                <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                  {pr.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
