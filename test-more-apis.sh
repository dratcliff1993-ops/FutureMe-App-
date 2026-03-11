#!/bin/bash

echo "=== Testing Financial Modeling Prep (register free) ==="
curl -s "https://financialmodelingprep.com/api/v3/quote/^FTSE" 2>&1 | head -3

echo -e "\n=== Testing RealCharts ==="
curl -s "https://api.realcharts.org/indices?name=FTSE" 2>&1 | head -5

echo -e "\n=== Testing StockData API ==="
curl -s "https://api.stockdata.io/v1/data/quote/^FTSE" 2>&1 | head -5

echo -e "\n=== Testing Twelve Data alternative endpoint ==="
curl -s "https://api.twelvedata.com/quote?symbol=^FTSE" 2>&1 | head -3

echo -e "\n=== Testing Polygon.io (free tier) ==="
curl -s "https://api.polygon.io/v1/open-close/FTSE/2024-01-01?apiKey=demo" 2>&1 | head -5

echo -e "\n=== Testing investing.com API ==="
curl -s "https://tvc4.investing.com/9f06f6f4ef8e7d2be0f2ac0cee317e64/1699386717/4,9,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50/1735689600/1000?sideChannel=0" 2>&1 | head -5
