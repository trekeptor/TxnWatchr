'use client';

import { useEffect, useState } from 'react';
import { fetchGasPrices } from '@/lib/gasOracle';
import { fetchEthPrice } from '@/lib/prices';

type GasData = {
  slow: number;
  standard: number;
  fast: number;
};

export default function GasOptimizer() {
  const [gas, setGas] = useState<GasData | null>(null);
  const [ethPrice, setEthPrice] = useState(0);
  const [gasLimit, setGasLimit] = useState(21000);
  const [loading, setLoading] = useState(false);

  async function loadData() {
    try {
      setLoading(true);
      const [gasData, ethUsd] = await Promise.all([
        fetchGasPrices(),
        fetchEthPrice(),
      ]);
      setGas({
        slow: gasData.low,
        standard: gasData.medium,
        fast: gasData.high,
      });
      setEthPrice(ethUsd);
    } catch (e) {
      console.error('Failed to load gas data', e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 20000);
    return () => clearInterval(interval);
  }, []);

  function estimateCost(
    gasPrice: number,
    gasLimit: number,
    ethPrice: number
  ) {
    const eth =
      gasLimit * gasPrice * 1e-9;
    return eth * ethPrice;
  }

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">
        Gas Fee Optimizer
      </h1>

      {/* Live Gas Prices */}
      <div
        className="mt-6 rounded-xl p-6 glow-card"
        style={{
          border: '1px solid var(--border)',
        }}
      >
        <h2 className="mb-4 font-semibold">
          ⛽ Live Gas Prices (Ethereum)
        </h2>

        {loading && !gas && (
          <p className="text-gray-400">
            Loading gas prices…
          </p>
        )}

        {gas && (
          <div className="space-y-3 text-sm">
            <GasRow label="🐢 Slow" value={gas.slow} />
            <GasRow
              label="🚗 Standard"
              value={gas.standard}
            />
            <GasRow label="🚀 Fast" value={gas.fast} />

            <p className="text-xs text-gray-500 mt-2">
              Updates every 20 seconds
            </p>
          </div>
        )}
      </div>

      {/* Tx Cost Estimator */}
      <div
        className="mt-6 rounded-xl p-6 glow-card"
        style={{
          border: '1px solid var(--border)',
        }}
      >
        <h2 className="mb-4 font-semibold">
          💸 Transaction Cost Estimator
        </h2>

        {/* Gas limit input */}
        <div className="mb-4">
          <label className="block text-sm mb-1 text-gray-400">
            Gas Limit
          </label>
          <input
            type="number"
            value={gasLimit}
            onChange={(e) =>
              setGasLimit(Number(e.target.value))
            }
            className="w-full px-3 py-2 rounded bg-transparent border outline-none"
            style={{ borderColor: 'var(--border)' }}
          />
          <p className="text-xs text-gray-500 mt-1">
            ETH transfer ≈ 21,000 · Swap ≈
            100,000+
          </p>
        </div>

        {/* Estimates */}
        {gas && ethPrice > 0 && (
          <div className="space-y-3 text-sm">
            <CostRow
              label="🐢 Slow"
              value={estimateCost(
                gas.slow,
                gasLimit,
                ethPrice
              )}
            />
            <CostRow
              label="🚗 Standard"
              value={estimateCost(
                gas.standard,
                gasLimit,
                ethPrice
              )}
            />
            <CostRow
              label="🚀 Fast"
              value={estimateCost(
                gas.fast,
                gasLimit,
                ethPrice
              )}
            />

            <p className="text-xs text-gray-500 mt-2">
              Based on live gas + ETH USD
              price
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

/* ---------------- UI Helpers ---------------- */

function GasRow({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span className="font-medium">
        {value} gwei
      </span>
    </div>
  );
}

function CostRow({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span className="font-medium">
        ≈ ${value.toFixed(2)}
      </span>
    </div>
  );
}
