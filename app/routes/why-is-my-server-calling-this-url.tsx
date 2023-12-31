import { type MetaFunction } from "@remix-run/cloudflare";

export const meta: MetaFunction = () => {
  return [
    {
      title:
        "Why is my server calling this URL? | Bithell Studios Telemetry and Analytics Platform",
    },
  ];
};

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Why is my server calling this URL?</h1>
      <p>You are seeing requests to this domain because</p>
    </div>
  );
}
