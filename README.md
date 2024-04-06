# Bithell Studios Telemetry & Analytics Platform

This project allows us to collect telemetry andd display analytics from our open-source applications, in order to better understand how our users are using our software and its reach and impact.

The project runs under the following privacy principles:
## Typegen

- Like the applications themselves, this application is fully open-source and the code is available for anyone to inspect and audit.
- We do not collect any personally identifiable information about users of our projects.
- Those self-hosting projects can opt-out of telemetry collection at any time.
Generate types for your Cloudflare bindings in `wrangler.toml`:

## This project
```sh
npm run typegen
```

This is a [Remix](https://remix.run) project, which is a framework for building server-rendered React applications. It runs on [Cloudflare Workers](https://workers.cloudflare.com/) with their D1 database, which allows us to run the application on the edge with minimal latency - essential for telemetry collection.
You will need to rerun typegen whenever you make changes to `wrangler.toml`.

It uses [Mantine](https://mantine.dev/) for UI components, and [Drizzle](https://drizzle.dev/) for database management.

It is [MIT licensed](./LICENSE).

### Development

We utilize Wrangler for local development to emulate the Cloudflare runtime. This is already wired up in package.json as the `dev` script:

```sh
# start the remix dev server and wrangler
npm run dev
```

Open up [http://127.0.0.1:8788](http://127.0.0.1:8788) and you should be ready to go!

To generate migrations after adjusting the schema, run `npx drizzle-kit generate:sqlite`

First, build your app for production:

> [!NOTE]  
> These notes are incomplete

1. Create a new project on Cloudflare Pages
1. Make sure to disable fallback mode (open) in the Cloudflare Pages settings
1. Mount the D1 database in the project as "DB"
