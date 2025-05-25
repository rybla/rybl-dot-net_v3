---
type: post
tags:
  - computics
  - Haskell
abstract:
  Basic Haskell functions do not support overloading, which is a feature that
  allows for multiple terms to have the same name in the same scope. This post
  demonstrates a comparison between three approaches to implementing overloading
  in Haskell -- typeclasses, templates, and singletons (mesaprogramming).
---

# Overloaded Functions in Haskell

## Introduction

A common metaprogrammatic feature is overloading. A function is _overloaded_ (by
name) if multiple implementations of possibly different types can all be
referred to by the same name (in the same scope). Overloading has many practical
uses (such as optional arguments, default argument values, function classes,
etc.), and is simple to describe, so I though it would be a nice way to
demonstrate a comparison between a few different kinds of approaches to
metaprogramming.

The running example in the next few sections will be the overloading of a
function `negate` to work on both integers and booleans.

I conclude with a overview of the advantages and drawbacks of the different
approaches, and some ideas about the generalization of my favored approach.

## Overloading with Typeclasses

Haskell provides a nice interface (with a complicated backend) for a restricted
form of overloading via typeclasses. A _typeclass_ is a way of classifying types
by _methods_ (to match the object-oriented terminology for (abstract) classes)
which haves types containing the classified type. If a typeclass has a method,
then every type in that typeclass must have a corresponding implementation of
that method for the type.

To implement an overloaded `negate`, we make a class `Nullable a` with a method
`negate :: a -> a`, and then instantiate this class for `Int` and `Bool`.

```haskell
module OverloadTypeclass where

import Prelude hiding (negate)

class Negatable a where
  negate :: a -> a

instance Negatable Int where
  negate x = (- x)

instance Negatable Bool where
  negate b = not b
```

We can use `negate` simply:

```haskell
negate 1 ==> -1
negate True ==> False
```

The implementation and usage of overloading is very concise for this typeclass
approach. Which overload to use is resolved via typeclass constraint solving,
and to the user this looks just like overload resolving in languages that have
built-in overloading (e.g. Java). However, this simple interface hides a lot of
backend complexity in how that constraint-solving works.

Additionally notice that, in order to write `Negateable a`, we had to choose a
form for the type of `negate`, in this case, `a -> a`. This is due to the way
that Haskell's typeclass constraint solving works. If we had tried to be more
general and written

```haskell
class Negatable a where
  negate :: a

instance Negatable (Int -> Int) where
  negate = \x -> (- x)

instance Negatable (Bool -> Bool) where
  negate = \b -> not b
```

then GHC would reject, telling us

> All instance types must be of the form (T a1 ... an) where a1 ... an are
> _distinct type variables_, and each type variable appears at most once in the
> instance head.

(Of course, this can be disabled via the language extensions `FlexibleInstances`
and `FlexibleContexts`, but it turns out this just makes typeclass constraint
resolution fail for our purposes.)

In this way, typeclasses don't provide fully-general overloading capability
where the different overload modes can have arbitrarily different types (e.g.
take different numbers of arguments).

## Overloading with Templates

Templates (via Template Haskell) offer more general megaprogramming capabilities
than typeclasses. Templates are metaprograms that are executed before
typechecking the base program. Templates rely on quoting and unquoting --
_quoting_ is the conversion of a string into syntax (encoded by a datatype), and
_unquoting_ is the conversion of syntax into code which is _spliced_ (i.e.) into
the base program.

To implement an overloaded `negate`, we write it as a template function that
takes an extra argument, the `NegateMode`, which specifies which overload for
`negate` is intended. (This isn't possible via a naive implementation because
the types of each overload would not match each other for the signature of
negate.) Now to use `negate`, it must be spliced as `$(negate mode x)` where
`mode :: NegateMode` and `x` is the argument to be negated. This splicing will
be replaced in-place by the specified overload, before typechecking it. In this
way, the type of the splice will be different depending on which `NegateMode` is
given.

```haskell
{-# LANGUAGE TemplateHaskell, QuasiQuotes #-}

module OverloadTH where

import Prelude hiding (negate)
import Language.Haskell.TH

data NegateMode = NegateInt | NegateBool

negate :: NegateMode -> Q Exp
negate NegateInt = [| \x -> (- x) |]
negate NegateBool = [| \b -> not b |]
```

The usage of `negate` is slightly more complicated now, because we need to
splice and given the `NegateMode`:

```haskell
$(negate NegateInt) 1 ==> -1
$(negate NegateBool) True ==> False
```

Templates have a couple of significant advantages and drawbacks. Templates avoid
the non-extensibility drawback of typeclasses; adding more overloads of
arbitrary types is as simple as adding more constructors to `NegateMode` and
cases for `negate`. Additionally, templates yield a concise implementation
concise, even more concise than typeclasses.

