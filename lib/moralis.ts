const MORALIS_BASE_URL =
  'https://deep-index.moralis.io/api/v2';

export async function fetchAllTokensMoralis(
  chain: string,
  address: string
) {
    const moralisChain = MORALIS_CHAIN_MAP[chain];
if (!moralisChain)
  throw new Error('Chain not supported');

  const res = await fetch(
    `${MORALIS_BASE_URL}/${address}/erc20?chain=${chain}`,
    {
      headers: {
        'X-API-Key':
          process.env.NEXT_PUBLIC_MORALIS_API_KEY!,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Moralis API error');
  }

  const data = await res.json();

  return data.map((t: any) => ({
    symbol: t.symbol,
    name: t.name,
    balance:
      Number(t.balance) /
      10 ** Number(t.decimals),
    contract: t.token_address,
  }));
}


export const MORALIS_CHAIN_MAP: Record<
  string,
  string
> = {
  ethereum: 'eth',
  polygon: 'polygon',
  arbitrum: 'arbitrum',
  optimism: 'optimism',
  base: 'base',
  bsc: 'bsc',
};
