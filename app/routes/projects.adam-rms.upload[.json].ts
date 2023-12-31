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
import { GenericObject, validationError } from "remix-validated-form";

export const loader = async ({ context }: LoaderFunctionArgs) =>
  redirect("/why-is-my-server-calling-this-url");

const validator = withZod(
  zod.object({
    rootUrl: zod.string().min(1),
    version: zod.string().max(50).min(3),
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
    const payload: unknown = await request.json();
    var validated = await validator.validate(payload as GenericObject);
    if (validated.error) return validationError(validated.error);
  } catch (e) {
    return json({ message: "Invalid JSON" }, 400);
  }
  const insert = await db((context.env as Env).DB)
    .insert(AdamRMSInstallations)
    .values({
      rootUrl: validated.data.rootUrl,
      version: validated.data.version,
      devMode: validated.data.devMode,
      metaData: {
        instances: validated.data.metaData.instances || false,
        users: validated.data.metaData.users || false,
        assets: validated.data.metaData.assets || false,
      },
    });
  if (insert.error) {
    return json({ message: insert.error }, 500);
  } else {
    return json({}, 200);
  }
};
