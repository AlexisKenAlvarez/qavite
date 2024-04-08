import { createTRPCReact } from "@trpc/react-query";

import type { AppRouter } from "@qavite/api";

export const api = createTRPCReact<AppRouter>({});