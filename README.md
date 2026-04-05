# TensorWave Stock Dashboard

Next.js stock dashboard using AlphaVantage for quotes, company overview data, and daily price history.

## Features

- Homepage table with 15 semiconductor-related stocks
- Clickable rows that route to details page at /stocks/[symbol]
- Company overview details with N/A fallback handling
- Daily historical prices table (date, close, volume, day-over-day percentage change)
- Company logos (Clearbit)
- Tremor line chart with loading animation
- Mock-first data mode to protect limited AlphaVantage quotas

## AlphaVantage Request Strategy

AlphaVantage free plans are easy to exhaust. This project defaults to mock data in development unless explicitly disabled.

Environment variables:

- ALPHAVANTAGE_API_KEY=your_key
- USE_MOCK_STOCK_DATA=true (recommended for local development)

Behavior:

- If USE_MOCK_STOCK_DATA=true, no AlphaVantage requests are made.
- In development, mock data is used by default unless USE_MOCK_STOCK_DATA=false.
- In production, set USE_MOCK_STOCK_DATA=false to use live data.
- Live requests use long revalidation to avoid repeated API hits.

## Getting Started

1. Install dependencies:
	npm install
2. Run dev server:
	npm run dev
3. Open http://localhost:3000

## Scripts

- npm run dev
- npm run lint
- npm run build
