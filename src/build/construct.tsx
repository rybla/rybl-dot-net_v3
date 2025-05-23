import config from "@/config.json";
import Effect from "@/effect";
import * as hast from "hast";
import {
  addResource,
  HtmlResource,
  ResourceMetadata,
  ResourceMetadata_Schema,
  Reference,
  Website,
  Resource,
  fromResourceToReference,
} from "@/types";
import {
  defined,
  do_,
  encodeURIComponent_id,
  ifDefined,
  indentString,
  intercalate,
  Ref,
  render_jsx,
  Tree,
} from "@/util";
import * as mdast from "mdast";
import remarkDirective from "remark-directive";
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
import PostComponent from "@/build/component/Post";
import TopComponent from "@/build/component/Top";
import Icon from "@/build/component/Icon";
import PostTeaser from "@/build/component/PostTeaser";
import {
  rehypeCustomHeaders,
  remarkCustomDirectives,
  remarkPostMetadata,
  remarkReferences,
  remarkTableOfContents,
  remarkTitle,
  showNode,
} from "@/build/unified_plugins";

const extname_Markdown = ".md";

export default async function constructWebsite(): Promise<Website> {
  console.log("construct");
  const website: Website = {
    url: config.website_url,
    name: config.website_name,
    resources: [],
  };

  const posts: HtmlResource[] = [];

  for (const filepath of await Effect.inputDir(".")) {
    try {
      if (filepath.endsWith(extname_Markdown)) {
        const resource = await constructMarkdown(filepath);
        addResource(website, resource);
        if (resource.metadata.type === "post") posts.push(resource);
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

  try {
    addResource(website, await constructIndex(posts));
  } catch (e: any) {
    console.error(indentString(1, e.toString()));
  }

  try {
    addResource(website, await constructTags(posts));
  } catch (e: any) {
    console.error(indentString(1, e.toString()));
  }

  return website;
}

async function constructIndex(posts: HtmlResource[]): Promise<HtmlResource> {
  console.log("constructIndex");
  const name = "Index";
  const index: HtmlResource = {
    route: `index.html`,
    name,
    references: posts.map(fromResourceToReference),
    type: "html",
    metadata: { type: "page" },
    content: await render_jsx(
      <TopComponent
        title={name}
        content_head={
          <>
            <link rel="stylesheet" href="Index.css" />
            <link rel="stylesheet" href="PostTeaser.css" />
          </>
        }
      >
        {posts.map((post) => (
          <PostTeaser post={post} />
        ))}
      </TopComponent>,
    ),
  };

  return index;
}

async function constructTags(posts: HtmlResource[]): Promise<HtmlResource> {
  console.log("constructTags");
  const tags = posts.flatMap((post) => post.metadata.tags ?? []);

  const resource: HtmlResource = {
    route: "Tags.html",
    name: "Tags",
    references: [],
    type: "html",
    metadata: {
      type: "page",
    },
    content: await render_jsx(
      <TopComponent
        title="Tags"
        content_head={
          <>
            <link rel="stylesheet" href="Tags.css" />
            <link rel="stylesheet" href="PostTeaser.css" />
          </>
        }
      >
        {tags.map((tag) => {
          const id = encodeURIComponent_id(tag);
          return (
            <>
              <h2 id={id}>
                <a href={`#${id}`} safe>
                  #{tag}
                </a>
              </h2>
              {posts.map((post) =>
                !post.metadata.tags?.includes(tag) ? (
                  <></>
                ) : (
                  <PostTeaser post={post} />
                ),
              )}
            </>
          );
        })}
      </TopComponent>,
    ),
  };

  return resource;
}

async function constructMarkdown(filepath: string): Promise<HtmlResource> {
  console.log(`constructPost: ${filepath}`);

  const filebasename = filepath.slice(0, -extname_Markdown.length);

  const titleRef: Ref<mdast.Heading> = Ref({
    type: "heading",
    depth: 1,
    children: [{ type: "text", value: filebasename }],
  });
  const metadataRef: Ref<ResourceMetadata> = Ref({
    type: "post",
  });
  const referencesRef: Ref<Reference[]> = Ref([]);

  const content = String(
    await unified()
      .use(remarkParse)
      .use(remarkFrontmatter, ["yaml"])
      .use(remarkPostMetadata, { metadataRef })
      .use(remarkTitle, { metadataRef, titleRef })
      .use(remarkDirective)
      .use(remarkCustomDirectives, {})
      .use(remarkGfm)
      .use(remarkMath)
      .use(remarkReferences, { metadataRef, referencesRef })
      .use(remarkTableOfContents, { metadataRef })
      .use(remarkRehype)
      .use(rehypeMathJaxSvg)
      .use(rehypeCustomHeaders, { metadataRef })
      .use(rehypeStringify)
      .process(await Effect.inputFile_text(filepath)),
  );

  const titleString = showNode(titleRef.value);

  const post: HtmlResource = {
    route: `${filebasename}.html`,
    name: titleString,
    references: referencesRef.value,
    type: "html",
    metadata: metadataRef.value,
    content: await render_jsx(
      <TopComponent title={titleString} content_head={<></>}>
        {content as "safe"}
      </TopComponent>,
    ),
  };

  return post;
}
