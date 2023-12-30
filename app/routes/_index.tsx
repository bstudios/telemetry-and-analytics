import {
  ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/cloudflare";
import { db } from "./../d1client.server";
import { Env } from "./../types";
import { users } from "./../db/schema/users";
import { Form, useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const allUsers = await db((context.env as Env).DB)
    .select()
    .from(users)
    .all();

  if (!allUsers) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  return json({ users: allUsers });
};

export default function Index() {
  const data = useLoaderData<typeof loader>();

  const { users } = data;

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix</h1>
      {users.length > 0 ? (
        <div>
          {users.map((user) => (
            <div key={user.id}>
              <a href={`/${user.id}`}>{user.textModifiers}</a>
              <p>{user.intModifiers}</p>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <h1>No results</h1>
        </div>
      )}
      <Form method="post">
        <button type="submit">New</button>
      </Form>
    </div>
  );
}

export const action = async ({ context }: ActionFunctionArgs) => {
  const user = await db((context.env as Env).DB)
    .insert(users)
    .values({ id: "something something" })
    .returning({ insertedId: users.id });
  return json({ user });
};
