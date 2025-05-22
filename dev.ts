import { do_ } from "./src/util";
import fs from "fs/promises";
import express from "express";
import http from "http";
import config from "./src/config.json";
import { execFileSync, spawnSync } from "child_process";

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

  async function rebuild(opts?: { clear?: boolean }) {
    if (opts?.clear === true) console.clear();
    tell(`rebuild`);
    spawnSync("tsx", ["./src/build.ts"], {
      stdio: "inherit",
    });
  }

  tell(`watching ${config.watchers_dirpaths}`);
  for (const watcher_dirpath of config.watchers_dirpaths) {
    do_(async () => {
      try {
        const watcher = fs.watch(watcher_dirpath, {
          recursive: true,
          signal: watchers_ac.signal,
        });
        for await (const event of watcher) {
          await rebuild({ clear: true });
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

  await rebuild();

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
