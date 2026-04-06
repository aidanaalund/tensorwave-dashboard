export interface StockData {
  symbol: string;
  name: string;
  price: string;
  change: string;
  changePercent: string;
  volume: string;
  marketCap?: string;
  exchange?: string;
  logoUrl?: string;
  isDelayed?: boolean;
  sparklineCloses?: number[];
}

export interface StockOverview {
  symbol: string;
  assetType: string;
  name: string;
  description: string;
  exchange: string;
  sector: string;
  industry: string;
  marketCapitalization: string;
  logoUrl?: string;
}

export interface HistoricalPrice {
  date: string;
  close: string;
  volume: string;
  changePercent: string;
}

export interface StockDetailsData {
  quote: StockData;
  overview: StockOverview;
  history: HistoricalPrice[];
}

export const TARGET_STOCKS = [
  { symbol: "AMD", name: "AMD" },
  { symbol: "TXN", name: "Texas Instruments" },
  { symbol: "ARM", name: "ARM Holdings" },
  { symbol: "CDNS", name: "Cadence Design Systems" },
  { symbol: "NVDA", name: "Nvidia" },
  { symbol: "QCOM", name: "Qualcomm" },
  { symbol: "SSNLF", name: "Samsung" },
  { symbol: "INTC", name: "Intel" },
  { symbol: "ADI", name: "Analog Devices" },
  { symbol: "KLAC", name: "KLA Corporation" },
  { symbol: "AMAT", name: "Applied Materials" },
  { symbol: "GFS", name: "GlobalFoundries" },
  { symbol: "NXPI", name: "NXP Semiconductors" },
  { symbol: "MU", name: "Micron Technology" },
  { symbol: "ASML", name: "ASML" },
];

const API_BASE_URL = "https://www.alphavantage.co/query";
const DEFAULT_REVALIDATE_SECONDS = 60 * 60 * 24;
const HISTORY_ITEMS_LIMIT = 30;
const SHOULD_USE_MOCK_DATA =
  process.env.USE_MOCK_STOCK_DATA === "true" ||
  (process.env.NODE_ENV !== "production" && process.env.USE_MOCK_STOCK_DATA !== "false");

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : fallback;
  if (typeof value !== "string") return fallback;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toInt(value: unknown, fallback = 0): number {
  if (typeof value === "number") return Number.isFinite(value) ? Math.round(value) : fallback;
  if (typeof value !== "string") return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function formatPrice(value: unknown): string {
  const num = toNumber(value, Number.NaN);
  return Number.isFinite(num) ? num.toFixed(2) : "N/A";
}

function formatChangePercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

function formatWholeNumber(value: number): string {
  if (!Number.isFinite(value)) return "N/A";
  return new Intl.NumberFormat("en-US").format(value);
}

function formatMarketCapValue(value: unknown): string {
  const amount = toNumber(value, Number.NaN);
  if (!Number.isFinite(amount)) return "N/A";
  return formatWholeNumber(amount);
}

function fallbackText(value: unknown): string {
  if (typeof value !== "string") return "N/A";
  const normalized = value.trim();
  if (!normalized || normalized.toLowerCase() === "none") return "N/A";
  return normalized;
}

function resolveLogoUrl(symbol: string): string | undefined {
  const normalizedSymbol = symbol.toUpperCase();
  const hasStock = TARGET_STOCKS.some((stock) => stock.symbol === normalizedSymbol);
  if (!hasStock) return undefined;
  return `/stocks/${normalizedSymbol.toLowerCase()}.png`;
}

function buildMockQuote(symbol: string): StockData {
  const stock = TARGET_STOCKS.find((entry) => entry.symbol === symbol.toUpperCase());
  const stockIndex = TARGET_STOCKS.findIndex((entry) => entry.symbol === symbol.toUpperCase());
  const base = 95 + (stockIndex < 0 ? 0 : stockIndex * 11.15);
  const change = (stockIndex % 2 === 0 ? 1 : -1) * ((stockIndex % 5) + 0.34);
  const cap = 18_000_000_000 + (stockIndex + 1) * 8_750_000_000;

  return {
    symbol: stock?.symbol ?? symbol.toUpperCase(),
    name: stock?.name ?? symbol.toUpperCase(),
    price: base.toFixed(2),
    change: change.toFixed(2),
    changePercent: formatChangePercent((change / base) * 100),
    volume: formatWholeNumber(980_000 + (stockIndex + 2) * 147_500),
    marketCap: formatWholeNumber(cap),
    exchange: stock?.symbol === "SSNLF" ? "OTC" : "NASDAQ",
    logoUrl: resolveLogoUrl(symbol),
  };
}

function buildMockOverview(symbol: string): StockOverview {
  const stock = TARGET_STOCKS.find((entry) => entry.symbol === symbol.toUpperCase());

  return {
    symbol: stock?.symbol ?? symbol.toUpperCase(),
    assetType: "Common Stock",
    name: stock?.name ?? symbol.toUpperCase(),
    description:
      "Mock company overview data for development and testing. Switch USE_MOCK_STOCK_DATA to false to pull live AlphaVantage data.",
    exchange: stock?.symbol === "SSNLF" ? "OTC" : "NASDAQ",
    sector: "Technology",
    industry: "Semiconductors",
    marketCapitalization: buildMockQuote(symbol).marketCap ?? "N/A",
    logoUrl: resolveLogoUrl(symbol),
  };
}

function buildMockHistory(symbol: string): HistoricalPrice[] {
  const startingPrice = toNumber(buildMockQuote(symbol).price, 100);
  const now = new Date();
  const rows: HistoricalPrice[] = [];

  for (let i = 0; i < HISTORY_ITEMS_LIMIT; i += 1) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);

    const directionalMove = (i % 2 === 0 ? -1 : 1) * ((i % 4) + 0.42);
    const close = Math.max(1, startingPrice + directionalMove * (i / 2));
    const previousClose = Math.max(1, close - directionalMove * 0.85);
    const changePercent = ((close - previousClose) / previousClose) * 100;

    rows.push({
      date: date.toISOString().slice(0, 10),
      close: close.toFixed(2),
      volume: formatWholeNumber(900_000 + i * 22_500),
      changePercent: formatChangePercent(changePercent),
    });
  }

  return rows;
}

