import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import type { Metadata } from 'next';
import { Noto_Sans } from 'next/font/google';
import './globals.css';
import { SessionProvider } from 'next-auth/react';
import { TanstackProvider } from '@/components/providers/TanstackProvider';
import { ReactNode } from 'react';
import AppThemeProvider from '@/context/AppThemeContext';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';

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
          suppressHydrationWarning
          lang="en"
          className={`${notoSans.variable} h-full antialiased bg-background-default`}
        >
          <body className="min-h-full flex flex-col">
            <AppRouterCacheProvider
              options={{ key: 'css', enableCssLayer: true }}
            >
              <AppThemeProvider>
                <InitColorSchemeScript defaultMode="system" attribute="class" />
                {children}
              </AppThemeProvider>
            </AppRouterCacheProvider>
          </body>
        </html>
      </TanstackProvider>
    </SessionProvider>
  );
}
