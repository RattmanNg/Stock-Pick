import React from 'react';
import { Stock, SignalType } from '../types';
import { 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  CheckCircle, 
  Target, 
  ShieldCheck, 
  BarChart, 
  ArrowUpRight, 
  ArrowDownRight,
  HelpCircle
} from 'lucide-react';

interface TechnicalAnalysisPanelProps {
  stock: Stock;
  onTrade?: (type: 'BUY' | 'SELL', stock: Stock) => void;
  onSetAlert?: (stock: Stock) => void;
}

export const TechnicalAnalysisPanel: React.FC<TechnicalAnalysisPanelProps> = ({
  stock,
  onTrade,
  onSetAlert,
}) => {
  // Score computation from indicators (0-100)
  const technicalScore = React.useMemo(() => {
    let score = 50;
    // RSI
    if (stock.rsi < 30) score += 20; // oversold = buy
    else if (stock.rsi < 45) score += 10;
    else if (stock.rsi > 70) score -= 20; // overbought = sell
    else if (stock.rsi > 60) score += 5;

    // MACD
    if (stock.macd.histogram > 0) score += 15;
    else score -= 15;

    // Moving Averages
    if (stock.price > stock.movingAverages.ema20) score += 10;
    else score -= 10;
    if (stock.price > stock.movingAverages.ema50) score += 10;
    else score -= 10;
    if (stock.price > stock.movingAverages.sma200) score += 10;

    return Math.max(10, Math.min(95, score));
  }, [stock]);

  const getSignalBadgeColor = (signal: SignalType) => {
    switch (signal) {
      case 'STRONG BUY':
        return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-xs shadow-emerald-500/30';
      case 'BUY':
        return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30';
      case 'NEUTRAL':
        return 'bg-slate-800 text-slate-300 border border-slate-700';
      case 'SELL':
        return 'bg-rose-500/15 text-rose-400 border border-rose-500/30';
      case 'STRONG SELL':
        return 'bg-rose-500/25 text-rose-300 border border-rose-500/50 shadow-xs shadow-rose-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Primary Signal & Action Banner */}
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md p-6 shadow-xl shadow-black/40">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Algorithmic Trade Signal
              </span>
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            </div>
            <div className="mt-2 flex items-center gap-3">
              <span className={`rounded-lg px-3 py-1 font-mono text-sm font-bold shadow-xs ${getSignalBadgeColor(stock.technicalSignal)}`}>
                {stock.technicalSignal}
              </span>
              <h2 className="text-xl font-bold tracking-tight text-slate-100">
                {stock.symbol} Investment Signal
              </h2>
            </div>
            <p className="mt-2 max-w-2xl text-xs sm:text-sm text-slate-300 leading-relaxed">
              {stock.signalReason}
            </p>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {onTrade && (
              <>
                <button
                  type="button"
                  onClick={() => onTrade('BUY', stock)}
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-md shadow-emerald-500/20 hover:bg-emerald-400 active:scale-95 transition"
                >
                  <ArrowUpRight className="h-4 w-4" />
                  Execute Buy Order
                </button>
                <button
                  type="button"
                  onClick={() => onTrade('SELL', stock)}
                  className="flex items-center gap-1.5 rounded-lg bg-rose-500 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-rose-500/20 hover:bg-rose-400 active:scale-95 transition"
                >
                  <ArrowDownRight className="h-4 w-4" />
                  Execute Sell Order
                </button>
              </>
            )}
            {onSetAlert && (
              <button
                type="button"
                onClick={() => onSetAlert(stock)}
                className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700/80 transition"
              >
                Set Price Alert
              </button>
            )}
          </div>
        </div>

        {/* Technical Score Gauge Bar */}
        <div className="mt-6 border-t border-slate-800 pt-5">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="text-slate-400">Technical Strength Index</span>
            <span className="font-mono text-cyan-400 font-bold">
              {technicalScore} / 100 ({technicalScore >= 60 ? 'Bullish Dominance' : technicalScore <= 40 ? 'Bearish Pressure' : 'Neutral Range'})
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-slate-950 overflow-hidden flex border border-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-rose-500 via-amber-500 to-cyan-400 rounded-full transition-all duration-500" 
              style={{ width: `${technicalScore}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
            <span>Strong Sell (0)</span>
            <span>Neutral (50)</span>
            <span>Strong Buy (100)</span>
          </div>
        </div>
      </div>

      {/* Grid: Oscillators, Moving Averages, Pivot Levels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Key Oscillators */}
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md p-5 shadow-xl shadow-black/40">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100 flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-cyan-400" /> Momentum Oscillators
            </h3>
            <span className="text-[10px] rounded bg-cyan-500/10 border border-cyan-500/30 px-1.5 py-0.5 font-medium text-cyan-300">
              Active
            </span>
          </div>

          <div className="mt-4 space-y-4 text-xs">
            {/* RSI */}
            <div>
              <div className="flex justify-between font-mono">
                <span className="text-slate-400">RSI (14 Period):</span>
                <strong className={stock.rsi > 70 ? 'text-rose-400' : stock.rsi < 35 ? 'text-emerald-400' : 'text-slate-100'}>
                  {stock.rsi.toFixed(1)}
                </strong>
              </div>
              <div className="mt-1 h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800/60">
                <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${stock.rsi}%` }} />
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                {stock.rsi > 70 ? 'Overbought warning' : stock.rsi < 35 ? 'Oversold accumulation opportunity' : 'Equilibrium zone (30-70)'}
              </span>
            </div>

            {/* MACD */}
            <div className="pt-2 border-t border-slate-800/80 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">MACD Line:</span>
                <strong className="text-slate-100">{stock.macd.macdLine.toFixed(2)}</strong>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-slate-400">Signal Line:</span>
                <span className="text-slate-300">{stock.macd.signalLine.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-slate-400">Histogram:</span>
                <strong className={stock.macd.histogram >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                  {stock.macd.histogram >= 0 ? '+' : ''}{stock.macd.histogram.toFixed(2)}
                </strong>
              </div>
            </div>

            {/* Bollinger Bands */}
            <div className="pt-2 border-t border-slate-800/80 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">BB Upper Band:</span>
                <span className="text-slate-300">${stock.bollingerBands.upper.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-slate-400">BB Lower Band:</span>
                <span className="text-slate-300">${stock.bollingerBands.lower.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Moving Averages Matrix */}
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md p-5 shadow-xl shadow-black/40">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100 flex items-center gap-1.5">
              <BarChart className="h-4 w-4 text-cyan-400" /> Moving Averages Trend
            </h3>
            <span className="text-[10px] rounded bg-indigo-500/10 border border-indigo-500/30 px-1.5 py-0.5 font-medium text-indigo-300">
              Trend Matrix
            </span>
          </div>

          <div className="mt-4 space-y-3 text-xs font-mono">
            {/* EMA 20 */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <div>
                <span className="font-semibold text-slate-100">20-Day EMA</span>
                <p className="text-[10px] text-slate-400 font-sans">Short-Term Trend</p>
              </div>
              <div className="text-right">
                <span className="font-bold text-cyan-400">${stock.movingAverages.ema20.toFixed(2)}</span>
                <div className={`text-[10px] ${stock.price >= stock.movingAverages.ema20 ? 'text-emerald-400 font-bold' : 'text-rose-400'}`}>
                  {stock.price >= stock.movingAverages.ema20 ? 'Price Above (Bullish)' : 'Price Below (Bearish)'}
                </div>
              </div>
            </div>

            {/* EMA 50 */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <div>
                <span className="font-semibold text-slate-100">50-Day EMA</span>
                <p className="text-[10px] text-slate-400 font-sans">Medium-Term Trend</p>
              </div>
              <div className="text-right">
                <span className="font-bold text-purple-400">${stock.movingAverages.ema50.toFixed(2)}</span>
                <div className={`text-[10px] ${stock.price >= stock.movingAverages.ema50 ? 'text-emerald-400 font-bold' : 'text-rose-400'}`}>
                  {stock.price >= stock.movingAverages.ema50 ? 'Price Above (Bullish)' : 'Price Below (Bearish)'}
                </div>
              </div>
            </div>

            {/* SMA 200 */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <div>
                <span className="font-semibold text-slate-100">200-Day SMA</span>
                <p className="text-[10px] text-slate-400 font-sans">Macro Baseline</p>
              </div>
              <div className="text-right">
                <span className="font-bold text-amber-400">${stock.movingAverages.sma200.toFixed(2)}</span>
                <div className={`text-[10px] ${stock.price >= stock.movingAverages.sma200 ? 'text-emerald-400 font-bold' : 'text-rose-400'}`}>
                  {stock.price >= stock.movingAverages.sma200 ? 'Golden Bull Regime' : 'Below 200 SMA'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Support, Resistance & Targets */}
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md p-5 shadow-xl shadow-black/40">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100 flex items-center gap-1.5">
              <Target className="h-4 w-4 text-cyan-400" /> Price Targets & Levels
            </h3>
            <span className="text-[10px] rounded bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 font-medium text-emerald-300">
              Calculated
            </span>
          </div>

          <div className="mt-4 space-y-2.5 text-xs font-mono">
            <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Resistance 2 (R2):</span>
              <strong className="text-rose-400">${(stock.resistanceLevel * 1.05).toFixed(2)}</strong>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Resistance 1 (R1):</span>
              <strong className="text-rose-400">${stock.resistanceLevel.toFixed(2)}</strong>
            </div>
            <div className="flex justify-between items-center py-1 bg-slate-950/60 border border-slate-800/80 px-2 rounded">
              <span className="font-semibold text-slate-300">Current Market:</span>
              <strong className="text-slate-100">${stock.price.toFixed(2)}</strong>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Support 1 (S1):</span>
              <strong className="text-emerald-400">${stock.supportLevel.toFixed(2)}</strong>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-400">Support 2 (S2):</span>
              <strong className="text-emerald-400">${(stock.supportLevel * 0.95).toFixed(2)}</strong>
            </div>

            <div className="mt-3 rounded-lg border border-cyan-500/30 bg-cyan-950/20 p-2.5 font-sans text-[11px] text-slate-300">
              <strong className="font-semibold text-cyan-300 block mb-0.5">
                Suggested Stop & Target
              </strong>
              Stop Loss: ${(stock.supportLevel * 0.97).toFixed(2)} (-{((1 - (stock.supportLevel * 0.97) / stock.price) * 100).toFixed(1)}%) | 
              Take Profit: ${(stock.resistanceLevel * 1.08).toFixed(2)} (+{(((stock.resistanceLevel * 1.08) / stock.price - 1) * 100).toFixed(1)}%)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
