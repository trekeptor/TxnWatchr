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
