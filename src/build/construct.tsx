import config from "@/config.json";
import Effect from "@/effect";
import * as hast from "hast";
import {
  addResource,
  Post,
  PostMetadata,
  PostMetadata_Schema,
  Reference,
  Website,
} from "@/types";
import {
  do_,
  encodeURIComponent_id,
  indentString,
  Ref,
  render_jsx,
  Tree,
} from "@/util";
import * as mdast from "mdast";
import rehypeMathJaxSvg from "rehype-mathjax";
import rehypeStringify from "rehype-stringify";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { Plugin, unified } from "unified";
import * as unist from "unist";
import { visit } from "unist-util-visit";
import YAML from "yaml";
import PostComponent from "./component/Post";

const extname_Page = ".page.md";
const extname_Post = ".post.md";

export default async function constructWebsite(): Promise<Website> {
  console.log("construct");
  const website: Website = {
    url: config.website_url,
    name: config.website_name,
    resources: [],
  };

  for (const filepath of await Effect.inputDir(".")) {
    try {
      if (filepath.endsWith(extname_Post)) {
        addResource(website, await constructPost(filepath));
      } else {
        addResource(website, {
          route: filepath,
          name: filepath,
          references: [],
          type: "raw",
        });
      }
    } catch (e: any) {
      console.error(indentString(1, e.toString()));
    }
  }

  return website;
}

async function constructPost(filepath: string): Promise<Post> {
  console.log(`constructPost: ${filepath}`);

  const filename = filepath.slice(0, -extname_Post.length);

  const titleRef: Ref<mdast.Heading> = Ref({
    type: "heading",
    depth: 1,
    children: [{ type: "text", value: filename }],
  });
  const metadataRef: Ref<PostMetadata> = Ref({});
  const referencesRef: Ref<Reference[]> = Ref([]);

  const content = String(
    await unified()
      .use(remarkParse)
      .use(remarkFrontmatter, ["yaml"])
      .use(remarkPostMetadata, { metadataRef })
      .use(remarkTitle, { titleRef })
      .use(remarkGfm)
      .use(remarkMath)
      .use(remarkReferences, { referencesRef })
      .use(remarkTableOfContents, {})
      .use(remarkRehype)
      .use(rehypeMathJaxSvg)
      .use(rehypeCustomHeaders, {})
      .use(rehypeStringify)
      .process(await Effect.inputFile_text(filepath)),
  );

  const titleString = showNode(titleRef.value);

  const post: Post = {
    route: `${filename}.html`,
    name: titleString,
    references: referencesRef.value,
    type: "post",
    pubDate: metadataRef.value.pubDate,
    tags: metadataRef.value.tags,
    summary: metadataRef.value.summary,
    content: await render_jsx(
      <PostComponent title={titleString}>{content as "safe"}</PostComponent>,
    ),
  };

  return post;
}

function showNode(node: mdast.Node): string {
  if ("value" in node) {
    return node.value as string;
  } else {
    return (node as unist.Parent).children.map((kid) => showNode(kid)).join("");
  }
}

const remarkTitle: Plugin<
  [{ titleRef: Ref<mdast.Heading> }],
  mdast.Root,
  mdast.Root
> = (opts) => async (root) => {
  visit(root, (node, index, parent) => {
    if (node.type === "heading" && node.depth === 1) {
      opts.titleRef.value = node;
    }
  });
};

const remarkPostMetadata: Plugin<
  [{ metadataRef: Ref<PostMetadata> }],
  mdast.Root,
  mdast.Root
> = (opts) => async (root) => {
  visit(root, (node) => {
    if (node.type === "yaml") {
      const frontmatter = YAML.parse(node.value);
      opts.metadataRef.value = PostMetadata_Schema.parse(frontmatter);
    }
  });
};

const remarkReferences: Plugin<
  [{ referencesRef: Ref<Reference[]> }],
  mdast.Root,
  mdast.Root
> = (opts) => async (root) => {
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

const remarkTableOfContents: Plugin<[{}], mdast.Root, mdast.Root> =
  (opts) => (root) => {
    const headings_forest: Tree<string>[] = [];
    visit(root, (node, index, parent) => {
      if (node.type === "heading") {
        const id = encodeURIComponent_id(showNode(node));
        node.data = { hProperties: { id, class: "section-header" } };

        if (node.depth === 1) return;
        let headings_subforest = headings_forest;
        let depth = 1;
        while (headings_subforest.length > 0 && depth + 1 < node.depth) {
          headings_subforest = headings_subforest.at(-1)!.kids;
          depth++;
        }
        headings_subforest.push({ value: id, kids: [] });
      }
    });

    const go_nodes = (nodes: Tree<string>[]): mdast.List => ({
      type: "list",
      ordered: true,
      children: nodes.map((kid) => go_node(kid)),
    });

    const go_node = (node: Tree<string>): mdast.ListItem => ({
      type: "listItem",
      children: [
        [
          {
            type: "paragraph" as "paragraph",
            children: [
              {
                type: "link",
                url: `#${node.value}`,
                title: node.value,
                children: [{ type: "text", value: node.value }],
              },
            ],
          } as mdast.Paragraph,
        ],
        node.kids.length === 0 ? [] : [go_nodes(node.kids)],
      ].flat<mdast.BlockContent[][]>(),
    });

    const tableOfContents = go_nodes(headings_forest);

    const title_index = root.children.findIndex(
      (node) => node.type === "heading" && node.depth === 1,
    );
    if (title_index !== -1) {
      root.children.splice(title_index + 1, 0, tableOfContents);
    }
  };

const rehypeCustomHeaders: Plugin<[{}], hast.Root, hast.Root> =
  (opts) => (root) => {
    visit(root, (node) => {
      if (node.type === "element" && RegExp(/^(h[1-6])$/).test(node.tagName)) {
        node.children = [
          {
            type: "element",
            tagName: "a",
            properties: {
              href: `#${node.properties.id}`,
            },
            children: node.children,
          },
        ];
      }
    });
  };

const plugin: Plugin<[{}], mdast.Root, mdast.Root> = (opts) => (root) => {};

// TODO: customize the size
// async function getIconUrl(url: URL) {
//   return `https://s2.googleusercontent.com/s2/favicons?domain=${url.hostname}&sz=${18}`;
// }
async function getIconUrl(url_raw: string): Promise<string | undefined> {
  const url = new URL(url_raw);
  const favicon_url = `${url.protocol}//${url.hostname}/favicon.ico`;
  const response = await fetch(favicon_url);
  if (!response.ok) return undefined;
  const favicon_filepath_relative = `${url.hostname}.favicon.ico`;
  Effect.useRemoteFile(favicon_url, favicon_filepath_relative);
  return favicon_filepath_relative;
}
