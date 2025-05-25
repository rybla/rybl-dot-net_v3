import compileWebsite from "@/build/compile";
import transformWebsite from "@/build/transform";
import Effect from "@/Effect";
import constructWebsite from "@/build/construct";
import { Website } from "@/types";
import config from "@/config.json";

Effect.run(
  {
    label: "build",
  },
  () => async (ctx) => {
    const website: Website = {
      url: config.website_url,
      name: config.website_name,
      resources: [],
    };
    await constructWebsite({ website })(ctx);
    await transformWebsite({ website })(ctx);
    await compileWebsite({ website })(ctx);
  },
)({})({
  depth: 0,
});
