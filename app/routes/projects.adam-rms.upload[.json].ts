import { json, type ActionFunctionArgs } from "@remix-run/cloudflare"; // or cloudflare/deno

export const action = async ({ request }: ActionFunctionArgs) => {
  switch (request.method) {
    case "POST": {
      if (request.method !== "POST") {
        return json({ message: "Method not allowed" }, 405);
      }
      const payload = await request.json();
      const user = await db((context.env as Env).DB)
        .insert(AdamRMSInstallations)
        .values({ id: "something something" })
        .returning({ insertedId: users.id });

      return json({ success: true }, 200);
    }
  }
};
