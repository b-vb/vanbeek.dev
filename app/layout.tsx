import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import clsx from 'clsx';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'vanbeek.dev',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
      >
        <body className={clsx(inter.className, 'min-h-[100dvh] p-8 bg-zinc-100 dark:bg-black')}>
          {children}
        </body>
      </ThemeProvider>
    </html>
  );
}
