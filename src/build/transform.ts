import Effect from "@/Effect";
import { Website } from "@/types";

export const transformWebsite: Effect.T<{ website: Website }> =
  (input) => async (ctx) => {};

export default transformWebsite;
