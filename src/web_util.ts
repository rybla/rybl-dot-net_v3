import { JSDOM } from "jsdom";
import Effect from "@/Effect";

export const extract_faviconUrl_from_url: Effect.T<
  { pageUrlString: string },
  URL | undefined
> = (input) => async (ctx) => {
  let pageUrl: URL;
  try {
    pageUrl = new URL(input.pageUrlString);
  } catch (e) {
    await Effect.tell(`Invalid page URL: ${input.pageUrlString}`)(ctx);
    return undefined;
  }

  try {
    const response = await fetch(pageUrl.toString(), {
      method: "GET",
      redirect: "follow",
    });

    if (!response.ok) {
      await Effect.tell(
        `Failed to fetch HTML: ${response.status} ${response.statusText} from ${pageUrl.toString()}`,
      )(ctx);
      return undefined;
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.toLowerCase().includes("text/html")) {
      await Effect.tell(
        `Expected HTML content, but got ${contentType} from ${pageUrl.toString()}`,
      )(ctx);
      return undefined;
    }

    const html = new JSDOM(await response.text());

    const selectors = [
      'link[rel="icon"]',
      'link[rel="shortcut icon"]',
      'link[rel="apple-touch-icon"]',
      'link[rel="apple-touch-icon-precomposed"]',
      'link[rel="mask-icon"]',
    ];

    for (const selector of selectors) {
      const linkElement = html.window.document.querySelector(
        selector,
      ) as HTMLLinkElement | null;
      if (linkElement && linkElement.href && linkElement.href.trim() !== "") {
        try {
          const faviconUrl = new URL(
            linkElement.href,
            html.window.document.baseURI,
          );
          if (faviconUrl.protocol === "data:") {
            return faviconUrl;
          }
          // For http/https, we assume the declared URL is the one to return.
          // Further validation of reachability for these linked URLs is not done here
          // to keep the function focused on extraction as per typical interpretations.
          return faviconUrl;
        } catch (e) {
          await Effect.tell(
            `Invalid or unresolvable href for selector ${selector}: "${linkElement.href}" on page ${pageUrl.toString()}`,
          )(ctx);
        }
      }
    }

    try {
      const fallbackFaviconUrl = new URL("/favicon.ico", pageUrl.origin);

      let headResponse: Response | null = null;
      try {
        headResponse = await fetch(fallbackFaviconUrl.toString(), {
          method: "HEAD",
          mode: "cors",
          redirect: "follow",
        });
        if (headResponse.ok) {
          return fallbackFaviconUrl;
        }
      } catch (headError) {
        await Effect.tell(
          `HEAD request for /favicon.ico failed for ${pageUrl.origin}, trying GET. Error: ${headError}`,
        )(ctx);
      }

      if (!headResponse || !headResponse.ok) {
        const getResponse = await fetch(fallbackFaviconUrl.toString(), {
          method: "GET",
          mode: "cors",
          redirect: "follow",
        });
        if (getResponse.ok) {
          if (
            getResponse.body &&
            typeof getResponse.body.cancel === "function"
          ) {
            await getResponse.body.cancel();
          } else if (
            getResponse.body &&
            typeof (getResponse.body as any).destroy === "function"
          ) {
            // Node.js stream
            (getResponse.body as any).destroy();
          } else {
            // If no specific cancel/destroy, try to read to completion to free resources
            try {
              await getResponse.arrayBuffer();
            } catch {
              /* ignore */
            }
          }
          return fallbackFaviconUrl;
        }
      }
    } catch (e) {
      await Effect.tell(
        `Error checking or fetching /favicon.ico for ${pageUrl.origin}`,
      )(ctx);
    }

    return undefined;
  } catch (error) {
    await Effect.tell(`Error extracting favicon from ${input.pageUrlString}`)(
      ctx,
    );
    return undefined;
  }
};
