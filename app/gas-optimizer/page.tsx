'use client';

import { useEffect, useState } from 'react';
import { fetchGasPrices } from '@/lib/gasOracle';

export default function GasOptimizer() {
  const [gas, setGas] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [gasLimit, setGasLimit] = useState(21000);

  useEffect(() => {
    async function loadGas() {
      try {
        const prices = await fetchGasPrices();
        setGas(prices);
      } catch {
        setError('Failed to load gas prices');
      } finally {
        setLoading(false);
      }
    }

    loadGas();
  }, []);

  function ethCost(gwei: number) {
    return ((gasLimit * gwei) / 1e9).toFixed(6);
  }

  function advice() {
    if (!gas) return '';

    const medium = Number(gas.medium);

    if (medium <= 20) return '🟢 Very cheap gas. Great time to transact.';
    if (medium <= 40) return '🟡 Normal gas. OK for most transactions.';
    return '🔴 High gas. Consider waiting if possible.';
  }

  return (
    <main className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold">Gas Fee Optimizer</h1>

      <p className="mt-2 text-gray-600">
        Live Ethereum gas prices with simple cost estimates.
      </p>

      {loading && (
        <p className="mt-4 text-gray-500">
          ⛽ Fetching gas prices…
        </p>
      )}

      {error && (
        <p className="mt-4 text-red-600">{error}</p>
      )}

      {gas && (
        <div className="mt-6 space-y-4">
          {/* Gas Limit Input */}
          <div className="rounded border p-4">
            <label className="block text-sm font-medium mb-1">
              Gas Limit
            </label>

            <input
              type="number"
              value={gasLimit}
              onChange={(e) =>
                setGasLimit(Number(e.target.value))
              }
              className="w-full rounded border px-3 py-2"
            />

            <p className="mt-1 text-xs text-gray-500">
              21,000 = simple ETH transfer
            </p>
          </div>

          {/* Gas Prices + ETH Cost */}
          <div className="rounded border p-4 space-y-2">
            <p>
              🟢 Slow: {gas.low} Gwei → ~
              {ethCost(Number(gas.low))} ETH
            </p>
            <p>
              🟡 Standard: {gas.medium} Gwei → ~
              {ethCost(Number(gas.medium))} ETH
            </p>
            <p>
              🔴 Fast: {gas.high} Gwei → ~
              {ethCost(Number(gas.high))} ETH
            </p>
          </div>

          {/* Recommendation */}
          <div className="rounded border p-4 bg-gray-50">
            <p className="font-medium">Recommendation</p>
            <p className="mt-1 text-gray-700">
              {advice()}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
