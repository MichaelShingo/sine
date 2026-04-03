import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import type { Metadata } from 'next';
import { Noto_Sans } from 'next/font/google';
import './globals.css';
import { SessionProvider } from 'next-auth/react';
import { TanstackProvider } from '@/components/providers/TanstackProvider';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/theme';
import { ReactNode } from 'react';

const notoSans = Noto_Sans({
  variable: '--font-noto-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Sine',
  description: 'Sine is a platform for creating and managing contracts.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <SessionProvider>
      <TanstackProvider>
        <html
          lang="en"
          className={`${notoSans.variable} h-full antialiased`}
        >
          <body className="min-h-full flex flex-col">
            <AppRouterCacheProvider
              options={{ key: 'css', enableCssLayer: true }}
            >
              <ThemeProvider theme={theme}>{children}</ThemeProvider>
            </AppRouterCacheProvider>
          </body>
        </html>
      </TanstackProvider>
    </SessionProvider>
  );
}
