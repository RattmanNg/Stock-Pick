import { Stock, CandleData, TimeFrame } from '../types';

export const INITIAL_STOCKS: Stock[] = [
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    sector: 'Semiconductors & AI Hardware',
    price: 138.45,
    previousClose: 135.20,
    change: 3.25,
    changePercent: 2.40,
    volume: '54.2M',
    avgVolume: '48.9M',
    marketCap: '$3.41T',
    peRatio: 48.2,
    high52: 140.76,
    low52: 45.11,
    dayHigh: 139.80,
    dayLow: 135.40,
    open: 135.90,
    rsi: 64.8,
    macd: {
      macdLine: 2.85,
      signalLine: 2.15,
      histogram: 0.70,
    },
    movingAverages: {
      ema20: 132.80,
      ema50: 125.40,
      sma200: 104.50,
    },
    bollingerBands: {
      upper: 142.10,
      middle: 133.50,
      lower: 124.90,
    },
    supportLevel: 130.00,
    resistanceLevel: 141.00,
    technicalSignal: 'BUY',
    signalReason: 'Bullish MACD crossover above zero line with price holding firmly above 20 & 50 EMAs.',
    sentiment: {
      score: 84,
      bullishPercent: 78,
      bearishPercent: 12,
      neutralPercent: 10,
      mentions24h: 38400,
      sentimentTrend: 'rising',
      topThemes: ['Blackwell Ultra', 'Hyperscale Capex', 'Datacenter AI', 'CUDA Moat'],
    },
    analyst: {
      consensus: 'Strong Buy',
      targetPrice: 165.00,
      targetHigh: 200.00,
      targetLow: 120.00,
      analystCount: 42,
      buyCount: 38,
      holdCount: 4,
      sellCount: 0,
      firms: [
        { firm: 'Goldman Sachs', rating: 'Conviction Buy', targetPrice: 175.00, date: 'Yesterday' },
        { firm: 'Morgan Stanley', rating: 'Overweight', targetPrice: 168.00, date: '2 days ago' },
        { firm: 'Bank of America', rating: 'Buy', targetPrice: 170.00, date: '3 days ago' },
        { firm: 'Bernstein', rating: 'Outperform', targetPrice: 155.00, date: 'Last week' },
      ],
    },
    pressReleases: [
      {
        id: 'nvda-pr-1',
        title: 'NVIDIA Accelerates Next-Generation AI Supercomputing Clusters with Blackwell Ultra Architecture',
        source: 'NVIDIA Press Desk',
        time: '4 hours ago',
        summary: 'Shipments of GB200 NVL72 liquid-cooled racks ramp up globally with top cloud hyperscalers expanding initial orders by 25%.',
        sentiment: 'positive',
        category: 'Product Launch',
      },
      {
        id: 'nvda-pr-2',
        title: 'Q2 Operating Margins Exceed Guidance on Enterprise AI Software Monetization',
        source: 'SEC 8-K Filing',
        time: '1 day ago',
        summary: 'Gross margins remained resilient at 75.1% alongside a $50B expanded share repurchase authorization.',
        sentiment: 'positive',
        category: 'Earnings',
      },
      {
        id: 'nvda-pr-3',
        title: 'Partnership with Global Telecoms to Deploy Sovereign Edge AI Infrastructure',
        source: 'Bloomberg Terminal',
        time: '3 days ago',
        summary: 'Strategic agreements across Europe and APAC established to build localized generative AI supercomputers.',
        sentiment: 'positive',
        category: 'Partnership',
      },
    ],
  },
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    sector: 'Consumer Electronics & Software',
    price: 232.10,
    previousClose: 229.85,
    change: 2.25,
    changePercent: 0.98,
    volume: '46.1M',
    avgVolume: '52.3M',
    marketCap: '$3.52T',
    peRatio: 34.5,
    high52: 237.23,
    low52: 164.08,
    dayHigh: 233.40,
    dayLow: 229.70,
    open: 230.15,
    rsi: 58.4,
    macd: {
      macdLine: 1.45,
      signalLine: 1.10,
      histogram: 0.35,
    },
    movingAverages: {
      ema20: 228.60,
      ema50: 222.10,
      sma200: 198.40,
    },
    bollingerBands: {
      upper: 236.80,
      middle: 229.20,
      lower: 221.60,
    },
    supportLevel: 226.50,
    resistanceLevel: 237.00,
    technicalSignal: 'BUY',
    signalReason: 'Solid consolidation above 20-day EMA with expanding Services revenue and Apple Intelligence rollouts.',
    sentiment: {
      score: 72,
      bullishPercent: 65,
      bearishPercent: 15,
      neutralPercent: 20,
      mentions24h: 29100,
      sentimentTrend: 'rising',
      topThemes: ['Apple Intelligence', 'Services All-Time High', 'iPhone 16 Cycle', 'China Rebound'],
    },
    analyst: {
      consensus: 'Buy',
      targetPrice: 250.00,
      targetHigh: 275.00,
      targetLow: 185.00,
      analystCount: 39,
      buyCount: 29,
      holdCount: 8,
      sellCount: 2,
      firms: [
        { firm: 'Wedbush', rating: 'Outperform', targetPrice: 275.00, date: '1 day ago' },
        { firm: 'JPMorgan', rating: 'Overweight', targetPrice: 265.00, date: '3 days ago' },
        { firm: 'Barclays', rating: 'Equal Weight', targetPrice: 210.00, date: 'Last week' },
      ],
    },
    pressReleases: [
      {
        id: 'aapl-pr-1',
        title: 'Apple Expands Siri and Apple Intelligence Localization Across European & Asian Markets',
        source: 'Apple Newsroom',
        time: '6 hours ago',
        summary: 'New localized on-device language models rollout with privacy-centric Private Cloud Compute verification.',
        sentiment: 'positive',
        category: 'Product Launch',
      },
      {
        id: 'aapl-pr-2',
        title: 'Services Segment Sets All-Time Quarterly Revenue Record Surpassing $25B',
        source: 'SEC 10-Q Quarterly Filing',
        time: '2 days ago',
        summary: 'Subscribers across App Store, Apple Music, iCloud, and Apple Pay surpass 1.05 billion paid accounts.',
        sentiment: 'positive',
        category: 'Earnings',
      },
    ],
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    sector: 'Cloud & Enterprise Software',
    price: 442.80,
    previousClose: 446.50,
    change: -3.70,
    changePercent: -0.83,
    volume: '18.9M',
    avgVolume: '21.5M',
    marketCap: '$3.29T',
    peRatio: 36.1,
    high52: 468.35,
    low52: 327.26,
    dayHigh: 447.20,
    dayLow: 441.50,
    open: 445.00,
    rsi: 48.2,
    macd: {
      macdLine: -0.85,
      signalLine: -0.30,
      histogram: -0.55,
    },
    movingAverages: {
      ema20: 446.20,
      ema50: 448.90,
      sma200: 420.50,
    },
    bollingerBands: {
      upper: 458.20,
      middle: 446.10,
      lower: 434.00,
    },
    supportLevel: 438.00,
    resistanceLevel: 456.00,
    technicalSignal: 'NEUTRAL',
    signalReason: 'Testing 50-day EMA support amidst temporary tech rotation; watch for bounce near $438.',
    sentiment: {
      score: 68,
      bullishPercent: 62,
      bearishPercent: 18,
      neutralPercent: 20,
      mentions24h: 19400,
      sentimentTrend: 'neutral',
      topThemes: ['Azure Growth', 'Copilot Enterprise Seats', 'Cybersecurity Suite', 'Capex Horizon'],
    },
    analyst: {
      consensus: 'Strong Buy',
      targetPrice: 495.00,
      targetHigh: 550.00,
      targetLow: 430.00,
      analystCount: 44,
      buyCount: 40,
      holdCount: 4,
      sellCount: 0,
      firms: [
        { firm: 'Morgan Stanley', rating: 'Top Pick / Overweight', targetPrice: 520.00, date: 'Yesterday' },
        { firm: 'Jefferies', rating: 'Buy', targetPrice: 500.00, date: '4 days ago' },
        { firm: 'Citi', rating: 'Buy', targetPrice: 485.00, date: 'Last week' },
      ],
    },
    pressReleases: [
      {
        id: 'msft-pr-1',
        title: 'Azure Cloud Platform Signs Multi-Billion Dollar Multi-Year Enterprise AI Contracts',
        source: 'Microsoft Official Blog',
        time: '8 hours ago',
        summary: 'Over 65,000 corporate clients now actively deploy Azure OpenAI models with 29% YoY commercial cloud expansion.',
        sentiment: 'positive',
        category: 'Partnership',
      },
      {
        id: 'msft-pr-2',
        title: 'Microsoft Announces Carbon-Negative Clean Datacenter Energy PPA Agreements',
        source: 'PR Newswire',
        time: '2 days ago',
        summary: 'Next-generation geothermal and advanced nuclear power purchase agreements signed to sustain AI workloads.',
        sentiment: 'positive',
        category: 'Regulatory',
      },
    ],
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    sector: 'Internet & Artificial Intelligence',
    price: 178.60,
    previousClose: 176.10,
    change: 2.50,
    changePercent: 1.42,
    volume: '23.4M',
    avgVolume: '26.8M',
    marketCap: '$2.21T',
    peRatio: 24.3,
    high52: 191.75,
    low52: 129.40,
    dayHigh: 179.40,
    dayLow: 175.80,
    open: 176.50,
    rsi: 61.2,
    macd: {
      macdLine: 1.60,
      signalLine: 1.15,
      histogram: 0.45,
    },
    movingAverages: {
      ema20: 174.50,
      ema50: 171.20,
      sma200: 156.80,
    },
    bollingerBands: {
      upper: 182.40,
      middle: 174.60,
      lower: 166.80,
    },
    supportLevel: 172.00,
    resistanceLevel: 184.00,
    technicalSignal: 'BUY',
    signalReason: 'Attractive valuation (24x P/E) relative to Big Tech peers; Google Cloud profitability inflecting upwards.',
    sentiment: {
      score: 75,
      bullishPercent: 68,
      bearishPercent: 14,
      neutralPercent: 18,
      mentions24h: 24300,
      sentimentTrend: 'rising',
      topThemes: ['Gemini 3 Architecture', 'Google Cloud Margin', 'Search Overviews Ad Revenue', 'Waymo Expansion'],
    },
    analyst: {
      consensus: 'Strong Buy',
      targetPrice: 205.00,
      targetHigh: 230.00,
      targetLow: 170.00,
      analystCount: 38,
      buyCount: 33,
      holdCount: 5,
      sellCount: 0,
      firms: [
        { firm: 'BofA Global Research', rating: 'Buy', targetPrice: 215.00, date: '2 days ago' },
        { firm: 'Wells Fargo', rating: 'Overweight', targetPrice: 205.00, date: '5 days ago' },
      ],
    },
    pressReleases: [
      {
        id: 'googl-pr-1',
        title: 'Waymo Surpasses 150,000 Commercial Paid Autonomous Rides Per Week',
        source: 'Alphabet Investor Relations',
        time: '12 hours ago',
        summary: 'Robotaxi coverage area triples across Austin and Atlanta with fully autonomous commercial operations.',
        sentiment: 'positive',
        category: 'Product Launch',
      },
      {
        id: 'googl-pr-2',
        title: 'Google DeepMind Unveils Next-Generation Frontier Reasoning Models with Search Grounding',
        source: 'Google Press Desk',
        time: '1 day ago',
        summary: 'Enhanced multimodal speed and native reasoning deployed directly across enterprise Google Workspace.',
        sentiment: 'positive',
        category: 'Product Launch',
      },
    ],
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    sector: 'E-Commerce & AWS Cloud',
    price: 198.30,
    previousClose: 194.80,
    change: 3.50,
    changePercent: 1.80,
    volume: '34.2M',
    avgVolume: '38.0M',
    marketCap: '$2.07T',
    peRatio: 41.6,
    high52: 201.20,
    low52: 118.35,
    dayHigh: 199.10,
    dayLow: 194.90,
    open: 195.40,
    rsi: 66.5,
    macd: {
      macdLine: 2.10,
      signalLine: 1.50,
      histogram: 0.60,
    },
    movingAverages: {
      ema20: 192.50,
      ema50: 187.30,
      sma200: 168.90,
    },
    bollingerBands: {
      upper: 202.80,
      middle: 192.40,
      lower: 182.00,
    },
    supportLevel: 190.00,
    resistanceLevel: 202.00,
    technicalSignal: 'BUY',
    signalReason: 'Testing 52-week all-time highs with accelerating AWS operating income and retail efficiency.',
    sentiment: {
      score: 79,
      bullishPercent: 74,
      bearishPercent: 12,
      neutralPercent: 14,
      mentions24h: 21600,
      sentimentTrend: 'rising',
      topThemes: ['AWS Re-acceleration', 'Prime Logistics Robotics', 'Bedrock Foundation Models', 'Holiday Season Projections'],
    },
    analyst: {
      consensus: 'Strong Buy',
      targetPrice: 228.00,
      targetHigh: 250.00,
      targetLow: 190.00,
      analystCount: 46,
      buyCount: 44,
      holdCount: 2,
      sellCount: 0,
      firms: [
        { firm: 'Cowen', rating: 'Outperform', targetPrice: 235.00, date: 'Yesterday' },
        { firm: 'Needham', rating: 'Buy', targetPrice: 225.00, date: '3 days ago' },
      ],
    },
    pressReleases: [
      {
        id: 'amzn-pr-1',
        title: 'AWS Announces Deployment of Custom Trainium3 AI Accelerators for Generative AI Workloads',
        source: 'AWS News Desk',
        time: '1 day ago',
        summary: 'New Silicon reduces cloud inferencing costs by up to 45% compared to baseline GPU instances.',
        sentiment: 'positive',
        category: 'Product Launch',
      },
    ],
  },
  {
    symbol: 'META',
    name: 'Meta Platforms Inc.',
    sector: 'Social Media & Artificial Intelligence',
    price: 588.20,
    previousClose: 574.90,
    change: 13.30,
    changePercent: 2.31,
    volume: '14.8M',
    avgVolume: '16.5M',
    marketCap: '$1.48T',
    peRatio: 27.8,
    high52: 602.95,
    low52: 279.40,
    dayHigh: 591.40,
    dayLow: 576.20,
    open: 577.00,
    rsi: 69.1,
    macd: {
      macdLine: 7.20,
      signalLine: 5.40,
      histogram: 1.80,
    },
    movingAverages: {
      ema20: 568.10,
      ema50: 542.50,
      sma200: 472.00,
    },
    bollingerBands: {
      upper: 598.00,
      middle: 568.00,
      lower: 538.00,
    },
    supportLevel: 565.00,
    resistanceLevel: 605.00,
    technicalSignal: 'STRONG BUY',
    signalReason: 'Unstoppable momentum supported by algorithmic ad targeting efficiency and Llama open-source standard.',
    sentiment: {
      score: 83,
      bullishPercent: 77,
      bearishPercent: 11,
      neutralPercent: 12,
      mentions24h: 31200,
      sentimentTrend: 'rising',
      topThemes: ['Llama Ecosystem', 'Ray-Ban Meta Glasses', 'Advantage+ Ad ROI', 'Operating Leverage'],
    },
    analyst: {
      consensus: 'Strong Buy',
      targetPrice: 650.00,
      targetHigh: 720.00,
      targetLow: 520.00,
      analystCount: 41,
      buyCount: 37,
      holdCount: 3,
      sellCount: 1,
      firms: [
        { firm: 'UBS', rating: 'Buy', targetPrice: 675.00, date: 'Yesterday' },
        { firm: 'Goldman Sachs', rating: 'Buy', targetPrice: 660.00, date: '4 days ago' },
      ],
    },
    pressReleases: [
      {
        id: 'meta-pr-1',
        title: 'Meta AI Surpasses 500 Million Active Monthly Users Across Instagram and WhatsApp',
        source: 'Meta Investor Relations',
        time: '7 hours ago',
        summary: 'Direct in-app commerce conversions increase 34% driven by tailored generative AI shopping recommendations.',
        sentiment: 'positive',
        category: 'Product Launch',
      },
    ],
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    sector: 'Electric Vehicles & Robotics',
    price: 248.50,
    previousClose: 254.20,
    change: -5.70,
    changePercent: -2.24,
    volume: '68.5M',
    avgVolume: '62.1M',
    marketCap: '$792.8B',
    peRatio: 68.4,
    high52: 271.00,
    low52: 138.80,
    dayHigh: 255.40,
    dayLow: 246.10,
    open: 253.90,
    rsi: 42.1,
    macd: {
      macdLine: -2.40,
      signalLine: -1.10,
      histogram: -1.30,
    },
    movingAverages: {
      ema20: 252.30,
      ema50: 244.80,
      sma200: 220.10,
    },
    bollingerBands: {
      upper: 268.00,
      middle: 252.00,
      lower: 236.00,
    },
    supportLevel: 242.00,
    resistanceLevel: 262.00,
    technicalSignal: 'SELL',
    signalReason: 'Bearish short-term MACD cross; price broke below 20-day EMA. Accumulation recommended only near $240 support.',
    sentiment: {
      score: 52,
      bullishPercent: 49,
      bearishPercent: 38,
      neutralPercent: 13,
      mentions24h: 52000,
      sentimentTrend: 'falling',
      topThemes: ['Cybercab Timeline', 'FSD V13 Release', 'Energy Storage Margins', 'Q3 Deliveries Consensus'],
    },
    analyst: {
      consensus: 'Hold',
      targetPrice: 240.00,
      targetHigh: 310.00,
      targetLow: 125.00,
      analystCount: 35,
      buyCount: 14,
      holdCount: 14,
      sellCount: 7,
      firms: [
        { firm: 'Piper Sandler', rating: 'Overweight', targetPrice: 310.00, date: '2 days ago' },
        { firm: 'Bernstein', rating: 'Underperform', targetPrice: 120.00, date: 'Last week' },
      ],
    },
    pressReleases: [
      {
        id: 'tsla-pr-1',
        title: 'Tesla Megapack Factory Reaches Run-Rate Production of 40 GWh Annually',
        source: 'Tesla IR Desk',
        time: '18 hours ago',
        summary: 'Energy storage segment revenues set to expand over 110% YoY, balancing automotive gross margin pressures.',
        sentiment: 'positive',
        category: 'Earnings',
      },
    ],
  },
  {
    symbol: 'AMD',
    name: 'Advanced Micro Devices',
    sector: 'Semiconductors',
    price: 156.40,
    previousClose: 152.10,
    change: 4.30,
    changePercent: 2.83,
    volume: '38.2M',
    avgVolume: '44.0M',
    marketCap: '$253.1B',
    peRatio: 98.2,
    high52: 227.30,
    low52: 94.04,
    dayHigh: 157.90,
    dayLow: 152.50,
    open: 153.00,
    rsi: 54.3,
    macd: {
      macdLine: 0.85,
      signalLine: 0.20,
      histogram: 0.65,
    },
    movingAverages: {
      ema20: 151.20,
      ema50: 148.80,
      sma200: 154.20,
    },
    bollingerBands: {
      upper: 162.00,
      middle: 151.00,
      lower: 140.00,
    },
    supportLevel: 148.00,
    resistanceLevel: 165.00,
    technicalSignal: 'BUY',
    signalReason: 'Breakout above 200 SMA on heavy volume; Instinct MI325X GPU adoption expanding with Tier-1 clouds.',
    sentiment: {
      score: 73,
      bullishPercent: 66,
      bearishPercent: 16,
      neutralPercent: 18,
      mentions24h: 18200,
      sentimentTrend: 'rising',
      topThemes: ['MI325X Datacenter AI', 'Zen 5 EPYC Servers', 'ROCm 6.2 Maturity', 'Client PC Share Gains'],
    },
    analyst: {
      consensus: 'Buy',
      targetPrice: 195.00,
      targetHigh: 230.00,
      targetLow: 150.00,
      analystCount: 36,
      buyCount: 28,
      holdCount: 8,
      sellCount: 0,
      firms: [
        { firm: 'Raymond James', rating: 'Strong Buy', targetPrice: 200.00, date: '1 day ago' },
        { firm: 'KeyBanc', rating: 'Overweight', targetPrice: 195.00, date: '3 days ago' },
      ],
    },
    pressReleases: [
      {
        id: 'amd-pr-1',
        title: 'AMD Expands Instinct AI Datacenter Roadmap With Next-Generation UDNA Unified Architecture',
        source: 'AMD Press Room',
        time: '1 day ago',
        summary: 'Cloud providers report rapid migration times using open-source ROCm software stack.',
        sentiment: 'positive',
        category: 'Product Launch',
      },
    ],
  },
  {
    symbol: 'AVGO',
    name: 'Broadcom Inc.',
    sector: 'Custom Silicon & Enterprise Cloud',
    price: 172.90,
    previousClose: 168.40,
    change: 4.50,
    changePercent: 2.67,
    volume: '19.4M',
    avgVolume: '22.1M',
    marketCap: '$808.5B',
    peRatio: 52.4,
    high52: 185.16,
    low52: 79.54,
    dayHigh: 174.20,
    dayLow: 168.60,
    open: 169.20,
    rsi: 62.8,
    macd: {
      macdLine: 3.10,
      signalLine: 2.30,
      histogram: 0.80,
    },
    movingAverages: {
      ema20: 166.50,
      ema50: 158.20,
      sma200: 134.10,
    },
    bollingerBands: {
      upper: 178.00,
      middle: 166.00,
      lower: 154.00,
    },
    supportLevel: 162.00,
    resistanceLevel: 180.00,
    technicalSignal: 'BUY',
    signalReason: 'Leading supplier of custom AI ASICs (Google TPU, Meta) + VMware ARR integration driving cash flows.',
    sentiment: {
      score: 80,
      bullishPercent: 74,
      bearishPercent: 12,
      neutralPercent: 14,
      mentions24h: 12400,
      sentimentTrend: 'rising',
      topThemes: ['Custom ASIC Demand', 'Tomahawk 5 Switches', 'VMware Recurring Subscriptions', 'Dividend Growth'],
    },
    analyst: {
      consensus: 'Strong Buy',
      targetPrice: 200.00,
      targetHigh: 225.00,
      targetLow: 165.00,
      analystCount: 32,
      buyCount: 30,
      holdCount: 2,
      sellCount: 0,
      firms: [
        { firm: 'Mizuho', rating: 'Outperform', targetPrice: 210.00, date: 'Yesterday' },
        { firm: 'Citi', rating: 'Buy', targetPrice: 205.00, date: '4 days ago' },
      ],
    },
    pressReleases: [
      {
        id: 'avgo-pr-1',
        title: 'Broadcom Demonstrates Industry First 100Tbps Optical Interconnect for AI Clusters',
        source: 'Broadcom Media Relations',
        time: '2 days ago',
        summary: 'Substantially decreases latency and rack power dissipation in multi-rack supercomputing pods.',
        sentiment: 'positive',
        category: 'Product Launch',
      },
    ],
  },
  {
    symbol: 'TSM',
    name: 'Taiwan Semiconductor',
    sector: 'Semiconductor Foundry',
    price: 188.50,
    previousClose: 184.20,
    change: 4.30,
    changePercent: 2.33,
    volume: '16.7M',
    avgVolume: '18.9M',
    marketCap: '$977.6B',
    peRatio: 30.1,
    high52: 193.47,
    low52: 84.50,
    dayHigh: 189.90,
    dayLow: 184.50,
    open: 185.00,
    rsi: 65.1,
    macd: {
      macdLine: 3.40,
      signalLine: 2.50,
      histogram: 0.90,
    },
    movingAverages: {
      ema20: 181.00,
      ema50: 172.40,
      sma200: 142.10,
    },
    bollingerBands: {
      upper: 194.00,
      middle: 181.00,
      lower: 168.00,
    },
    supportLevel: 178.00,
    resistanceLevel: 195.00,
    technicalSignal: 'STRONG BUY',
    signalReason: 'Global 3nm and 2nm capacity fully booked by Apple, Nvidia, and Qualcomm through 2026.',
    sentiment: {
      score: 82,
      bullishPercent: 76,
      bearishPercent: 10,
      neutralPercent: 14,
      mentions24h: 15300,
      sentimentTrend: 'rising',
      topThemes: ['CoWoS Packaging Expansion', 'N2 Node Milestones', 'Arizona Fab Ramp', 'Pricing Power'],
    },
    analyst: {
      consensus: 'Strong Buy',
      targetPrice: 220.00,
      targetHigh: 245.00,
      targetLow: 180.00,
      analystCount: 30,
      buyCount: 29,
      holdCount: 1,
      sellCount: 0,
      firms: [
        { firm: 'Needham', rating: 'Buy', targetPrice: 225.00, date: 'Yesterday' },
        { firm: 'Goldman Sachs', rating: 'Buy', targetPrice: 218.00, date: '3 days ago' },
      ],
    },
    pressReleases: [
      {
        id: 'tsm-pr-1',
        title: 'TSMC Board of Directors Approves $28B Capital Expenditure for Advanced Packaging and N2',
        source: 'TSMC Global Press Center',
        time: '1 day ago',
        summary: 'Capacity expansion aims to clear worldwide backlog for advanced silicon packaging solutions.',
        sentiment: 'positive',
        category: 'SEC Filing',
      },
    ],
  },
];

