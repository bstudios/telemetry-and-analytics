import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
export const meta: MetaFunction = () => {
  return [{ title: "Bithell Studios Telemetry and Analytics Platform" }];
};

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const { cf } = context.cloudflare;
  return json({
    visitorString:
      cf.asOrganization +
      " in " +
      cf.city +
      ", " +
      cf.region +
      ", " +
      cf.country +
      ", " +
      cf.continent +
      " via " +
      cf.colo,
  });
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Bithell Studios Telemetry and Analytics Platform</h1>
      <p>
        Hello visitor from {data.visitorString}!! This is a platform for
        telemetry and analytics for Bithell Studios projects.
      </p>
      <p>
        Text about how this works, and the privacy etc etc goes here.
        Principles:
      </p>
      <ul>
        <li>
          Data not verified, presented as-is - anyone can make a request and
          it'll show up here and skew the stats
        </li>
        <li>Don't store any personal data</li>
        <li>Project is open source</li>
      </ul>
    </div>
  );
}
