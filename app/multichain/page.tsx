'use client';

import { useState } from 'react';
import {
  fetchNativeBalance,
  fetchTokenBalances,
  fetchRecentTxs,
  fetchAllBalances,
} from '@/lib/explorer';
import { TOKENS } from '@/lib/tokens';
import {
  fetchTokenPrices,
  fetchMoralisPrices,
} from '@/lib/prices';
import { fetchAllTokensMoralis } from '@/lib/moralis';
import { COINGECKO_CONTRACT_MAP } from '@/lib/tokenPriceMap';

/* ---------------- Allocation Logic ---------------- */
function calculateAllocation({
  balance,
  nativePrice,
  chain,
  tokens,
}: {
  balance: any;
  nativePrice: number;
  chain: string;
  tokens: any[];
}) {
  let eth = 0;
  let bnb = 0;
  let stable = 0;

  // Native asset
  if (balance && nativePrice) {
    const usd = balance.balance * nativePrice;
    chain === 'bsc' ? (bnb += usd) : (eth += usd);
  }

  // Stablecoins only
  tokens.forEach((t) => {
    if (!t.balance || typeof t.price !== 'number')
      return;
    if (['USDT', 'USDC', 'DAI'].includes(t.symbol)) {
      stable += t.balance * t.price;
    }
  });

  return {
    eth,
    bnb,
    stable,
    total: eth + bnb + stable,
  };
}

