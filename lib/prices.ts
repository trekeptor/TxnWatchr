export async function fetchTokenPrices(
  ids: string[]
): Promise<Record<string, number>> {
  if (ids.length === 0) return {};

  const url =
    `https://api.coingecko.com/api/v3/simple/price` +
    `?ids=${ids.join(',')}` +
    `&vs_currencies=usd`;

  const res = await fetch(url);
  const data = await res.json();

  const prices: Record<string, number> = {};

  for (const id of ids) {
    prices[id] = data[id]?.usd ?? 0;
  }

  return prices;
}

export async function fetchMoralisTokenPrices(
  chain: string,
  tokens: { contract: string }[]
): Promise<Record<string, number>> {
  const map = COINGECKO_CONTRACT_MAP[chain] ?? {};
  const ids = tokens
    .map((t) => map[t.contract.toLowerCase()])
    .filter(Boolean) as string[];

  if (ids.length === 0) return {};

  const uniqueIds = Array.from(new Set(ids)).join(',');
  const url =
    `https://api.coingecko.com/api/v3/simple/price` +
    `?ids=${uniqueIds}&vs_currencies=usd`;

  const res = await fetch(url);
  const data = await res.json();

  const prices: Record<string, number> = {};
  for (const id of uniqueIds.split(',')) {
    prices[id] = data[id]?.usd ?? 0;
  }
  return prices;
}

import { COINGECKO_CONTRACT_MAP } from './tokenPriceMap';

export async function fetchMoralisPrices(
  chain: string,
  tokens: { contract: string }[]
) {
  const map = COINGECKO_CONTRACT_MAP[chain] || {};
  const ids: string[] = [];

  tokens.forEach((t) => {
    const id = map[t.contract.toLowerCase()];
    if (id && !ids.includes(id)) ids.push(id);
  });

  if (ids.length === 0) return {};

  const url =
    `https://api.coingecko.com/api/v3/simple/price?` +
    `ids=${ids.join(',')}&vs_currencies=usd`;

  const res = await fetch(url);
  const data = await res.json();

  const priceMap: Record<string, number> = {};
  ids.forEach((id) => {
    priceMap[id] = data[id]?.usd ?? 0;
  });

  return priceMap;
}


export async function fetchEthPrice() {
  const res = await fetch(
    'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
  );
  const json = await res.json();
  return json.ethereum?.usd ?? 0;
}
