export type TokenConfig = {
  address: string;
  symbol: string;
  coingeckoId: string;
};

export const TOKENS: Record<string, TokenConfig[]> = {
  ethereum: [
    {
      symbol: 'USDT',
      address:
        '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      coingeckoId: 'tether',
    },
    {
      symbol: 'USDC',
      address:
        '0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      coingeckoId: 'usd-coin',
    },
    {
      symbol: 'DAI',
      address:
        '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      coingeckoId: 'dai',
    },
  ],

  bsc: [
  {
    symbol: 'USDT',
    address: '0x55d398326f99059fF775485246999027B3197955',
    coingeckoId: 'tether',
  },
  {
    symbol: 'USDC',
    address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
    coingeckoId: 'usd-coin',
  },
],


  polygon: [
    {
      symbol: 'USDC',
      address:
        '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        coingeckoId: 'usd-coin'
    },
    {
      symbol: 'USDT',
      address:
        '0xc2132D05D31c914a87C6611C10748AaCBdB3C1e',
        coingeckoId: 'tether'
    },
  ],

  arbitrum: [
    {
      symbol: 'USDC',
      address:
        '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
        coingeckoId: 'usd-coin'
    },
  ],

  optimism: [
    {
      symbol: 'USDC',
      address:
        '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
        coingeckoId: 'usd-coin'
    },
  ],

  base: [
    {
      symbol: 'USDC',
      address:
        '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        coingeckoId: 'usd-coin'
    },
  ],
};
