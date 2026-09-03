import React from 'react';
import { 
  TrendingUp, 
  Bell, 
  Volume2, 
  VolumeX, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Info,
  ChevronDown
} from 'lucide-react';
import { Stock, NotificationItem } from '../types';

interface NavbarProps {
  stocks: Stock[];
  selectedStock: Stock;
  onSelectStock: (stock: Stock) => void;
  activeTab: 'overview' | 'technicals' | 'portfolio' | 'intel' | 'alerts' | 'performance';
  setActiveTab: (tab: 'overview' | 'technicals' | 'portfolio' | 'intel' | 'alerts' | 'performance') => void;
  notifications: NotificationItem[];
  unreadCount: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onClearNotifications: () => void;
  onRequestPush: () => void;
  pushEnabled: boolean;
  totalPortfolioValue: number;
  totalPortfolioChange: number;
  totalPortfolioChangePercent: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  stocks,
  selectedStock,
  onSelectStock,
  activeTab,
  setActiveTab,
  notifications,
  unreadCount,
  soundEnabled,
  onToggleSound,
  onClearNotifications,
  onRequestPush,
  pushEnabled,
  totalPortfolioValue,
  totalPortfolioChange,
  totalPortfolioChangePercent,
}) => {
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showStockDropdown, setShowStockDropdown] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#020617]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand & Stock Selector */}
        <div className="flex items-center gap-3 md:gap-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/30">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-semibold tracking-tight text-slate-100">
                  Stock Portfolio Tracker
                </span>
                <span className="hidden items-center gap-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 text-[10px] font-medium text-cyan-300 sm:inline-flex shadow-xs shadow-cyan-500/10">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  REAL-TIME
                </span>
              </div>
              <p className="hidden text-xs text-slate-400 sm:block">
                Advanced Technicals & Investment Intelligence
              </p>
            </div>
          </div>

          {/* Quick Stock Selector Dropdown */}
          <div className="relative">
            <button
              id="stock-selector-btn"
              type="button"
              onClick={() => setShowStockDropdown(!showStockDropdown)}
              className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs font-semibold text-slate-100 transition hover:bg-slate-800/80 hover:border-slate-700 shadow-sm"
            >
              <span className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[11px] text-cyan-300 border border-slate-700">
                {selectedStock.symbol}
              </span>
              <span className="hidden sm:inline font-normal text-slate-400 truncate max-w-[120px]">
                {selectedStock.name}
              </span>
              <span className="font-mono font-bold text-slate-100">
                ${selectedStock.price.toFixed(2)}
              </span>
              <span className={`font-mono text-[11px] ${selectedStock.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {selectedStock.change >= 0 ? '+' : ''}{selectedStock.changePercent.toFixed(2)}%
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {showStockDropdown && (
              <div 
                className="absolute left-0 mt-1 w-72 rounded-xl border border-slate-800 bg-slate-900/95 p-1.5 shadow-2xl shadow-black/80 ring-1 ring-white/10 backdrop-blur-xl z-50"
                onClick={() => setShowStockDropdown(false)}
              >
                <div className="px-2 py-1 text-[11px] font-medium uppercase tracking-wider text-slate-400">
                  Major Technology Stocks
                </div>
                <div className="max-h-80 overflow-y-auto space-y-0.5">
                  {stocks.map((stock) => (
                    <button
                      key={stock.symbol}
                      type="button"
                      onClick={() => onSelectStock(stock)}
                      className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition ${
                        stock.symbol === selectedStock.symbol
                          ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border border-cyan-500/40 font-semibold text-cyan-300'
                          : 'text-slate-300 hover:bg-slate-800/60 hover:text-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-12 font-mono font-bold text-slate-100">
                          {stock.symbol}
                        </span>
                        <span className="truncate max-w-[100px] text-slate-400 text-[11px]">
                          {stock.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-medium text-slate-100">
                          ${stock.price.toFixed(2)}
                        </div>
                        <div className={`font-mono text-[10px] ${stock.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center/Right: Navigation Tabs & Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Quick Portfolio Widget */}
          <div className="hidden lg:flex items-center gap-2 rounded-lg border border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-3 py-1.5 shadow-xs">
            <span className="text-xs text-slate-400">Portfolio:</span>
            <span className="font-mono text-xs font-bold text-slate-100">
              ${totalPortfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className={`font-mono text-[11px] font-semibold ${totalPortfolioChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {totalPortfolioChange >= 0 ? '+' : ''}${totalPortfolioChange.toFixed(2)} ({totalPortfolioChangePercent.toFixed(2)}%)
            </span>
          </div>

          {/* Sound Toggle */}
          <button
            id="sound-toggle-btn"
            type="button"
            onClick={onToggleSound}
            title={soundEnabled ? 'Alert chime enabled' : 'Alert chime muted'}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/80 text-slate-300 transition hover:bg-slate-800 hover:text-slate-100 hover:border-slate-700 shadow-xs"
          >
            {soundEnabled ? <Volume2 className="h-4 w-4 text-emerald-400" /> : <VolumeX className="h-4 w-4 text-slate-500" />}
          </button>

          {/* Notifications Bell with Popover */}
          <div className="relative">
            <button
              id="notifications-btn"
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/80 text-slate-300 transition hover:bg-slate-800 hover:text-slate-100 hover:border-slate-700 shadow-xs"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 font-mono text-[10px] font-bold text-white shadow-md shadow-rose-500/50">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-slate-800 bg-slate-900/95 p-3 shadow-2xl shadow-black/90 backdrop-blur-2xl ring-1 ring-white/10 z-50">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-100">
                      Live Price & Signal Alerts
                    </span>
                    {unreadCount > 0 && (
                      <span className="rounded bg-rose-500/20 border border-rose-500/30 px-1.5 py-0.2 text-[10px] font-semibold text-rose-300">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {!pushEnabled && (
                      <button
                        type="button"
                        onClick={onRequestPush}
                        className="text-[11px] font-medium text-cyan-400 hover:underline"
                      >
                        Enable Push
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={onClearNotifications}
                      className="text-[11px] text-slate-400 hover:text-slate-200"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="mt-2 max-h-72 overflow-y-auto space-y-2">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                      <CheckCircle2 className="mx-auto mb-1 h-5 w-5 text-slate-500" />
                      No alerts triggered yet. Set custom price and signal alerts in the Alerts tab!
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`flex gap-2.5 rounded-lg border p-2.5 text-xs transition ${
                          notif.type === 'signal'
                            ? 'border-emerald-500/30 bg-emerald-950/20'
                            : 'border-slate-800/80 bg-slate-950/60'
                        }`}
                      >
                        <div className="mt-0.5">
                          {notif.type === 'signal' ? (
                            <Activity className="h-4 w-4 text-emerald-400" />
                          ) : notif.type === 'price' ? (
                            <AlertTriangle className="h-4 w-4 text-amber-400" />
                          ) : (
                            <Info className="h-4 w-4 text-cyan-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-100">
                              {notif.title}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {notif.timestamp}
                            </span>
                          </div>
                          <p className="mt-0.5 text-slate-300 text-[11px]">
                            {notif.message}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Sub-bar */}
      <div className="border-t border-slate-800/80 bg-[#020617]/90 backdrop-blur-md px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center gap-1 sm:gap-2 overflow-x-auto py-1.5 text-xs font-medium scrollbar-none">
          {[
            { id: 'overview', label: 'Market Overview' },
            { id: 'technicals', label: 'Technical Indicators & Signals' },
            { id: 'portfolio', label: 'Portfolio Tracker' },
            { id: 'intel', label: 'News, Analysts & Sentiment' },
            { id: 'alerts', label: 'Price Alerts' },
            { id: 'performance', label: 'Historical Reporting' },
          ].map((tab) => (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`whitespace-nowrap rounded-md px-3 py-1.5 transition ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border border-cyan-500/40 font-semibold text-cyan-300 shadow-xs shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
