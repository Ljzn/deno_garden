// github webhook server
// --allow-net --allow-run
import { serve } from "https://deno.land/x/http/server.ts";
const { run } = Deno;

// set the port listen
const s = serve("0.0.0.0:8888");
// set the branch ref
const TRIGGER_REF = "/refs/heads/master";
// set the shell script you want to run for depolyment
const DEPOLY_SCRIPT = "script_depoly.sh";

async function main() {
  for await (const req of s) {
    let decoder = new TextDecoder();
    let body = await req.body().then((arr) => JSON.parse(decoder.decode(arr)));

    console.log(body.ref);

    if (body.ref.localeCompare(TRIGGER_REF)) {
      console.log("head: ", body.after);
      depoly();
    }
  }
}

function depoly() {
  run({args: ["sh", DEPOLY_SCRIPT]});
}

main();
