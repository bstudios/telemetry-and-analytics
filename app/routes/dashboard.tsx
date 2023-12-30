// app/routes/login.tsx
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/cloudflare";
import { Form, useLoaderData } from "@remix-run/react";
import { authenticator } from "~/services/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  let user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  return json({ user: user });
}

export default function Screen() {
  const data = useLoaderData<typeof loader>();

  const { user } = data;

  return (
    <>
      <Form method="post">
        <button>Logout</button>
      </Form>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  await authenticator.logout(request, { redirectTo: "/login" });
}
