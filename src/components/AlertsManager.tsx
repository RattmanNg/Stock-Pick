import React, { useState } from 'react';
import { Stock, PriceAlert, AlertCondition } from '../types';
import { 
  Bell, 
  Plus, 
  Volume2, 
  Smartphone, 
  CheckCircle2, 
  AlertTriangle, 
  Trash2, 
  Clock,
  Play
} from 'lucide-react';
import { audioAlerts } from '../utils/audioAlert';
import { sendBrowserNotification, requestNotificationPermission } from '../utils/notifications';

interface AlertsManagerProps {
  stocks: Stock[];
  alerts: PriceAlert[];
  onAddAlert: (alert: Omit<PriceAlert, 'id' | 'createdAt' | 'isTriggered'>) => void;
  onToggleAlert: (id: string) => void;
  onDeleteAlert: (id: string) => void;
  pushEnabled: boolean;
  onRequestPush: () => void;
  onSelectStock: (stock: Stock) => void;
}

export const AlertsManager: React.FC<AlertsManagerProps> = ({
  stocks,
  alerts,
  onAddAlert,
  onToggleAlert,
  onDeleteAlert,
  pushEnabled,
  onRequestPush,
  onSelectStock,
}) => {
  const [symbol, setSymbol] = useState(stocks[0]?.symbol || 'NVDA');
  const [condition, setCondition] = useState<AlertCondition>('PRICE_ABOVE');
  const [targetValue, setTargetValue] = useState<number>(145);
  const [notifySound, setNotifySound] = useState(true);

  const selectedStock = stocks.find((s) => s.symbol === symbol) || stocks[0];

  const handleConditionChange = (newCond: AlertCondition) => {
    setCondition(newCond);
    if (newCond === 'PRICE_ABOVE') {
      setTargetValue(Number((selectedStock.price * 1.05).toFixed(2)));
    } else if (newCond === 'PRICE_BELOW') {
      setTargetValue(Number((selectedStock.price * 0.95).toFixed(2)));
    } else if (newCond === 'PERCENT_CHANGE_UP' || newCond === 'PERCENT_CHANGE_DOWN') {
      setTargetValue(3.0);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddAlert({
      symbol,
      condition,
      targetValue: condition.includes('SIGNAL') || condition.includes('RSI') ? undefined : Number(targetValue),
      active: true,
      notifySound,
    });
    // Trigger confirmation sound
    if (notifySound) {
      audioAlerts.playNotificationPing();
    }
  };

  const handleTestAlert = () => {
    audioAlerts.playBuySignalChime();
    sendBrowserNotification('Stock Portfolio Alert Triggered', {
      body: `TEST ALERT: ${selectedStock.symbol} price alert and buy signal notification verified.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Alert Header & Push Notification Banner */}
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md p-5 shadow-xl shadow-black/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-cyan-500/20 border border-cyan-500/40 px-2 py-0.5 text-[10px] font-bold text-cyan-300">
                MULTI-DEVICE PRICE & SIGNAL DISPATCH
              </span>
              <span className="text-xs text-slate-400">Desktop & Mobile Seamless Monitoring</span>
            </div>
            <h2 className="mt-1 text-lg font-bold text-slate-100">
              Automated Buy/Sell & Technical Indicator Alerts
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Get notified instantly via Web Audio acoustic bells, in-app banners, and HTML5 Push notifications.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!pushEnabled && (
              <button
                type="button"
                onClick={onRequestPush}
                className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:opacity-90 transition shadow-md shadow-cyan-500/20"
              >
                <Smartphone className="h-4 w-4" /> Enable Device Push
              </button>
            )}
            <button
              type="button"
              onClick={handleTestAlert}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
            >
              <Play className="h-3.5 w-3.5 text-cyan-400" /> Test Sound & Push
            </button>
          </div>
        </div>
      </div>

      {/* Alert Builder Form */}
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md p-6 shadow-xl shadow-black/40">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100 mb-4 flex items-center gap-2">
          <Plus className="h-4 w-4 text-cyan-400" /> Create Custom Price / Signal Alert Rule
        </h3>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Target Stock */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Select Stock
            </label>
            <select
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-mono font-bold text-slate-100 focus:border-cyan-400 focus:outline-none"
            >
              {stocks.map((s) => (
                <option key={s.symbol} value={s.symbol}>
                  {s.symbol} (${s.price.toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          {/* Condition Type */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Trigger Condition
            </label>
            <select
              value={condition}
              onChange={(e) => handleConditionChange(e.target.value as AlertCondition)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none"
            >
              <option value="PRICE_ABOVE">Price Rises Above ($)</option>
              <option value="PRICE_BELOW">Price Drops Below ($)</option>
              <option value="PERCENT_CHANGE_UP">Daily Gain Exceeds (%)</option>
              <option value="PERCENT_CHANGE_DOWN">Daily Loss Exceeds (%)</option>
              <option value="SIGNAL_BUY">Algorithm Triggers BUY Signal</option>
              <option value="SIGNAL_SELL">Algorithm Triggers SELL Signal</option>
              <option value="RSI_OVERSOLD">RSI Drops Below 30 (Oversold)</option>
              <option value="RSI_OVERBOUGHT">RSI Rises Above 70 (Overbought)</option>
            </select>
          </div>

          {/* Threshold Target Value */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              {condition.includes('PERCENT') ? 'Target Percentage (%)' : condition.includes('PRICE') ? 'Target Price ($)' : 'Indicator Target'}
            </label>
            <input
              type="number"
              step="0.01"
              disabled={condition.includes('SIGNAL') || condition.includes('RSI')}
              value={targetValue}
              onChange={(e) => setTargetValue(Number(e.target.value))}
              placeholder={condition.includes('SIGNAL') || condition.includes('RSI') ? 'Automatic trigger' : 'e.g. 150.00'}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-mono text-slate-100 disabled:opacity-40 focus:border-cyan-400 focus:outline-none"
            />
          </div>

          {/* Action / Submit */}
          <div className="flex items-end gap-3">
            <label className="flex items-center gap-1.5 text-xs text-slate-400 mb-2 cursor-pointer">
              <input
                type="checkbox"
                checked={notifySound}
                onChange={(e) => setNotifySound(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-cyan-400 focus:ring-cyan-500"
              />
              <Volume2 className="h-3.5 w-3.5 text-cyan-400" />
              Chime
            </label>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-cyan-500 py-2 px-4 text-xs font-bold text-slate-950 shadow-md shadow-cyan-500/20 hover:bg-cyan-400 active:scale-95 transition"
            >
              Add Alert
            </button>
          </div>
        </form>
      </div>

      {/* Active Alerts List */}
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md shadow-xl shadow-black/40 overflow-hidden">
        <div className="p-4 border-b border-slate-800">
          <h3 className="text-sm font-bold text-slate-100">
            Active Monitored Alert Rules ({alerts.filter((a) => a.active).length})
          </h3>
        </div>

        {alerts.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No active alerts configured. Use the form above to add real-time price thresholds or buy/sell signal alerts.
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {alerts.map((alert) => {
              const stock = stocks.find((s) => s.symbol === alert.symbol);
              return (
                <div key={alert.id} className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => stock && onSelectStock(stock)}
                      className="rounded bg-slate-800 border border-slate-700 px-2 py-1 font-mono text-xs font-bold text-cyan-300 hover:border-cyan-400 hover:text-white transition"
                    >
                      {alert.symbol}
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-100">
                          {alert.condition.replace(/_/g, ' ')}
                        </span>
                        {alert.targetValue !== undefined && (
                          <span className="font-mono text-xs font-bold text-cyan-400">
                            {alert.condition.includes('PERCENT') ? `${alert.targetValue}%` : `$${alert.targetValue.toFixed(2)}`}
                          </span>
                        )}
                        {alert.isTriggered && (
                          <span className="rounded bg-rose-500/20 border border-rose-500/40 px-1.5 py-0.2 text-[10px] font-bold text-rose-300">
                            TRIGGERED
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                        <span>Current: ${stock?.price.toFixed(2)}</span>
                        <span>•</span>
                        <span>Created: {new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onToggleAlert(alert.id)}
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold transition ${
                        alert.active
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {alert.active ? 'Active' : 'Paused'}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteAlert(alert.id)}
                      className="rounded p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                      title="Delete Alert"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
