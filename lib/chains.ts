export type ChainConfig = {
  id: string;
  name: string;
  symbol: string;
  rpcUrl: string;
};

const ZAN_KEY = process.env.NEXT_PUBLIC_ZAN_API_KEY;

export const CHAINS: Record<string, ChainConfig> = {
  ethereum: {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    rpcUrl: `https://api.zan.top/node/v1/eth/mainnet/${ZAN_KEY}`,
  },
  polygon: {
    id: 'polygon',
    name: 'Polygon',
    symbol: 'MATIC',
    rpcUrl: `https://api.zan.top/node/v1/polygon/mainnet/${ZAN_KEY}`,
  },
  arbitrum: {
    id: 'arbitrum',
    name: 'Arbitrum',
    symbol: 'ETH',
    rpcUrl: `https://api.zan.top/node/v1/arb/one/${ZAN_KEY}`,
  },
  optimism: {
    id: 'optimism',
    name: 'Optimism',
    symbol: 'ETH',
    rpcUrl: `https://api.zan.top/node/v1/opt/mainnet/${ZAN_KEY}`,
  },
  base: {
    id: 'base',
    name: 'Base',
    symbol: 'ETH',
    rpcUrl: `https://api.zan.top/node/v1/base/mainnet/${ZAN_KEY}`,
  },
  sepolia: {
    id: 'sepolia',
    name: 'Sepolia',
    symbol: 'ETH',
    rpcUrl: `https://api.zan.top/node/v1/eth/sepolia/${ZAN_KEY}`,
  },
};
