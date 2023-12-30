# Welcome to Remix!

- [Remix Docs](https://remix.run/docs)

## Development

You will be utilizing Wrangler for local development to emulate the Cloudflare runtime. This is already wired up in your package.json as the `dev` script:

```sh
# start the remix dev server and wrangler
npm run dev
```

Open up [http://127.0.0.1:8788](http://127.0.0.1:8788) and you should be ready to go!

## Cloudflare Pages Settings

- Make sure to disable fallback mode (open) in the Cloudflare Pages settings

Migrations

`npx drizzle-kit generate:sqlite`