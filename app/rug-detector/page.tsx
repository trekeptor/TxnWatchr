'use client';

import { useState } from 'react';
import { fetchContractSource } from '@/lib/etherscanContract';
import { scanPermissions } from '@/lib/permissionScanner';
import { calculateRisk } from '@/lib/riskScorer';

export default function RugDetector() {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  async function analyze() {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const source = await fetchContractSource(address);

      if (!source || !source.SourceCode) {
        setResult({ verified: false });
      } else {
        const permissions = scanPermissions(source.SourceCode);
        const risk = calculateRisk(permissions);

        setResult({
          verified: true,
          contractName: source.ContractName,
          compilerVersion: source.CompilerVersion,
          permissions,
          risk,
        });
      }
    } catch {
      setError('Failed to fetch contract data.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold">Rug Detector</h1>

      <p className="mt-2 text-gray-600">
        Analyze token contracts for common risk signals.
        <br />
        <span className="text-sm italic">
          Educational only. Not financial advice.
        </span>
      </p>

      {/* Input */}
      <div className="mt-6 max-w-md">
        <label className="block text-sm font-medium">
          Token Contract Address
        </label>

        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="0x..."
          className="mt-2 w-full rounded border px-3 py-2"
        />

        <button
          onClick={analyze}
          disabled={!address || loading}
          className="mt-4 rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? 'Analyzing…' : 'Analyze Token'}
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <p className="mt-4 text-gray-500">
          🔍 Analyzing contract… please wait
        </p>
      )}

      {/* Error */}
      {error && (
        <p className="mt-4 text-red-600">{error}</p>
      )}

      {/* Empty state */}
      {!result && !loading && (
        <div className="mt-8 rounded border border-dashed p-6 text-center text-gray-400">
          Paste a token contract address to analyze risk signals.
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="mt-8 space-y-6">
          {/* Status cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Verification */}
            <div className="rounded-lg border p-4">
              <h2 className="font-semibold mb-2">
                Contract Verification
              </h2>

              {result.verified ? (
                <p className="text-green-600">
                  ✅ Verified on Etherscan
                </p>
              ) : (
                <p className="text-red-600">
                  ❌ Not verified (high risk)
                </p>
              )}

              {result.contractName && (
                <p className="mt-1 text-sm text-gray-600">
                  Name: {result.contractName}
                </p>
              )}
            </div>

            {/* Permissions */}
            {result.permissions && (
              <div className="rounded-lg border p-4">
                <h2 className="font-semibold mb-2">
                  Permission Signals
                </h2>

                <ul className="space-y-1 text-sm">
                  {Object.entries(result.permissions).map(
                    ([key, value]) => (
                      <li key={key}>
                        {value ? '⚠️' : '✅'} {key}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Risk summary */}
          {result.risk && (
            <div className="flex items-center gap-4 rounded-lg border p-4">
              <span
                className={`rounded-full px-3 py-1 text-sm font-semibold ${
                  result.risk.level === 'High'
                    ? 'bg-red-100 text-red-700'
                    : result.risk.level === 'Medium'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-green-100 text-green-700'
                }`}
              >
                {result.risk.level} Risk
              </span>

              <p className="text-sm text-gray-600">
                Score: {result.risk.score} • Educational signal only
              </p>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
