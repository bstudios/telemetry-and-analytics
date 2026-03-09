import { type PlatformProxy } from "wrangler";

// When using `wrangler.jsonc` to configure bindings,
// `wrangler types` will generate types for those bindings
// into the global `Env` interface.
// See worker-configuration.d.ts for the generated types.

type Cloudflare = Omit<PlatformProxy<Env>, "dispose">;

declare module "@remix-run/cloudflare" {
  interface AppLoadContext {
    cloudflare: Cloudflare;
  }
}
