'use client';

export default function Dashboard() {
  return (
    <main className="p-8 max-w-5xl mx-auto text-gray-900 dark:text-gray-100">
      <h1 className="text-4xl font-bold tracking-tight">
        TxnWise
      </h1>

      <p className="mt-3 max-w-2xl text-gray-600 dark:text-gray-400 text-lg">
        Simple, educational Web3 tools to help you understand
        transactions, avoid risky tokens, and save on gas fees.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {[
          {
            icon: '🧠',
            title: 'AI Wallet Assistant',
            desc: 'Understand wallet transactions in plain English.',
            href: '/wallet-assistant',
          },
          {
            icon: '🔍',
            title: 'Rug Detector',
            desc: 'Analyze token contracts for risk signals.',
            href: '/rug-detector',
          },
          {
            icon: '⛽',
            title: 'Gas Fee Optimizer',
            desc: 'Estimate gas costs and find the best time to transact.',
            href: '/gas-optimizer',
          },

          // ✅ NEW: Multi-Chain Dashboard
          {
            icon: '🌐',
            title: 'Multi-Chain Dashboard',
            desc: 'View balances, tokens, prices, and activity across Ethereum, L2s, and Base.',
            href: '/multichain',
          },
        ].map((tool) => (
          <a
            key={tool.title}
            href={tool.href}
            className="group rounded-xl border p-6 transition hover:shadow-lg dark:border-gray-800 dark:hover:bg-gray-900"
          >
            <div className="text-3xl">{tool.icon}</div>
            <h2 className="mt-3 text-lg font-semibold group-hover:underline">
              {tool.title}
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {tool.desc}
            </p>
          </a>
        ))}
      </div>

      <div className="mt-14 rounded-lg bg-gray-50 p-6 dark:bg-gray-900">
        <h3 className="font-semibold text-lg">
          Who is TxnWise for?
        </h3>

        <ul className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-400">
          <li>• New crypto users who want clarity</li>
          <li>• Traders checking token risk quickly</li>
          <li>• Builders testing wallets and contracts</li>
          <li>• Anyone tired of guessing in Web3</li>
        </ul>
      </div>

      <p className="mt-10 text-xs text-gray-400 max-w-2xl">
        Educational use only. No financial advice.
      </p>
    </main>
  );
}

