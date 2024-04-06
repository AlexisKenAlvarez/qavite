import { appRouter } from '@/trpc/routers/_app';
import { Database } from '@/types';
import { createClient } from '@supabase/supabase-js';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { ExpoRequest } from 'expo-router/server';

const supabase = createClient<Database>(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function GET(req: ExpoRequest) {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req: req as unknown as Request,
    router: appRouter,
    createContext: async () => {
      const token = req.headers.get('authorization');

      const user = token ? await supabase.auth.getUser(token) : null;

      return { user: user?.data.user ?? null, supabase };
    },
  });
}

export async function POST(req: ExpoRequest) {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req: req as unknown as Request,
    router: appRouter,
    createContext: async () => {
      const token = req.headers.get('authorization');

      const user = token ? await supabase.auth.getUser(token) : null;

      return { user: user?.data.user ?? null, supabase };
    },
  });
}