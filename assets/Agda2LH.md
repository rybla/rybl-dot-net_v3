---
type: post
tags:
  - computics
  - Agda
  - Haskell
  - LiquidHaskell
abstract:
  The project `agda2hs` claims that a reasonable subset of Agda programs can be
  directly compiled to Haskell programs which can be considered verified up to
  the Agda programs' specifications. However, `agda2hs`'s extraction leaves the
  resulting Haskell program bare of all statically-checkable guarantees from the
  perspective of client Haskell programs that would like to use it. This article
  proposes a modified extraction `agda2lh` which compiles a reasonable Agda
  program, which has specifications in terms of decidable relations, to a Liquid
  Haskell program that includes those specifications as Liquid Haskell
  refinements. Such a Liquid Haskell program exposes the Agda-originating
  specifications to client Haskell code that also uses Liquid Haskell to
  variable degree.
---

# agda2lh

## Introduction to agda2hs

In the paper _[Reasonable Agda Is Correct Haskell: Writing Verified Haskell
using agda2hs](https://jesper.sikanda.be/files/reasonable-agda-is-correct-haskell.pdf)_, the authors identify a reasonable correspondence
between a subset of Agda and Haskell within which they can perform a reasonable
translation from Agda to Haskell.

For example, consider the following Agda program:

```agda
-- utilities

⊔ : ℕ → ℕ → ℕ
⊔-comm : ∀ m n → m ⊔ n ≡ n ⊔ m
{-# COMPILE AGDA2HS ⊔-comm irrelevant #-}

-- Tree

data Tree (A : Set) : (@0 _ : ℕ) -> Set where
  Leaf : Tree A 0
  Branch : A → ∀ nₗ nᵣ → Tree A nₗ → Tree A nᵣ → Tree A (nₗ ⊔ nᵣ)
{-# COMPILE AGDA2HS Tree #-}

-- mirror

mirror : ∀ {A} {n} → Tree A n → Tree A n
mirror Leaf = Leaf
mirror (Branch a nₗ nᵣ tₗ tᵣ) rewrite ⊔-comm nₗ nᵣ =
  Branch a nᵣ nₗ (mirror tᵣ) (mirror tₗ)
{-# COMPILE AGDA2HS mirror #-}
```

`Tree` is indexed by its height, which is annotated by `@0` as
runtime-irrelevant. Without the height indexing, this Agda program could be
written in Haskell as the following, which is in fact what the `AGDA2HS`
annotations specify `agda2hs` to extract.

```haskell
-- Tree

data Tree a where
  Leaf :: Tree
  Branch :: a -> Tree -> Tree -> Tree

-- mirror

mirror :: Tree a -> Tree a
mirror Leaf = Leaf
mirror (Branch a tl tr) = Branch a (mirror tr) (mirror tl)
```

Behaviorally, these programs are the same. But still something has been lost in
translation.

## Problem: Agda is more expressive than Haskell

Since Haskell does not support full dependent typing, the Haskell program above
does not have the same statically-checked properties as the Agda program. In
particular, the Agda `mirror` preserves the height of the `Tree` it operates on,
since both the input and the output type are `Tree`s with height index `n`. The
Haskell `mirror` has no such statically-ensured property -- the Haskell `Tree`
is not height-indexed.

Of course, one could use some advanced Haskell type features to include a sort
of height-indexing into the Haskell `Tree` (perhaps something like `-XGADTs`,
`-XDataKinds`, `-XTypeFamilies`). But, these sorts of techniques are clunky,
hard to generalize, probably require some explicit witnesses, and, very
importantly, don't interoperate well with other Haskell code that are not also
using fancy GADTs with indexing.

In summary, what we are lacking is a Haskell target that maintains the static
checks of the original Agda code and is still easily interoperable with normal
Haskell code when desired.

## Solution: target LiquidHaskell with agda2lh

_[Liquid Haskell](https://github.com/ucsd-progsys/liquidhaskell)_ is a plugin to Haskell that adds automatically-checked
refinement types to Haskell's type system. A _refinement type_ is a basic
Haskell type that is _refined_ by a boolean predicate over values of the type.
For example, the following function has a refined input type and a refined
output type.

```haskell
{-@ mulOdds :: {x:Int | (x % 2) == 1} -> {y:Int | (x % 2) == 1}
            -> {z:Int | (z % 2) == 0} @-}
mulOdds :: Int -> Int -> Int
mulOdds x y = x * y
```

In this way, Liquid Haskell adds lightweight dependent types to Haskell, with
heavy (SMT-powered) automation for checking refinements (The proof that the
product of two odds is even is not totally trivial, and the SMT solver figured
it out!). Since Liquid Haskell can ensure dependent-types related properties
(such as indexing of datatypes) via typechecking then perhaps we can attempt to
encode the information discarded by `agda2hs` as Liquid Haskell refinements.

```haskell
{-@ LIQUID "--reflection" @-}
{-@ LIQUID "--ple" @-}

-- utilities

{-@ by :: {x:a1 | b1} -> {y:a2 | b2} -> {x':a1 | (x == x') && b1 && b2} @-}

-- Nat

data Nat = Zero | Suc Nat deriving (Eq)

{-@ reflect max @-}
max :: Nat -> Nat -> N
max Zero n = n
max m Zero = m
max (Suc m) (Suc n) = Suc (max m n)

{-@ max_comm :: m:Nat -> n:Nat -> {max m n == max n m} @-}
max_comm :: Nat -> Nat -> ()
max_comm (Suc m) (Suc n) = max_comm m n
max_comm _ _ = ()

-- Tree

data Tree a = Leaf | Branch a (Tree a) (Tree a)

-- derived from indexing in definition of Agda `Tree`
{-@ reflect height @-}
height :: Tree a -> Nat
height Leaf = Zero
height (Branch _ tl tr) = max (height tl) (height tr)

-- mirror

-- preserves height of `Tree`
{-@ mirror :: t:Tree a -> {t':Tree a | height t == height t'} @-}
mirror :: Tree a -> Tree a
mirror Leaf = Leaf
mirror (Branch a tl tr) =
    Branch a (mirror tr) (mirror tl)
      `by` max_comm (height tl) (height tr)
```

This kind of translation required a few derivations:

- The Agda lemma `⊔-comm` was translated to the Liquid Haskell lemma `max_comm`,
  which implicitly converted Agda's propositional equality `_≡_` into Liquid
  Haskell's refinement-level decidable equality `(==)`. This translation
  requires that Agda's `_≡_ {ℕ}` is decidable, and also the the user must
  specify that `_≡_` is meant to be proof-irrelevant
- The Agda datatype `Tree`'s height index is extracted to a reflected Liquid
  Haskell function `height`. This derivation is performed by inspecting the
  output index for each constructor of Agda's `Tree`.

In the same style of `agda2hs`, an `agda2lh` could be annotated like so to
specify these derivations.

```agda
-- utilities

-- decidable equality over ℕ
_==_ : ∀ (m n : ℕ) → Dec (m ≡ n)
zero == zero = yes refl
zero == suc n = no λ ()
suc m == zero = no λ ()
suc m == suc n with m == n
suc m == suc n    | yes m≡n = yes (cong suc m≡n)
suc m == suc n    | no ¬m≡n = no (λ { refl → ¬m≡n refl })
-- specify that `_==_` should be used as the instance of decidable equality
-- over `ℕ` for refinement-relevant extractions
{-# COMPILE AGDA2LH _==_ REFINEMENT-EQUALITY(ℕ) #-}

⊔ : ℕ → ℕ → ℕ
⊔-comm : ∀ m n → m ⊔ n ≡ n ⊔ m
-- specify that `⊔-comm` is proof-irrelevant but refinement-relevant; uses
-- `_==_` as the instance of decidable equality in the extracted refinement, as
-- per the previous annotation
{-# COMPILE AGDA2LH ⊔-comm REFINEMENT #-}

-- Tree

data Tree (A : Set) : (@0 height : ℕ) -> Set where
  Leaf : Tree A 0
  Branch : A → ∀ nₗ nᵣ → Tree A nₗ → Tree A nᵣ → Tree A (nₗ ⊔ nᵣ)
-- specify that `Tree`'s term-irrelevant parameter `height` should be extracted
-- as an index which is kept track of by extracted refinements.
{-# COMPILE AGDA2LH Tree REFINEMENT-INDEX(height) #-}

-- mirror

mirror : ∀ {A} {n} → Tree A n → Tree A n
mirror Leaf = Leaf
mirror (Branch a nₗ nᵣ tₗ tᵣ) rewrite ⊔-comm nₗ nᵣ =
  Branch a nᵣ nₗ (mirror tᵣ) (mirror tₗ)
-- no special annotations needed here; the enforcement of `mirror` preserving
-- height is derived from the previous annotation that specifies the `height`
-- of a tree to be refinement-relevant index
{-# COMPILE AGDA2LH mirror #-}
```
