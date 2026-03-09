import { createRequestHandler } from "@remix-run/cloudflare";

// @ts-expect-error - virtual module provided by the Remix Vite plugin
import * as build from "virtual:remix/server-build";

const requestHandler = createRequestHandler(build);

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    return requestHandler(request, {
      cloudflare: {
        env,
        ctx,
        cf: request.cf!,
        caches,
      },
    });
  },
};
