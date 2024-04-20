import {
  ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/cloudflare";
import { BarChart } from "@mantine/charts";
import { db } from "../d1client.server";
import { AdamRMSInstallations } from "../db/schema/AdamRMSInstallations";
import { Link, useLoaderData } from "@remix-run/react";
import {
  and,
  desc,
  eq,
  gt,
  gte,
  inArray,
  isNotNull,
  lt,
  ne,
  max,
} from "drizzle-orm";
import { Center, Image, Table, Text } from "@mantine/core";
import { StatsGrid } from "~/components/AdamRMS/StatsGrid";
import AdamRMSLogo from "~/components/AdamRMS/logo.svg";
import { AdamRMSTimeSeries } from "~/db/schema/AdamRMSTimeSeries";
import { version } from "react";
import { number } from "zod";
export const meta: MetaFunction = () => {
  return [{ title: "AdamRMS Project | Telemetry and Analytics" }];
};
const months: { [key: number]: string } = {
  0: "January",
  1: "February",
  2: "March",
  3: "April",
  4: "May",
  5: "June",
  6: "July",
  7: "August",
  8: "September",
  9: "October",
  10: "November",
  11: "December",
};
const getNextMonth = (month: number, year: number) => {
  if (month === 11) return { month: 0, year: year + 1 };
  else return { month: month + 1, year };
};
const getMonthName = (month: number) => {
  return months[month];
};
const getPreviousMonths = (lookbackMonths: number) => {
  const d = new Date();
  const month = d.getMonth();
  const year = d.getFullYear();
  const monthsYears: Array<{
    month: number;
    year: number;
  }> = [
    {
      month,
      year,
    },
  ];
  for (let i = 0; i < lookbackMonths; i++) {
    d.setMonth(d.getMonth() - 1);
    monthsYears.push({ month: d.getMonth(), year: d.getFullYear() });
  }
  return monthsYears;
};
const getInstallationStatsInMonth = async (
  env: Env,
  month: number,
  year: number
) => {
  const nextMonth = getNextMonth(month, year);
  const query = await db(env.DB)
    .select({
      timestamp: max(AdamRMSTimeSeries.timestamp),
      id: AdamRMSTimeSeries.id,
      version: AdamRMSTimeSeries.version,
    })
    .from(AdamRMSTimeSeries)
    .leftJoin(
      AdamRMSInstallations,
      eq(AdamRMSTimeSeries.installationId, AdamRMSInstallations.id)
    )
    .where(
      and(
        isNotNull(AdamRMSInstallations.rootUrl),
        eq(AdamRMSInstallations.devMode, false),
        gte(
          AdamRMSTimeSeries.timestamp,
          new Date(`01 ${getMonthName(month)} ${year}`)
        ),
        lt(
          AdamRMSTimeSeries.timestamp,
          new Date(`01 ${getMonthName(nextMonth.month)} ${nextMonth.year}`)
        )
      )
    )
    .groupBy(AdamRMSTimeSeries.installationId);

  const installations: { [id: string]: number } = {};
  for (const row of query) {
    if (installations[row.version] === undefined)
      installations[row.version] = 0;
    installations[row.version] += 1;
  }
  return installations;
};

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const { env } = context.cloudflare;
  const date = new Date();
  date.setDate(date.getDate() - 90);
  const installationsSeenLast90Days = await db(env.DB)
    .select({
      rootUrl: AdamRMSInstallations.rootUrl,
      hidden: AdamRMSInstallations.hidden,
      userDefinedString: AdamRMSInstallations.userDefinedString,
      metaData: AdamRMSInstallations.metaData,
    })
    .from(AdamRMSInstallations)
    .where(
      and(
        isNotNull(AdamRMSInstallations.rootUrl),
        eq(AdamRMSInstallations.devMode, false),
        gte(AdamRMSInstallations.latestHeardTimestamp, date)
      )
    );
  const totals = {
    instances: 0,
    users: 0,
    assetsCount: 0,
    assetsValueUSD: 0,
    assetsMassKg: 0,
  };
  installationsSeenLast90Days.forEach((installation) => {
    if (!installation.metaData) return;
    totals.assetsCount += (installation.metaData.assetsCount as number) || 0;
    totals.assetsValueUSD +=
      (installation.metaData.assetsValueUSD as number) || 0;
    totals.assetsMassKg += (installation.metaData.assetsMassKg as number) || 0;
    totals.instances += (installation.metaData.instances as number) || 0;
    totals.users += (installation.metaData.users as number) || 0;
  });
  const historicInstallationStats: Array<{
    month: number;
    year: number;
    monthName: string;
    installation: Awaited<ReturnType<typeof getInstallationStatsInMonth>>;
  }> = [];
  for (const date of getPreviousMonths(6)) {
    historicInstallationStats.push({
      month: date.month,
      year: date.year,
      monthName: getMonthName(date.month),
      installation: await getInstallationStatsInMonth(
        env,
        date.month,
        date.year
      ),
    });
  }
  return json({
    installationsSeenLast90DaysCount: installationsSeenLast90Days.length,
    installationsTable: installationsSeenLast90Days
      .filter((installation) => installation.hidden !== true)
      .map((installation) => ({
        rootUrl: installation.rootUrl,
        userDefinedString: installation.userDefinedString,
      })),
    totals,
    historicInstallationStats,
  });
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const graphColors = [
    "red.6",
    "gray.6",
    "pink.6",
    "grape.6",
    "violet.6",
    "indigo.6",
    "blue.6",
    "cyan.6",
    "teal.6",
    "green.6",
    "lime.6",
    "yellow.6",
    "orange",
    "red.2",
    "gray.2",
    "pink.2",
    "grape.2",
    "violet.2",
    "indigo.2",
    "blue.2",
    "cyan.2",
    "teal.2",
    "green.2",
    "lime.2",
    "yellow.2",
    "orange.2",
  ].reverse();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <Center>
        <Image
          h={200}
          w="auto"
          fit="contain"
          src={AdamRMSLogo}
          alt="AdamRMS Logo"
        />
      </Center>
      {data.installationsSeenLast90DaysCount > 0 ? (
        <div>
          <StatsGrid
            data={[
              {
                title: "Active Installations",
                icon: "receipt",
                value: data.installationsSeenLast90DaysCount.toString(),
                diff: null,
                description: "Installations seen in the last 90 days",
              },
              {
                title: "Total Instances",
                icon: "coin",
                value: data.totals.instances.toString(),
                diff: null,
                description:
                  "Total number instances across all installations seen in the last 90 days",
              },
              {
                title: "Total Users",
                icon: "user",
                value: data.totals.users.toString(),
                diff: null,
                description:
                  "Total number of users across all installations seen in the last 90 days",
              },
              {
                title: "Total Assets",
                icon: "discount",
                value: data.totals.assetsCount.toString(),
                diff: null,
                description:
                  "Total number of assets across all installations seen in the last 90 days",
              },
              {
                title: "Total Mass of Assets",
                icon: "discount",
                value: data.totals.assetsMassKg.toString(),
                diff: null,
                description:
                  "Total mass of assets across all installations seen in the last 90 days, in Kilograms",
              },
              {
                title: "Total Assets",
                icon: "coin",
                value: data.totals.assetsValueUSD.toString(),
                diff: null,
                description:
                  "Total value of all assets across all installations seen in the last 90 days, in USD",
              },
            ]}
          />

          <BarChart
            h={300}
            data={[
              ...data.historicInstallationStats.map((month) => ({
                month: `${month.monthName} ${month.year}`,
                ...month.installation,
              })),
            ].reverse()}
            dataKey="month"
            type="stacked"
            series={data.historicInstallationStats
              .flatMap((month) =>
                Object.keys(month.installation).map((key) => ({
                  name: key,
                  color: graphColors.pop() || "pink.9",
                }))
              )
              .filter((v, i, a) => a.findIndex((t) => t.name === v.name) === i)}
            xAxisLabel="Month"
            yAxisLabel="Active Installations"
          />
          <Table>
            <Table.Thead>
              <Table.Th>URL</Table.Th>
              <Table.Th>Note</Table.Th>
            </Table.Thead>
            <Table.Tbody>
              {data.installationsTable.map((installation, i) => (
                <Table.Tr key={i}>
                  <Table.Td>
                    <Link
                      to={installation.rootUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {installation.rootUrl}
                    </Link>
                  </Table.Td>
                  <Table.Td>{installation.userDefinedString}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>
      ) : (
        <div>
          <h1>No installations found</h1>
        </div>
      )}
    </div>
  );
}
