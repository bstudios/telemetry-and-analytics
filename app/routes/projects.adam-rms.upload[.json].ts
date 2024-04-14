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
import { and, eq, isNotNull } from "drizzle-orm";
import { AdamRMSTimeSeries } from "~/db/schema/AdamRMSTimeSeries";

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
  const { env, cf } = context.cloudflare;
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

  const findInstallation = await db(env.DB)
    .select({ id: AdamRMSInstallations.id })
    .from(AdamRMSInstallations)
    .where(
      and(
        isNotNull(AdamRMSInstallations.rootUrl),
        eq(AdamRMSInstallations.rootUrl, validated.data.rootUrl)
      )
    )
    .limit(1);
  let installationId: number;
  if (findInstallation.length > 0) {
    installationId = findInstallation[0].id;
    const update = await db(env.DB)
      .update(AdamRMSInstallations)
      .set({
        latestHeardTimestamp: new Date(),
        version: validated.data.version,
        devMode: validated.data.devMode,
        asn: cf.asOrganization + " (" + cf.asn + ")",
        location:
          cf.city +
          ", " +
          cf.region +
          ", " +
          cf.country +
          ", " +
          cf.continent +
          " (via " +
          cf.colo +
          ")",
        userDefinedString: validated.data.userDefinedString || "",
        metaData: {
          instances: validated.data.metaData.instances || false,
          users: validated.data.metaData.users || false,
          assets: validated.data.metaData.assets || false,
        },
      })
      .where(eq(AdamRMSInstallations.id, installationId));
    if (update.error) return json({ message: update.error }, 500);
  } else {
    const insert = await db(env.DB)
      .insert(AdamRMSInstallations)
      .values({
        firstHeardTimestamp: new Date(),
        latestHeardTimestamp: new Date(),
        rootUrl: validated.data.rootUrl,
        version: validated.data.version,
        devMode: validated.data.devMode,
        asn: cf.asOrganization + " (" + cf.asn + ")",
        location:
          cf.city +
          ", " +
          cf.region +
          ", " +
          cf.country +
          ", " +
          cf.continent +
          " (via " +
          cf.colo +
          ")",
        userDefinedString: validated.data.userDefinedString || "",
        metaData: {
          instances: validated.data.metaData.instances || false,
          users: validated.data.metaData.users || false,
          assets: validated.data.metaData.assets || false,
        },
      })
      .returning({ insertedId: AdamRMSInstallations.id });
    if (insert.error) return json({ message: insert.error }, 500);
    installationId = insert[0].insertedId;
  }

  const insertTimeSeries = await db(env.DB)
    .insert(AdamRMSTimeSeries)
    .values({
      installationId: installationId,
      version: validated.data.version,
      metaData: {
        instances: validated.data.metaData.instances || false,
        users: validated.data.metaData.users || false,
        assets: validated.data.metaData.assets || false,
      },
    });
  if (insertTimeSeries.error)
    return json({ message: insertTimeSeries.error }, 500);
  return json({}, 200);
};
