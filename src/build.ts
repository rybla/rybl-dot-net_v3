import { do_ } from "./util";
import constructWebsite from "./build/construct";
import compileWebsite from "@/build/compile";

do_(async () => {
  console.log("build");
  const website = await constructWebsite();
  await compileWebsite(website);
});
