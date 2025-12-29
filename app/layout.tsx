import './globals.css';
import Navbar from '@/components/Navbar';
import Providers from './providers';

export const metadata = {
  title: 'TxnWatchr',
  description: 'AI + Web3 tools for safer crypto usage',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
