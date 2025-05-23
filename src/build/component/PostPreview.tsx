import Tag from "@/build/component/Tag";
import { remarkCustomDirectives } from "@/build/unified_plugins";
import { HtmlResource } from "@/types";
import { ifDefined, intercalate } from "@/util";
import rehypeMathJaxSvg from "rehype-mathjax";
import rehypeStringify from "rehype-stringify";
import remarkDirective from "remark-directive";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

export default function PostPreview(props: {
  post: HtmlResource;
}): JSX.Element {
  return (
    <div class="PostPreview">
      {ifDefined(props.post.name, <></>, (name) => (
        <div class="name">
          <h2>
            <a href={props.post.route} class="no_background" safe>
              {name}
            </a>
          </h2>
        </div>
      ))}
      {ifDefined(props.post.metadata.pubDate, <></>, (pubDate) => (
        <div class="pubDate">
          <i>Published.</i> <span safe>{pubDate}</span>
        </div>
      ))}
      {ifDefined(props.post.metadata.tags, <></>, (tags) => (
        <div class="tags">
          <i>Tags.</i>{" "}
          {intercalate<JSX.Element>(
            tags.map((tag) => [<Tag tag={tag} />]),
            [<>, </>],
          )}
        </div>
      ))}
      {ifDefined<string, JSX.Element>(
        props.post.metadata.abstract,
        <></>,
        async (abstract) => (
          <div class="abstract">
            <i>Abstract.</i>{" "}
            {
              String(
                unified()
                  .use(remarkParse)
                  .use(remarkDirective)
                  .use(remarkCustomDirectives, {})
                  .use(remarkGfm)
                  .use(remarkMath)
                  .use(remarkRehype)
                  .use(rehypeMathJaxSvg)
                  .use(rehypeStringify)
                  .processSync(abstract),
              ) as "safe"
            }
          </div>
        ),
      )}
    </div>
  );
}
