---
type: post
tags:
  - computics
  - Haskell
abstract: An overview of different capabilities and styles of metaprogramming.
---

# Metaprogramming Capabilities

## Overview

A *metaprogram* is a program that operates on the syntax of a programming
language as data. Many advanced programming languages provide some sort of
metaprogramming capabilities, for example:
- Haskell
  - _templates_ (_TemplateHaskell_): splice syntax
  - _type classes_: splice function definitions
- Agda
  - _reflection_: inspect syntax
  - _macros_:  splice syntax - _syntax notations_: splice syntax
- Coq
  - _reflection_ and  _templates_ (_Template-Coq_ via _MetaCoq_): inspect
    syntax, splice syntax
  - _notations_: splice syntax
  - _tactics_: splice terms, match on context
- Lean
  - _macros_: splice syntax
  - _notations_: splice syntax
  - _tactics_: splice terms, match on context
- Rust
  - _macros_: splice syntax
- C++
  - _templates_: splice function and class definitions (used for polymorphism)
  - _macros_: splice text
- Python
  - _meta classes_: splice classes
  - _eval_: interpret syntax
- JavaScript
  - _proxies_: intercept semantics
  - _reflection_: inspect syntax
  - _eval_: interpret syntax

Overall, I group these capabilities into the following categories:
- *Reflection* — inspect syntax. Examples: reflection, eval.
- *Reification* — splice syntax. Examples: macros, templates, Haskell type
  classes, Python meta classes.
- *Dynamic semantics* — modify semantics. Examples: JavaScript proxies.

## Macros

Macros are common style of reification — splicing syntax. Generally, a language
with macros provides a special syntax for defining macro functions, which are
functions that are run at compile time and output syntax that is spliced as the
call cite before the rest of compilation. These functions are written using the
same language that the macros expand to, with a few extra operations relevant to
reification.

So far, macros sound just like general reification. But, general reification is
very difficult. With the freedom to work over your program as generally as just
a string, you lose of lot of the safety features that many languages try to
provide, such as well-typeness, well-scoped news, well-formedness, etc. If you
wrote the program you intend to splice directly, the compiler/interpreter can
immediately tell you where things went wrong: type errors, scoping errors,
syntax errors, etc. But if you compiler your metaprogram, the system cannot
statically predict if the metaprogram will certainly produce well-typed,
well-scoped, well-formed text where it is spliced. Each use of the metaprogram
has to be checked itself, and so in essence the user only has dynamic guarantees
about the behavior of the metaprogram (since run-time for the metaprogram is
compile-time for the base program).

Macros and templates are different approaches to solving this problem — that is,
the problem of checking static guarantees of reification metaprograms.

*Templates* use a deep embedding of the language (encoding the entire
syntactical structure of the base language as data in the base language
available to work over by the macro) to ensure that the generated text
necessarily reifies as well-formed, well-scoped, or perhaps even well-typed
syntax. This is a very restrictive form of metaprogramming, because it doesn’t
allow for the generation of several textual components that can be combined in
some way to refit as good syntax. For example:
- Template Haskell has typed template metaprogramming, where an expression of
  type `Q a` is able to be reified into a term of type `a`.
- C++ class/function templates require a specific form which ensures that the
  generated classes/functions are well-formed.

*Macros* use a partially-parsed version of the language’s syntax as an
intermediate representation to work over. So, the macro is required to work over
expressions in this partial-parsed syntax (as opposed to unstructured text or
fully well-formed syntax) that doesn’t necessarily require all of the same
checks as for the base language (such as well-typedness or well-scopedness). In
this way, the macro can still have some basic statically-checked properties,
such as producing matching delimiters, well-scoped names, etc.
