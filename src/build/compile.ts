import { addResource, Post, Website } from "@/types";
import path from "path";
import config from "@/config.json";
import Effect from "@/effect";

/**
 * Compiles a constructored {@link Website} to output files.
 *
 * @param website
 */
export default async function compile(website: Website) {
  console.log("compile");
  for (const resource of website.resources) {
    console.log(`compile: ${resource.route}`);
    if (resource.type === "page") {
      Effect.outputFile_text(resource.route, resource.content);
    } else if (resource.type === "post") {
      Effect.outputFile_text(resource.route, resource.content);
    } else if (resource.type === "raw") {
      Effect.useLocalFile(resource.route);
    } else {
      // @ts-expect-error
      const _: Resource = resource;
    }
  }
}
