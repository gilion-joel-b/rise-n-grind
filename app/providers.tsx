"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProfileProvider } from "../components/context/context";

const client = new QueryClient();

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryClientProvider client={client}>
      <ProfileProvider>
        {children}
      </ProfileProvider>
    </QueryClientProvider>
  );
}
