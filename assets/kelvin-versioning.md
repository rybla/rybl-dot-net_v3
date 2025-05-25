---
type: post
tags:
  - software-engineering
abstract: Kelvin versioning is an uncommon versioning scheme, introduced by Curtis Yarvin at Urbit, that enumerates newer versions with lower natural numbers. When version 0K is reached, no more changes are allowed -- this final version is, permanently, "frozen". I present a way to arrive at versioning schemes like semantic versioning (semver) and Kelvin versioning (kelver) from first principles, and propose an variant of Kelvin versioning that mirrors the way that semantic versioning improved upon more primitive versioning schemes.
---

# Kelvin Versioning

## Kelvin Versioning

__Kelvin versioning__ (i.e. __kelver__) is an extremely uncommon versioning scheme,
introduced by [Curtis Yarvin](https://en.wikipedia.org/wiki/Curtis_Yarvin) at [urbit](https://urbit.org), that enumerates
newer versions with lower natural numbers. The metaphor is between versions of a
software project and degrees of [Kelvin](https://en.wikipedia.org/wiki/Kelvin), which is the [SI base
unit](https://en.wikipedia.org/wiki/SI_base_unit) of
[temperature](https://en.wikipedia.org/wiki/Temperature) where 0 degrees Kelvin
--- written 0K and often referred to as ["absolute
zero"](https://en.wikipedia.org/wiki/Absolute_zero) --- is the measure of the
total absence of kinetic energy.

In this way, as a project's version approaches 0K, the amount of further changes
allowed (i.e. the kinetic energy) approaches 0. A project with version a high
degree is expected to experience many further changes --- it has high kinetic
energy. A project with version a low degree is expected to experience few
further changes --- it has low kinetic energy.

## Semantic Versioning

__[Semantic versioning](https://semver.org)__ (i.e. __semver__) is the most standard, and
extremely common, versioning scheme used in production software. It encodes a
project's version with three natural numbers, written `major.minor.patch`:

- __major__: Versions with the same major version number are [backwards
  compatible](https://en.wikipedia.org/wiki/Backward_compatibility). In this
  way, an major version update indicates non-backwards-compatibile changes.
- __minor__: A minor version update indicates backwards-compatible changes.
- __patch__: A patch version update indicates backwards-compatible changes that
  only fix bugs.

## The Purposes of Versioning Schemes

The contrast between kelver and semver demonstrates some fundamentally different
ideas about the purposes of versioning schemes. At bottom, a versioning scheme
is a scheme for uniquely naming each version of a project. This description
captures both kelver and semver, and also allows completely unconventional
schemes such as the following:

- __randver__: the version is a random version not already used by an existing
  version (this is how many layuser-facing version names are chosen for systems
  like macos and android)
- __hashver__: the version is the hash of the project (this is essentially how
  github versions commits)
- __idver__: the version _is_ the project (in binary)
- __natver__: the version starts at 0 and increments for each new version
  version

### randver & hashver

The hamartia of randver and hashver is that the versions of projects do not
indicate anything about their relationship other that whether they are the same.

Idver indicates slightly more than randver and hashver. Taking a [diff](https://en.wikipedia.org/wiki/Diff) of
two versions entirely describes the (syntactic) differences between those
versions of the project. However, users don't care specifically about the syntax
of a project; users care about the semantics of a project so they use the
project's behaviors without knowing or understanding in particular _how_ those
behaviors are implemented. So, more developed versioning schemes have adopted
the further purpose to conveniently encode important semantic relationships.
From now on, "change" is used as shorthand for "semantic change".

### natver

Natver is the simplest step in the direction of satisfying this further purpose.
For example, version 10 is a more developed version than version 2 and versions
2 through 9 show how version 1 was incrementally developed in version 10.
Additionally, there are more significant changes between versions 10
and 100 than between version 1 and 10. Using digital encodings of natural
numbers is the only acceptable way to implement this, but there has been an
exception made from this for [Donald
Knuth](https://en.wikipedia.org/wiki/Donald_Knuth) who, after writing some of the
most influencial work on [The Art of Computer
Programming](https://en.wikipedia.org/wiki/The_Art_of_Computer_Programming) and
developing document and font rendering programs TeX and Metafont which are still
used >60 years later, was allowed to [encode the natver of TeX in unary as the
sequence of digits approaching π (where π is planned to be a locked
version)](https://en.wikipedia.org/wiki/TeX#TeX82).

Even this simple step, however, introduces many more ways to misuse the
versioning scheme. In randver, hashver, and idver, releasing a new project
version was trivial. But in natver, the useful information in the version has to
be maintained, nontrivially, by the project developer. All of the sudden, many
more factors are relevant to choosing when to make a new version than before.
The developer has to be conscious now that, when they release a new version, it
should be based on the immediately previous version of the project. It doesn't
make sense for development to go backwards or have multiple branches because the
versioning in monotone increasing and linear. So, the developer has to
anticipate that the version they are releasing is strictly more advanced than
the previous version. Additionally, each new version should have roughly the
same amount of change. Otherwise, it's impossible to say if there was more
change from version 1 to 10 or from version 10 to 100.

### semver

Beyond natver, there are many other kinds of historical semantic relationships
that could be encoded in the version. Semver has been adopted as the standard
way to simply encode what are widely agreed upon as the most important of these
historical semantic relationships:
- a __major__ version corresponds to a behavioral change that is not compatible with
  previous major versions
- a __minor__ version corresponds to an additional behavior (i.e. feature) that is
  compatible with previous minor versions with the same major version
- a __patch__ version corresponds to a change in implementation that does brings
  the actual behavior more in line with the intended/expected/specified
  behavior.

Of course, these intricate ideas multiplies the potential for misuse and burdens
upkeep. For example, the project developer can make a breaking change in a minor
version update, add a new feature in a fix, make a breaking change in a fix,
etc. The developer simply has to be trusted to use semver correctly, although
"misuses" are often just bugs. More sophisticated versioning schemes like semver
have huge advantages when used well and encourage good organization of semantic
relationships between versions, but are also more difficult to use and
practically force users to just trust the project developer. Semvar has been
widely settled upon as the best way to select and encode a minimal set of
semantic relationships that's worth the continuous effort.

### kelver

Historical semantic relationships are, however, only backwards-facing.
Future-facing semantic relationships are also important and are most commonly
captured in the concept of _stability_. It is seen as good practice on GitHub
for a project to include a [stability
badge](https://github.com/badges/stability-badges), so clearly stability is
considered an important metric, but it is also very difficult to measure if not
entirely ephemeral for some projects. This is certainly one reason that semver,
and a very general versioning scheme, doesn't take a stance on encoding
stability. Generally, where stability is relevant enough to measure, it is
either measured at the top level of the project (above any particular version)
or at the major vesion level. For example, a large and widely used project (e.g.
a compiler, protocol, OS) might release a new major version every couples years.
The cycle is generally like this:
- A new major version is releases as an _experimental_ build.
- As the new major version gains adoption, patches are made as bugs are
  inevitably discovered and reported.
- Every so often, new minor features accumulate into new minor versions
- As the major version matures and the rate of bug appearance starts to level
  off, the stability increases from _experimental_ to _unstable_ to _stable_. Once the
  major version is considered _stable_, it takes it's place as the _latest
  version_ of the project. Most users are expected to adopt this version of the
  project, but there will of course persist a diaspora of dependents out there
  that are never updated..
- Eventually, new feature proposals and experimental implementations that have
  major changes accumulate into a new major version proposal, which is released
  as an experimental build.
- As development slows on the _latest version_, it eventually loses its status
  as the _latest_, and the developers more or less agree that the buts worth
  fixing have laready been fixed. Finally, it becomes _frozen_, which indicates
  that regular updates are no longer expected and pretty much only patches of
  serious new bugs are expected.
- As more time passes, some projects that depend on a specific frozen version,
  age, become entrenched, and rely on that major version being availabel and a
  specific one of its minor/patch version to be cononical for its specified set
  of features and compatibilities. So, this specific version becomes _locked_ --
  no more development is allowed (or at least, if there are changes, they will
  pretty mich just be ignored by the relevant community of dependents) on that
  major version.

The details will be different for different kinds of projects --- open source software ([GHC](https://github.com/ghc/ghc)), closed source software ([Adobe Reader](https://www.adobe.com/acrobat/pdf-reader.html)), frequently-updated applications ([Firefox](https://www.mozilla.org/en-US/firefox/new/)), consumer operating systems ([MacOS](https://www.apple.com/macos/monterey/)), widely used protocols ([IPv4, IPv6](https://www.geeksforgeeks.org/differences-between-ipv4-and-ipv6/)) --- but at the macro scale they all follow this general pattern of development.

All of this is to say that stability is an integral part of organizing the
development of software, in a way parallel to versioning. Yet still some sort of
standard "stability versioning" (other than rough labels like "unstable" and
"stable") are very rare. We return finally to kelver.

Kelver is a sort of co-natver; natver counts _up_ from the _start_ while kelver
counts _down_ to the _end_. But in the same way that natver is only the first
step towards semver in terms of encoding the most important compatibility
(historical) relationships, perhaps kelver as simple as it is the first step
towards encoding the most important stability (future-facing) relationships?

I summarize the appeal of kelver, as I see it and as
[urbit](https://urbit.org/blog/toward-a-frozen-operating-system) and [Urbit
developers](https://jtobin.io/kelvin-versioning) have described it, as its focus on the
goal of making an finished, totally-frozen piece of software. Not all software
has this goal in development (though perhaps more should), but for the software
that does, kelver delivers.

As with natver, however, kelver has some rough edges that modern software
engineers expect to be smoothed out by now in their organizational systems, such
as versioning. Kelver does not encode information about compatibility
(historical semantic relationships), but let ignore that for the moment. The
large immediate tension in kelver is that **it's almost always unreasonable to
expect the developer pick a reasonable starting temperature**. Of course,
overshooting the starting temperature is much more convenient than undershooting
(since if you undershoot then you might run out), so the incentive is to have a
way higher temperature than the project should have. And since the temperature
of a project will start of very high, as the final stages of the project become
more clear, huge drops in temperature will occur even if the number and
significance of the changes made in the versions that lie along that curve of
steeply-dropping temperature are not much if at all more than the changes that
happened before that point. So if a user sees that the temperature has dropped
recently from 100K to 10K, they don't know yet whether that's because there's
been a lot of changes, or the developers just decided that the project is almost
done. Given this tension, kelver incentivizes developers to overshoot
temperature given uncertainty, and so the temperature only has much precision
when its close to zero. In other words, until the temperature is very close to
zero, it probably doesn't encode much if any useful information.

<!-- -->

Alternatively, even worse, if the developers undershoot the temperature because
they were confident in some stability that they shouldn't have been, they're
incenticized to pack large changes into just a few versions that are still close
to zero. So in the end, you have to understand the developers very well in order
to interpret how stable exactly version 15K is, and there's pretty much no way
of telling how stable 1000K is.

And these are exactly the sort of problems in natver that semver addresses (see
section [semver](#semver)). Semver introduced the semantic "units" --- major
changes, minor changes, and patch changes --- the quantify how much semantic
change a new version represents, and kelver needs some similar kind of
quantification.

Here I propose an augmented kelver, __staver__, that preserves the spirit of the
original kelver while vastly improving its usefulness, feasibility, and
incentivization of good organization by encoding slightly more information.

- __staver__: the version is a pair of natural numbers, the _stability_ which
  counts down from a developer-chosen number, and the _patch_ which counts up
  from 0, written `stability.patch`. A new _stability_ version indicates a new
  feature or compatibility-breaking change (which should be the same, for the
  kind of projects that want this kind of versioning), and a new _patch_ version
  indicates a bug fix that doesn't change the specified behavior of the current
  _stability_ version.

When the developer chooses a starting stability version, they may want to
overshoot slightly in case they have to make more breaking changes down the road
than they expected, but its much much more feasible to anticipate how many more new
features you'll add and breaking changes you'll have to make than how many bugs
you'll have to fix. And for the projects that desire some sort of
stability-focused versioning like kelver or staver, new features are
essentially synonymous with breaking changes, since a new feature is outside the
specification of the previous stability version. Additionally, all bugs in the
same stability version can be addressed without the worry of stability
limitations, via patch versions. Kelver introduced a hack called "release
candidates" which is similar to patch versions but don't count as real versions
and in that way have none of the structure imposed upon them that software
engineers learned to make great use of. Patch versions maintain that usefulness,
which still enforcing the restrictions of kelver when it comes to breaking
changes.

Since it's so much more feasible for the developer to choose precise stability
versions rather than being strongly incentivized to overshoot, the stability
version can be expected to be much more precise. Of course, sometimes developers
will still want to overshoot due to large uncertainties about the future of the
project, but then as the future becomes more certain and the stability version
falls quickly, it more sensitively captures the solidification of the future
of the project than kelver where you can only really afford to start dropping
the version by much once you are at the very end of a project.

## Definitions of Versioning Schemes

- __randver__: The version is a random version not already used by an existing
  version (this is how many layuser-facing version names are chosen for systems
  like macos and android)
- __hashver__: The version is the hash of the project (this is essentially how
  github versions commits)
- __idver__: The version _is_ the project (in binary)
- __natver__: the version starts at 0 and increments for each new version
  version
- __kelver__: The version is a natural number counts down for each new version,
  and was initialized by the developers. The final version is 0K.
- __semver__: the version is a triple of a _major_, _minor_, and _patch_
  version. A new major version indicates compatibility-breaking changes, a minor
  version indicates compatibility-presenving new features, and a patch version
  indicates a compatibility-preserving bug fix
- __staver__: the version is a pair of a _stability_ version and a _patch_
  version. The stability version counts down on each breaking change or new
  feature and was initialized by the developers, and the patch verson indicates
  a compatible bug fix that doesn't add new features. The final version is 0.N,
  whre N can still increment for bug fixes.
