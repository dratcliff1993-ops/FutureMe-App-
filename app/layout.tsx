import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FutureMe - Financial Planning Reimagined',
  description: 'Master your finances with intelligent tax and loan optimization',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