// Helper to generate deterministic, authentic candlestick data for different timeframes
export function generateCandlesForStock(stock: Stock, timeframe: TimeFrame): CandleData[] {
  const candles: CandleData[] = [];
  const now = Date.now();
  let count = 40;
  let intervalMs = 5 * 60 * 1000; // 5 mins for 1D
  let volatility = 0.004;

  if (timeframe === '1D') {
    count = 48; // 4 hours in 5m ticks
    intervalMs = 5 * 60 * 1000;
    volatility = 0.0035;
  } else if (timeframe === '1W') {
    count = 35; // 7 days, 5 ticks/day
    intervalMs = 4 * 60 * 60 * 1000;
    volatility = 0.009;
  } else if (timeframe === '1M') {
    count = 30; // 30 days
    intervalMs = 24 * 60 * 60 * 1000;
    volatility = 0.016;
  } else if (timeframe === '1Y') {
    count = 52; // 52 weeks
    intervalMs = 7 * 24 * 60 * 60 * 1000;
    volatility = 0.035;
  } else if (timeframe === '5Y') {
    count = 60; // 60 months
    intervalMs = 30 * 24 * 60 * 60 * 1000;
    volatility = 0.06;
  }

  // Generate backwards from current price
  let currentClose = stock.price;
  const tempCandles: CandleData[] = [];

  // Use a pseudo-random seed based on symbol char codes
  let seed = stock.symbol.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) + timeframe.charCodeAt(0);
  function pseudoRandom() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  }

  for (let i = 0; i < count; i++) {
    const timestamp = now - i * intervalMs;
    const date = new Date(timestamp);
    let dateStr = '';
    if (timeframe === '1D') {
      dateStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (timeframe === '1W' || timeframe === '1M') {
      dateStr = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } else {
      dateStr = date.toLocaleDateString([], { month: 'short', year: '2-digit' });
    }

    const drift = (pseudoRandom() - 0.48) * volatility;
    const open = i === 0 ? stock.open : Number((currentClose / (1 + drift)).toFixed(2));
    const close = currentClose;
    const high = Number((Math.max(open, close) * (1 + pseudoRandom() * volatility * 0.8)).toFixed(2));
    const low = Number((Math.min(open, close) * (1 - pseudoRandom() * volatility * 0.8)).toFixed(2));
    const volume = Math.floor(100000 + pseudoRandom() * 4000000);

    tempCandles.push({
      timestamp,
      dateStr,
      open,
      high,
      low,
      close,
      volume,
    });

    currentClose = open;
  }

  // Reverse so older candles come first (left to right)
  for (let i = tempCandles.length - 1; i >= 0; i--) {
    candles.push(tempCandles[i]);
  }

  return candles;
}
