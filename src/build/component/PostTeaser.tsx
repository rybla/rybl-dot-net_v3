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
import { remarkCustomDirectives } from "@/build/unified_plugins";

export default function PostTeaser(props: { post: HtmlResource }): JSX.Element {
  return (
    <div class="PostTeaser">
      {ifDefined(props.post.name, <></>, (name) => (
        <div class="name">
          <h2>
            <a href={props.post.route} safe>
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
            tags.map((tag) => [
              <a href={`/Tags.html#${encodeURIComponent_id(tag)}`} safe>
                #{tag}
              </a>,
            ]),
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
