import { lazy, Suspense, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from 'sonner'
const ReactQueryDevtoolsProduction = lazy(() =>
  import("@tanstack/react-query-devtools").then((d) => ({
    default: d.ReactQueryDevtools,
  })),
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 10, // 10 seconds
    },
  },
});

interface Props {
  children: ReactNode;
}

export const AppProviders = ({ children }: Props) => {
  return (
      <QueryClientProvider client={queryClient}>
        <Toaster richColors/>
          {children}
          <Suspense fallback={null}>
            <ReactQueryDevtoolsProduction />
          </Suspense>
      </QueryClientProvider>
  );
};