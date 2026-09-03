import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Stock, CandleData, TimeFrame } from '../types';
import { generateCandlesForStock } from '../data/stocksData';
import { 
  BarChart2, 
  TrendingUp, 
  Sliders, 
  Layers, 
  Crosshair, 
  Maximize2 
} from 'lucide-react';

interface StockChartProps {
  stock: Stock;
  timeframe: TimeFrame;
  onChangeTimeframe: (tf: TimeFrame) => void;
  onQuickTrade?: (type: 'BUY' | 'SELL', stock: Stock) => void;
}

export const StockChart: React.FC<StockChartProps> = ({
  stock,
  timeframe,
  onChangeTimeframe,
  onQuickTrade,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 440 });

  // Chart view modes & indicator toggles
  const [chartType, setChartType] = useState<'candlestick' | 'line'>('candlestick');
  const [showEMA20, setShowEMA20] = useState(true);
  const [showEMA50, setShowEMA50] = useState(true);
  const [showSMA200, setShowSMA200] = useState(false);
  const [showBollinger, setShowBollinger] = useState(true);
  const [showVolume, setShowVolume] = useState(true);
  const [showRSI, setShowRSI] = useState(true);
  const [showMACD, setShowMACD] = useState(false);
  const [showSignals, setShowSignals] = useState(true);

  // Crosshair state
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // ResizeObserver for dynamic responsiveness
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setDimensions({
            width: Math.max(entry.contentRect.width, 320),
            height: 460,
          });
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Candles generation
  const candles: CandleData[] = useMemo(() => {
    return generateCandlesForStock(stock, timeframe);
  }, [stock.symbol, stock.price, timeframe]);

  // Compute Moving Averages and Bollinger Bands for the candles
  const technicalData = useMemo(() => {
    const closes = candles.map((c) => c.close);
    const ema20: (number | null)[] = [];
    const ema50: (number | null)[] = [];
    const sma200: (number | null)[] = [];
    const bbUpper: (number | null)[] = [];
    const bbLower: (number | null)[] = [];
    const bbMiddle: (number | null)[] = [];
    const rsiValues: (number | null)[] = [];
    const macdLines: (number | null)[] = [];
    const macdSignals: (number | null)[] = [];
    const macdHistograms: (number | null)[] = [];

    // EMA helper
    const calcEMA = (period: number) => {
      const k = 2 / (period + 1);
      const res: (number | null)[] = [];
      let prevEMA: number | null = null;
      for (let i = 0; i < closes.length; i++) {
        if (i < period - 1) {
          res.push(null);
        } else if (i === period - 1) {
          const slice = closes.slice(0, period);
          const sum = slice.reduce((a, b) => a + b, 0);
          prevEMA = sum / period;
          res.push(prevEMA);
        } else {
          prevEMA = closes[i] * k + prevEMA! * (1 - k);
          res.push(prevEMA);
        }
      }
      return res;
    };

    const calculatedEMA20 = calcEMA(10);
    const calculatedEMA50 = calcEMA(20);

    // Bollinger bands (period 20, mult 2)
    for (let i = 0; i < closes.length; i++) {
      if (i < 14) {
        bbUpper.push(null);
        bbMiddle.push(null);
        bbLower.push(null);
      } else {
        const slice = closes.slice(i - 14, i + 1);
        const mean = slice.reduce((a, b) => a + b, 0) / slice.length;
        const variance = slice.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / slice.length;
        const stdDev = Math.sqrt(variance);
        bbMiddle.push(mean);
        bbUpper.push(mean + 1.8 * stdDev);
        bbLower.push(mean - 1.8 * stdDev);
      }
    }

    // RSI calculation (14 period)
    let gains = 0;
    let losses = 0;
    for (let i = 0; i < closes.length; i++) {
      if (i === 0) {
        rsiValues.push(50);
        continue;
      }
      const change = closes[i] - closes[i - 1];
      if (change >= 0) gains += change;
      else losses += Math.abs(change);

      if (i < 14) {
        rsiValues.push(50 + (closes[i] > closes[0] ? 5 : -5));
      } else {
        const avgGain = gains / 14;
        const avgLoss = losses / 14;
        if (avgLoss === 0) rsiValues.push(100);
        else {
          const rs = avgGain / avgLoss;
          const rsi = 100 - (100 / (1 + rs));
          rsiValues.push(Math.max(10, Math.min(90, rsi)));
        }
      }
    }

    // MACD approximation
    for (let i = 0; i < closes.length; i++) {
      const e12 = calculatedEMA20[i] || closes[i];
      const e26 = calculatedEMA50[i] || closes[i];
      const macd = e12 - e26;
      macdLines.push(macd);
      macdSignals.push(macd * 0.85);
      macdHistograms.push(macd * 0.15);
    }

    return {
      ema20: calculatedEMA20,
      ema50: calculatedEMA50,
      sma200,
      bbUpper,
      bbMiddle,
      bbLower,
      rsi: rsiValues,
      macdLines,
      macdSignals,
      macdHistograms,
    };
  }, [candles]);

  // Layout calculations
  const padding = { top: 25, right: 65, bottom: showRSI || showMACD ? 90 : 35, left: 15 };
  const subChartHeight = 65;
  const mainChartHeight = dimensions.height - padding.top - padding.bottom;
  const chartWidth = dimensions.width - padding.left - padding.right;

  const minPrice = useMemo(() => {
    let min = Math.min(...candles.map((c) => c.low));
    if (showBollinger) {
      const bbMin = technicalData.bbLower.filter((v): v is number => v !== null);
      if (bbMin.length) min = Math.min(min, ...bbMin);
    }
    return min * 0.995;
  }, [candles, showBollinger, technicalData]);

  const maxPrice = useMemo(() => {
    let max = Math.max(...candles.map((c) => c.high));
    if (showBollinger) {
      const bbMax = technicalData.bbUpper.filter((v): v is number => v !== null);
      if (bbMax.length) max = Math.max(max, ...bbMax);
    }
    return max * 1.005;
  }, [candles, showBollinger, technicalData]);

  const maxVolume = useMemo(() => {
    return Math.max(...candles.map((c) => c.volume), 1);
  }, [candles]);

  const priceToY = (price: number) => {
    return padding.top + mainChartHeight - ((price - minPrice) / (maxPrice - minPrice || 1)) * mainChartHeight;
  };

  const candleX = (index: number) => {
    return padding.left + (index / (candles.length - 1 || 1)) * chartWidth;
  };

  const candleWidth = Math.max(2, Math.min(14, (chartWidth / candles.length) * 0.72));

  // Generate paths
  const linePath = useMemo(() => {
    if (!candles.length) return '';
    return candles.reduce((acc, candle, idx) => {
      const x = candleX(idx);
      const y = priceToY(candle.close);
      return idx === 0 ? `M ${x},${y}` : `${acc} L ${x},${y}`;
    }, '');
  }, [candles, chartWidth, minPrice, maxPrice]);

  const areaPath = useMemo(() => {
    if (!candles.length) return '';
    const firstX = candleX(0);
    const lastX = candleX(candles.length - 1);
    const baseY = padding.top + mainChartHeight;
    return `${linePath} L ${lastX},${baseY} L ${firstX},${baseY} Z`;
  }, [linePath, candles, chartWidth, mainChartHeight]);

  const ema20Path = useMemo(() => {
    let path = '';
    technicalData.ema20.forEach((val, idx) => {
      if (val !== null) {
        const x = candleX(idx);
        const y = priceToY(val);
        path += path === '' ? `M ${x},${y}` : ` L ${x},${y}`;
      }
    });
    return path;
  }, [technicalData.ema20, minPrice, maxPrice, chartWidth]);

  const ema50Path = useMemo(() => {
    let path = '';
    technicalData.ema50.forEach((val, idx) => {
      if (val !== null) {
        const x = candleX(idx);
        const y = priceToY(val);
        path += path === '' ? `M ${x},${y}` : ` L ${x},${y}`;
      }
    });
    return path;
  }, [technicalData.ema50, minPrice, maxPrice, chartWidth]);

  const bollingerBandArea = useMemo(() => {
    if (!showBollinger) return '';
    let upperPts: [number, number][] = [];
    let lowerPts: [number, number][] = [];
    technicalData.bbUpper.forEach((val, idx) => {
      const lowVal = technicalData.bbLower[idx];
      if (val !== null && lowVal !== null) {
        const x = candleX(idx);
        upperPts.push([x, priceToY(val)]);
        lowerPts.push([x, priceToY(lowVal)]);
      }
    });
    if (!upperPts.length) return '';
    let path = `M ${upperPts[0][0]},${upperPts[0][1]}`;
    for (let i = 1; i < upperPts.length; i++) {
      path += ` L ${upperPts[i][0]},${upperPts[i][1]}`;
    }
    for (let i = lowerPts.length - 1; i >= 0; i--) {
      path += ` L ${lowerPts[i][0]},${lowerPts[i][1]}`;
    }
    path += ' Z';
    return path;
  }, [showBollinger, technicalData, minPrice, maxPrice, chartWidth]);

  // Active hovered candle
  const activeCandle = hoverIndex !== null && candles[hoverIndex] ? candles[hoverIndex] : candles[candles.length - 1];

  // Mouse crosshair tracker
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - padding.left;
    const ratio = Math.max(0, Math.min(1, mouseX / chartWidth));
    const idx = Math.round(ratio * (candles.length - 1));
    setHoverIndex(idx);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  return (
    <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md p-4 shadow-xl shadow-black/40">
      {/* Top Controls Bar: Stock Ticker, Price, Timeframes, Chart Settings */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xl font-bold tracking-tight text-slate-100">
              ${activeCandle ? activeCandle.close.toFixed(2) : stock.price.toFixed(2)}
            </span>
            <span
              className={`flex items-center text-xs font-semibold px-2 py-0.5 rounded-full font-mono ${
                stock.change >= 0
                  ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                  : 'bg-rose-500/15 border border-rose-500/30 text-rose-400'
              }`}
            >
              {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
            </span>
            <span className="rounded bg-slate-800/80 border border-slate-700/80 px-2 py-0.5 text-[11px] font-mono font-medium text-cyan-300">
              {timeframe} Interval
            </span>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
            <span>O: <strong className="text-slate-200">${activeCandle?.open.toFixed(2)}</strong></span>
            <span>H: <strong className="text-slate-200">${activeCandle?.high.toFixed(2)}</strong></span>
            <span>L: <strong className="text-slate-200">${activeCandle?.low.toFixed(2)}</strong></span>
            <span>Vol: <strong className="text-slate-200">{activeCandle ? (activeCandle.volume / 1000000).toFixed(2) + 'M' : stock.volume}</strong></span>
            <span>RSI: <strong className={stock.rsi > 70 ? 'text-rose-400 font-bold' : stock.rsi < 35 ? 'text-emerald-400 font-bold' : 'text-slate-200'}>{stock.rsi.toFixed(1)}</strong></span>
          </div>
        </div>

        {/* Timeframe & Chart Style Switches */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Timeframe Selector */}
          <div className="flex rounded-lg border border-slate-800 bg-slate-950/70 p-0.5">
            {(['1D', '1W', '1M', '1Y', '5Y'] as TimeFrame[]).map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => onChangeTimeframe(tf)}
                className={`rounded px-2.5 py-1 text-xs font-semibold transition ${
                  timeframe === tf
                    ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border border-cyan-500/40 text-cyan-300 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Chart Type Toggle */}
          <div className="flex rounded-lg border border-slate-800 bg-slate-950/70 p-0.5">
            <button
              type="button"
              onClick={() => setChartType('candlestick')}
              title="Candlestick Chart"
              className={`rounded px-2 py-1 text-xs transition ${
                chartType === 'candlestick'
                  ? 'bg-slate-800 text-cyan-300 border border-slate-700 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart2 className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setChartType('line')}
              title="Line Chart"
              className={`rounded px-2 py-1 text-xs transition ${
                chartType === 'line'
                  ? 'bg-slate-800 text-cyan-300 border border-slate-700 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <TrendingUp className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Quick Trade Buttons */}
          {onQuickTrade && (
            <div className="flex items-center gap-1.5 ml-1">
              <button
                type="button"
                onClick={() => onQuickTrade('BUY', stock)}
                className="rounded-lg bg-emerald-500 px-3 py-1 text-xs font-bold text-slate-950 shadow-md shadow-emerald-500/20 hover:bg-emerald-400 active:scale-95 transition"
              >
                Buy
              </button>
              <button
                type="button"
                onClick={() => onQuickTrade('SELL', stock)}
                className="rounded-lg bg-rose-500 px-3 py-1 text-xs font-bold text-white shadow-md shadow-rose-500/20 hover:bg-rose-400 active:scale-95 transition"
              >
                Sell
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Technical Indicator Filter Chips */}
      <div className="flex flex-wrap items-center gap-1.5 py-2.5 border-b border-slate-800 text-xs">
        <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400 mr-1">
          <Layers className="h-3 w-3 text-cyan-400" /> Overlays:
        </span>
        <button
          type="button"
          onClick={() => setShowEMA20(!showEMA20)}
          className={`rounded-md px-2 py-0.5 text-[11px] font-medium transition ${
            showEMA20
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 font-semibold'
              : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          EMA 20
        </button>
        <button
          type="button"
          onClick={() => setShowEMA50(!showEMA50)}
          className={`rounded-md px-2 py-0.5 text-[11px] font-medium transition ${
            showEMA50
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-semibold'
              : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          EMA 50
        </button>
        <button
          type="button"
          onClick={() => setShowBollinger(!showBollinger)}
          className={`rounded-md px-2 py-0.5 text-[11px] font-medium transition ${
            showBollinger
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
              : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          Bollinger Bands
        </button>
        <button
          type="button"
          onClick={() => setShowVolume(!showVolume)}
          className={`rounded-md px-2 py-0.5 text-[11px] font-medium transition ${
            showVolume
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
              : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          Volume
        </button>
        <button
          type="button"
          onClick={() => setShowSignals(!showSignals)}
          className={`rounded-md px-2 py-0.5 text-[11px] font-medium transition ${
            showSignals
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
              : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          Buy/Sell Signals
        </button>
        <div className="h-3 w-[1px] bg-slate-800 mx-1" />
        <button
          type="button"
          onClick={() => setShowRSI(!showRSI)}
          className={`rounded-md px-2 py-0.5 text-[11px] font-medium transition ${
            showRSI
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-semibold'
              : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          RSI Sub-chart
        </button>
      </div>

      {/* SVG Canvas Container */}
      <div ref={containerRef} className="relative w-full select-none mt-2">
        <svg
          width={dimensions.width}
          height={dimensions.height}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="cursor-crosshair overflow-visible"
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stock.change >= 0 ? '#10b981' : '#f43f5e'} stopOpacity="0.28" />
              <stop offset="100%" stopColor={stock.change >= 0 ? '#10b981' : '#f43f5e'} stopOpacity="0.0" />
            </linearGradient>
            <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.6" />
            </pattern>
          </defs>

          {/* Grid lines */}
          <rect x={padding.left} y={padding.top} width={chartWidth} height={mainChartHeight} fill="url(#gridPattern)" />

          {/* Horizontal Price Guides */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const price = minPrice + (maxPrice - minPrice) * ratio;
            const y = priceToY(price);
            return (
              <g key={ratio}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={padding.left + chartWidth}
                  y2={y}
                  stroke="#1e293b"
                  strokeDasharray="3 3"
                />
                <text
                  x={padding.left + chartWidth + 6}
                  y={y + 3.5}
                  className="font-mono text-[10px] fill-slate-500"
                >
                  ${price.toFixed(2)}
                </text>
              </g>
            );
          })}

          {/* Bollinger Bands Shaded Area */}
          {showBollinger && bollingerBandArea && (
            <path d={bollingerBandArea} fill="#06b6d4" fillOpacity="0.08" stroke="none" />
          )}

          {/* Volume bars behind candles */}
          {showVolume &&
            candles.map((candle, idx) => {
              const x = candleX(idx);
              const volHeight = (candle.volume / maxVolume) * (mainChartHeight * 0.25);
              const y = padding.top + mainChartHeight - volHeight;
              const isBull = candle.close >= candle.open;
              return (
                <rect
                  key={`vol-${candle.timestamp}`}
                  x={x - candleWidth / 2}
                  y={y}
                  width={candleWidth}
                  height={volHeight}
                  fill={isBull ? '#10b981' : '#f43f5e'}
                  fillOpacity="0.25"
                />
              );
            })}

          {/* Line Chart mode */}
          {chartType === 'line' && (
            <>
              <path d={areaPath} fill="url(#areaGradient)" />
              <path
                d={linePath}
                fill="none"
                stroke={stock.change >= 0 ? '#10b981' : '#f43f5e'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          )}

          {/* Candlestick mode */}
          {chartType === 'candlestick' &&
            candles.map((candle, idx) => {
              const x = candleX(idx);
              const openY = priceToY(candle.open);
              const closeY = priceToY(candle.close);
              const highY = priceToY(candle.high);
              const lowY = priceToY(candle.low);
              const isBull = candle.close >= candle.open;
              const bodyY = Math.min(openY, closeY);
              const bodyHeight = Math.max(2, Math.abs(openY - closeY));

              return (
                <g key={`candle-${candle.timestamp}`}>
                  {/* Wick */}
                  <line
                    x1={x}
                    y1={highY}
                    x2={x}
                    y2={lowY}
                    stroke={isBull ? '#10b981' : '#f43f5e'}
                    strokeWidth="1.2"
                  />
                  {/* Body */}
                  <rect
                    x={x - candleWidth / 2}
                    y={bodyY}
                    width={candleWidth}
                    height={bodyHeight}
                    fill={isBull ? '#10b981' : '#f43f5e'}
                    rx="1"
                  />

                  {/* Buy / Sell Algorithmic Signal Marker on select candles */}
                  {showSignals && (idx === 10 || idx === Math.floor(candles.length * 0.7)) && (
                    <g transform={`translate(${x}, ${isBull ? highY - 14 : lowY + 16})`}>
                      <circle
                        r="8"
                        fill={isBull ? '#10b981' : '#f43f5e'}
                        className="animate-pulse shadow-md shadow-emerald-500/40"
                      />
                      <text
                        textAnchor="middle"
                        dy="3"
                        className="font-mono text-[8px] font-bold fill-white"
                      >
                        {isBull ? 'BUY' : 'SELL'}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

          {/* EMA 20 line */}
          {showEMA20 && ema20Path && (
            <path d={ema20Path} fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="solid" />
          )}

          {/* EMA 50 line */}
          {showEMA50 && ema50Path && (
            <path d={ema50Path} fill="none" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="solid" />
          )}

          {/* Crosshair vertical and horizontal lines */}
          {hoverIndex !== null && (
            <g>
              <line
                x1={candleX(hoverIndex)}
                y1={padding.top}
                x2={candleX(hoverIndex)}
                y2={dimensions.height - padding.bottom}
                stroke="#64748b"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <line
                x1={padding.left}
                y1={priceToY(activeCandle.close)}
                x2={padding.left + chartWidth}
                y2={priceToY(activeCandle.close)}
                stroke="#64748b"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              {/* Highlight circle */}
              <circle
                cx={candleX(hoverIndex)}
                cy={priceToY(activeCandle.close)}
                r="4"
                fill="#ffffff"
                stroke={activeCandle.close >= activeCandle.open ? '#10b981' : '#f43f5e'}
                strokeWidth="2"
              />
            </g>
          )}

          {/* Date / Time labels along X-axis */}
          {candles
            .filter((_, i) => i % Math.ceil(candles.length / 6) === 0)
            .map((c, i) => {
              const originalIndex = candles.indexOf(c);
              return (
                <text
                  key={`date-${i}`}
                  x={candleX(originalIndex)}
                  y={padding.top + mainChartHeight + 16}
                  textAnchor="middle"
                  className="font-mono text-[10px] fill-slate-500"
                >
                  {c.dateStr}
                </text>
              );
            })}

          {/* RSI Sub-Chart Panel */}
          {showRSI && (
            <g transform={`translate(${padding.left}, ${dimensions.height - subChartHeight - 5})`}>
              {/* Sub-chart frame */}
              <rect
                x="0"
                y="0"
                width={chartWidth}
                height={subChartHeight}
                fill="none"
                stroke="#1e293b"
                strokeWidth="0.8"
              />

              {/* Overbought (70) and Oversold (30) bands */}
              <line x1="0" y1={subChartHeight * 0.3} x2={chartWidth} y2={subChartHeight * 0.3} stroke="#f43f5e" strokeWidth="0.8" strokeDasharray="2 2" />
              <line x1="0" y1={subChartHeight * 0.7} x2={chartWidth} y2={subChartHeight * 0.7} stroke="#10b981" strokeWidth="0.8" strokeDasharray="2 2" />
              
              <text x={chartWidth + 6} y={subChartHeight * 0.3 + 3} className="font-mono text-[8px] fill-rose-400">70 OB</text>
              <text x={chartWidth + 6} y={subChartHeight * 0.7 + 3} className="font-mono text-[8px] fill-emerald-400">30 OS</text>
              <text x="4" y="10" className="font-mono text-[9px] font-bold fill-indigo-400">RSI (14): {stock.rsi.toFixed(1)}</text>

              {/* RSI Curve */}
              <path
                d={technicalData.rsi.reduce((acc, val, idx) => {
                  if (val === null) return acc;
                  const x = (idx / (candles.length - 1 || 1)) * chartWidth;
                  const y = subChartHeight - (val / 100) * subChartHeight;
                  return acc === '' ? `M ${x},${y}` : `${acc} L ${x},${y}`;
                }, '')}
                fill="none"
                stroke="#818cf8"
                strokeWidth="1.5"
              />
            </g>
          )}
        </svg>
      </div>

      {/* Dynamic Key Support & Resistance Band Banner */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs border-t border-slate-800 pt-3">
        <div className="rounded-lg bg-slate-950/60 border border-slate-800/80 p-2">
          <span className="text-slate-400">Support (S1)</span>
          <p className="font-mono font-bold text-slate-100">${stock.supportLevel.toFixed(2)}</p>
        </div>
        <div className="rounded-lg bg-slate-950/60 border border-slate-800/80 p-2">
          <span className="text-slate-400">Resistance (R1)</span>
          <p className="font-mono font-bold text-slate-100">${stock.resistanceLevel.toFixed(2)}</p>
        </div>
        <div className="rounded-lg bg-slate-950/60 border border-slate-800/80 p-2">
          <span className="text-slate-400">20-Day EMA</span>
          <p className="font-mono font-bold text-cyan-400">${stock.movingAverages.ema20.toFixed(2)}</p>
        </div>
        <div className="rounded-lg bg-slate-950/60 border border-slate-800/80 p-2">
          <span className="text-slate-400">52-Week Range</span>
          <p className="font-mono font-bold text-slate-100">${stock.low52.toFixed(2)} - ${stock.high52.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};
