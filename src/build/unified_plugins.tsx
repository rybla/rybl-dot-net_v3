import config from "@/config.json";
import Effect from "@/effect";
import { Reference, ResourceMetadata, ResourceMetadata_Schema } from "@/types";
import { defined, do_, encodeURIComponent_id, Ref, Tree } from "@/util";
import * as hast from "hast";
import * as mdast from "mdast";
import { Plugin } from "unified";
import * as unist from "unist";
import { visit } from "unist-util-visit";
import YAML from "yaml";

export function showNode(node: mdast.Node): string {
  if ("value" in node) {
    return node.value as string;
  } else {
    return (node as unist.Parent).children.map((kid) => showNode(kid)).join("");
  }
}

export const remarkTitle: Plugin<
  [{ metadataRef: Ref<ResourceMetadata>; titleRef: Ref<mdast.Heading> }],
  mdast.Root,
  mdast.Root
> = (opts) => async (root) => {
  // console.log("remarkTitle");
  visit(root, (node, index, parent) => {
    if (node.type === "heading" && node.depth === 1) {
      opts.titleRef.value = node;
    }
  });
};

export const remarkPostMetadata: Plugin<
  [{ metadataRef: Ref<ResourceMetadata> }],
  mdast.Root,
  mdast.Root
> = (opts) => async (root) => {
  // console.log("remarkPostMetadata");
  visit(root, (node) => {
    if (node.type === "yaml") {
      const frontmatter = YAML.parse(node.value);
      const metadata = ResourceMetadata_Schema.parse(frontmatter);
      opts.metadataRef.value = metadata;
    }
  });
};

export const remarkReferences: Plugin<
  [{ metadataRef: Ref<ResourceMetadata>; referencesRef: Ref<Reference[]> }],
  mdast.Root,
  mdast.Root
> = (opts) => async (root) => {
  // console.log("remarkReferences");
  if (["page"].includes(opts.metadataRef.value.type)) return;

  // have to do this `visit` pass first before inserting images into links since
  // otherwise those images would be included in these image references
  {
    const promises: Promise<void>[] = [];
    visit(root, (node) => {
      if (node.type === "image") {
        promises.push(
          do_(async () => {
            const icon_url = await getIconUrl(node.url);
            opts.referencesRef.value.push({
              name:
                node.alt !== undefined && node.alt !== null && node.alt !== ""
                  ? node.alt
                  : node.url,
              url: node.url,
              icon_url,
            });
          }),
        );
      }
    });
    await Promise.all(promises);
  }

  {
    const promises: Promise<void>[] = [];
    visit(root, (node) => {
      if (node.type === "link") {
        promises.push(
          do_(async () => {
            // console.log(`reference: ${showNode(node)}`);
            const icon_url = await do_(async () => {
              if (node.url.startsWith("#")) {
                return config.website_url;
              } else {
                return await getIconUrl(node.url);
              }
            });
            opts.referencesRef.value.push({
              name: showNode(node),
              url: node.url,
              icon_url,
            });
            if (icon_url !== undefined) {
              node.children.splice(0, 0, {
                type: "image",
                alt: "",
                url: icon_url,
                data: {
                  hProperties: {
                    class: "icon",
                  },
                },
              });
            }
          }),
        );
      }
    });
    await Promise.all(promises);
  }

  if (opts.referencesRef.value.length === 0) return;

  root.children.push(
    {
      type: "heading",
      depth: 2,
      children: [{ type: "text", value: "References" }],
    },
    {
      type: "list",
      children: opts.referencesRef.value.map((reference) => ({
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
};

export const remarkTableOfContents: Plugin<
  [{ metadataRef: Ref<ResourceMetadata> }],
  mdast.Root,
  mdast.Root
> = (opts) => (root) => {
  if (["page"].includes(opts.metadataRef.value.type)) return;

  const headings_forest: Tree<{ id: string; value: string }>[] = [];
  visit(root, (node, index, parent) => {
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

  const title_index = root.children.findIndex(
    (node) => node.type === "heading" && node.depth === 1,
  );
  if (title_index !== -1) {
    root.children.splice(title_index + 1, 0, tableOfContents);
  }
};

export const rehypeCustomHeaders: Plugin<
  [{ metadataRef: Ref<ResourceMetadata> }],
  hast.Root,
  hast.Root
> = (opts) => (root) => {
  // console.log("rehypeCustomHeaders");
  if (["page"].includes(opts.metadataRef.value.type)) return;

  visit(root, (node) => {
    if (node.type === "element" && RegExp(/^(h[1-6])$/).test(node.tagName)) {
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
};

export const remarkCustomDirectives: Plugin<[{}], mdast.Root, mdast.Root> =
  (opts) => (root) => {
    // console.log("remarkCustomDirectives");
    visit(root, (node) => {
      if (
        node.type === "containerDirective" &&
        node.name === "example_containerDirective"
      ) {
        node.data = node.data ?? {};
        node.data.hProperties = node.data.hProperties ?? {};
        node.data.hProperties.class = "example_containerDirective";
      } else if (
        node.type === "leafDirective" &&
        node.name === "example_leafDirective"
      ) {
        node.data = node.data ?? {};
        node.data.hProperties = node.data.hProperties ?? {};
        node.data.hProperties.class = "example_leafDirective";
        node.children = [{ type: "text", value: "example_leafDirective" }];
      } else if (
        node.type === "textDirective" &&
        node.name === "example_textDirective"
      ) {
        node.data = node.data ?? {};
        node.data.hName = "span";
        node.data.hProperties = node.data.hProperties ?? {};
        node.data.hProperties.class = "example_textDirective";
        node.children = [{ type: "text", value: "example_textDirective" }];
      } else if (
        node.type === "containerDirective" &&
        node.name === "thumbnail"
      ) {
        node.data = node.data ?? {};
        node.data.hProperties = node.data.hProperties ?? {};
        node.data.hProperties.class = "containerDirective_thumbnail";
        const attributes = defined(node.attributes);
        const title = defined(attributes.title);
        const url = defined(attributes.url);
        node.children.splice(0, 0, {
          type: "heading",
          depth: 2,
          children: [
            {
              type: "text",
              value: title,
            },
          ],
        });
      } else if (node.type === "leafDirective" && node.name === "youtube") {
        console.log(JSON.stringify(node, null, 4));
      }
    });
  };

const plugin: Plugin<
  [{ metadataRef: Ref<ResourceMetadata> }],
  mdast.Root,
  mdast.Root
> = (opts) => (root) => {};

// TODO: customize the size
// async function getIconUrl(url: URL) {
//   return `https://s2.googleusercontent.com/s2/favicons?domain=${url.hostname}&sz=${18}`;
// }
export async function getIconUrl(url_raw: string): Promise<string | undefined> {
  const url = new URL(url_raw);
  const favicon_url = `${url.protocol}//${url.hostname}/favicon.ico`;
  const response = await fetch(favicon_url);
  if (!response.ok) return undefined;
  const favicon_filepath_relative = `${url.hostname}.favicon.ico`;
  await Effect.useRemoteFile(favicon_url, favicon_filepath_relative);
  return favicon_filepath_relative;
}
