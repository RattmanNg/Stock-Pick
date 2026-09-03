import React, { useState } from 'react';
import { Stock, PortfolioHolding, PortfolioTransaction } from '../types';
import { 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  ArrowUpRight, 
  ArrowDownRight, 
  Trash2, 
  Bell,
  Briefcase
} from 'lucide-react';

interface PortfolioDashboardProps {
  stocks: Stock[];
  holdings: PortfolioHolding[];
  cashBalance: number;
  onExecuteTrade: (type: 'BUY' | 'SELL', symbol: string, shares: number, price: number) => void;
  onRemoveHolding: (id: string) => void;
  onSelectStock: (stock: Stock) => void;
  onOpenAlertModal: (stock: Stock) => void;
}

export const PortfolioDashboard: React.FC<PortfolioDashboardProps> = ({
  stocks,
  holdings,
  cashBalance,
  onExecuteTrade,
  onRemoveHolding,
  onSelectStock,
  onOpenAlertModal,
}) => {
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [tradeSymbol, setTradeSymbol] = useState(stocks[0]?.symbol || 'NVDA');
  const [tradeShares, setTradeShares] = useState<number>(10);

  // Map stocks by symbol for quick price lookup
  const stockMap = React.useMemo(() => {
    const map = new Map<string, Stock>();
    stocks.forEach((s) => map.set(s.symbol, s));
    return map;
  }, [stocks]);

  // Compute portfolio metrics
  const portfolioStats = React.useMemo(() => {
    let totalInvestedCost = 0;
    let totalCurrentValue = 0;
    let todayChangeDollars = 0;

    holdings.forEach((h) => {
      const stock = stockMap.get(h.symbol);
      const currentPrice = stock ? stock.price : h.averageBuyPrice;
      const cost = h.shares * h.averageBuyPrice;
      const val = h.shares * currentPrice;
      const dayChange = stock ? h.shares * stock.change : 0;

      totalInvestedCost += cost;
      totalCurrentValue += val;
      todayChangeDollars += dayChange;
    });

    const netWorth = totalCurrentValue + cashBalance;
    const totalProfitDollars = totalCurrentValue - totalInvestedCost;
    const totalProfitPercent = totalInvestedCost > 0 ? (totalProfitDollars / totalInvestedCost) * 100 : 0;
    const todayChangePercent = totalCurrentValue > 0 ? (todayChangeDollars / (totalCurrentValue - todayChangeDollars || 1)) * 100 : 0;

    return {
      netWorth,
      totalInvestedCost,
      totalCurrentValue,
      totalProfitDollars,
      totalProfitPercent,
      todayChangeDollars,
      todayChangePercent,
    };
  }, [holdings, cashBalance, stockMap]);

  const selectedTradeStock = stockMap.get(tradeSymbol) || stocks[0];

  const handleConfirmTrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTradeStock || tradeShares <= 0) return;
    onExecuteTrade(tradeType, tradeSymbol, Number(tradeShares), selectedTradeStock.price);
    setShowTradeModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Overview KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net Worth */}
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md p-5 shadow-xl shadow-black/40">
          <span className="text-xs font-medium text-slate-400">Total Net Worth</span>
          <div className="mt-1 font-mono text-2xl font-bold tracking-tight text-slate-100">
            ${portfolioStats.netWorth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-1 flex items-center text-xs text-slate-400 font-mono">
            <span>Cash: ${cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>

        {/* Today's Return */}
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md p-5 shadow-xl shadow-black/40">
          <span className="text-xs font-medium text-slate-400">Today's P&L</span>
          <div className={`mt-1 font-mono text-2xl font-bold tracking-tight ${
            portfolioStats.todayChangeDollars >= 0 ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {portfolioStats.todayChangeDollars >= 0 ? '+' : ''}${portfolioStats.todayChangeDollars.toFixed(2)}
          </div>
          <div className="mt-1 flex items-center text-xs font-semibold">
            <span className={portfolioStats.todayChangePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
              {portfolioStats.todayChangePercent >= 0 ? '▲' : '▼'} {portfolioStats.todayChangePercent.toFixed(2)}% today
            </span>
          </div>
        </div>

        {/* All-Time Unrealized Gain */}
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md p-5 shadow-xl shadow-black/40">
          <span className="text-xs font-medium text-slate-400">All-Time Return</span>
          <div className={`mt-1 font-mono text-2xl font-bold tracking-tight ${
            portfolioStats.totalProfitDollars >= 0 ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {portfolioStats.totalProfitDollars >= 0 ? '+' : ''}${portfolioStats.totalProfitDollars.toFixed(2)}
          </div>
          <div className="mt-1 text-xs font-semibold">
            <span className={portfolioStats.totalProfitPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
              {portfolioStats.totalProfitPercent >= 0 ? '+' : ''}{portfolioStats.totalProfitPercent.toFixed(2)}% all-time
            </span>
          </div>
        </div>

        {/* Invested Equity */}
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md p-5 shadow-xl shadow-black/40">
          <span className="text-xs font-medium text-slate-400">Invested Capital</span>
          <div className="mt-1 font-mono text-2xl font-bold tracking-tight text-cyan-400">
            ${portfolioStats.totalCurrentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-1 text-xs text-slate-400 font-mono">
            Across {holdings.length} major tech positions
          </div>
        </div>
      </div>

      {/* Asset Allocation & Top Holdings Bar */}
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md p-5 shadow-xl shadow-black/40">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100 flex items-center gap-1.5">
            <PieChart className="h-4 w-4 text-cyan-400" /> Technology Portfolio Weighting
          </h3>
          <button
            type="button"
            onClick={() => {
              setTradeType('BUY');
              setShowTradeModal(true);
            }}
            className="flex items-center gap-1 rounded-lg bg-cyan-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 shadow-md shadow-cyan-500/20 transition"
          >
            <Plus className="h-3.5 w-3.5" /> Execute New Trade
          </button>
        </div>

        {/* Stacked Allocation Bar */}
        <div className="mt-4">
          <div className="h-4 w-full rounded-md bg-slate-950 border border-slate-800/80 flex overflow-hidden">
            {holdings.map((h, idx) => {
              const stock = stockMap.get(h.symbol);
              const val = h.shares * (stock?.price || h.averageBuyPrice);
              const pct = portfolioStats.totalCurrentValue > 0 ? (val / portfolioStats.totalCurrentValue) * 100 : 0;
              const colors = ['bg-cyan-400', 'bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-emerald-400', 'bg-amber-400'];
              return (
                <div
                  key={h.id}
                  style={{ width: `${pct}%` }}
                  title={`${h.symbol}: ${pct.toFixed(1)}%`}
                  className={`${colors[idx % colors.length]} transition-all hover:opacity-85`}
                />
              );
            })}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-mono">
            {holdings.map((h, idx) => {
              const stock = stockMap.get(h.symbol);
              const val = h.shares * (stock?.price || h.averageBuyPrice);
              const pct = portfolioStats.totalCurrentValue > 0 ? (val / portfolioStats.totalCurrentValue) * 100 : 0;
              const dotColors = ['bg-cyan-400', 'bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-emerald-400', 'bg-amber-400'];
              return (
                <div key={h.id} className="flex items-center gap-1.5">
                  <span className={`h-2.5 w-2.5 rounded-full ${dotColors[idx % dotColors.length]}`} />
                  <span className="font-bold text-slate-100">{h.symbol}:</span>
                  <span className="text-slate-400">{pct.toFixed(1)}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md shadow-xl shadow-black/40 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100">
              Active Holdings & Positions
            </h3>
            <p className="text-xs text-slate-400">
              Real-time mark-to-market valuation with instant trading triggers.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-medium">
              <tr>
                <th className="py-3 px-4">Asset</th>
                <th className="py-3 px-4">Shares</th>
                <th className="py-3 px-4">Avg Cost</th>
                <th className="py-3 px-4">Market Price</th>
                <th className="py-3 px-4">Current Value</th>
                <th className="py-3 px-4">Unrealized P&L</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {holdings.map((h) => {
                const stock = stockMap.get(h.symbol);
                const currentPrice = stock ? stock.price : h.averageBuyPrice;
                const totalCost = h.shares * h.averageBuyPrice;
                const currentValue = h.shares * currentPrice;
                const profit = currentValue - totalCost;
                const profitPct = totalCost > 0 ? (profit / totalCost) * 100 : 0;

                return (
                  <tr key={h.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => stock && onSelectStock(stock)}
                        className="text-left group"
                      >
                        <span className="font-mono font-bold text-slate-100 group-hover:text-cyan-400 transition">
                          {h.symbol}
                        </span>
                        <p className="text-[11px] text-slate-400 truncate max-w-[130px]">
                          {stock?.name || h.symbol}
                        </p>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-200">
                      {h.shares}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      ${h.averageBuyPrice.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-100">
                      ${currentPrice.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-100">
                      ${currentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <div className={`font-bold ${profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {profit >= 0 ? '+' : ''}${profit.toFixed(2)}
                      </div>
                      <div className={`text-[10px] ${profitPct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        ({profitPct >= 0 ? '+' : ''}{profitPct.toFixed(2)}%)
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setTradeSymbol(h.symbol);
                            setTradeType('BUY');
                            setShowTradeModal(true);
                          }}
                          className="rounded p-1 text-emerald-400 hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/30 transition"
                          title="Buy more shares"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setTradeSymbol(h.symbol);
                            setTradeType('SELL');
                            setShowTradeModal(true);
                          }}
                          className="rounded p-1 text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/30 transition"
                          title="Sell shares"
                        >
                          <ArrowDownRight className="h-4 w-4" />
                        </button>
                        {stock && (
                          <button
                            type="button"
                            onClick={() => onOpenAlertModal(stock)}
                            className="rounded p-1 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition"
                            title="Set price alert"
                          >
                            <Bell className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onRemoveHolding(h.id)}
                          className="rounded p-1 text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                          title="Remove holding"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trade Execution Modal */}
      {showTradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800/90 bg-slate-900 p-6 shadow-2xl shadow-black/80 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-100">
                Execute Stock Order
              </h3>
              <button
                type="button"
                onClick={() => setShowTradeModal(false)}
                className="text-slate-400 hover:text-slate-200 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmTrade} className="mt-4 space-y-4">
              {/* Order Type Toggle */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTradeType('BUY')}
                  className={`rounded-lg py-2 text-xs font-bold transition ${
                    tradeType === 'BUY'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-xs'
                      : 'border border-slate-800 bg-slate-950/40 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Buy Shares
                </button>
                <button
                  type="button"
                  onClick={() => setTradeType('SELL')}
                  className={`rounded-lg py-2 text-xs font-bold transition ${
                    tradeType === 'SELL'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 shadow-xs'
                      : 'border border-slate-800 bg-slate-950/40 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Sell Shares
                </button>
              </div>

              {/* Symbol Select */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Stock Symbol
                </label>
                <select
                  value={tradeSymbol}
                  onChange={(e) => setTradeSymbol(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-mono font-bold text-slate-100 focus:outline-cyan-400"
                >
                  {stocks.map((s) => (
                    <option key={s.symbol} value={s.symbol}>
                      {s.symbol} - {s.name} (${s.price.toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Shares Input */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Number of Shares
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={tradeShares}
                  onChange={(e) => setTradeShares(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-mono text-slate-100 focus:outline-cyan-400"
                />
              </div>

              {/* Estimated Total Calculation */}
              <div className="rounded-lg bg-slate-950/80 border border-slate-800/80 p-3 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Market Price:</span>
                  <span>${selectedTradeStock ? selectedTradeStock.price.toFixed(2) : '0.00'}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-100 mt-1">
                  <span>Estimated Total:</span>
                  <span className="text-cyan-400">
                    ${((selectedTradeStock ? selectedTradeStock.price : 0) * tradeShares).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTradeModal(false)}
                  className="rounded-lg border border-slate-700 bg-slate-800/80 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`rounded-lg px-4 py-2 text-xs font-bold text-slate-950 shadow-sm transition ${
                    tradeType === 'BUY'
                      ? 'bg-emerald-400 hover:bg-emerald-300'
                      : 'bg-rose-500 hover:bg-rose-400 text-white'
                  }`}
                >
                  Confirm {tradeType}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
