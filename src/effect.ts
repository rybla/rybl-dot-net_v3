import * as fs from "fs/promises";
import * as fsSync from "fs";
import path from "path";
import config from "@/config.json";
import { indentString } from "@/util";

namespace Effect {
  export type T<A, B = void> = (input: A) => (ctx: Ctx.T) => Promise<B>;

  export namespace Ctx {
    export type T = {
      readonly depth: number;
      readonly tell_mode:
        | { type: "console" }
        | { type: "writer"; tells: { depth: number; content: string }[] };
    };

    export const nest: (ctx: T) => T = (ctx) => ({
      ...ctx,
      depth: ctx.depth + 1,
    });
  }

  export class EffectError extends Error {
    constructor(message: string) {
      super(message);
      this.name = "EffectError";
    }
  }

  const label = (name: string, args: object, content: string) =>
    `${name}(${JSON.stringify(args)}): ${content}`;

  export const tell: T<string> = (content) => async (ctx) => {
    if (ctx.tell_mode.type === "console") {
      console.log(indentString(ctx.depth, content));
    } else if (ctx.tell_mode.type === "writer") {
      ctx.tell_mode.tells.push({ depth: ctx.depth, content });
    }
  };

  export const run: <A, B>(
    opts: {
      label?: string | ((input: A) => string);
      catch?: T<EffectError, B>;
    },
    t: T<A, B>,
  ) => T<A, B> = (opts, t) => (input) => async (ctx) => {
    const ctx_new: Ctx.T = opts.label === undefined ? ctx : Ctx.nest(ctx);
    if (opts.label !== undefined) {
      if (typeof opts.label === "function") await tell(opts.label(input))(ctx);
      else await tell(opts.label)(ctx);
    }
    try {
      return await t(input)(ctx_new);
    } catch (e: any) {
      if (e instanceof EffectError && opts.catch !== undefined)
        return await opts.catch(e)(ctx_new);
      throw e;
    }
  };

  export const getCache =
    <A>(input: { key: string; default: T<{}, A> }) =>
    async (ctx: Ctx.T): Promise<A> => {
      await Effect.tell(`get cache at "${input.key}"`)(ctx);
      const filepath = `cache/${input.key}.json`;
      if (!fsSync.existsSync(filepath)) return await input.default({})(ctx);
      return JSON.parse(await fs.readFile(filepath, { encoding: "utf8" }));
    };

  export const setCache =
    <A>(input: { key: string; value: A }) =>
    async (ctx: Ctx.T): Promise<void> => {
      await Effect.tell(`set cache at "${input.key}"`)(ctx);
      if (!fsSync.existsSync("cache")) fs.mkdir("cache", { recursive: true });
      const filepath = `cache/${input.key}.json`;
      await fs.writeFile(filepath, JSON.stringify(input.value, null, 4));
    };

  export const withCache: T<void, void> = (input) => async (ctx) => {
    // TODO: wrapper around using cached values
  };

  export const inputFile_text: T<{ filepath_relative: string }, string> =
    (input) => async (ctx) => {
      try {
        const filepath_input = path.join(
          config.input_dir,
          input.filepath_relative,
        );
        return await fs.readFile(filepath_input, {
          encoding: "utf8",
        });
      } catch (e: any) {
        throw new EffectError(label("inputFile_text", input, e.toString()));
      }
    };

  export const outputFile_text: T<{
    filepath_relative: string;
    content: string;
  }> = (input) => async (ctx) => {
    try {
      const filepath_output = path.join(
        config.output_dir,
        input.filepath_relative,
      );
      await fs.mkdir(path.dirname(filepath_output), {
        recursive: true,
      });
      await fs.writeFile(filepath_output, input.content, {
        encoding: "utf8",
      });
    } catch (e: any) {
      throw new EffectError(label("outputFile_text", input, e.toString()));
    }
  };

  export const inputDir: T<{ dirpath_relative: string }, string[]> =
    (input) => async (ctx) => {
      try {
        const dirpath_input = path.join(
          config.input_dir,
          input.dirpath_relative,
        );
        const files_input = await fs.readdir(dirpath_input);
        return files_input;
      } catch (e: any) {
        throw new EffectError(label("inputDir_text", input, e.toString()));
      }
    };

  export const useLocalFile: T<{ filepath_relative: string }, string> =
    (input) => async (ctx) => {
      try {
        const filepath_input = path.join(
          config.input_dir,
          input.filepath_relative,
        );
        const filepath_output = path.join(
          config.output_dir,
          input.filepath_relative,
        );
        await fs.mkdir(path.dirname(filepath_output), {
          recursive: true,
        });
        await fs.copyFile(filepath_input, filepath_output);
        return filepath_output;
      } catch (e: any) {
        throw new EffectError(label("inputDir_text", input, e.toString()));
      }
    };

  export const useRemoteFile: T<{ url: string; filepath_relative: string }> =
    (input) => async (ctx) => {
      try {
        const filepath_output = path.join(
          config.output_dir,
          input.filepath_relative,
        );
        if (fsSync.existsSync(filepath_output)) {
          // already downloaded, so, don't need to download again
          return;
        } else {
          const response = await fetch(input.url, {
            redirect: "follow",
            signal: AbortSignal.timeout(config.fetch_timeout),
          });
          if (!response.ok)
            throw new Error(`Failed to download file from ${input.url}`);
          const blob = await response.blob();
          const arrayBuffer = await blob.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          await fs.mkdir(path.dirname(filepath_output), { recursive: true });
          await fs.writeFile(filepath_output, buffer);
          await tell(`Downloaded ${input.url} to ${filepath_output}`)(ctx);
        }
      } catch (e: any) {
        throw new EffectError(label("useRemoteFile", input, e.toString()));
      }
    };

  export const defined: <A>(
    a: A | undefined | null,
  ) => (ctx: Ctx.T) => Promise<A> = (a) => async (ctx) => {
    if (a === undefined)
      throw new EffectError("expected to be defined, but was undefined");
    if (a === null)
      throw new EffectError("expected to be defined, but was null");
    return a;
  };

  export const all =
    <Input, Output>(input: {
      opts: { batch_size?: number };
      ks: T<Input, Output>[];
      input: Input;
    }) =>
    async (ctx: Ctx.T): Promise<Output[]> => {
      const batch_size = input.opts.batch_size ?? input.ks.length;
      const batches: T<Input, Output>[][] = [];
      for (let i = 0; i < input.ks.length; i += batch_size)
        batches.push(input.ks.slice(i, i + batch_size));

      const tellss: { depth: number; content: string }[][] = [];
      const results: Output[] = [];

      for (const batch of batches) {
        results.push(
          ...(await Promise.all(
            batch.map((k, i) => {
              const tells: { depth: number; content: string }[] = [];
              tellss.push(tells);
              return run({}, k)(input.input)({
                ...ctx,
                tell_mode: { type: "writer", tells },
              });
            }),
          )),
        );

        for (const ts of tellss) {
          for (const t of ts) await tell(t.content)({ ...ctx, depth: t.depth });
        }
      }

      return results;
    };
}

export default Effect;