However, templates add a lot of complexity (much of it hidden) -- much worse
than typeclasses do. In order to use an overloaded function, we now need to
splice it, which can perform arbitrary computations and needs a whole
metaprogramming framework (Template Haskell) on top of the base language that
generates untype syntax to be inserted at the splice. To be sure, for this
trivial example, it is very easy to implement the metafunction
`negate :: NegateMode -> Q Exp` correctly, but this simplicity isn't modular. If
the metafunction was more complicated and relied on other metafunctions, then
complexity quickly exponentiates. And since metafunctions don't know about the
types of the syntax they are manipulating, it is very easy to make mistakes and
generate badly-typed or even well-typed but yet incorrect terms. Relying on
arbitrarily-complicated template functions forgoes the entire purpose Haskell's
lauded type system.

Many probably admit these drawbacks but still find the power of templates to be
worth the cost. After all, most languages are much less safe than Haskell, and
they are still used prolifically. So, why not allow a very powerful feature
(which is completely optional) that makes Haskell much more slick? This is a
tempting point of view, and maybe I will adopt it one day. But for now, I am
still naive enough to seek an alternative.s

Additionally, You might think that it is a little annoying and probably
unnecessary to have to provide a the extra `NegateMode` argument. And maybe for
some decent range of applications of overloading that is true. But if you want
fully-general overloading, where different overloads can have the same types,
then the only sure way of specifying overloads is explicitly.

(Sure, maybe you could ask for automatic overload resolution to be done via
types when possible, and then only ask for it when that isn't sufficient. That
is a cool idea, and a way to achieve it would be somehow taking advantage of
type inference to allow an `_` in place of the overload specification argument.
This won't work for this templates approach, but perhaps it could work for the
singletons approach -- see the next section.)

## Overloading with Singletons

Finally, this third approach is to take advantage of a restricted form of
dependent typing that Haskell provides: singletons. In short, a _singleton_
reflects a type at the term level (there are also utility templates for
automatically generating singletons for many datatypes). In the code below,
`SNegateMode` is the singleton for `NegateMode`. So, in `negate`, when the first
argument is pattern-matched on, the case determines the `mode` type variable,
and so `NegateType mode` is expanded to the appropriate overload type.

```haskell
{-# LANGUAGE GADTs, KindSignatures, DataKinds, RankNTypes, TypeFamilies, AllowAmbiguousTypes #-}

module OverloadSingleton where

import Prelude hiding (negate)

data NegateMode = NegateInt | NegateBool

data SNegateMode :: NegateMode -> * where
  SNegateInt :: SNegateMode NegateInt
  SNegateBool :: SNegateMode NegateBool

type family NegateType (mode :: NegateMode) :: * where
  NegateType NegateInt = Int -> Int
  NegateType NegateBool = Bool -> Bool

negate :: SNegateMode mode -> NegateType mode
negate SNegateInt = \x -> (- x)
negate SNegateBool = \b -> not b
```

Using this `negate` looks similar to the version from the templates approach,
but doesn't require splicing:

```haskell
negate SNegateInt 1 ==> -1
negate SNegateBool True ==> False
```

This singletons approach has the extensibility advantage of the templates
approach without the downside of untyped quoting/unquoting. Additionally, this
approach doesn't rely on a complicated and hidden constraint-solving framework
to use the overloads like the typeclass approach did, but we do have to provide
an explicit overload specification argument (which I argued previously is
actually probably correct).

As just an idea, perhaps it could be possible, somehow, to allow type inference
to take care of singleton arguments. For example, the example usages above could
become

```haskell
negate _ 1 ==> -1
negate _ True ==> False
```

where Haskell's type inference would figure out the type of `_`, which uniquely
specifies the singleton constructor. This idea is not directly impossible in
Haskell though.

However, can can do something similar by using typeclasses and injective type
families. In the following module `OverloadSingletonI`, there are three main
changes upon `OverloadSingleton`:

1. The type family `OverloadType` is injective. This is necessary because TODO.
2. The class `SOverloadModeI` can provide `SOverloadMode` as a sort of implicit
   argument via a typeclass constraint. TODO: justify use of typeclasses
3. The function `negate` now uses the `sOverloadMode` method provided by the
   `SOverloadModeI` typeclass constraint in order to call `negate'` which takes
   the argument explicitly. TODO: explain how typeclass constraint is like an
   implicit argument.

