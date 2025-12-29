export const COINGECKO_CONTRACT_MAP: Record<
  string,
  Record<string, string>
> = {
  ethereum: {
    '0xdac17f958d2ee523a2206206994597c13d831ec7': 'tether',
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': 'usd-coin',
    '0x6b175474e89094c44da98b954eedeac495271d0f': 'dai',
    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee': 'ethereum',
  },
  polygon: {
    '0x2791bca1f2de4661ed88a30c99a7a9449aa84174': 'usd-coin',
    '0xc2132d05d31c914a87c6611c10748aacbd3c1e': 'tether',
    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee': 'matic-network',
  },
  arbitrum: {
    '0xaf88d065e77c8cC2239327C5EDb3A432268e5831': 'usd-coin',
    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee': 'ethereum',
  },
  optimism: {
    '0x7f5c764cbc14f9669b88837ca1490cca17c31607': 'usd-coin',
    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee': 'ethereum',
  },
  base: {
    '0x833589fcd6edb6e08f4c7c32d4f71b54bdA02913': 'usd-coin',
    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee': 'ethereum',
  },
  bsc: {
    '0x55d398326f99059ff775485246999027b3197955': 'tether',
    '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d': 'usd-coin',
    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee': 'binancecoin',
  },
};

