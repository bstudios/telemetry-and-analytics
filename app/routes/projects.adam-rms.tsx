import {
  ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/cloudflare";
import { BarChart } from "@mantine/charts";
import { db } from "../d1client.server";
import { AdamRMSInstallations } from "../db/schema/AdamRMSInstallations";
import { useLoaderData } from "@remix-run/react";
import { and, desc, eq, gt, isNotNull, lt, ne } from "drizzle-orm";
import { Text } from "@mantine/core";

export const meta: MetaFunction = () => {
  return [{ title: "AdamRMS Project | Telemetry and Analytics" }];
};

const getInstallationStatsInTimePeriod = async (
  env: Env,
  timePeriod: number
) => {
  const activeInstallationsSubQuery = await db(env.DB)
    .select()
    .from(AdamRMSInstallations)
    //.groupBy(AdamRMSInstallations.rootUrl)
    .where(
      and(
        isNotNull(AdamRMSInstallations.rootUrl),
        ne(AdamRMSInstallations.rootUrl, "http://localhost"),
        lt(AdamRMSInstallations.timestamp, new Date())
      )
    );

  //   .as("subQuery");
  // const activeInstallations = await db(env.DB)
  //   .select()
  //   .from(activeInstallationsSubQuery)
  //   .where(
  //     and(
  //       gt(
  //         activeInstallationsSubQuery.timestamp,
  //         new Date(new Date().setDate(new Date().getDate() - 90))
  //       ),
  //       isNotNull(activeInstallationsSubQuery.timestamp),
  //       eq(activeInstallationsSubQuery.devMode, false)
  //     )
  //   )
  //   .orderBy(desc(activeInstallationsSubQuery.id));
  return activeInstallationsSubQuery;
};

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const { env } = context.cloudflare;
  const activeInstallations = await getInstallationStatsInTimePeriod(env, 90);
  return json({ activeInstallations: activeInstallations });
};

export default function Index() {
  const data = useLoaderData<typeof loader>();

  const { activeInstallations } = data;

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>AdamRMS</h1>
      <Text>
        An installation is considered active, and counted in statistics below,
        if it has been seen in the last 90 days.
      </Text>
      {activeInstallations.length > 0 ? (
        <div>
          {activeInstallations.map((activeInstallation) => (
            <div key={activeInstallation.id}>
              <pre>{JSON.stringify(activeInstallation, null, 2)}</pre>
            </div>
          ))}
          <BarChart
            h={300}
            data={[
              {
                month: "January",
                Smartphones: 1200,
                Laptops: 900,
                Tablets: 200,
              },
              {
                month: "February",
                Smartphones: 1900,
                Laptops: 1200,
                Tablets: 400,
              },
              { month: "March", Smartphones: 400, Laptops: 1000, Tablets: 200 },
              { month: "April", Smartphones: 1000, Laptops: 200, Tablets: 800 },
              { month: "May", Smartphones: 800, Laptops: 1400, Tablets: 1200 },
              { month: "June", Smartphones: 750, Laptops: 600, Tablets: 1000 },
            ]}
            dataKey="month"
            type="stacked"
            series={[
              { name: "Smartphones", color: "violet.6" },
              { name: "Laptops", color: "blue.6" },
              { name: "Tablets", color: "teal.6" },
            ]}
          />
          ;
        </div>
      ) : (
        <div>
          <h1>No installations found</h1>
        </div>
      )}
    </div>
  );
}
