import { serve } from "https://deno.land/x/http/server.ts";

let env = Deno.env();
const CLIENT_ID = env.GH_BASIC_CLIENT_ID;
const CLIENT_SECRET = env.GH_BASIC_SECRET_ID;

console.log('client id: ', CLIENT_ID);

const pageTemplate = `
<html>
  <head>
  </head>
  <body>
    <p>
      Well, hello there!
    </p>
    <p>
      We're going to now talk to the GitHub API. Ready?
      <a href="https://github.com/login/oauth/authorize?scope=user:email&client_id=<%CLIENT_ID%>">Click here</a> to begin!</a>
    </p>
    <p>
      If that link doesn't work, remember to provide your own <a href="/apps/building-oauth-apps/authorizing-oauth-apps/">Client ID</a>!
    </p>
  </body>
</html>
`

const page = new TextEncoder().encode(
  pageTemplate
	  .replace("<%CLIENT_ID%>", CLIENT_ID)
);

const s = serve("0.0.0.0:4567");

const headers = new Headers();
headers.set("content-type", "text/html");

async function main() {
  for await (const req of s) {

	let parsedURL = new URL(req.url, "http://example.com");
		if (parsedURL.pathname === "/callback") {
			if (req.method === "GET") {
			  let code = parsedURL.searchParams.get("code");
				console.log("code: ", code);

				let body = new TextEncoder().encode(JSON.stringify({
					client_id: CLIENT_ID,
					client_secret: CLIENT_SECRET,
					code: code,
					accept: "json"
				}))

				//TODO visit https://developer.github.com/apps/building-github-apps/identifying-and-authorizing-users-for-github-apps/#identifying-users-on-your-site to see the correct ACCEPT header
				fetch("https://github.com/login/oauth/access_token", {
					method: "POST",
					headers: { "Content-Type": "application/json; charset=utf-8" },
					body
				})
					.then((response) => response)
					.then((data) => console.log(data))
			}
		}

		req.respond({ 
			body: page,
			headers
		});
  }
}

main();
