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
export type Resource = HtmlResource | RawResource;

/**
 * A type common to all {@link Resource}s.
 */
export type ResourceBase = {
  route: string;
  name: string;
  /**
   * All the {@link Reference}s referred to in this {@link Resource}.
   */
  references: Reference[];
};

export type HtmlResource = ResourceBase & {
  type: "html";
  content: string;
  metadata: ResourceMetadata;
};

export type ResourceMetadata = z.infer<typeof ResourceMetadata_Schema>;
export const ResourceMetadata_Schema = z.object({
  type: z.enum(["page", "post"]),
  pubDate: z.optional(z.string()),
  tags: z.optional(z.array(z.string())),
  abstract: z.optional(z.string()),
});

export type RawResource = ResourceBase & {
  type: "raw";
};

export type Reference = {
  url: string;
  name?: string;
  icon_url?: string;
};
