import { JSDOM } from "jsdom";

export async function extract_faviconUrl_from_url(
  pageUrlString: string,
): Promise<URL | undefined> {
  let pageUrl: URL;
  try {
    pageUrl = new URL(pageUrlString);
  } catch (e) {
    console.error("Invalid page URL:", pageUrlString, e);
    return undefined;
  }

  try {
    const response = await fetch(pageUrl.toString(), {
      method: "GET",
      redirect: "follow",
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch HTML: ${response.status} ${response.statusText} from ${pageUrl.toString()}`,
      );
      return undefined;
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.toLowerCase().includes("text/html")) {
      console.error(
        `Expected HTML content, but got ${contentType} from ${pageUrl.toString()}`,
      );
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
          // console.warn(
          //   `Invalid or unresolvable href for selector ${selector}: "${linkElement.href}" on page ${pageUrl.toString()}`,
          //   e,
          // );
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
        // console.warn(
        //   `HEAD request for /favicon.ico failed for ${pageUrl.origin}, trying GET. Error:`,
        //   headError,
        // );
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
      // console.warn(
      //   `Error checking or fetching /favicon.ico for ${pageUrl.origin}`,
      //   e,
      // );
    }

    return undefined;
  } catch (error) {
    console.error(`Error processing ${pageUrlString}:`, error);
    return undefined;
  }
}
