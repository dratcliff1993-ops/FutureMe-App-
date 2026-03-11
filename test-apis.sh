#!/bin/bash

echo "=== Testing Quandl (free tier) ==="
curl -s "https://www.quandl.com/api/v3/datasets/NASDAQOMX/FTSE?rows=1&api_key=YOUR_KEY" 2>&1 | head -5

echo -e "\n=== Testing IEX Cloud (free tier) ==="
curl -s "https://cloud.iexapis.com/stable/data/core/quote/FTSE?token=pk_test123" 2>&1 | head -5

echo -e "\n=== Testing EOD Data ==="
curl -s "https://eodhd.com/api/real-time/^FTSE?api_token=demo&fmt=json" 2>&1 | head -5

echo -e "\n=== Testing Finnhub alternative symbols ==="
curl -s "https://finnhub.io/api/v1/quote?symbol=0P0000YRJD&token=demo" 2>&1

echo -e "\n=== Testing CoinGecko (has some indices) ==="
curl -s "https://api.coingecko.com/api/v3/simple/price?ids=ftse&vs_currencies=gbp" 2>&1

echo -e "\n=== Testing free-to-use finance API ==="
curl -s "https://financialmodelingprep.com/api/v3/quote/^FTSE?apikey=demo" 2>&1 | head -5
