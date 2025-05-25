import { z } from "zod";
import Effect from "./Effect";

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
export const addResource: Effect.T<
  { website: Website; resource: Resource },
  void
> = (input) => async (ctx) => {
  if (
    input.website.resources.find(
      (resource_old) => resource_old.route === input.resource.route,
    ) !== undefined
  ) {
    throw new Effect.EffectError(
      `attempted to add a new Resource to a Website that already has a Resource at that Route: ${input.resource.route}`,
    );
  }
  input.website.resources.push(input.resource);
};

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
  type: z.enum(["page", "post", "excerpt"]),
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

export const fromResourceToReference = (resource: Resource): Reference => ({
  name: resource.name,
  url: resource.route,
  icon_url: `favicon.ico`,
});
