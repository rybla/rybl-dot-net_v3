---
type: post
tags:
  - computics
abstract:
  Some terms are uniquely (up to normalization and α-renaming) determined by
  their types.
---

# Unique Terms

## In the polymorphic λ-calculus (System F)

The polymorphic λ-calculus has the following grammar

```
<judgment> ::= <term> :: <type>

<type> ::= * | <var> | <type> -> <type>

<term> ::= unit
         | <var>
         | λ <var>* . <term> | <term> <term*>
```

with the usual typing rules.

The following judgements are uniquely determined by the type (up to
normalization and α-renaming):

```
id = λ x . x :: a -> a

apply = λ f x . f x :: (a -> b) -> a -> b

const = λ x y . x :: a -> b -> a

inj1 = ...
inj2 = ...
case • of { inj1 • -> • | inj • -> • } = ...
proj1 = ...
proj2 = ...
( • , • ) = ...
( • , • , ... ) = ...

proj<i> = proj2 o ... o proj2 o proj1 :: (... * a * ...) -> a
```

## In the dependently-typed λ-calculus

```
<judgment> ::= <term> :: <term>

<term> ::= U
         | Π (<var> : <term>)* . <term>
         | λ <var>* : <term>
         | <term> <term>
         | <var>
```

The following judgments are uniquely determined (up to normalization and
α-renaming).

```
id = λ A x . x :: Π (A : U) (x : A) . A

apply = λ A B f x . f x :: Π (A : U) (B : U) (f : A -> B) (x : A) -> B

const = λ A B x y . x :: Π (A : U) (B : U) (x : A) (y : B) -> A
```
