'use client';

import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';
import WalletConnectButton from '@/components/WalletConnectButton';
import { fetchTransactions } from '@/lib/etherscan';
import ExplanationModal from '@/components/ExplanationModal';


export default function WalletAssistant() {
  const { address, status } = useAccount();
  const isConnected = status === 'connected';

  const [txs, setTxs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ THESE MUST EXIST
  const [open, setOpen] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [aiLoading, setAiLoading] = useState(false);


  useEffect(() => {
    if (!address || !isConnected) return;

    async function loadTxs() {
      setLoading(true);
      const result = await fetchTransactions(address as string);
      setTxs(result);
      setLoading(false);
    }

    loadTxs();
  }, [address, isConnected]);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">AI Wallet Assistant</h1>

      <div className="mt-4">
        <WalletConnectButton />
      </div>

      {isConnected && (
        <div className="mt-6">
          <p className="text-sm text-gray-500">Connected wallet</p>
          <p className="font-mono text-sm mb-4">{address}</p>

          <h2 className="text-lg font-semibold">Recent Transactions</h2>

          {loading && <p>Loading...</p>}

          {!loading && txs.length === 0 && (
            <p className="text-gray-500">No transactions found.</p>
          )}

          <ul className="mt-4 space-y-2">
            {txs.map((tx) => (
              <li key={tx.hash} className="rounded border p-3">
  <p className="text-sm font-mono">
    {tx.hash.slice(0, 10)}...
  </p>

  <p className="text-sm">
    Value: {Number(tx.value) / 1e18} ETH
  </p>

  <button
  className="mt-2 text-sm text-blue-600 underline"
  onClick={async () => {
    setOpen(true);
    setAiLoading(true);
    setExplanation('');

    try {
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tx }),
      });

      const data = await res.json();
      setExplanation(data.explanation);
    } catch {
      setExplanation('Failed to get explanation.');
    } finally {
      setAiLoading(false);
    }
  }}
>
  Explain this transaction
</button>

</li>

            ))}
          </ul>
        </div>
      )}

<ExplanationModal
  open={open}
  onClose={() => setOpen(false)}
  content={explanation}
  loading={aiLoading}
/>

    </main>
  );
}


