export interface CandleData {
  timestamp: number;
  dateStr: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type TimeFrame = '1D' | '1W' | '1M' | '1Y' | '5Y';

export type SignalType = 'STRONG BUY' | 'BUY' | 'NEUTRAL' | 'SELL' | 'STRONG SELL';

export interface AnalystFirmRating {
  firm: string;
  rating: string;
  targetPrice: number;
  date: string;
}

export interface PressRelease {
  id: string;
  title: string;
  source: string;
  time: string;
  summary: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  category: 'Earnings' | 'Product Launch' | 'Partnership' | 'Regulatory' | 'SEC Filing';
}

export interface Stock {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  previousClose: number;
  change: number;
  changePercent: number;
  volume: string;
  avgVolume: string;
  marketCap: string;
  peRatio: number;
  high52: number;
  low52: number;
  dayHigh: number;
  dayLow: number;
  open: number;
  
  // Technicals
  rsi: number;
  macd: {
    macdLine: number;
    signalLine: number;
    histogram: number;
  };
  movingAverages: {
    ema20: number;
    ema50: number;
    sma200: number;
  };
  bollingerBands: {
    upper: number;
    middle: number;
    lower: number;
  };
  supportLevel: number;
  resistanceLevel: number;
  technicalSignal: SignalType;
  signalReason: string;
  
  // Sentiment & Social
  sentiment: {
    score: number; // 0-100
    bullishPercent: number;
    bearishPercent: number;
    neutralPercent: number;
    mentions24h: number;
    sentimentTrend: 'rising' | 'neutral' | 'falling';
    topThemes: string[];
  };

  // Analyst Consensus
  analyst: {
    consensus: 'Strong Buy' | 'Buy' | 'Hold' | 'Underperform' | 'Sell';
    targetPrice: number;
    targetHigh: number;
    targetLow: number;
    analystCount: number;
    buyCount: number;
    holdCount: number;
    sellCount: number;
    firms: AnalystFirmRating[];
  };

  // Press releases and news
  pressReleases: PressRelease[];
}

export interface PortfolioHolding {
  id: string;
  symbol: string;
  shares: number;
  averageBuyPrice: number;
  dateAdded: string;
}

export interface PortfolioTransaction {
  id: string;
  type: 'BUY' | 'SELL';
  symbol: string;
  shares: number;
  price: number;
  total: number;
  date: string;
}

export type AlertCondition = 
  | 'PRICE_ABOVE' 
  | 'PRICE_BELOW' 
  | 'PERCENT_CHANGE_UP' 
  | 'PERCENT_CHANGE_DOWN'
  | 'RSI_OVERBOUGHT' 
  | 'RSI_OVERSOLD' 
  | 'SIGNAL_BUY' 
  | 'SIGNAL_SELL';

export interface PriceAlert {
  id: string;
  symbol: string;
  condition: AlertCondition;
  targetValue?: number;
  active: boolean;
  isTriggered: boolean;
  createdAt: string;
  triggeredAt?: string;
  notifySound: boolean;
  message?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  symbol: string;
  type: 'price' | 'signal' | 'sentiment' | 'news';
  timestamp: string;
  read: boolean;
}

export interface AIAnalysisResult {
  symbol: string;
  signal: SignalType;
  targetPrice: number;
  confidenceScore: number;
  timeHorizon: string;
  catalysts: string[];
  risks: string[];
  pressReleaseSummary: string;
  analystConsensusSummary: string;
  socialSentimentSummary: string;
  suggestedAction: string;
}
