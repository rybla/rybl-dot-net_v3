import { ChildProcessByStdio, spawn, spawnSync } from "child_process";
import express from "express";
import fs from "fs/promises";
import http from "http";
import config from "./src/config.json";
import { do_ } from "./src/util";

const RESET = "\x1b[0m";
const FG_BLACK = "\x1b[30m";
const BG_GREEN = "\x1b[42m";
const BG_WHITE = "\x1b[107m";

function tell(msg: string) {
  console.log(`${BG_WHITE}${FG_BLACK} dev ${RESET} ${msg}`);
}

do_(async () => {
  const watchers_ac = new AbortController();

  tell(`defining server`);
  const app = express();
  app.use(express.static(config.serve_static_dirpath));
  const server = http.createServer(app);

  function rebuild(opts?: {
    clear?: boolean;
  }): ChildProcessByStdio<null, null, null> {
    if (opts?.clear === true) console.clear();
    tell(`rebuild ...`);
    const cp = spawn("tsx", ["./src/build.ts"], {
      stdio: ["ignore", "inherit", "inherit"],
    });
    cp.on("exit", (code) => {
      if (code === 0) {
        tell(`rebuild ✅`);
      } else {
        tell(`rebuild ❌`);
      }
    });
    return cp;
  }

  tell(`watching ${config.watchers_dirpaths}`);
  for (const watcher_dirpath of config.watchers_dirpaths) {
    do_(async () => {
      try {
        let current_rebuild: ChildProcessByStdio<null, null, null> | undefined =
          undefined;
        const watcher = fs.watch(watcher_dirpath, {
          recursive: true,
          signal: watchers_ac.signal,
        });
        for await (const {} of watcher) {
          if (current_rebuild !== undefined) {
            current_rebuild.kill("SIGINT");
            console.log("rebuild interrupted by a new rebuild");
          }
          current_rebuild = rebuild({ clear: true });
        }
      } catch (e: any) {
        if (e.name === "AbortError") return;
        throw e;
      }
    });
  }

  async function cleanup() {
    tell(`stopping watchers`);
    watchers_ac.abort();
    tell(`stopping server`);
    server.close();
  }

  process.on("SIGINT", async () => {
    console.log();
    await cleanup();
    process.exit(0);
  });

  process.on("uncaughtException", async (error: Error) => {
    tell(`uncaughtException: ${error.toString()}`);
    await cleanup();
    process.exit(1);
  });

  rebuild();

  server.listen(config.serve_port, () => {
    console.log(
      `server: ${JSON.stringify(
        {
          static_dirpath: config.serve_static_dirpath,
          url: `http://localhost:${config.serve_port}`,
        },
        null,
        4,
      )}`,
    );
  });
});