function buildSparklineCloses(history: HistoricalPrice[], points = 12): number[] {
  if (!history.length) return [];

  return [...history]
    .slice(0, points)
    .reverse()
    .map((entry) => toNumber(entry.close, Number.NaN))
    .filter((value) => Number.isFinite(value));
}

async function fetchAlphaVantage(
  params: URLSearchParams,
  revalidateSeconds = DEFAULT_REVALIDATE_SECONDS,
): Promise<Record<string, unknown> | null> {
  const apiKey =
    process.env.ALPHA_VANTAGE_API_KEY || process.env.ALPHAVANTAGE_API_KEY || "demo";
  params.set("apikey", apiKey);

  try {
    const res = await fetch(`${API_BASE_URL}?${params.toString()}`, {
      cache: "force-cache",
      next: { revalidate: revalidateSeconds },
    });

    if (!res.ok) return null;

    const payload = (await res.json()) as Record<string, unknown>;
    if (
      typeof payload.Note === "string" ||
      typeof payload.Information === "string" ||
      typeof payload["Error Message"] === "string"
    ) {
      return null;
    }

    return payload;
  } catch (error) {
    console.error(error);
    return null;
  }
}

/**
 * Reusable and modular HTTP request to fetch stock data.
 * @param symbol The stock ticker symbol.
 * @returns StockData object.
 */
export async function fetchStockQuote(symbol: string): Promise<StockData | null> {
  if (SHOULD_USE_MOCK_DATA) {
    return buildMockQuote(symbol);
  }

  const data = await fetchAlphaVantage(
    new URLSearchParams({
      function: "GLOBAL_QUOTE",
      symbol,
    }),
  );

  const quote = data?.["Global Quote"] as Record<string, unknown> | undefined;

  if (!quote || Object.keys(quote).length === 0) {
    return null;
  }

  const targetStock = TARGET_STOCKS.find((s) => s.symbol === symbol.toUpperCase());

  return {
    symbol: fallbackText(quote["01. symbol"]),
    name: targetStock?.name || fallbackText(quote["01. symbol"]),
    price: formatPrice(quote["05. price"]),
    change: formatPrice(quote["09. change"]),
    changePercent: fallbackText(quote["10. change percent"]),
    volume: formatWholeNumber(toInt(quote["06. volume"], Number.NaN)),
    marketCap: "N/A",
    exchange: targetStock?.symbol === "SSNLF" ? "OTC" : "NASDAQ",
    logoUrl: resolveLogoUrl(symbol),
  };
}

