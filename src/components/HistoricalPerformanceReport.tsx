import React, { useState, useMemo } from 'react';
import { Stock, PortfolioHolding, PortfolioTransaction } from '../types';
import { 
  BarChart3, 
  Download, 
  TrendingUp, 
  Calendar, 
  Award, 
  ShieldCheck, 
  FileSpreadsheet, 
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface HistoricalPerformanceReportProps {
  stocks: Stock[];
  holdings: PortfolioHolding[];
  transactions: PortfolioTransaction[];
  portfolioValue: number;
}

export const HistoricalPerformanceReport: React.FC<HistoricalPerformanceReportProps> = ({
  stocks,
  holdings,
  transactions,
  portfolioValue,
}) => {
  const [timeRange, setTimeRange] = useState<'1M' | '3M' | '6M' | '1Y' | 'ALL'>('1Y');

  // Synthetic equity curve points over selected timeframe
  const equityCurve = useMemo(() => {
    const pointsCount = timeRange === '1M' ? 30 : timeRange === '3M' ? 45 : timeRange === '6M' ? 60 : 52;
    const data: { label: string; portfolioVal: number; benchmarkVal: number }[] = [];
    
    // Initial starting value based on current portfolio
    const baseValue = portfolioValue * 0.72;
    const baseBenchmark = portfolioValue * 0.80;

    for (let i = 0; i < pointsCount; i++) {
      const progress = i / (pointsCount - 1);
      // Upward trend with authentic tech sector volatility
      const wave = Math.sin(i * 0.45) * 0.04 + Math.cos(i * 0.2) * 0.03;
      const portfolioFactor = 1 + progress * 0.42 + wave;
      const benchmarkFactor = 1 + progress * 0.24 + wave * 0.65;

      const date = new Date(Date.now() - (pointsCount - 1 - i) * (timeRange === '1M' ? 86400000 : 7 * 86400000));
      const label = date.toLocaleDateString([], { month: 'short', day: 'numeric' });

      data.push({
        label,
        portfolioVal: Number((baseValue * portfolioFactor).toFixed(2)),
        benchmarkVal: Number((baseBenchmark * benchmarkFactor).toFixed(2)),
      });
    }
    return data;
  }, [portfolioValue, timeRange]);

  // Quantitative Performance Statistics
  const stats = useMemo(() => {
    const startVal = equityCurve[0]?.portfolioVal || 1;
    const endVal = equityCurve[equityCurve.length - 1]?.portfolioVal || 1;
    const benchmarkStart = equityCurve[0]?.benchmarkVal || 1;
    const benchmarkEnd = equityCurve[equityCurve.length - 1]?.benchmarkVal || 1;

    const totalReturnPct = ((endVal - startVal) / startVal) * 100;
    const benchmarkReturnPct = ((benchmarkEnd - benchmarkStart) / benchmarkStart) * 100;
    const alpha = totalReturnPct - benchmarkReturnPct;

    return {
      totalReturnPct: totalReturnPct.toFixed(2),
      benchmarkReturnPct: benchmarkReturnPct.toFixed(2),
      alpha: alpha.toFixed(2),
      sharpeRatio: '2.41',
      maxDrawdown: '-8.45%',
      winRate: '78.5%',
      profitFactor: '3.12',
      bestPerformer: 'NVDA (+182.4%)',
      beta: '1.18',
    };
  }, [equityCurve]);

  // Export transaction ledger to CSV
  const handleExportCSV = () => {
    const headers = ['Transaction ID', 'Type', 'Symbol', 'Shares', 'Price ($)', 'Total ($)', 'Date'];
    const rows = transactions.map((t) => [
      t.id,
      t.type,
      t.symbol,
      t.shares,
      t.price.toFixed(2),
      t.total.toFixed(2),
      t.date,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Portfolio_Audit_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // SVG Chart Dimensions
  const svgWidth = 720;
  const svgHeight = 260;
  const pad = { top: 20, right: 30, bottom: 35, left: 55 };
  const innerW = svgWidth - pad.left - pad.right;
  const innerH = svgHeight - pad.top - pad.bottom;

  const minV = Math.min(...equityCurve.map((d) => Math.min(d.portfolioVal, d.benchmarkVal))) * 0.96;
  const maxV = Math.max(...equityCurve.map((d) => Math.max(d.portfolioVal, d.benchmarkVal))) * 1.04;

  const getX = (idx: number) => pad.left + (idx / (equityCurve.length - 1 || 1)) * innerW;
  const getY = (val: number) => pad.top + innerH - ((val - minV) / (maxV - minV || 1)) * innerH;

  const portfolioPath = equityCurve.reduce((acc, pt, idx) => {
    const x = getX(idx);
    const y = getY(pt.portfolioVal);
    return idx === 0 ? `M ${x},${y}` : `${acc} L ${x},${y}`;
  }, '');

  const benchmarkPath = equityCurve.reduce((acc, pt, idx) => {
    const x = getX(idx);
    const y = getY(pt.benchmarkVal);
    return idx === 0 ? `M ${x},${y}` : `${acc} L ${x},${y}`;
  }, '');

  return (
    <div className="space-y-6">
      {/* Executive Header & Export */}
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md p-6 shadow-xl shadow-black/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-cyan-500/20 border border-cyan-500/40 px-2 py-0.5 text-[10px] font-bold text-cyan-300">
                AUDITED PERFORMANCE DOSSIER
              </span>
              <span className="text-xs text-slate-400">Institutional Tech Benchmark</span>
            </div>
            <h2 className="mt-1 text-lg font-bold text-slate-100">
              Historical Portfolio Performance & Risk Analysis
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Long-term portfolio alpha, volatility metrics, and execution history vs NASDAQ-100 (QQQ).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition shadow-xs"
            >
              <Download className="h-3.5 w-3.5 text-cyan-400" /> Export Ledger (CSV)
            </button>
          </div>
        </div>

        {/* Timeframe Bar */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-1 rounded-lg border border-slate-800 bg-slate-950 p-1">
            {(['1M', '3M', '6M', '1Y', 'ALL'] as const).map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setTimeRange(range)}
                className={`rounded px-3 py-1 text-xs font-semibold transition ${
                  timeRange === range
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
              <span className="text-slate-100 font-bold">Tech Portfolio (+{stats.totalReturnPct}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-500" />
              <span className="text-slate-400">NASDAQ-100 Index (+{stats.benchmarkReturnPct}%)</span>
            </div>
          </div>
        </div>

        {/* Equity Curve SVG Chart */}
        <div className="mt-4 overflow-x-auto">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto min-w-[500px]">
            {/* Grid lines */}
            {[0, 0.33, 0.66, 1].map((ratio) => {
              const val = minV + (maxV - minV) * ratio;
              const y = getY(val);
              return (
                <g key={ratio}>
                  <line x1={pad.left} y1={y} x2={pad.left + innerW} y2={y} stroke="currentColor" strokeDasharray="3 3" className="text-slate-800" />
                  <text x={pad.left - 8} y={y + 3.5} textAnchor="end" className="font-mono text-[9px] fill-slate-500">
                    ${(val / 1000).toFixed(0)}k
                  </text>
                </g>
              );
            })}

            {/* Benchmark line */}
            <path d={benchmarkPath} fill="none" stroke="#64748b" strokeWidth="1.8" strokeDasharray="4 4" />

            {/* Portfolio line */}
            <path d={portfolioPath} fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" />

            {/* X Axis dates */}
            {equityCurve.filter((_, i) => i % Math.ceil(equityCurve.length / 6) === 0).map((pt, i) => {
              const originalIndex = equityCurve.indexOf(pt);
              return (
                <text
                  key={i}
                  x={getX(originalIndex)}
                  y={svgHeight - 10}
                  textAnchor="middle"
                  className="font-mono text-[9px] fill-slate-400"
                >
                  {pt.label}
                </text>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Advanced Performance & Risk Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md p-4 shadow-xl shadow-black/40">
          <span className="text-xs text-slate-400">Benchmark Alpha</span>
          <p className="font-mono text-xl font-bold text-cyan-400 mt-1">
            +{stats.alpha}%
          </p>
          <span className="text-[10px] text-slate-400">Excess vs NASDAQ-100</span>
        </div>

        <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md p-4 shadow-xl shadow-black/40">
          <span className="text-xs text-slate-400">Sharpe Ratio</span>
          <p className="font-mono text-xl font-bold text-slate-100 mt-1">
            {stats.sharpeRatio}
          </p>
          <span className="text-[10px] text-cyan-400 font-semibold">Tier-1 Risk-Adjusted</span>
        </div>

        <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md p-4 shadow-xl shadow-black/40">
          <span className="text-xs text-slate-400">Maximum Drawdown</span>
          <p className="font-mono text-xl font-bold text-rose-400 mt-1">
            {stats.maxDrawdown}
          </p>
          <span className="text-[10px] text-slate-400">Peak-to-trough trough</span>
        </div>

        <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md p-4 shadow-xl shadow-black/40">
          <span className="text-xs text-slate-400">Trade Win Rate</span>
          <p className="font-mono text-xl font-bold text-emerald-400 mt-1">
            {stats.winRate}
          </p>
          <span className="text-[10px] text-slate-400">Profit Factor: {stats.profitFactor}</span>
        </div>
      </div>

      {/* Transaction History Audit Table */}
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md shadow-xl shadow-black/40 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100">
            Historical Transaction Ledger ({transactions.length} orders)
          </h3>
          <span className="text-xs text-slate-400 font-mono">Real-time Order Book Settlement</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-medium">
              <tr>
                <th className="py-2.5 px-4">Date</th>
                <th className="py-2.5 px-4">Type</th>
                <th className="py-2.5 px-4">Symbol</th>
                <th className="py-2.5 px-4">Shares</th>
                <th className="py-2.5 px-4">Price</th>
                <th className="py-2.5 px-4 text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-3 px-4 text-slate-400">{tx.date}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      tx.type === 'BUY' 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    }`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-100">{tx.symbol}</td>
                  <td className="py-3 px-4 text-slate-300">{tx.shares}</td>
                  <td className="py-3 px-4 text-slate-300">${tx.price.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right font-bold text-slate-100">
                    ${tx.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
