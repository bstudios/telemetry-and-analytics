import { Link } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/cloudflare";

export const meta: MetaFunction = () => {
  return [{ title: "Bithell Studios Telemetry and Analytics Platform" }];
};

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Bithell Studios Telemetry and Analytics Platform</h1>
      <Link to="/projects/adam-rms">AdamRMS</Link>
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
