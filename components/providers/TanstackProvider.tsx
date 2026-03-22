"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FC, ReactNode, useState } from "react";

interface TanstackProviderProps {
  children: ReactNode;
}

export const TanstackProvider: FC<TanstackProviderProps> = ({ children }) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
