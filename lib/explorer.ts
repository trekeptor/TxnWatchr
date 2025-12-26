import { CHAINS } from './chains';
import { ERC20_ABI } from './erc20';
import { TOKENS } from './tokens';

/* -------------------------------
   Native balance (single chain)
-------------------------------- */
export async function fetchNativeBalance(
  chainKey: string,
  address: string
) {
  const chain = CHAINS[chainKey];
  if (!chain) throw new Error('Unsupported chain');

  const res = await fetch(chain.rpcUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_getBalance',
      params: [address, 'latest'],
    }),
  });

  const data = await res.json();

  return {
    balance: parseInt(data.result || '0', 16) / 1e18,
    symbol: chain.symbol,
  };
}

/* -------------------------------
   Aggregate native balances
-------------------------------- */
export async function fetchAllBalances(address: string) {
  const entries = Object.entries(CHAINS);

  const results = await Promise.all(
    entries.map(async ([_, chain]) => {
      try {
        const res = await fetch(chain.rpcUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'eth_getBalance',
            params: [address, 'latest'],
          }),
        });

        const data = await res.json();

        return {
          chain: chain.name,
          symbol: chain.symbol,
          balance: parseInt(data.result || '0', 16) / 1e18,
        };
      } catch {
        return {
          chain: chain.name,
          symbol: chain.symbol,
          balance: null,
        };
      }
    })
  );

  return results;
}

/* -------------------------------
   ERC-20 token balances
-------------------------------- */
export async function fetchTokenBalances(
  chainKey: string,
  address: string
) {
  const chain = CHAINS[chainKey];
  const tokens = TOKENS[chainKey];
  if (!chain || !tokens) return [];

  return Promise.all(
    tokens.map(async (token) => {
      try {
        // balanceOf(address)
        const balanceRes = await fetch(chain.rpcUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'eth_call',
            params: [
              {
                to: token.address,
                data:
                  ERC20_ABI.balanceOf +
                  address.slice(2).padStart(64, '0'),
              },
              'latest',
            ],
          }),
        });

        const balanceData = await balanceRes.json();
        const raw = parseInt(balanceData.result || '0', 16);

        // decimals()
        const decimalsRes = await fetch(chain.rpcUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'eth_call',
            params: [
              {
                to: token.address,
                data: ERC20_ABI.decimals,
              },
              'latest',
            ],
          }),
        });

        const decimalsData = await decimalsRes.json();
        const decimals = parseInt(decimalsData.result || '0', 16);

        return {
          symbol: token.symbol,
          balance: raw / 10 ** decimals,
        };
      } catch {
        return {
          symbol: token.symbol,
          balance: null,
        };
      }
    })
  );
}

/* -------------------------------
   Recent transactions (MVP)
-------------------------------- */
export async function fetchRecentTxs(
  chainKey: string,
  address: string
) {
  const chain = CHAINS[chainKey];
  if (!chain) return [];

  const addr = address.toLowerCase();
  const results: any[] = [];

  // 1️⃣ Get latest block number
  const blockRes = await fetch(chain.rpcUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_blockNumber',
      params: [],
    }),
  });

  const blockData = await blockRes.json();
  let currentBlock = parseInt(blockData.result, 16);

  // 2️⃣ Scan last 20 blocks (enough for MVP)
  for (let i = 0; i < 20 && results.length < 5; i++) {
    const blockHex = '0x' + currentBlock.toString(16);

    const txRes = await fetch(chain.rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_getBlockByNumber',
        params: [blockHex, true],
      }),
    });

    const txData = await txRes.json();
    const txs = txData.result?.transactions || [];

    for (const tx of txs) {
      if (
        tx.from?.toLowerCase() === addr ||
        tx.to?.toLowerCase() === addr
      ) {
        results.push({
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          value: parseInt(tx.value || '0', 16) / 1e18,
        });
      }

      if (results.length >= 5) break;
    }

    currentBlock--;
  }

  return results;
}

