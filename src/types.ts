import { z } from "zod";

/**
 * Everything that describes a website.
 */
export type Website = {
  url: string;
  name: string;
  resources: Resource[];
};

/**
 * Adds a {@link Resource} to a {@link Website}. Throws an error if a
 * {@link Resource} with the same `route` already exists.
 *
 * @param website
 * @param resource
 */
export async function addResource(website: Website, resource: Resource) {
  if (
    website.resources.find(
      (resource_old) => resource_old.route === resource.route,
    ) !== undefined
  ) {
    throw new Error(
      `attempted to add a new Resource to a Website that already has a Resource at that Route: ${resource.route}`,
    );
  }
  website.resources.push(resource);
}

/**
 * A thing that exists in a {@link Website}.
 */
export type Resource = Post | Page | Raw;

/**
 * A type common to all {@link Resource}s.
 */
export type ResourceBase = {
  route: string;
  name: string;
  /**
   * All the {@link Reference}s refered to in this {@link Resource}.
   */
  references: Reference[];
};

/**
 * A simple {@link Resource} that just has some {@link HtmlString} content to be inserted into a `<main>`.
 */
export type Page = ResourceBase & {
  type: "page";
  content: HtmlString;
};

/**
 * A {@link Resource} that has {@link HtmlString} content to be inserted into
 * an `<article>` tag.
 */
export type Post = ResourceBase & {
  type: "post";
  content: HtmlString;
} & PostMetadata;

export type PostMetadata = z.infer<typeof PostMetadata_Schema>;
export const PostMetadata_Schema = z.object({
  pubDate: z.optional(z.string()),
  tags: z.optional(z.array(z.string())),
  summary: z.optional(z.string()),
});

export type Raw = ResourceBase & {
  type: "raw";
};

export type Reference = {
  url: string;
  name?: string;
  icon_url?: string;
};

/**
 * Html serialized as a string.
 */
export type HtmlString = string;
