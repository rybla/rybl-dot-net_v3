---
type: post
pubDate: 2025-05-13
tags:
  - Agda
  - type_theory
  - interactive_theorem_proving
abstract: |
  Interactive tactics, such as [LTac](https://rocq-prover.org/doc/v8.19/refman/proof-engine/ltac.html) in [Coq/Rocq](https://rocq-prover.org/), support an interesting and often useful workflow: to interactively run a tactic script (which can leverage metaprogramming), viewing the context and expected type of the rest of the tactic script (in a nested fashion) at each step. In this way, you as a programmer can view the intermediate states that are yielded by metaprogrammatic computations which would otherwise be inaccessible if you were only able to view the final output of the tactic script.
---

# Using Agda Macros as Interactive Tactics

## Interactive Tactics (not in Agda)

Interactive tactics, such as [LTac](https://rocq-prover.org/doc/v8.19/refman/proof-engine/ltac.html) in [Coq/Rocq](https://rocq-prover.org/), support an interesting and often useful workflow: to interactively run a tactic script (which can leverage metaprogramming), viewing the context and expected type of the rest of the tactic script (in a nested fashion) at each step. In this way, you as a programmer can view the intermediate states that are yielded by metaprogrammatic computations which would otherwise be inaccessible if you were only able to view the final output of the tactic script.

## Agda's Typed Holes and Macros

[Agda](https://agda.readthedocs.io/en/latest/index.html) has an interactive editing mode that provides some similar features to this workflow. In particular, [typed holes](https://agda.readthedocs.io/en/latest/language/lexical-structure.html#holes) let you as a programmer view the intermediate state (context and expected type) of the typechecker at any point in your program. This is a very interesting and useful feature for many of the same reasons as is interactively running a tactic script.

Agda _also_ has a [macro system](https://agda.readthedocs.io/en/stable/language/reflection.html). These macros allow for all the same computations that can be performed in tactic languages such as LTac, in particular because it allows the macro programmer to inspect that current context and expected type of the macro expansion's result. However, the macro system _does not_ provide the same interactive experience as interactive tactic scripts because of the way that holes and macros interact: when a hole is given as an argument to a macro, that hole is evaluated (where the evaluation immediately gets stuck, since its a hole after all) _before_ the macro starts expanding (just like any other argument to the macro), and so that hole's expected type and context can only be considered in the context and expected type _at the macro's invocation_. Interactivity would require the hole's evaluation to be delayed until _after_ the macro is expanded, since this would allow the macro to splice the hole into a different context and expected type.

### Example of Macro-Hole Interaction

Imports:

```agda
open import Reflection using (_>>=_)
open import Agda.Builtin.Reflection
open import Data.Unit using (⊤)
open import Data.Nat using (ℕ; zero; suc)
open import Agda.Builtin.String using (primShowNat)
open import Data.String using (String; _++_)
```

Consider the following simple Agda macro:

```agda
intro-helper : ℕ → Type → Term → TC Term
intro-helper i (pi _ (abs _ b)) rest = do
  body ← intro-helper (suc i) b rest
  returnTC (lam visible (abs ("x" ++ primShowNat i) body))
intro-helper _ _ rest = returnTC rest

-- introduces as many arguments as the goal type allows
macro
  intros : Term → Term → TC ⊤
  intros rest hole = do
    α ← inferType hole
    hole′ ← intro-helper zero α rest
    unify hole hole′
```

In the macro `intros`, the `rest` argument corresponds to the "rest" of what should happen after the arguments have been introduced. For example,

```agda
_ : ℕ → ℕ → ℕ
_ = intros zero
```

demonstrates how `intros` is used to introduce the two arguments (via `λ x0 x1 → ...`) and then `zero` is spliced in as the innermost body to yield `λ x0 x1 → zero`. This works.

However, suppose we wanted to see the intermediate state of the context and expected type at where `zero` is provided, but before actually providing `zero`? We could put a hole there, like so:

```agda
_ : ℕ → ℕ → ℕ
_ = intros ?
```

But this is interpreted differently than it might first appear. Agda is going to complain that it gets blocked at the hole (where `_64` is the value of the hole):

```agda
———— Error ———————————
Failed to solve the following constraints:
  unquote
  (λ hole →
     bindTC (inferType hole)
     (λ α → bindTC (intro-helper zero α _64) (unify hole)))
    (blocked on _64)
```

This is because `unquote` is blocked when trying to evaluate the hole, and so macro expansion doesn't even get started. Because of this, we _can't_ inspect that intermediate state in the same way we could if this was a function application rather than a macro invocation.

## Proposal: Quoted Holes

What would be desirable in this instance,

```agda
_ : ℕ → ℕ → ℕ
_ = intros ?
```

is that we actually get a typed hole there that is _spliced_ into the result of the macro invocation. In this case, the hole would actually be in a context with two new entries that are not present where the macro is invoked.

We can do this with non-hole terms via quotation e.g. something like

```agda
intros (x + y)
```

would literally splice the `x + y` into the result of the macro expansion without first evaluating the expression. But this doesn't work with holes since holes can't be quoted.

And that's exactly what we need: _quoted holes_.

A quoted hole behaves like so:

- When quoted, is assigned an id that corresponds to its source position and to-be-generated metavariable type.
- The first time the quoted hole is spliced, a metavariable is freshly generated in the context of that splice, and the quoted hole's id is associated with that metavariable.
- The subsequent times the quoted hole is spliced (identified by the quoted hole's id), the metavariable associated with that quoted hole's type is used as the type of the new splice as well.

Note that quoted holes do not require any new features of Agda's type theory -- they are purely a UI phenomenon.

### Example Usage

This feature will allow you to write something like

```agda
_ : ℕ → ℕ → ℕ
_ = intros ?
```

and then inspect the hole to see the context and expected type:

```agda
Goal: ℕ
————————————————————
x1 : ℕ
x0 : ℕ
```

Ultimately, this gives you exactly the kind of interactivity as interactively running tactic scripts in Coq. Most of the feature is already implemented in how Agda's typed holes work -- it just needs this one extra feature to to be able to quote and splice holes!

### More about Quoted Holes

#### Desugaring

In the example, the idea is that the macro invocation `intros ?` to [desugars](https://agda.readthedocs.io/en/v2.8.0-rc1/language/reflection.html#macros) to

```agda
unquote (intros (quoteTerm ?))
```

So, `quoteTerm` needs to handle quoting holes properly.

#### Multiply-spliced Quoted Holes??

A quoted hole is more special than other quoted terms, since it must remember its original source. A quoted term is spliced as a completely new copy of the term that was quoted. In contrast, all splices of the same quoted hole (identified by their shared id) share a metavariable as their types. This is critical because the user will only interact with one instance of the quoted hole, so all ways that it can be spliced must be satisfied by the same context and type, which the user will see when they inspect that information at the quoted hole.

However, note that this requirement _only_ holds for quote holes, not other quoted terms which are copied when they are spliced. So, this proposal for quoted holes doesn't allow you to put a quoted hole _anywhere_ when using a macro. Since sometimes, a quoted term will be able to be spliced into different contexts with different expected types, which is not allowed for a spliced quoted hole (in particular, think of splicing a macro that will expand). But I think that's mostly ok. An alternative would be to make a special kind of metavariable for quoted holes that can accumulate multiple contexts and expected types and not try to unify.
