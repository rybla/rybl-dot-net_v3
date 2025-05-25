import PostPreview from "@/build/component/PostPreview";
import Tag from "@/build/component/Tag";
import TopComponent from "@/build/component/Top";
import config from "@/config.json";
import {
  rehypeCustomHeaders,
  remarkCustomDirectives,
  remarkPostMetadata,
  remarkReferences,
  remarkTableOfContents,
  remarkTitle,
  showNode,
} from "@/build/unified_plugins";
import Effect from "@/Effect";
import {
  addResource,
  fromResourceToReference,
  HtmlResource,
  Reference,
  ResourceMetadata,
  Website,
} from "@/types";
import { encodeURIComponent_id, Ref, render_jsx } from "@/util";
import { hash } from "crypto";
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

export const constructWebsite: Effect.T<{ website: Website }> =
  (input) => async (ctx) => {
    const website = input.website;

    const posts: HtmlResource[] = [];

    const constructResourceFromFilepath: Effect.T<{ filepath: string }> =
      Effect.run(
        {
          label: (input) =>
            `constructResourceFromFilepath("${input.filepath}")`,
          catch: (e) => async (ctx) => await Effect.tell(e.toString())(ctx),
        },
        (input) => async (ctx) => {
          if (input.filepath === ".DS_Store") return;

          if (input.filepath.endsWith(".md")) {
            const resource = await constructMarkdown({
              filepath: input.filepath,
            })(ctx);
            await addResource({ website, resource })(ctx);
            if (resource.metadata.type === "post") posts.push(resource);
          } else {
            await addResource({
              website,
              resource: {
                route: input.filepath,
                name: input.filepath,
                references: [],
                type: "raw",
              },
            })(ctx);
          }
        },
      );

    const filepaths = await Effect.inputDir({ dirpath_relative: "." })(ctx);
    if (false) {
      await Effect.all({
        opts: {
          batch_size: 5,
        },
        input: {},
        ks: filepaths.map(
          (filepath) => () => constructResourceFromFilepath({ filepath }),
        ),
      })(ctx);
    } else {
      for (const filepath of filepaths)
        await constructResourceFromFilepath({ filepath })(ctx);
    }

    await Effect.all({
      opts: {},
      input: {},
      ks: [
        () => async (ctx) =>
          await addResource({
            website,
            resource: await constructIndex({ posts })(ctx),
          })(ctx),
        () => async (ctx) =>
          await addResource({
            website,
            resource: await constructTags({ posts })(ctx),
          })(ctx),
        () => async (ctx) =>
          await addResource({
            website,
            resource: await constructAbout({})(ctx),
          })(ctx),
      ],
    })(ctx);
  };

export default constructWebsite;

const constructIndex: Effect.T<{ posts: HtmlResource[] }, HtmlResource> =
  Effect.run({ label: "constructIndex" }, (input) => async (ctx) => {
    const name = "Index";
    const index: HtmlResource = {
      route: `index.html`,
      name,
      references: input.posts.map(fromResourceToReference),
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
            {input.posts.map((post) => (
              <PostPreview ctx={ctx} post={post} />
            ))}
          </div>
        </TopComponent>,
      ),
    };

    return index;
  });

const constructTags: Effect.T<{ posts: HtmlResource[] }, HtmlResource> =
  Effect.run({ label: "constructTags" }, (input) => async (ctx) => {
    const tags: Set<string> = new Set(
      input.posts.flatMap((post) => post.metadata.tags ?? []),
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
                  {input.posts.map((post) =>
                    !post.metadata.tags?.includes(tag) ? (
                      <></>
                    ) : (
                      <PostPreview ctx={ctx} post={post} />
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
  });

const constructAbout: Effect.T<{}, HtmlResource> = Effect.run(
  { label: "constructAbout" },
  (input) => async (ctx) => {
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
  },
);

const constructMarkdown: Effect.T<{ filepath: string }, HtmlResource> =
  Effect.run({ label: "constructMarkdown" }, (input) => async (ctx) => {
    const content_raw = await Effect.inputFile_text({
      filepath_relative: input.filepath,
    })(ctx);

    if (config.using_cache) {
      const cache = await Effect.getCache<
        { hash: string; post: HtmlResource } | undefined
      >({
        key: input.filepath,
        default: () => async () => undefined,
      })(ctx);

      if (cache !== undefined && cache.hash === hash("sha256", content_raw)) {
        await Effect.tell(`using cached value at "${input.filepath}"`)(ctx);
        return cache.post;
      }
    }

    const filebasename = input.filepath.slice(0, -".md".length);

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
        .use(remarkPostMetadata, { ctx, metadataRef })
        .use(remarkTitle, { ctx, metadataRef, titleRef })
        .use(remarkDirective)
        // .use(remarkCustomDirectives, { ctx })
        .use(remarkGfm)
        .use(remarkMath)
        .use(remarkReferences, { ctx, metadataRef, referencesRef })
        .use(remarkTableOfContents, { ctx, metadataRef })
        .use(remarkRehype)
        .use(rehypeMathJaxSvg)
        .use(rehypeCustomHeaders, { ctx, metadataRef })
        .use(rehypeStringify)
        .process(content_raw),
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

    if (config.using_cache) {
      await Effect.setCache({
        key: input.filepath,
        value: {
          hash: hash("sha256", content_raw),
          post,
        },
      })(ctx);
    }

    return post;
  });
