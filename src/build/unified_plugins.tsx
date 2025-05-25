import config from "@/config.json";
import Effect from "@/Effect";
import { Reference, ResourceMetadata, ResourceMetadata_Schema } from "@/types";
import { do_, encodeURIComponent_id, indentString, Ref, Tree } from "@/util";
import { extract_faviconUrl_from_url } from "@/web_util";
import * as hast from "hast";
import * as mdast from "mdast";
import * as mdast_directive from "mdast-util-directive";
import { Plugin } from "unified";
import * as unist from "unist";
import { visit } from "unist-util-visit";
import YAML from "yaml";

// -----------------------------------------------------------------------------
// Template
// -----------------------------------------------------------------------------

const mkPlugin: <
  Opts extends { [key: string]: any } & { ctx: Effect.Ctx.T },
  Input extends unist.Node,
  Output extends unist.Node,
>(
  label: string,
  k: Effect.T<Opts & { root: Input }, void>,
) => Plugin<[Opts], Input, Output> =
  (label, k) =>
  (opts) =>
  // @ts-ignore
  (root: Input) =>
    Effect.run({ label }, k)({ ...opts, root })(opts.ctx);

const examplePlugin: Plugin<
  [{ ctx: Effect.Ctx.T; metadataRef: Ref<ResourceMetadata> }],
  mdast.Root,
  mdast.Root
> = mkPlugin("TODO:label", (input) => async (ctx) => {
  await Effect.tell("TODO")(ctx);
});

// -----------------------------------------------------------------------------
// Plugins
// -----------------------------------------------------------------------------

export const remarkTitle: Plugin<
  [
    {
      ctx: Effect.Ctx.T;
      metadataRef: Ref<ResourceMetadata>;
      titleRef: Ref<mdast.Heading>;
    },
  ],
  mdast.Root,
  mdast.Root
> = mkPlugin("remarkTitle", (input) => async (ctx) => {
  visit(input.root, (node) => {
    if (node.type === "heading" && node.depth === 1) {
      input.titleRef.value = node;
    }
  });
});

export const remarkPostMetadata: Plugin<
  [{ ctx: Effect.Ctx.T; metadataRef: Ref<ResourceMetadata> }],
  mdast.Root,
  mdast.Root
> = mkPlugin("remarkPostMetadata", (input) => async (ctx) => {
  visit(input.root, (node) => {
    if (node.type === "yaml") {
      const frontmatter = YAML.parse(node.value);
      const metadata = ResourceMetadata_Schema.parse(frontmatter);
      input.metadataRef.value = metadata;
    }
  });
});

export const remarkReferences: Plugin<
  [
    {
      ctx: Effect.Ctx.T;
      metadataRef: Ref<ResourceMetadata>;
      referencesRef: Ref<Reference[]>;
    },
  ],
  mdast.Root,
  mdast.Root
> = mkPlugin("remarkReferences", (input) => async (ctx) => {
  if (["page"].includes(input.metadataRef.value.type)) return;

  // have to do this `visit` pass first before inserting images into links since
  // otherwise those images would be included in these image references
  {
    const nodes: mdast.Image[] = [];
    visit(input.root, (node) => {
      if (node.type === "image") nodes.push(node);
    });

    for (const node of nodes) {
      const icon_url = await getIconUrl({ url_raw: node.url })(input.ctx);
      input.referencesRef.value.push({
        name:
          node.alt !== undefined && node.alt !== null && node.alt !== ""
            ? node.alt
            : node.url,
        url: node.url,
        icon_url,
      });
    }
  }

  {
    const nodes: mdast.Link[] = [];
    visit(input.root, (node) => {
      if (node.type === "link") nodes.push(node);
    });

    for (const node of nodes) {
      const icon_url = await do_(async () => {
        if (node.url.startsWith("#")) {
          return config.website_url;
        } else {
          return await getIconUrl({ url_raw: node.url })(input.ctx);
        }
      });
      input.referencesRef.value.push({
        name: showNode(node),
        url: node.url,
        icon_url,
      });
      if (icon_url !== undefined) {
        node.children = [
          {
            type: "image",
            alt: "",
            url: icon_url,
            data: {
              hProperties: {
                class: "icon",
              },
            },
          },
          {
            type: "textDirective",
            name: "span",
            data: {
              hName: "span",
              hProperties: {
                class: "name",
              },
            },
            children: node.children,
          },
        ];
      }
    }
  }

  if (
    input.metadataRef.value.type === "excerpt" ||
    input.referencesRef.value.length === 0
  )
    return;

  input.root.children.push(
    {
      type: "heading",
      depth: 2,
      children: [{ type: "text", value: "References" }],
    },
    {
      type: "list",
      children: input.referencesRef.value.map((reference) => ({
        type: "listItem",
        children: [
          {
            type: "paragraph",
            children: [
              {
                type: "link",
                title: reference.name ?? reference.url,
                url: reference.url,
                children: [
                  reference.icon_url === undefined
                    ? []
                    : [
                        {
                          type: "image",
                          alt: "",
                          url: reference.icon_url,
                          data: {
                            hProperties: {
                              class: "icon",
                            },
                          },
                        } as mdast.Image,
                      ],
                  [
                    {
                      type: "text",
                      value: reference.name ?? reference.url,
                    } as mdast.Text,
                  ],
                ].flat(),
              },
            ],
          },
        ],
      })),
    },
  );
});

export const remarkTableOfContents: Plugin<
  [{ ctx: Effect.Ctx.T; metadataRef: Ref<ResourceMetadata> }],
  mdast.Root,
  mdast.Root
