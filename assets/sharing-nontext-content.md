---
type: post
abstract:
  I express my frustration with the current state of podcast-sharing
  capabilities, and outline what kinds of solutions I'd like to see.
categories:
  - technology
---

# New Features for Sharing Nontext Content

## Introduction

Sharing text online in the form of urls, quotes, or just raw text has been a
core part of how content is shared online. For almost any kind of content on the
internet, even nontext content such as video or audio, there is always an
associated url that links to it or some representative text. However, I think
that this leaves a lot of room for improvement as nontext content becomes a more
developed medium.

The following sections outline a few features that I think take better advantage
of how nontext context is consumed on the internet.

## Splicing

Currently, YouTube offers a functionality for tagging a video link with a
_start_ time. When the link is opened, the video will load the video player with
the head set to the given time. This feature is so useful because:

- It is annoying to separately communicate timestamps if just a certain part of
  the video is of interest.
- Navigating a video without context is often cumbersome, and is especially
  difficult on mobile. Thus, the _start_ time function serves a legitimate
  purpose. It is also the first step towards a suite of similar, potention
  features that add only slightly more complexity.

Most obviously, a _stop_ time function could behave symmetrically. This feature
would be useful because:

- Often when a certain part of a video is of interest, it is not just the entire
  video after the specified _start_ time but just a small section of it.
- After watching the video for some amount of time, the user has to decide at
  what point to stop the video. This choice is often made arbitrarily and
  counter to the sender's intention.
- A user usually takes length heavily into account when deciding whether or not
  to watch a video or video segment. An unspecified length of a shared video
  segement may be less appealing than a specified length.
- Sections of videos could be more easily linked to in the context of citation,
  putting both a left and right bound around where a citation references in the
  video.

YouTube currently offers another functionality called Playlists where a user can
aggregate a selection of YouTube videos in a specified order. If YouTube offered
both _start_ and _stop_ time functions, then a user could make a Playlist that
included videos that only play a specified section when watched as part of the
playlist. I think this would be a hugely useful tool for YouTube users that want
to share bundles of videos, especially longer ones, but currently need to
actually splice together the videos off-platform and then upload the product as
an independent video. If users could splice together videos using the _start_
and _stop_ time functions in Playlists, then Playlists become a super easy way
to do this that preserves all easy-to-follow links to the original video sources
(for instance, to watch context around the spliced section). Perhaps even, a
creator could splice their own video content into the Playlist as a way to
easily do commentary that preserves the original sources.

I describe these features in the context of YouTube because I am most familiar
with its _start_ time function, but in theory it would work just as well with
any video or audio. For audio, the ability to link to specified sections of
podcasts and splice together small sections of several episodes would be very
useful for sharing small bits of longer pieces of content. Currently, there is
not even a _start_ time function for the largest podcast application Apple
Podcasts.

There are other possible functions in this area such as a YouTube function for
Playlists that play two videos side-by-side or in some sort of overlapping
arrangement. I think, however, that there will develop a relatively clear line
between what people are interested in making use of inside YouTube's interface
and what they will prefer to do in other ways (e.g. the raw video source). For
example, I predict that not many people would make use of the parallel-videos
Playlist functionlity just mentioned.

## Timestamped Comments

For text-centric content such as articles, a commenter can easily refer to a
part of the article by quoting the section. But for nontext content the
analogous capabilities are very clunky. Two examples:

- YouTube comments can reference a specific time via text in order to generate a
  link to the video at that time in the published comment. It's annoying to
  transcribe the timestamp, especially since its difficult to navigate a
  specific time on mobile
- Soundcloud comments are all timestamped, and can only be viewed by navigating
  to the part of the song the comment is at. This is extremely stupid because no
  one reads the comments as the randomly flash during the song - most of the
  comments are insignificant and if there are many comments near each other,
  it's impossible to navigate. Additionally, most of the comments have no reason
  for being linked to a specific time in the song.

In these and many other ways, the idea of timestamped comments has been
addressed superficially. However, for longer-form video and audio especially,
timestamped comments can be very useful. For example in a podcast, the analogous
act to quoting a section of an article would be to quote to a span of time in
the podcast.

The actual UI implementation of this feature seems to be a main sticking point.
YouTube's automatically-recognized timestamps are a good approach to start with.
The next step would be to allow a user to select the time rather to be the
current time of the player or by allowing a scrubber interfact for choosing a
timestamp. This removes the middle step of reading, remembering, and then typing
the timestamp.

## Chapters, Sections, Etc.

## Modular Video and Audio Widgets
