import PostPreview from "@/build/component/PostPreview";
import Tag from "@/build/component/Tag";
import TopComponent from "@/build/component/Top";
import {
  rehypeCustomHeaders,
  remarkCustomDirectives,
  remarkPostMetadata,
  remarkReferences,
  remarkTableOfContents,
  remarkTitle,
  showNode,
} from "@/build/unified_plugins";
import config from "@/config.json";
import Effect from "@/effect";
import {
  addResource,
  fromResourceToReference,
  HtmlResource,
  Reference,
  ResourceMetadata,
  Website,
} from "@/types";
import { encodeURIComponent_id, Ref, render_jsx } from "@/util";
import * as mdast from "mdast";
import rehypeMathJaxSvg from "rehype-mathjax";
import rehypeStringify from "rehype-stringify";
import remarkDirective from "remark-directive";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

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
      console.error(e.toString());
    }
  }

  try {
    addResource(website, await constructIndex(posts));
  } catch (e: any) {
    console.error(e.toString());
  }

  try {
    addResource(website, await constructTags(posts));
  } catch (e: any) {
    console.error(e.toString());
  }

  try {
    addResource(website, await constructAbout());
  } catch (e: any) {
    console.error(e.toString());
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
        resource_name={name}
        content_head={
          <>
            <link rel="stylesheet" href="Index.css" />
            <link rel="stylesheet" href="PostPreview.css" />
          </>
        }
      >
        <div class="previews">
          {posts.map((post) => (
            <PostPreview post={post} />
          ))}
        </div>
      </TopComponent>,
    ),
  };

  return index;
}

async function constructTags(posts: HtmlResource[]): Promise<HtmlResource> {
  console.log("constructTags");
  const tags: Set<string> = new Set(
    posts.flatMap((post) => post.metadata.tags ?? []),
  );

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
        resource_name="Tags"
        content_head={
          <>
            <link rel="stylesheet" href="Tags.css" />
            <link rel="stylesheet" href="PostPreview.css" />
          </>
        }
      >
        <div class="Tags">
          {Array.from(tags).map((tag) => {
            const id = encodeURIComponent_id(tag);
            return (
              <>
                <div id={id} class="heading">
                  <Tag tag={tag} />
                </div>
                {posts.map((post) =>
                  !post.metadata.tags?.includes(tag) ? (
                    <></>
                  ) : (
                    <PostPreview post={post} />
                  ),
                )}
              </>
            );
          })}
        </div>
      </TopComponent>,
    ),
  };

  return resource;
}

async function constructAbout(): Promise<HtmlResource> {
  const resource: HtmlResource = {
    route: "About.html",
    name: "About",
    references: [],
    type: "html",
    metadata: {
      type: "page",
    },
    content: await render_jsx(
      <TopComponent
        resource_name="About"
        content_head={
          <>
            <link rel="stylesheet" href="About.css" />
            <link rel="stylesheet" href="PostPreview.css" />
          </>
        }
      >
        TODO: write about me
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
      <TopComponent
        resource_name={titleString}
        content_head={
          <>
            <link rel="stylesheet" href="Post.css" />
          </>
        }
      >
        <article>{content as "safe"}</article>
      </TopComponent>,
    ),
  };

  return post;
}
