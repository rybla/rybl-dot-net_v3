import Effect from "@/Effect";
import { Website } from "@/types";

/**
 * Compiles a constructored {@link Website} to output files.
 *
 * @param website
 */
export const compileWebsite: Effect.T<{ website: Website }, void> = Effect.run(
  { label: "compileWebsite" },
  (input) => async (ctx) => {
    for (const resource of input.website.resources) {
      Effect.tell(`compile: ${resource.route}`)(ctx);
      if (resource.type === "html") {
        await Effect.outputFile_text({
          filepath_relative: resource.route,
          content: resource.content,
        })(ctx);
      } else if (resource.type === "raw") {
        await Effect.useLocalFile({ filepath_relative: resource.route })(ctx);
      } else {
        // @ts-expect-error
        const _: Resource = resource;
      }
    }
  },
);

export default compileWebsite;
