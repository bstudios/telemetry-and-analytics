import { createCookieSessionStorage } from "@remix-run/cloudflare";

export let sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    maxAge: false
      ? 60 * 60 * 24 * 7 // 7 days
      : undefined, // Should session persist past the browser closing? //TODO: work on this
    path: "/",
    sameSite: "strict", //CSRF protection for following maliciously crafted links then filling in form actions
    secrets: ["s3cret1"], //TODO: change this to a genuine secret
    secure: true, //TODO: change this to true when we have https
  },
});

export let { getSession, commitSession, destroySession } = sessionStorage;