export async function fetchCompanyOverview(symbol: string): Promise<StockOverview | null> {
  if (SHOULD_USE_MOCK_DATA) {
    return buildMockOverview(symbol);
  }

  const data = await fetchAlphaVantage(
    new URLSearchParams({
      function: "OVERVIEW",
      symbol,
    }),
  );

  if (!data || Object.keys(data).length === 0) {
    return null;
  }

  const normalizedSymbol = fallbackText(data.Symbol) === "N/A" ? symbol.toUpperCase() : fallbackText(data.Symbol);

  return {
    symbol: normalizedSymbol,
    assetType: fallbackText(data.AssetType),
    name: fallbackText(data.Name),
    description: fallbackText(data.Description),
    exchange: fallbackText(data.Exchange),
    sector: fallbackText(data.Sector),
    industry: fallbackText(data.Industry),
    marketCapitalization: formatMarketCapValue(data.MarketCapitalization),
    logoUrl: resolveLogoUrl(normalizedSymbol),
  };
}

export async function fetchDailySeries(symbol: string): Promise<HistoricalPrice[]> {
  if (SHOULD_USE_MOCK_DATA) {
    return buildMockHistory(symbol);
  }

  const data = await fetchAlphaVantage(
    new URLSearchParams({
      function: "TIME_SERIES_DAILY",
      symbol,
      outputsize: "compact",
    }),
  );

  const dailySeries = data?.["Time Series (Daily)"] as
    | Record<string, Record<string, string>>
    | undefined;

  if (!dailySeries) {
    return [];
  }

  const sortedDates = Object.keys(dailySeries).sort((a, b) => (a < b ? 1 : -1));
  const history: HistoricalPrice[] = [];

  for (let index = 0; index < sortedDates.length && history.length < HISTORY_ITEMS_LIMIT; index += 1) {
    const date = sortedDates[index];
    const row = dailySeries[date];
    const close = toNumber(row?.["4. close"], Number.NaN);
    const volume = toInt(row?.["5. volume"], Number.NaN);

    if (!Number.isFinite(close)) continue;

    let changePercent = "N/A";

    if (index + 1 < sortedDates.length) {
      const previousDate = sortedDates[index + 1];
      const previousClose = toNumber(dailySeries[previousDate]?.["4. close"], Number.NaN);

      if (Number.isFinite(previousClose) && previousClose !== 0) {
        changePercent = formatChangePercent(((close - previousClose) / previousClose) * 100);
      }
    }

    history.push({
      date,
      close: close.toFixed(2),
      volume: formatWholeNumber(volume),
      changePercent,
    });
  }

  return history;
}

export async function fetchStockDetails(symbol: string): Promise<StockDetailsData | null> {
  const [quote, overview, history] = await Promise.all([
    fetchStockQuote(symbol),
    fetchCompanyOverview(symbol),
    fetchDailySeries(symbol),
  ]);

  if (!quote && !overview && history.length === 0) {
    return null;
  }

  const fallbackQuote = quote ?? buildMockQuote(symbol);
  const fallbackOverview = overview ?? {
    ...buildMockOverview(symbol),
    marketCapitalization:
      quote?.marketCap && quote.marketCap !== "N/A" ? quote.marketCap : "N/A",
  };

  return {
    quote: fallbackQuote,
    overview: {
      ...fallbackOverview,
      logoUrl: fallbackOverview.logoUrl ?? fallbackQuote.logoUrl,
    },
    history: history.length > 0 ? history : buildMockHistory(symbol),
  };
}

/**
 * Fetch all target stocks in parallel, managing potential failures
 */
export async function fetchAllStocks(): Promise<StockData[]> {
  if (SHOULD_USE_MOCK_DATA) {
    return TARGET_STOCKS.map((stock) => ({
      ...buildMockQuote(stock.symbol),
      sparklineCloses: buildSparklineCloses(buildMockHistory(stock.symbol)),
    }));
  }

  const promises = TARGET_STOCKS.map(async (stock) => {
    const [quote, history] = await Promise.all([
      fetchStockQuote(stock.symbol),
      fetchDailySeries(stock.symbol),
    ]);

    return {
      symbol: stock.symbol,
      quote,
      history,
    };
  });

  const results = await Promise.all(promises);

  return results.map((result) => {
    const sparklineCloses =
      result.history.length > 0
        ? buildSparklineCloses(result.history)
        : buildSparklineCloses(buildMockHistory(result.symbol));

    if (result.quote) {
      return {
        ...result.quote,
        sparklineCloses,
      };
    }

    // When API quota/rate limits hit, keep the homepage populated with deterministic fallback rows.
    return {
      ...buildMockQuote(result.symbol),
      isDelayed: true,
      sparklineCloses,
    };
  });
}
