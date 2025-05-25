---
type: post
tags:
  - computics
abstract:
  In mathematics and theoretical computer science, theoreticians seem to always
  be grasping for synonyms of the word "type." This post serves as a convenient
  resource for these words.
---

## Types of "Type"s

In mathematics and theoretical computer science, theoreticians seem to always be
grasping for synonyms of the word "type." This post serves as a convenient
resource for these words.

| analogy            | types of types                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| abstract           | type (type theory), kind (type theory), set (set theory), collection, variety, category (category theory), group (abstract algebra), lot, genre, division, class (OOP), circle, assortment, aggregation, batch, bundle, bunch, conglomerate, cluster (statistics), sample (statistics), gathering, level (type theory), share (economics), chunk (software), fragment (software), partition (software, set theory), grouping, configuration, conformation, design, framework, methodology, derivation, selection, classification, frame, pattern (type theory), theory (category theory), topic, span, sphere, affinity, stretch, case (type theory) , homology (category theory), sort (type theory) |
| social/political   | cast, gang, band, club, faction, party, assembly, cartel, clique, covery, covey, league, suite, rank, tier, sector, department, standard, echelon, school, arragenement, organization, system, constitution, alignment, formation, cult, structure, religion, history, field, domain, estate, house, dynasty, empire, rule, reign, government, administration, jurisdiction, management, legion, dominion, regimen, tenure, order, kingdom, varna, association, alliance                                                                                                                                                                                                                              |
| artistic           | style, orchestration/orchestra, ensemble, band, sinfonietta, choir, chorus, chorale, verse, hymn, paean, song, production, composition, tune, theme, motif, subject                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| biological/genetic | strain, ilk, species, breed, family, ancestry, generation, kin, progeny, legacy, lineage, brood, kindred, folk, genealogy, pedigree, stock, tribe, descent, scions, issue, organism, parentage, stemma, genus, phylum, kith, cognate                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| natural/temporal   | bag, flock, herd, pack, pool, branch, world, tree, realm, dimension, place, age, epoch, era, period, sheave (category theory), fiber (abstract algebra), glob (category theory), space, site (category theory)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| technical          | grade, caliber, gradation                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |

<!--
abstract
- type
- kind
- set
- collection
- variety
- category
- group
- lot
- genre
- division
- class
- circle
- assortment
- aggregation
- batch
- bundle
- fiber
- bunch
- conglomerate
- cluster
- sample
- gathering
- level
- share
- chunk
- fragment
- partition
- grouping
- configuration
- conformation
- design
- framework
- methodology
- derivation
- selection
- classification
- frame
- pattern
- theory
- topic
- span
- sphere
- affinity
- stretch
- case

social/political
- cast
- gang
- band
- club
- faction
- party
- assembly
- cartel
- clique
- covery
- covey
- league
- suite
- rank
- tier
- sector
- department
- standard
- echelon
- school
- arragenement
- organization
- system
- constitution
- alignment
- formation
- cult
- structure
- religion
- history
- field
- domain
- estate
- house
- dynasty
- empire
- rule
- reign
- government
- administration
- jurisdiction
- management
- legion
- dominion
- regimen
- tenure
- order
- kingdom
- varna
- association
- alliance

artistic
- style
- orchestration/orchestra
- ensemble
- band
- sinfonietta
- choir
- chorus
- chorale
- verse
- hymn
- paean
- song
- production
- composition
- tune
- theme
- motif
- subject


biological/genetic
- strain
- ilk
- species
- breed
- family
- ancestry
- generation
- kin
- progeny
- legacy
- lineage
- brood
- kindred
- folk
- genealogy
- pedigree
- stock
- tribe
- descent
- scions
- issue
- organism
- parentage
- stemma
- genus
- phylum
- kith
- cognate


natural/physical/temporal
- bag
- flock
- herd
- pack
- pool
- branch
- world
- tree
- realm
- dimension
- place
- age
- epoch
- era
- period


jargon
- grade
- caliber
- gradation

-->

## Criteria

