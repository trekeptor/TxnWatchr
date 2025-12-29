'use client';

export default function Home() {
  return (
    <main className="p-8 max-w-6xl mx-auto text-gray-900 dark:text-gray-100">
      {/* Hero */}
      <h1 className="text-4xl font-bold tracking-tight">
        TxnWatchr
      </h1>

      <p className="mt-3 max-w-2xl text-gray-600 dark:text-gray-400 text-lg">
        A modern on-chain toolkit to explore wallets, assets,
        and risks across multiple blockchains.
      </p>

      {/* DASHBOARDS */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">
          🌐 Dashboards
        </h2>

        <div className="grid gap-6 sm:grid-cols-2">
          <ToolCard
            icon="🌐"
            title="Multi-Chain Dashboard"
            desc="View balances, tokens, prices, and recent activity across Ethereum, L2s, and Base."
            href="/multichain"
            badge="Flagship"
          />
        </div>
      </section>

      {/* WALLET TOOLS */}
      <section className="mt-14">
        <h2 className="text-xl font-semibold mb-4">
          🧠 Wallet Tools
        </h2>

        <div className="grid gap-6 sm:grid-cols-3">
          <ToolCard
            icon="🧠"
            title="AI Wallet Assistant"
            desc="Understand wallet transactions in plain English."
            href="/wallet-assistant"
          />

          <ToolCard
            icon="⛽"
            title="Gas Fee Optimizer"
            desc="Estimate gas costs and find the best time to transact."
            href="/gas-optimizer"
          />
        </div>
      </section>

      {/* SECURITY */}
      <section className="mt-14">
        <h2 className="text-xl font-semibold mb-4">
          🛡 Security & Risk
        </h2>

        <div className="grid gap-6 sm:grid-cols-3">
          <ToolCard
            icon="🔍"
            title="Rug Detector"
            desc="Analyze token contracts for common risk signals."
            href="/rug-detector"
          />

          {/* Placeholder for future */}
          <div className="rounded-xl border border-dashed p-6 text-sm text-gray-400 dark:border-gray-700">
            Approval Checker
            <p className="mt-2">
              Coming soon — review token approvals for wallet safety.
            </p>
          </div>
        </div>
      </section>

      {/* Footer note */}
      <p className="mt-16 text-xs text-gray-400 max-w-2xl">
        Educational use only. TxnWatchr does not provide financial advice.
      </p>
    </main>
  );
}

/* ---------------------------------
   Reusable Tool Card
---------------------------------- */
function ToolCard({
  icon,
  title,
  desc,
  href,
  badge,
}: {
  icon: string;
  title: string;
  desc: string;
  href: string;
  badge?: string;
}) {
  return (
    <a
      href={href}
      className="group relative rounded-xl border p-6 transition hover:shadow-lg dark:border-gray-800 dark:hover:bg-gray-900"
    >
      {badge && (
        <span className="absolute right-4 top-4 rounded bg-black px-2 py-0.5 text-xs text-white">
          {badge}
        </span>
      )}

      <div className="text-3xl">{icon}</div>

      <h3 className="mt-3 text-lg font-semibold group-hover:underline">
        {title}
      </h3>

      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        {desc}
      </p>
    </a>
  );
}