> = mkPlugin("remarkTableOfContents", (input) => async (ctx) => {
  if (["page"].includes(input.metadataRef.value.type)) return;

  const headings_forest: Tree<{ id: string; value: string }>[] = [];
  visit(input.root, (node, index, parent) => {
    if (node.type === "heading") {
      const value = showNode(node);
      const id = encodeURIComponent_id(value);
      node.data = node.data ?? {};
      node.data.hProperties = node.data.hProperties ?? {};
      node.data.hProperties.id = id;
      node.data.hProperties.class = "section-header";

      if (node.depth === 1) return;
      let headings_subforest = headings_forest;
      let depth = 1;
      while (headings_subforest.length > 0 && depth + 1 < node.depth) {
        headings_subforest = headings_subforest.at(-1)!.kids;
        depth++;
      }
      headings_subforest.push({ value: { id, value }, kids: [] });
    }
  });

  const go_nodes = (
    nodes: Tree<{ id: string; value: string }>[],
  ): mdast.List => ({
    type: "list",
    ordered: true,
    children: nodes.map((kid) => go_node(kid)),
  });

  const go_node = (
    node: Tree<{ id: string; value: string }>,
  ): mdast.ListItem => ({
    type: "listItem",
    children: [
      [
        {
          type: "paragraph" as "paragraph",
          children: [
            {
              type: "link",
              url: `#${node.value.id}`,
              title: node.value.value,
              children: [{ type: "text", value: node.value.value }],
            },
          ],
        } as mdast.Paragraph,
      ],
      node.kids.length === 0 ? [] : [go_nodes(node.kids)],
    ].flat<mdast.BlockContent[][]>(),
  });

  const tableOfContents = go_nodes(headings_forest);

  if (tableOfContents.children.length === 0) return;

  const title_index = input.root.children.findIndex(
    (node) => node.type === "heading" && node.depth === 1,
  );
  if (title_index !== -1) {
    input.root.children.splice(title_index + 1, 0, tableOfContents);
  }
});

export const rehypeCustomHeaders: Plugin<
  [{ ctx: Effect.Ctx.T; metadataRef: Ref<ResourceMetadata> }],
  hast.Root,
  hast.Root
> = mkPlugin("rehypeCustomHeaders", (input) => async (ctx) => {
  if (["page"].includes(input.metadataRef.value.type)) return;

  const nodes: hast.Element[] = [];
  visit(input.root, (node) => {
    if (node.type === "element" && RegExp(/^(h[1-6])$/).test(node.tagName))
      nodes.push(node);
  });

  for (const node of nodes) {
    node.children = [
      {
        type: "element",
        tagName: "a",
        properties: {
          href: `#${node.properties.id}`,
          class: "no_background",
        },
        children: node.children,
      },
    ];
  }
});

export const remarkCustomDirectives: Plugin<
  [{ ctx: Effect.Ctx.T }],
  mdast.Root,
  mdast.Root
> = mkPlugin("remarkCustomDirectives", (input) => async (ctx) => {
  const nodes: mdast_directive.Directives[] = [];
  visit(input.root, (node) => {
    if (
      node.type === "containerDirective" ||
      node.type === "leafDirective" ||
      node.type === "textDirective"
    )
      nodes.push(node);
  });

  for (const node of nodes) {
    if (node.type === "leafDirective" && node.name === "youtube") {
      node.data = node.data ?? {};
      node.data.hName = "iframe";
      node.data.hProperties = node.data.hProperties ?? {};
      node.data.hProperties.src = node.attributes!.src;
    } else {
      await Effect.tell(
        `unhandled directive: ${JSON.stringify(node, null, 4)}`,
      )(ctx);
    }
  }
});

// -----------------------------------------------------------------------------
// Utilities
// -----------------------------------------------------------------------------

// TODO: customize the size
// async function getIconUrl(url: URL) {
//   return `https://s2.googleusercontent.com/s2/favicons?domain=${url.hostname}&sz=${18}`;
// }
export const getIconUrl: Effect.T<{ url_raw: string }, string> =
  (input) => async (ctx) => {
    if (input.url_raw.startsWith("/")) {
      return "favicon.ico";
    } else {
      const url = do_(() => {
        try {
          return new URL(input.url_raw);
        } catch (e: any) {
          console.error(
            indentString(1, `problem with url_raw: ${input.url_raw}`),
          );
          throw new Error(`getIconUrl: ${e.toString()}`);
        }
      });
      let hostname = url.hostname;
      const hostname_parts = hostname.split(".");
      if (hostname_parts.length > 0) {
        hostname = hostname_parts
          .slice(hostname_parts.length - 2, hostname_parts.length)
          .join(".");
      }

      const favicon_url = await extract_faviconUrl_from_url({
        pageUrlString: `${url.protocol}//${hostname}`,
      })(ctx);

      if (favicon_url === undefined) {
        return config.placeholder_favicon_filepath;
      }

      const favicon_href = favicon_url.href;
      const favicon_extname = favicon_url.pathname.split(".").pop() || "ico";

      try {
        const response = await fetch(favicon_href, {
          redirect: "follow",
          signal: AbortSignal.timeout(config.fetch_timeout),
        });
        if (!response.ok) {
          return config.placeholder_favicon_filepath;
        }
      } catch (e: any) {
        return config.placeholder_favicon_filepath;
      }

      const name = url.hostname.replaceAll(".", "_");
      const favicon_filepath_relative = `${name}_favicon.${favicon_extname}`;

      await Effect.useRemoteFile({
        url: favicon_href,
        filepath_relative: favicon_filepath_relative,
      })(ctx);
      return favicon_filepath_relative;
    }
  };

export function showNode(node: mdast.Node): string {
  if ("value" in node) {
    return node.value as string;
  } else {
    return (node as unist.Parent).children.map((kid) => showNode(kid)).join("");
  }
}