In choosing these words, I mostly looked to mathematical convention for what
works as new terms. Though my goal is that these words should be able to be used
as names for new mathematical/computical structures, I do not suggest that each
word is the most proper fit for any new structure. The same is true in
convention, even with the most general terms. For example, "group" could
probably not have been suggested in place of "type," because "group" insinuates
a sort of relatability between the elements of the group, where terms of types
are not necessarily related in any way. The term "group" fits mathematical
groups because the elements of a mathematical group do indeed relate in that
they can be composed to get other elements of the group and so on. In the same
way, the word "system" could be used well for some mathematica/computical
structures and not others.

Of course, on the other hand, there are interchangable terms. For example,
"type" and "kind" could probably have been interchanged without much trouble,
renaming "type theory" to "kind theory," which is perhaps a more friendly and
less divisive name even.

So, the criteria below are meant to be very broad in order to capture any words
that have any non-negligible likelihood (in my opinion) of dubbing a
mathematical/computical structure.

- the word refers to several things
- the word need not be very specific about the absolute qualities of the
  referred things
- the word dilineates the things from other things in a simple, context-free way
- there is potential for peculiar connotations of the word to translate into
  some metaphorical metaphor describing the strucutre

The last point is important for a large class of my suggestions, because plenty
of the words I admit have connotations that might seem to contradict the second
point about not being specific about absolute qualities. For example, how is
"genealogy" not specific about genetic qualities? The words I suggest are chosen
such that even if they do have more specific connotations, they are easily
generalizable. With "genealogy," it is intuitive to generalize the idea of the
original genetic "genealogy" to the genealogy of inheritance in OOP or the
genealogy of increasingly-axiomatized structures in set theory, etc. To take
this example one step further, here's a suggestion for what a mathematical
genealogy could be defined as:

> A **genealogy** is a directed graph of theories, where there is an edge from
> theory \\(A\\) to theory \\(B\\) if the axioms of theory \\(A\\) are a subset
> of the axioms of theory \\(B\\).

I haven't noticed a very common definition of "theory" in mathematical texts,
though I'm sure its out there somewhere. This is how I define it:

> A **theory** is a set of propositions. A set of propositions are considered
> **axioms** of a theory if all the propositions in the theory can be reached by
> a finite number of applications of the axioms, via the rules of logical
> inference.

## Case Studies

### Type Theory

As a particular example close to my interests, the field of theoretical computer
science _type theory_ revolves around a concept called "type," where data
manipulated by a computer can be annotated with _data types_ such as "integer,"
"boolean," "string," etc. In this sense, a datum's type corresponds to a way of
reading the raw data; the raw data can all be considered to be of a single
trivial type (e.g. "bitstring" or even just "computer memory").

