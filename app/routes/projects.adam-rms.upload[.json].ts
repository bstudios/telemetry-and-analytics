import {
  ActionFunctionArgs,
  json,
  redirect,
  type LoaderFunctionArgs,
} from "@remix-run/cloudflare";
import { db } from "../d1client.server";
import { Env } from "../types";
import { AdamRMSInstallations } from "../db/schema/AdamRMSInstallations";
import { withZod } from "@remix-validated-form/with-zod";
import { z as zod } from "zod";

export const loader = async ({ context }: LoaderFunctionArgs) =>
  redirect("/why-is-my-server-calling-this-url");

const validator = withZod(
  zod.object({
    rootUrl: zod.string().url(),
    version: zod.string(),
    devMode: zod.boolean(),
    metaData: zod.object({
      instances: zod.number().or(zod.boolean()).optional(),
      users: zod.number().or(zod.boolean()).optional(),
      assets: zod.number().or(zod.boolean()).optional(),
    }),
  })
);

export const action = async ({ context, request }: ActionFunctionArgs) => {
  if (request.method !== "PUT") {
    return json({ message: "Method not allowed" }, 405);
  }
  try {
    var payload = await request.json();
  } catch (e) {
    return json({ message: "Invalid JSON" }, 400);
  }
  const insert = await db((context.env as Env).DB)
    .insert(AdamRMSInstallations)
    .values({
      rootUrl: payload.rootUrl,
      version: payload.version,
      devMode: payload.devMode,
      metaData: payload.metaData,
    });
  if (insert.error) {
    return json({ message: insert.error }, 500);
  } else {
    return json({}, 200);
  }
};
