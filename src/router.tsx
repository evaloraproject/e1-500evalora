import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    // Support both URL forms used by the previous Pages deployment.
    trailingSlash: "preserve",
    defaultPreloadStaleTime: 0,
  });

  return router;
};
