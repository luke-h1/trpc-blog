import { UserContextProvider } from '@frontend/context/userContext';
import { AppRouter } from '@frontend/server/route/app.router';
import { trpc } from '@frontend/utils/trpc';
import { httpBatchLink } from '@trpc/client/links/httpBatchLink';
import { loggerLink } from '@trpc/client/links/loggerLink';
import { withTRPC } from '@trpc/next';
import type { AppProps } from 'next/app';
import superjson from 'superjson';
import '@frontend/styles/global.css';

function App({ Component, pageProps }: AppProps) {
  const { data, error, isLoading } = trpc.useQuery(['users.me']);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (isLoading) {
    return <div>Loading user...</div>;
  }

  return (
    <UserContextProvider value={data}>
      <Component {...pageProps} />
    </UserContextProvider>
  );
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    const links = [
      loggerLink(),
      httpBatchLink({ maxBatchSize: 20, url: process.env.NEXT_PUBLIC_URL }),
    ];
    return {
      queryClientConfig: {
        defaultOptions: {
          queries: {
            staleTime: 60,
          },
        },
      },
      headers() {
        if (ctx?.req) {
          return {
            ...ctx.req.headers,
            'x-ssr': '1',
          };
        }
        return {};
      },
      links,
      transformer: superjson,
    };
  },
  ssr: true,
})(App);
