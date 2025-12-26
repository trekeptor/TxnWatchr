import Link from 'next/link';
import WalletConnectButton from './WalletConnectButton';

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between border-b px-6 py-4 dark:border-gray-800">
      <Link href="/" className="text-lg font-semibold">
        TxnWise
      </Link>

      <div className="flex items-center gap-4 text-sm">
        <Link href="/wallet-assistant">Wallet</Link>
        <Link href="/rug-detector">Rug</Link>
        <Link href="/gas-optimizer">Gas</Link>

        {/* ✅ NEW: Multi-Chain Dashboard */}
        <Link
          href="/multichain"
          className="font-medium"
        >
          Dashboard
        </Link>

        <WalletConnectButton />
      </div>
    </nav>
  );
}