/* ---------------- Page ---------------- */
export default function MultiChainDashboard() {
  const [address, setAddress] = useState('');
  const [chain, setChain] = useState('ethereum');

  const [balance, setBalance] = useState<any>(null);
  const [nativePrice, setNativePrice] = useState(0);

  const [tokens, setTokens] = useState<any[]>([]);
  const [allTokens, setAllTokens] = useState<any[]>([]);
  const [txs, setTxs] = useState<any[]>([]);
  const [allBalances, setAllBalances] =
    useState<any[]>([]);

  const CHAINS = [
    { id: 'ethereum', name: 'Ethereum' },
    { id: 'bsc', name: 'BNB Chain' },
    { id: 'polygon', name: 'Polygon' },
    { id: 'arbitrum', name: 'Arbitrum' },
    { id: 'optimism', name: 'Optimism' },
    { id: 'base', name: 'Base' },
    
  ];

  const NATIVE_PRICE_IDS: Record<string, string> =
    {
      ethereum: 'ethereum',
      bsc: 'binancecoin',
      polygon: 'matic-network',
      arbitrum: 'ethereum',
      optimism: 'ethereum',
      base: 'ethereum',
      
    };

  /* ---------------- Loaders ---------------- */
  async function loadBalance() {
    if (!address) return;

    const data = await fetchNativeBalance(
      chain,
      address
    );
    setBalance(data);

    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${NATIVE_PRICE_IDS[chain]}&vs_currencies=usd`
    );
    const price =
      (await res.json())[
        NATIVE_PRICE_IDS[chain]
      ]?.usd ?? 0;

    setNativePrice(price);
  }

  async function loadTokens() {
    if (!address) return;

    const balances = await fetchTokenBalances(
      chain,
      address
    );
    const ids =
      TOKENS[chain]?.map(
        (t) => t.coingeckoId
      ) || [];
    const prices = await fetchTokenPrices(ids);

    setTokens(
      balances.map((b) => {
        const meta = TOKENS[chain]?.find(
          (t) => t.symbol === b.symbol
        );
        return {
          ...b,
          price: meta
            ? prices[meta.coingeckoId]
            : null,
        };
      })
    );
  }

  async function loadAllTokens() {
    if (!address) return;

    const data = await fetchAllTokensMoralis(
      chain,
      address
    );
    const priceMap = await fetchMoralisPrices(
      chain,
      data
    );

    const enriched = data.map((t: any) => {
      const id =
        COINGECKO_CONTRACT_MAP[chain]?.[
          t.contract.toLowerCase()
        ];
      const price =
        id && typeof priceMap[id] === 'number'
          ? priceMap[id]
          : null;

      return {
        ...t,
        price,
        usd:
          typeof price === 'number'
            ? t.balance * price
            : null,
      };
    });

    setAllTokens(enriched);
  }

  async function loadTxs() {
    if (!address) return;
    setTxs(
      await fetchRecentTxs(chain, address)
    );
  }

  async function toggleAllChains() {
    if (!address) return;
    setAllBalances(
      allBalances.length
        ? []
        : await fetchAllBalances(address)
    );
  }

  const allocation = calculateAllocation({
    balance,
    nativePrice,
    chain,
    tokens,
  });

  const netWorth =
    allocation.eth +
    allocation.bnb +
    allocation.stable;

  /* ---------------- Render ---------------- */
  return (
    <main className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold">
        TxnWatchr
      </h1>

      {/* Net Worth */}
      <div className="mt-6 rounded-xl border p-6">
        <p className="text-sm text-gray-500">
          Net Worth
        </p>
        <p className="text-3xl font-bold">
          ${netWorth.toFixed(2)}
        </p>
      </div>

      {/* Allocation */}
      <div className="mt-6 rounded-xl border p-6">
        <h2 className="mb-4 font-semibold">
          Portfolio Allocation
        </h2>
        <AllocationChart {...allocation} />
      </div>

      {/* Inputs */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <input
          className="border px-3 py-2 rounded"
          placeholder="Wallet address"
          value={address}
          onChange={(e) =>
            setAddress(e.target.value)
          }
        />
        <select
          className="border px-3 py-2 rounded"
          value={chain}
          onChange={(e) =>
            setChain(e.target.value)
          }
        >
          {CHAINS.map((c) => (
            <option
              key={c.id}
              value={c.id}
            >
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Buttons */}
      <div className="mt-4 flex flex-wrap gap-3">
  <button onClick={loadBalance} className="btn glow-btn">
  Load Balance
</button>

<button onClick={loadTokens} className="btn glow-btn">
  Tokens
</button>

<button onClick={loadAllTokens} className="btn glow-btn">
  All Tokens
</button>

<button onClick={loadTxs} className="btn glow-btn">
  Transactions
</button>

<button onClick={toggleAllChains} className="btn glow-btn">
  All Chains
</button>
      </div>

      {/* Native Balance */}
      {balance && (
        <Section title="Native Balance">
          <Row
            left={balance.symbol}
            right={`${balance.balance.toFixed(
              4
            )} · $${(
              balance.balance * nativePrice
            ).toFixed(2)}`}
          />
        </Section>
      )}

      {/* Tokens */}
      {tokens.length > 0 && (
        <Section title="Tokens">
          {tokens.map((t) => (
            <Row
              key={t.symbol}
              left={t.symbol}
              right={`${t.balance.toFixed(
                4
              )} · $${(
                t.balance * (t.price ?? 0)
              ).toFixed(2)}`}
            />
          ))}
        </Section>
      )}

      {/* All Tokens */}
      {allTokens.length > 0 && (
        <Section title="All Tokens (Indexed)">
          {allTokens.map((t) => (
            <Row
              key={t.contract}
              left={`${t.symbol} (${t.name})`}
              right={
                typeof t.usd === 'number'
                  ? `${t.balance.toFixed(
                      4
                    )} · $${t.usd.toFixed(2)}`
                  : `${t.balance.toFixed(
                      4
                    )} · N/A`
              }
            />
          ))}
        </Section>
      )}

      {/* Transactions */}
      {txs.length > 0 && (
        <Section title="Recent Transactions">
          {txs.map((tx) => (
            <Row
              key={tx.hash}
              left={
                tx.from.toLowerCase() ===
                address.toLowerCase()
                  ? 'OUT'
                  : 'IN'
              }
              right={`${tx.value.toFixed(
                4
              )} · ${tx.hash.slice(0, 6)}…`}
            />
          ))}
        </Section>
      )}

      {/* All Chains */}
      {allBalances.length > 0 && (
        <Section title="All Chains">
          {allBalances.map((b) => (
            <Row
              key={b.chain}
              left={b.chain}
              right={`${b.balance.toFixed(
                4
              )} ${b.symbol}`}
            />
          ))}
        </Section>
      )}
    </main>
  );
}

/* ---------------- UI Components ---------------- */
function Section({
  title,
  children,
}: {
  title: string;
  children: any;
}) {
  return (
    <div
      className="mt-6 rounded-xl p-4 glow-card"
      style={{
        border: '1px solid var(--border)',
      }}
    >
      <h2 className="mb-2 font-semibold">{title}</h2>
      {children}
    </div>
  );
}


function Row({
  left,
  right,
}: {
  left: string;
  right: string;
}) {
  return (
    <div className="flex justify-between text-sm">
      <span>{left}</span>
      <span>{right}</span>
    </div>
  );
}

/* ---------------- Allocation Chart ---------------- */
function AllocationChart({
  eth,
  bnb,
  stable,
  total,
}: {
  eth: number;
  bnb: number;
  stable: number;
  total: number;
}) {
  if (!total)
    return (
      <p className="text-sm text-gray-400">
        Load balances to see allocation
      </p>
    );

  const pct = (v: number) =>
    ((v / total) * 100).toFixed(1);

  return (
    <div className="space-y-4">
      <AllocationRow
        label="ETH"
        value={eth}
        percent={pct(eth)}
        color="bg-indigo-500"
      />
      <AllocationRow
        label="BNB"
        value={bnb}
        percent={pct(bnb)}
        color="bg-yellow-500"
      />
      <AllocationRow
        label="Stablecoins"
        value={stable}
        percent={pct(stable)}
        color="bg-emerald-500"
      />
    </div>
  );
}

function AllocationRow({
  label,
  value,
  percent,
  color,
}: {
  label: string;
  value: number;
  percent: string;
  color: string;
}) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium">{label}</span>
        <span className="text-gray-600">
          ${value.toFixed(2)} ({percent}%)
        </span>
      </div>
      <div className="h-2 w-full bg-gray-200 rounded">
        <div
          className={`${color} h-2 rounded`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
