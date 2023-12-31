import {
  ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/cloudflare";
import { db } from "../d1client.server";
import { Env } from "../types";
import { AdamRMSInstallations } from "../db/schema/AdamRMSInstallations";
import { Form, useLoaderData } from "@remix-run/react";
import { and, desc, eq, gt } from "drizzle-orm";

export const meta: MetaFunction = () => {
  return [{ title: "AdamRMS Project | Telemetry and Analytics" }];
};

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const activeInstallations = await db((context.env as Env).DB)
    .select()
    .from(AdamRMSInstallations)
    .groupBy(AdamRMSInstallations.rootUrl)
    .where(
      and(
        gt(
          AdamRMSInstallations.timestamp,
          new Date(new Date().setDate(new Date().getDate() - 90))
        ),
        eq(AdamRMSInstallations.devMode, false)
      )
    )
    .orderBy(desc(AdamRMSInstallations.id));
  return json({ activeInstallations: activeInstallations });
};

export default function Index() {
  const data = useLoaderData<typeof loader>();

  const { activeInstallations } = data;

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>AdamRMS</h1>
      {activeInstallations.length > 0 ? (
        <div>
          {activeInstallations.map((activeInstallation) => (
            <div key={activeInstallation.id}>
              <a href={`/${activeInstallation.id}`}>
                {activeInstallation.rootUrl}
              </a>
              <pre>{JSON.stringify(activeInstallation, null, 2)}</pre>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <h1>No installations found</h1>
        </div>
      )}
    </div>
  );
}
