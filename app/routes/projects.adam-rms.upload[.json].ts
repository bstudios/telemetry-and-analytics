import {
  ActionFunctionArgs,
  json,
  redirect,
  type LoaderFunctionArgs,
} from "@remix-run/cloudflare";
import { db } from "../d1client.server";
import { AdamRMSInstallations } from "../db/schema/AdamRMSInstallations";
import { withZod } from "@remix-validated-form/with-zod";
import { z as zod } from "zod";
import { GenericObject, validationError } from "remix-validated-form";

export const loader = async () =>
  redirect("/why-is-my-server-calling-this-url");

const validator = withZod(
  zod.object({
    rootUrl: zod.string().min(1),
    version: zod.string().max(50).min(3),
    devMode: zod.boolean(),
    userDefinedString: zod.string().optional(),
    metaData: zod.object({
      instances: zod.number().or(zod.boolean()).optional(),
      users: zod.number().or(zod.boolean()).optional(),
      assets: zod.number().or(zod.boolean()).optional(),
    }),
  })
);

export const action = async ({ context, request }: ActionFunctionArgs) => {
  const { env } = context.cloudflare;
  if (request.method !== "PUT") {
    return json({ message: "Method not allowed" }, 405);
  }
  let payload: unknown;
  try {
    payload = await request.json();
  } catch (e) {
    return json({ message: "Invalid JSON" }, 400);
  }
  const validated = await validator.validate(payload as GenericObject);
  if (validated.error) return validationError(validated.error);
  const insert = await db(env.DB)
    .insert(AdamRMSInstallations)
    .values({
      rootUrl: validated.data.rootUrl,
      version: validated.data.version,
      devMode: validated.data.devMode,
      userDefinedString: validated.data.userDefinedString || "",
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