```haskell
{-# LANGUAGE GADTs, KindSignatures, DataKinds, RankNTypes, TypeFamilies, TypeFamilyDependencies, AllowAmbiguousTypes, ScopedTypeVariables #-}

module OverloadSingletonI where

import Prelude hiding (negate)

data NegateMode = NegateInt | NegateBool

data SNegateMode :: NegateMode -> * -> * where
  SNegateInt :: SNegateMode NegateInt (Int -> Int)
  SNegateBool :: SNegateMode NegateBool (Bool -> Bool)

type family NegateType (mode :: NegateMode) = r | r -> mode where
  NegateType NegateInt = Int -> Int
  NegateType NegateBool = Bool -> Bool

class SNegateModeI (mode :: NegateMode) where
  sNegateMode :: SNegateMode mode (NegateType mode)

instance SNegateModeI NegateInt where
  sNegateMode = SNegateInt

instance SNegateModeI NegateBool where
  sNegateMode = SNegateBool

negate :: forall (mode :: NegateMode). SNegateModeI mode => NegateType mode
negate = negate' sNegateMode

negate' :: forall (mode :: NegateMode). SNegateMode mode (NegateType mode) -> NegateType mode
negate' SNegateInt = \x -> (- x)
negate' SNegateBool = \b -> not b

negate_1 :: Int
negate_1 = negate (1 :: Int)

negate_True :: Bool
negate_True = negate True
```

Usage now looks like this:

```haskell
negate (1 :: Int) :: Int ==> -1
negate True :: Bool ==> False
```

Note that the type annotations are now necessary in order for type inference to
work. This is because, otherwise, the output type is just a type variable, and
GHC would try to solve `Int -> t ~ NegateType mode` which it cannot.

## Overloading with Π

As described before, singletons are an implementation in Haskell of a restricted
kind of dependent types. That is, they allow the output type of functions to
depend on the values of its arguments. But how would we implement overloading
with fully-fledged dependent types? The feature that we need is Π-types i.e.
dependent functions -- `negate` is a dependent function because its output type
`NegateType mode` depends on its input value `mode`. The following Agda program
implements.

```plaintext
module OverloadPi where

open import Data.Integer
open import Data.Bool

data NegateMode : Set where
  Negateℤ : NegateMode
  NegateBool : NegateMode

NegateType : NegateMode → Set
NegateType Negateℤ = ℤ → ℤ
NegateType NegateBool = Bool → Bool

negate : ∀ (mode : NegateMode) → NegateType mode
negate Negateℤ = λ x → - x
negate NegateBool = λ b → not b
```

Using `negate` looks exaclty like in the singletons approach:

```plaintext
negate Negateℤ 1ℤ ==> -1ℤ
negate NegateBool true ==> false
```

Note that, although Agda offers the option to make arguments implicit, trying to
make the `mode` argument of `negate` implicit will not work due to how type
inference works, sadly.

This implementation makes it clear what features were necessary to make the
singletons approach work: pattern matching on an "overload mode" singleton, and
a type family (i.e. type-level function from a type to a type) for the types of
each overload mode.

## Conclusions

We have overviewed three approaches to implementing overloading in Haskell (or
any other language that offers these features respectively):

- typeclasses
  - advantages: type-safe, very concise usage
  - drawbacks: not extensible
- templates
  - advantages: very extensible, very concise implementation
  - drawbacks: verbose usage (explicit mode argument), type-dangerous,
    anti-modular
- singletons/dependent types
  - advantages: type-safe, extensible
  - drawbacks: verbose usage (explicit mode argument)

So much has been built upon typeclasses in Haskell that it would be rediculous
to suggest for them to be replaced with singleton-powered overloading. However I
think that its advantage over typeclasses in extensibility and advantage over
templates in safety are worth considering for new languages and design patterns.
Typeclases are a huge framework on top of Haskell -- a new language might prefer
to use singletons rather than go through designing typeclasses (or whatever
similar feature in its place, such as traits in Rust and Scala).

A generalization of this singletons approach is useful for much more than just
implementing overloading. The basic idea used here was to encode the desired
metaprogrammatic feature (overloading) as a datatype (`NegateMode`) in the base
language (Haskell). Then the metaprogramming itself was simply to take the
specified metaprogrammatic behavior as an extra argument to handle just like a
normal function would (and, sometimes, such as in overloading, the function's
type may need to depend on this argument's value).

This style of metaprogramming can be called **mesaprogramming** because, rather
than how normal metaprogramming relies on features _on top of_ the base language
to handle metaprogrammatic behaviors (as is most explicit in the templates
approach, but also present in the typeclass approach if you think of typeclasses
as a metaprogrammatic feature on top of the Haskell base language),
mesaprogramming defines data _embedded in_ the base language to specify
metaprogrammatic behavior and then performs the metaprogrammatic behavior by
pattern-matching on this data as an extra argument.

I will write more about mesaprogramming more generally in later posts.
