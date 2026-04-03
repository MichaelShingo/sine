import { Navbar } from '@/components/molecules/Navbar/Navbar';
import { ReactNode } from 'react';

export default function MembersOnlyLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        {children}
      </main>
    </div>
  );
}
