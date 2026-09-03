/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Stock, 
  PortfolioHolding, 
  PortfolioTransaction, 
  PriceAlert, 
  NotificationItem, 
  TimeFrame 
} from './types';
import { INITIAL_STOCKS } from './data/stocksData';
import { Navbar } from './components/Navbar';
import { StockChart } from './components/StockChart';
import { TechnicalAnalysisPanel } from './components/TechnicalAnalysisPanel';
import { PortfolioDashboard } from './components/PortfolioDashboard';
import { SentimentAndNewsFeed } from './components/SentimentAndNewsFeed';
import { AlertsManager } from './components/AlertsManager';
import { HistoricalPerformanceReport } from './components/HistoricalPerformanceReport';
import { audioAlerts } from './utils/audioAlert';
import { sendBrowserNotification, requestNotificationPermission } from './utils/notifications';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Bell, 
  Search, 
  Layers, 
  Zap, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownRight,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function App() {
  // Core application state
  const [stocks, setStocks] = useState<Stock[]>(() => {
    const saved = localStorage.getItem('stock_tracker_stocks');
    return saved ? JSON.parse(saved) : INITIAL_STOCKS;
  });

  const [selectedStockSymbol, setSelectedStockSymbol] = useState<string>('NVDA');
  const [timeframe, setTimeframe] = useState<TimeFrame>('1D');
  const [activeTab, setActiveTab] = useState<'overview' | 'technicals' | 'portfolio' | 'intel' | 'alerts' | 'performance'>('overview');

  // Multi-device notification & audio settings
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Price & Signal Alerts
  const [alerts, setAlerts] = useState<PriceAlert[]>([
    {
      id: 'alert-1',
      symbol: 'NVDA',
      condition: 'PRICE_ABOVE',
      targetValue: 140.00,
      active: true,
      isTriggered: false,
      createdAt: new Date().toISOString(),
      notifySound: true,
    },
    {
      id: 'alert-2',
      symbol: 'TSLA',
      condition: 'SIGNAL_BUY',
      active: true,
      isTriggered: false,
      createdAt: new Date().toISOString(),
      notifySound: true,
    },
    {
      id: 'alert-3',
      symbol: 'AAPL',
      condition: 'RSI_OVERBOUGHT',
      active: true,
      isTriggered: false,
      createdAt: new Date().toISOString(),
      notifySound: true,
    }
  ]);

  // Initial Portfolio Holdings with realistic initial position data
  const [holdings, setHoldings] = useState<PortfolioHolding[]>([
    { id: 'h-1', symbol: 'NVDA', shares: 50, averageBuyPrice: 118.50, dateAdded: '2024-04-10' },
    { id: 'h-2', symbol: 'AAPL', shares: 35, averageBuyPrice: 210.00, dateAdded: '2024-05-15' },
    { id: 'h-3', symbol: 'MSFT', shares: 20, averageBuyPrice: 415.00, dateAdded: '2024-03-20' },
    { id: 'h-4', symbol: 'GOOGL', shares: 30, averageBuyPrice: 162.00, dateAdded: '2024-06-01' },
    { id: 'h-5', symbol: 'AMZN', shares: 25, averageBuyPrice: 180.00, dateAdded: '2024-05-22' },
    { id: 'h-6', symbol: 'META', shares: 15, averageBuyPrice: 490.00, dateAdded: '2024-02-18' },
  ]);

  const [cashBalance, setCashBalance] = useState<number>(14500.00);

  const [transactions, setTransactions] = useState<PortfolioTransaction[]>([
    { id: 'tx-1', type: 'BUY', symbol: 'NVDA', shares: 50, price: 118.50, total: 5925.00, date: '2024-04-10 10:15' },
    { id: 'tx-2', type: 'BUY', symbol: 'AAPL', shares: 35, price: 210.00, total: 7350.00, date: '2024-05-15 11:30' },
    { id: 'tx-3', type: 'BUY', symbol: 'MSFT', shares: 20, price: 415.00, total: 8300.00, date: '2024-03-20 09:45' },
    { id: 'tx-4', type: 'BUY', symbol: 'GOOGL', shares: 30, price: 162.00, total: 4860.00, date: '2024-06-01 14:20' },
    { id: 'tx-5', type: 'BUY', symbol: 'AMZN', shares: 25, price: 180.00, total: 4500.00, date: '2024-05-22 13:10' },
    { id: 'tx-6', type: 'BUY', symbol: 'META', shares: 15, price: 490.00, total: 7350.00, date: '2024-02-18 15:00' },
  ]);

  // Selected Stock
  const selectedStock = useMemo(() => {
    return stocks.find((s) => s.symbol === selectedStockSymbol) || stocks[0];
  }, [stocks, selectedStockSymbol]);

  // Request browser notification permission
  const handleRequestPush = async () => {
    const granted = await requestNotificationPermission();
    setPushEnabled(granted);
    if (granted) {
      sendBrowserNotification('Notifications Activated', {
        body: 'Real-time stock price and buy/sell alerts are now enabled on your device.',
      });
    }
  };

  // Check initial permission
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPushEnabled(Notification.permission === 'granted');
    }
  }, []);

  // Real-time market tick simulation engine (runs every 3.5s)
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks((prevStocks) => {
        return prevStocks.map((stock) => {
          // Micro tick: random walk between -0.3% and +0.35%
          const tickPct = (Math.random() - 0.48) * 0.004;
          const newPrice = Number((stock.price * (1 + tickPct)).toFixed(2));
          const newChange = Number((newPrice - stock.previousClose).toFixed(2));
          const newChangePercent = Number(((newChange / stock.previousClose) * 100).toFixed(2));
          const newDayHigh = Math.max(stock.dayHigh, newPrice);
          const newDayLow = Math.min(stock.dayLow, newPrice);

          // Slightly adjust RSI dynamically
          const rsiDelta = (newPrice > stock.price ? 0.3 : -0.3) * (Math.random() + 0.5);
          const newRsi = Math.max(15, Math.min(88, Number((stock.rsi + rsiDelta).toFixed(1))));

          // Evaluate algorithmic buy/sell conditions
          let newSignal = stock.technicalSignal;
          let newReason = stock.signalReason;

          if (newRsi < 32 && stock.technicalSignal !== 'STRONG BUY') {
            newSignal = 'STRONG BUY';
            newReason = `RSI oversold rebound (${newRsi.toFixed(1)}) with price consolidating near support.`;
          } else if (newRsi > 72 && stock.technicalSignal !== 'STRONG SELL') {
            newSignal = 'SELL';
            newReason = `RSI reached overbought territory (${newRsi.toFixed(1)}); take profit or tighten trailing stop.`;
          }

          // Check against active alerts
          alerts.forEach((alert) => {
            if (alert.active && !alert.isTriggered && alert.symbol === stock.symbol) {
              let triggered = false;
              let alertTitle = '';
              let alertMsg = '';

              if (alert.condition === 'PRICE_ABOVE' && alert.targetValue && newPrice >= alert.targetValue) {
                triggered = true;
                alertTitle = `${stock.symbol} Price Alert: Above $${alert.targetValue}`;
                alertMsg = `${stock.symbol} crossed above $${alert.targetValue.toFixed(2)} (Now $${newPrice.toFixed(2)})`;
              } else if (alert.condition === 'PRICE_BELOW' && alert.targetValue && newPrice <= alert.targetValue) {
                triggered = true;
                alertTitle = `${stock.symbol} Price Alert: Below $${alert.targetValue}`;
                alertMsg = `${stock.symbol} dropped below $${alert.targetValue.toFixed(2)} (Now $${newPrice.toFixed(2)})`;
              } else if (alert.condition === 'RSI_OVERBOUGHT' && newRsi >= 70) {
                triggered = true;
                alertTitle = `${stock.symbol} RSI Overbought`;
                alertMsg = `14-day RSI reached ${newRsi} - potential resistance warning.`;
              } else if (alert.condition === 'RSI_OVERSOLD' && newRsi <= 30) {
                triggered = true;
                alertTitle = `${stock.symbol} RSI Oversold Accumulation`;
                alertMsg = `14-day RSI dropped to ${newRsi} - favorable risk-reward accumulation zone.`;
              } else if (alert.condition === 'SIGNAL_BUY' && (newSignal === 'BUY' || newSignal === 'STRONG BUY')) {
                triggered = true;
                alertTitle = `${stock.symbol} BUY Signal Alert`;
                alertMsg = `Algorithm issued ${newSignal} signal: ${newReason}`;
              } else if (alert.condition === 'SIGNAL_SELL' && (newSignal === 'SELL' || newSignal === 'STRONG SELL')) {
                triggered = true;
                alertTitle = `${stock.symbol} SELL Signal Alert`;
                alertMsg = `Algorithm issued ${newSignal} signal: ${newReason}`;
              }

              if (triggered) {
                // Play audio chime
                if (soundEnabled && alert.notifySound) {
                  if (alert.condition.includes('SELL')) {
                    audioAlerts.playSellSignalChime();
                  } else {
                    audioAlerts.playBuySignalChime();
                  }
                }

                // Push browser notification
                sendBrowserNotification(alertTitle, { body: alertMsg });

                // Push to in-app notifications
                setNotifications((prevNotifs) => [
                  {
                    id: `notif-${Date.now()}`,
                    title: alertTitle,
                    message: alertMsg,
                    symbol: stock.symbol,
                    type: alert.condition.includes('SIGNAL') ? 'signal' : 'price',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    read: false,
                  },
                  ...prevNotifs,
                ]);

                // Update alert status
                setAlerts((prevAlerts) =>
                  prevAlerts.map((a) => (a.id === alert.id ? { ...a, isTriggered: true, active: false } : a))
                );
              }
            }
          });

          return {
            ...stock,
            price: newPrice,
            change: newChange,
            changePercent: newChangePercent,
            dayHigh: newDayHigh,
            dayLow: newDayLow,
            rsi: newRsi,
            technicalSignal: newSignal,
            signalReason: newReason,
          };
        });
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [alerts, soundEnabled]);

  // Execute trade (Buy / Sell)
  const handleExecuteTrade = useCallback((type: 'BUY' | 'SELL', symbol: string, shares: number, price: number) => {
    const total = shares * price;
    const now = new Date();
    const dateStr = `${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    if (type === 'BUY') {
      setCashBalance((prev) => Math.max(0, prev - total));
      setHoldings((prev) => {
        const existing = prev.find((h) => h.symbol === symbol);
        if (existing) {
          const totalShares = existing.shares + shares;
          const totalCost = existing.shares * existing.averageBuyPrice + total;
          return prev.map((h) =>
            h.symbol === symbol
              ? { ...h, shares: totalShares, averageBuyPrice: totalCost / totalShares }
              : h
          );
        } else {
          return [
            ...prev,
            {
              id: `h-${Date.now()}`,
              symbol,
              shares,
              averageBuyPrice: price,
              dateAdded: now.toISOString().slice(0, 10),
            },
          ];
        }
      });
      if (soundEnabled) audioAlerts.playBuySignalChime();
    } else {
      // SELL
      setCashBalance((prev) => prev + total);
      setHoldings((prev) => {
        return prev
          .map((h) => {
            if (h.symbol === symbol) {
              const remaining = Math.max(0, h.shares - shares);
              return { ...h, shares: remaining };
            }
            return h;
          })
          .filter((h) => h.shares > 0);
      });
      if (soundEnabled) audioAlerts.playSellSignalChime();
    }

    setTransactions((prev) => [
      {
        id: `tx-${Date.now()}`,
        type,
        symbol,
        shares,
        price,
        total,
        date: dateStr,
      },
      ...prev,
    ]);

    setNotifications((prev) => [
      {
        id: `order-${Date.now()}`,
        title: `Order Executed: ${type} ${shares} ${symbol}`,
        message: `Filled at $${price.toFixed(2)} for a total of $${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
        symbol,
        type: 'price',
        timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false,
      },
      ...prev,
    ]);
  }, [soundEnabled]);

  // Portfolio Totals
  const portfolioSummary = useMemo(() => {
    let totalStockVal = 0;
    let totalCost = 0;
    let dayChange = 0;

    holdings.forEach((h) => {
      const stock = stocks.find((s) => s.symbol === h.symbol);
      const curPrice = stock ? stock.price : h.averageBuyPrice;
      totalStockVal += h.shares * curPrice;
      totalCost += h.shares * h.averageBuyPrice;
      dayChange += stock ? h.shares * stock.change : 0;
    });

    const netWorth = totalStockVal + cashBalance;
    const dayChangePct = totalStockVal > 0 ? (dayChange / totalStockVal) * 100 : 0;

    return {
      netWorth,
      totalStockVal,
      dayChange,
      dayChangePct,
    };
  }, [stocks, holdings, cashBalance]);

  // Alert management helpers
  const handleAddAlert = (newAlertData: Omit<PriceAlert, 'id' | 'createdAt' | 'isTriggered'>) => {
    const alertItem: PriceAlert = {
      ...newAlertData,
      id: `alert-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isTriggered: false,
    };
    setAlerts((prev) => [alertItem, ...prev]);
  };

  const handleToggleAlert = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a)));
  };

  const handleDeleteAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const handleRemoveHolding = (id: string) => {
    setHoldings((prev) => prev.filter((h) => h.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden">
      {/* Ambient background glow accents */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-35">
        <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute top-1/3 -right-20 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-10 left-10 h-80 w-80 rounded-full bg-emerald-500/5 blur-3xl" />
      </div>

      {/* Top Navigation */}
      <Navbar
        stocks={stocks}
        selectedStock={selectedStock}
        onSelectStock={(s) => setSelectedStockSymbol(s.symbol)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        notifications={notifications}
        unreadCount={notifications.filter((n) => !n.read).length}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        onClearNotifications={() => setNotifications([])}
        onRequestPush={handleRequestPush}
        pushEnabled={pushEnabled}
        totalPortfolioValue={portfolioSummary.netWorth}
        totalPortfolioChange={portfolioSummary.dayChange}
        totalPortfolioChangePercent={portfolioSummary.dayChangePct}
      />

      {/* Main Content Workspace */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* TAB 1: OVERVIEW (Interactive Chart + Live Tech Watchlist) */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Real-time Ticker Marquee Ribbon */}
            <div className="flex items-center gap-2 overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md p-2.5 shadow-lg shadow-black/40 scrollbar-none">
              <span className="flex items-center gap-1.5 px-2 font-mono text-[11px] font-bold text-slate-400 uppercase">
                <Activity className="h-3.5 w-3.5 text-cyan-400 animate-pulse" /> Live Quotes
              </span>
              <div className="h-4 w-[1px] bg-slate-800 shrink-0" />
              {stocks.map((stk) => (
                <button
                  key={stk.symbol}
                  type="button"
                  onClick={() => setSelectedStockSymbol(stk.symbol)}
                  className={`flex items-center gap-2 rounded-lg px-2.5 py-1 text-xs transition shrink-0 ${
                    stk.symbol === selectedStock.symbol
                      ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border border-cyan-500/40 text-cyan-300 font-semibold shadow-xs shadow-cyan-500/20'
                      : 'hover:bg-slate-800/60 text-slate-300 border border-transparent'
                  }`}
                >
                  <span className="font-mono font-bold text-slate-100">{stk.symbol}</span>
                  <span className="font-mono">${stk.price.toFixed(2)}</span>
                  <span className={`font-mono text-[10px] ${stk.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {stk.change >= 0 ? '+' : ''}{stk.changePercent.toFixed(1)}%
                  </span>
                </button>
              ))}
            </div>

            {/* Two-Column Grid: Left Chart + Right Watchlist & Buy/Sell Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Main Interactive Chart */}
              <div className="lg:col-span-2 space-y-6">
                <StockChart
                  stock={selectedStock}
                  timeframe={timeframe}
                  onChangeTimeframe={setTimeframe}
                  onQuickTrade={(type) => handleExecuteTrade(type, selectedStock.symbol, 10, selectedStock.price)}
                />

                {/* Quick Technical Indicator Summary strip */}
                <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md p-4 shadow-xl shadow-black/40">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100 flex items-center gap-1.5">
                      <Zap className="h-4 w-4 text-cyan-400" /> Active Technical Diagnosis
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab('technicals')}
                      className="text-xs font-medium text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-0.5"
                    >
                      Deep Technical Dashboard <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className={`rounded-lg px-2.5 py-1 text-xs font-bold font-mono ${
                        selectedStock.technicalSignal.includes('BUY') 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs shadow-emerald-500/20' 
                          : selectedStock.technicalSignal.includes('SELL') 
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-xs shadow-rose-500/20' 
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}>
                        {selectedStock.technicalSignal}
                      </span>
                      <p className="text-xs text-slate-300">
                        {selectedStock.signalReason}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleExecuteTrade('BUY', selectedStock.symbol, 10, selectedStock.price)}
                        className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-bold text-slate-950 shadow-md shadow-emerald-500/20 hover:bg-emerald-400 active:scale-95 transition"
                      >
                        Buy 10 Shares
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Major Technology Stocks Watchlist & Intelligence Quick Peek */}
              <div className="space-y-6">
                {/* Watchlist Card */}
                <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md p-4 shadow-xl shadow-black/40">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100">
                      Major Tech Watchlist
                    </h3>
                    <span className="text-[10px] font-mono text-slate-400">10 Assets</span>
                  </div>

                  <div className="mt-3 space-y-1 max-h-[460px] overflow-y-auto">
                    {stocks.map((s) => (
                      <div
                        key={s.symbol}
                        onClick={() => setSelectedStockSymbol(s.symbol)}
                        className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition ${
                          s.symbol === selectedStock.symbol
                            ? 'bg-slate-800/80 border border-cyan-500/40 shadow-xs shadow-cyan-500/10'
                            : 'hover:bg-slate-800/40 border border-transparent'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-xs text-slate-100">
                              {s.symbol}
                            </span>
                            <span className={`text-[9px] px-1 py-0.2 rounded font-mono font-semibold ${
                              s.technicalSignal.includes('BUY') 
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}>
                              {s.technicalSignal}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 block truncate max-w-[120px]">
                            {s.name}
                          </span>
                        </div>

                        <div className="text-right">
                          <div className="font-mono font-bold text-xs text-slate-100">
                            ${s.price.toFixed(2)}
                          </div>
                          <div className={`font-mono text-[10px] font-semibold ${
                            s.change >= 0 ? 'text-emerald-400' : 'text-rose-400'
                          }`}>
                            {s.change >= 0 ? '+' : ''}{s.changePercent.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Intelligence Promo Card */}
                <div className="rounded-xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/30 via-slate-900/80 to-indigo-950/30 p-4 shadow-xl backdrop-blur-md">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                    <Sparkles className="h-4 w-4 text-cyan-400" />
                    Press & Social Sentiment Radar
                  </div>
                  <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                    Synthesizing live Wall Street upgrades, {selectedStock.symbol} SEC 8-K filings, and retail chatter.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('intel')}
                    className="mt-3 flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
                  >
                    View Analyst Consensus & AI Brief <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TECHNICALS (Advanced Indicators & Buy/Sell Signals) */}
        {activeTab === 'technicals' && (
          <div className="space-y-6">
            <TechnicalAnalysisPanel
              stock={selectedStock}
              onTrade={(type) => handleExecuteTrade(type, selectedStock.symbol, 10, selectedStock.price)}
              onSetAlert={() => setActiveTab('alerts')}
            />
            {/* Embedded Stock Chart for context */}
            <StockChart
              stock={selectedStock}
              timeframe={timeframe}
              onChangeTimeframe={setTimeframe}
              onQuickTrade={(type) => handleExecuteTrade(type, selectedStock.symbol, 10, selectedStock.price)}
            />
          </div>
        )}

        {/* TAB 3: PORTFOLIO TRACKER (Holdings, Net Worth, Executions) */}
        {activeTab === 'portfolio' && (
          <PortfolioDashboard
            stocks={stocks}
            holdings={holdings}
            cashBalance={cashBalance}
            onExecuteTrade={handleExecuteTrade}
            onRemoveHolding={handleRemoveHolding}
            onSelectStock={(s) => {
              setSelectedStockSymbol(s.symbol);
              setActiveTab('overview');
            }}
            onOpenAlertModal={() => setActiveTab('alerts')}
          />
        )}

        {/* TAB 4: INTEL (Press Releases, Analyst Reports, Social Sentiment, Gemini AI) */}
        {activeTab === 'intel' && (
          <SentimentAndNewsFeed
            stock={selectedStock}
            onTrade={(type) => handleExecuteTrade(type, selectedStock.symbol, 10, selectedStock.price)}
          />
        )}

        {/* TAB 5: ALERTS (Multi-device Price & Signal Alerts Manager) */}
        {activeTab === 'alerts' && (
          <AlertsManager
            stocks={stocks}
            alerts={alerts}
            onAddAlert={handleAddAlert}
            onToggleAlert={handleToggleAlert}
            onDeleteAlert={handleDeleteAlert}
            pushEnabled={pushEnabled}
            onRequestPush={handleRequestPush}
            onSelectStock={(s) => {
              setSelectedStockSymbol(s.symbol);
              setActiveTab('overview');
            }}
          />
        )}

        {/* TAB 6: PERFORMANCE (Historical Performance Reporting & Benchmark Ledger) */}
        {activeTab === 'performance' && (
          <HistoricalPerformanceReport
            stocks={stocks}
            holdings={holdings}
            transactions={transactions}
            portfolioValue={portfolioSummary.netWorth}
          />
        )}
      </main>
    </div>
  );
}
