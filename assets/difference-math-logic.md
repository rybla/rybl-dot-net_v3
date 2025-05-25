---
type: post
tags:
  - computics
  - philosophy
  - mathematics
abstract: What is the difference between mathematics and logic?
---

# The Difference Between Mathematics and Logic

The difference between mathematics and logic is that logical truths are true
model-independently, while mathematical truths are merely true
model-dependently.

Of course, logic is used in mathematics, but the domains are distinguished. The
core of logic is
**[classical first-order logic (FOL)](https://plato.stanford.edu/entries/modeltheory-fo/)**,
which is the logic of _well-formed_, _classical_, _first-order_ sentences.

- _well-formed_: are valid according to the language definition
- _first-order_: include quantifiers over a fixed and not self-referential
  domain
- _classical_: are either true or false

The formalization of logics such as classical FOL is the study of
**[model theory](https://plato.stanford.edu/entries/model-theory/)**, which is a
branch of mathematics. However, can only ever study the truth of sentences
(which are used to indicate propositions) within the context of a model. The
study of logic itself is concerned only with model-independent truths. In this
way, model theory is like a strictly cross-sectional study of logical truth.

In mathematics more broadly, model-dependency is the norm. Every branch of
mathematics has a model that includes an enumeration of axioms and, usually,
inherits from a model of classical FOL or some similar logic. For example, field
theory is the study of [fields](https://ncatlab.org/nlab/show/field) which is a
mathematics object that obeys a selection of axioms called the field axioms. The
existence of these mathematical objects is posited. Only under all of these
conditions, and within a chosen model (that is typically beyond first-order),
does field theory contain truths. Nearly all mathematical theories have this
form:

- posit a new mathematical object
- specify axioms about the new object
- choose a model within which to reason about the object with the axioms

In pure logic, there is no underlying structure of the truths. The rule often
called "modus ponens" which states "if A and A implies B, then B" is not an
axiom given for reasoning about sentences that correspond to propositions. Modus
ponens is just a description of what it means for A to imply B. The phrase "A
implies B" indicates a proposition that we understand to have that meaning. And
when one writes "A implies B" they are indending to indicate the proposition,
without necessarily specifying a framework for interpreting it. Implicly, the
intepretation framework is the "common interpretation framework" which is the
way in which people normally understand each other. It is impossible to
completely formalize this framework because, in doing so, it must be
communicated by appealing to the framework itself.
