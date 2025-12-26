'use client';

import { useState } from 'react';
import {
  fetchNativeBalance,
  fetchAllBalances,
  fetchTokenBalances,
  fetchRecentTxs,
} from '@/lib/explorer';
import { TOKENS } from '@/lib/tokens';
import { fetchTokenPrices } from '@/lib/prices';

const CHAINS = [
  { id: 'ethereum', name: 'Ethereum' },
  { id: 'polygon', name: 'Polygon' },
  { id: 'arbitrum', name: 'Arbitrum' },
  { id: 'optimism', name: 'Optimism' },
  { id: 'base', name: 'Base' },
  { id: 'sepolia', name: 'Sepolia (Testnet)' },
];

const NATIVE_PRICE_IDS: Record<string, string> = {
  ethereum: 'ethereum',
  polygon: 'matic-network',
  arbitrum: 'ethereum',
  optimism: 'ethereum',
  base: 'ethereum',
  sepolia: 'ethereum',
};

export default function MultiChainDashboard() {
  const [address, setAddress] = useState('');
  const [chain, setChain] = useState('ethereum');

  const [balance, setBalance] = useState<any>(null);
  const [nativePrice, setNativePrice] = useState(0);
  const [tokens, setTokens] = useState<any[]>([]);
  const [allBalances, setAllBalances] = useState<any[]>([]);
  const [txs, setTxs] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [tokenLoading, setTokenLoading] = useState(false);
  const [aggregateLoading, setAggregateLoading] =
    useState(false);
  const [txLoading, setTxLoading] = useState(false);

  async function loadBalance() {
    setLoading(true);
    const data = await fetchNativeBalance(chain, address);
    setBalance(data);

    const priceId = NATIVE_PRICE_IDS[chain];
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${priceId}&vs_currencies=usd`
    );
    const priceData = await res.json();
    setNativePrice(priceData[priceId]?.usd ?? 0);
    setLoading(false);
  }

  async function toggleAllBalances() {
    if (allBalances.length > 0) {
      setAllBalances([]);
      return;
    }
    setAggregateLoading(true);
    setAllBalances(await fetchAllBalances(address));
    setAggregateLoading(false);
  }

  async function loadTokens() {
    setTokenLoading(true);
    const balances = await fetchTokenBalances(chain, address);
    const ids = TOKENS[chain]?.map((t) => t.coingeckoId) || [];
    const prices = await fetchTokenPrices(ids);

    setTokens(
      balances.map((b) => {
        const token = TOKENS[chain]?.find(
          (t) => t.symbol === b.symbol
        );
        return {
          ...b,
          price: token
            ? prices[token.coingeckoId] ?? 0
            : 0,
        };
      })
    );
    setTokenLoading(false);
  }

  async function loadTxs() {
    setTxLoading(true);
    setTxs(await fetchRecentTxs(chain, address));
    setTxLoading(false);
  }

  const netWorth =
    (balance && nativePrice
      ? balance.balance * nativePrice
      : 0) +
    tokens.reduce(
      (sum, t) =>
        sum +
        (t.balance && t.price
          ? t.balance * t.price
          : 0),
      0
    );

  return (
    <main className="p-8 max-w-5xl">
      <h1 className="text-2xl font-bold">
        Multi-Chain Dashboard
      </h1>

      <p className="mt-2 text-gray-600">
        One wallet view across multiple blockchains.
      </p>

      {/* Net Worth */}
      <div className="mt-6 rounded-xl border p-6">
        <p className="text-sm text-gray-500">
          Estimated Net Worth
        </p>
        <p className="mt-2 text-3xl font-bold">
          ${netWorth.toFixed(2)}
        </p>
      </div>

      {/* Controls */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Wallet address (0x...)"
          className="rounded border px-3 py-2"
        />
        <select
          value={chain}
          onChange={(e) => setChain(e.target.value)}
          className="rounded border px-3 py-2"
        >
          {CHAINS.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Buttons */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={loadBalance}
          disabled={!address || loading}
          className="rounded bg-black px-4 py-2 text-white"
        >
          Load Balance
        </button>

        <button
          onClick={toggleAllBalances}
          disabled={!address || aggregateLoading}
          className="rounded border px-4 py-2"
        >
          {allBalances.length > 0
            ? 'Hide All Chains'
            : 'Load All Chains'}
        </button>

        <button
          onClick={loadTokens}
          disabled={!address || tokenLoading}
          className="rounded border px-4 py-2"
        >
          Load Tokens
        </button>

        <button
          onClick={loadTxs}
          disabled={!address || txLoading}
          className="rounded border px-4 py-2"
        >
          Load Transactions
        </button>
      </div>

      {/* Native Balance */}
      {balance && (
        <div className="mt-6 rounded-xl border p-4">
          <p className="text-lg font-semibold">
            {balance.balance.toFixed(4)} {balance.symbol}
          </p>
          <p className="text-sm text-gray-500">
            ≈ $
            {(balance.balance * nativePrice).toFixed(2)}
          </p>
        </div>
      )}

      {/* Tokens */}
      {tokens.length > 0 && (
        <div className="mt-6 rounded-xl border p-4">
          <h2 className="mb-2 font-semibold">Tokens</h2>
          {tokens.map((t) => (
            <div
              key={t.symbol}
              className="flex justify-between text-sm"
            >
              <span>{t.symbol}</span>
              <span>
                {t.balance?.toFixed(2)} — $
                {(t.balance * t.price).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Transactions */}
      {txs.length > 0 && (
        <div className="mt-6 rounded-xl border p-4">
          <h2 className="mb-2 font-semibold">
            Recent Transactions
          </h2>
          {txs.map((tx) => (
            <div
              key={tx.hash}
              className="flex justify-between text-sm"
            >
              <span>
                {tx.from.toLowerCase() ===
                address.toLowerCase()
                  ? 'OUT'
                  : 'IN'}
              </span>
              <span>{tx.value.toFixed(4)}</span>
              <span className="text-gray-400">
                {tx.hash.slice(0, 6)}…
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Aggregate */}
      {allBalances.length > 0 && (
        <div className="mt-6 rounded-xl border p-4">
          <h2 className="mb-2 font-semibold">
            All Chains
          </h2>
          {allBalances.map((b) => (
            <div
              key={b.chain}
              className="flex justify-between text-sm"
            >
              <span>{b.chain}</span>
              <span>
                {b.balance?.toFixed(4)} {b.symbol}
              </span>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