Of couse, these are particularly basic examples of data types. Type theory is
mainly interested in formalizing systems of interesting types, such as
[polymorphic types](<https://en.wikipedia.org/wiki/Polymorphism_(computer_science)>),
[inductive data types](https://link.springer.com/chapter/10.1007%2F978-3-662-07964-5_6),
[dependent types](https://wiki.haskell.org/Dependent_type), or even
[self types](https://link.springer.com/chapter/10.1007%2F978-3-319-08918-8_16).
However, to investigate such interesting type systems, a higher-order concept of
_type_ is needed. For example, what is the type of a type, if the type is
considered as a type of data type itself? A common name for the type of a type
is "kind" i.e. types are to data (or, _terms_) as kinds are to types. Then we
may go further -- what is the type of a kind? There is a common name here too:
"sort". Altogether:

- type is to term as kind is to type i.e. the type of a type is a kind
- sort is to kind as kind is to type i.e. the type of a kind is a sort

What lies beyond? Typically, as far as I can tell, "sort" applies well to the
infinite heirarchy of types of types of ... of sorts. A little underwhelming. At
this point many systems (such as Coq and Agda) use a numbering scheme to
distinguish levels of the heirarchy. With these retroactive renamings:

- _type_ := _type0_
- _kind_ := _type1_
- _sort_ := _type2_
- type of type of ... := _typeN_

### Abstract Algebra

Abstract algebra upon set theory with a (non-technical) variety of structures,
the most commonly-recognized name among them being "group." The name is fitting
because it is so generic a name to give to such a specific mathematical
structure, yet one that is a very generalizable itself. Notably, "an
introduction to abstract algebra" is often shortened to just "group theory."
There are other structures beyond groups, of course. And though their names seem
just an unspecific, it is fatal to mix them up. A summary of abstract algebra
is: the domain of interesting structures generated within the axioms of set
theory. See [algebraic structures] for an extensive list. Here is an interesting
selection:

- [pointed set](https://en.wikipedia.org/wiki/Pointed_set)
- [magma](<https://en.wikipedia.org/wiki/Magma_(algebra)>)
- [semigroup](https://en.wikipedia.org/wiki/Semigroup)
- [monoid](https://en.wikipedia.org/wiki/Monoid)
- [group](<https://en.wikipedia.org/wiki/Group_(mathematics)>)
- [ring](<https://en.wikipedia.org/wiki/Ring_(mathematics)>)
- [lattice](<https://en.wikipedia.org/wiki/Lattice_(order)>)
- [field](<https://en.wikipedia.org/wiki/Field_(mathematics)>)
- [algebra](https://en.wikipedia.org/wiki/Algebra_over_a_field)
- [arithmetic](https://en.wikipedia.org/wiki/Peano_axioms)
- [module](<https://en.wikipedia.org/wiki/Module_(mathematics)>)
- [vector space](https://en.wikipedia.org/wiki/Vector_space)
- [topology](https://en.wikipedia.org/wiki/Topology)
- [space](https://en.wikipedia.org/wiki/Hilbert_space)

### Category Theory

When modern mathematics was first formalized in the 19th and 20th centuries, a
new standard basis for all of mathematics was formalized: _set theory_. The
basis of set theory, of course, was the _set_. While in layman's terms a _set_
of things might be just another way to say a _collection_ of things or a _group_
of things, set theory gave a technical definition to "set" to be used in this
formal context. Given as a basis for all of mathematics, it was plausible at the
time that any mathematical theory could be expressed (and many believed that,
beyond just expressing any theory, any theory could also be proven or disproven)
in the language of sets. Famously, Alfred Whitehead and Bertrand Russel
attempted to prove this plausibility in the
[Principia Mathematica](https://en.wikipedia.org/wiki/Principia_Mathematica).

Since those developments however, mathematicians learned that there are some
mathematical theories that are "beyond set theory" i.e. mathematical theories
which represent structures that cannot be formalized in set theory. The prime
example is _category theory_ -- the study of _categories_ which turn out to be
strictly more general than mere sets. Why the name "category"?; is it not just
another term for "set"? Yes, it does seem to be. Additionally, it turns out that
there is a
[correspondence](https://ncatlab.org/nlab/show/computational+trinitarianism)
between categories (from category theory) and types (from type theory), which is
very convenient since "category" and "type" are roughly synonyms in the first
place!

And once you you have new structure names like "category" floating around, of
course many others come:

- [sheave](https://ncatlab.org/nlab/show/Categories+and+Sheaves)
- [homology](<https://en.wikipedia.org/wiki/Homology_(mathematics)>)
- [theory](https://ncatlab.org/nlab/show/Lawvere+theory)
- [fiber](https://ncatlab.org/nlab/show/fiber+bundle)
- [bundle](https://ncatlab.org/nlab/show/fiber+bundle)
- [topos](https://ncatlab.org/nlab/show/topos)
- [glob](https://ncatlab.org/nlab/show/globular+theory)
- [monad](https://ncatlab.org/nlab/show/algebra+over+a+monad)
- [shelf](https://ncatlab.org/nlab/show/shelf)
- [braid](https://ncatlab.org/nlab/show/braid+group)
- [diagram](https://ncatlab.org/nlab/show/commutative+diagram)
- [link](https://ncatlab.org/nlab/show/link)
- [model](https://ncatlab.org/nlab/show/model)
- [site](https://ncatlab.org/nlab/show/site)
- [allegory](https://ncatlab.org/nlab/show/allegory)

Of course, coming up with many different names that often are different words
for "type" is not unique to category theory. But given that category theory
usually is the most abstracty of the nonsense, it really has to start reaching
for new words to name structures that are so general their intuitive structure
is hard to grasp in a term other than "type" in a slightly specific context.
