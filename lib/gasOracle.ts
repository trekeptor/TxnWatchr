export async function fetchGasPrices() {
  const apiKey = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;

  const url = `https://api.etherscan.io/v2/api?chainid=1&module=gastracker&action=gasoracle&apikey=${apiKey}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.status !== '1') {
    throw new Error('Failed to fetch gas prices');
  }

  return {
    low: data.result.SafeGasPrice,
    medium: data.result.ProposeGasPrice,
    high: data.result.FastGasPrice,
  };
}
