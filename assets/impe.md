---
type: post
tags:
  - computics
  - Haskell
abstract:
  This is a demonstration of the design and implementation of a very simple
  imperative programming language, Impe, using Haskell. The goal is to
  demonstrate the convenience and advanced features and libraries that Haskell
  offers for programming language implementation.
---

# Impe

## Introduction

This post documents the design and implementation of an interpreter for a very
simple imperative programming lanugage, _Impe_, using Haskell. The goal is to
demonstrate the convenience and advanced features and libraries that Haskell
offers for programming language implementation. All the code used and referenced
in this post can be found in this github repository:
[riib/impe](https://github.com/rybla/impe).

## Design

### Grammar

Grammar:

<!-- TODO: what `...` means -->

```
<program>
  ::= <instruction> ...

<instruction>
  ::= { <instruction> ... }
    | <name>: <type>;
    | <name> <- <expression>;
    | <name>: <type> <- expression;
    | <name>(<name>: <type>, ...): <type> = <instruction>
    | <name>(<expression>, ...);
    | if <expression> then <instruction> else <instruction>
    | while <expression> do <instruction>
    | return <expression>;
    | pass;

<type>
  ::= void
    | unit
    | int
    | bool
    | string
    | (<type>, ...) -> <type>

<expression>
  ::= unit
    | <bool>
    | <int>
    | <string>
    | <name>
    | <name>(<expression>, ...)
```

<!-- TODO: `<-` vs `=` syntax -->
<!-- TODO: why initialization is a seperate statement rather than syntax sugar -->
<!-- TODO: where semicolons are necessary and where not -->
<!-- TODO: brief description of syntax features -->
<!-- TODO: what are procedure calls -->
<!-- TODO: what are blocks and scopes -->
<!-- TODO: how does `return` work -->
<!-- TODO: how does `pass` work, and is it different from `{}`-->

### Variables

Variables are _mutable_ -- the value of a variable can be changed during the
program's execution. An analogy: a variable is like a box that can have its
contents replaced while still staying the same box (in the same place i.e.
memory).

Variables are _call by value_ -- when a variable is mentioned (as an argument to
a function call), it is immediately evaluated. This is opposed to _call by name_
where an argument variable is passed by name and is then evaluated when it is
needed in the function's execution.

<!-- TODO: citations to sources that explain this -->
<!-- TODO: tangent about Haskell's laziness -->

### Void versus Unit

Typically when you want to ignore the output of a function, you can do just that
without a second thought. But in this design, you must be conscious of it. The
syntax for calling a procedure will be typechecked to require that the return
type is in fact `void`. Many languages opt to use the `unit` type to reflect a
trivial value, and this is fine. But `void` allows the power of a native
requirement that the return value of a function _cannot_ be useful. So perhaps
eliminates some bugs.

Additionally, `void`-return-typed functions cannot be well-typed in expressions,
since no function can have a `void` parameter and there is no term of type
`void`.

The type `void` encodes a type "with no values". In a more standard type system,
it should be impossible to have a function with the type `a -> void` for some
type `a`, because then the function produces a value of a type with no values!
But in Impe, `void` is interpreted to mean a type with values that are
inaccessible. So, Impe's typing rules ensure that a function that returns `void`
is never used somewhere where a value is expected, and a value is never used
where `void` is expected.

It would be possible to use `unit` in place of void, and the just have the
programmer ignore the output of functions that return `unit` as it is trivial
(this is how Haskell handles this, for example). But I liked the idea of using
`void` in this way since I haven't seen it enforced like this in many other
languages, but I makes for a useful little extra check that functions with
outputs that shouldn't be used do in fact don't have their output used (even
trivially).

<!-- TODO: should the only way to ignore output of function be to do this? or should there be special syntax -->

To ignore output of a non-`void`-returning function without cluttering
namespace, you can do

```plain
{ _: t <- f(e, ...); }
```

where `t` is the return type of function `f`.

## Implementation

### Interpretation

To interpret some given source code, there are three stages:

1. _Parsing_: takes source code as input, gives an AST of the source code's
   program as output.
2. _Typechecking_: takes a program AST as input, checkes that the program is
   well-typed and gives the resulting typechecking context as output.
3. _Executing_: takes a program AST as input, executes the program and gives the
   resulting execution context as output.

#### Organization

The `Language.Impe` modules contains a collection of submodules that define how
the Impe programming language interprets Impe source code. For each of the three
stages of interpretation, there is a corresponding independent module that does
not import the module of any other stage of interpretation:

- `Parsing`: parsing Impe source code into an Impe program
- `Typechecking`: checking that an Impe program is well-typed
- `Executing`: executing an Impe program's instructions imperatively

There are a few functionalities that are shared between each of these stages. As
the prime example, Impe's grammatical structure must be referencable in all
three stages in order for `Parsing` to build, `Typechecking` to inspect, and
`Executing`to traverse Impe programs. So, there is a common module `Grammar`
that is imported by all of them.

- `Grammar`: grammatical structure of an Impe program

Additionally, the other functionalities used during interpretation are _logging_
and _excepting_.

- `Logging`: log messages concurrently with computation
- `Excepting`: throw exception during computation

Finally, to run an entire interpretation from source code to execution result, a
module that exports an `interpretProgram` function is defined for convenience:

- `Interpretation`: interpret an Impe program (from source code to execution
  result)

### Grammar

`Language.Impe.Grammar`

The grammar given in the _Design_ section was written in a formal notation for
reading ease and concision. The following code block exhibits how the same
grammar is defined in Haskell using algebraic data types (ADTs).

```haskell
data Program
  = Program [Instruction]

data Instruction
  = Block [Instruction]
  | Declaration Name Type
  | Assignment Name Expression
  | Initialization Name Type Expression
  | Function Name [(Name, Type)] Type Instruction
  | Branch Expression Instruction Instruction
  | Loop Expression Instruction
  | Return Expression
  | ProcedureCall Name [Expression]
  | Pass

data Type
  = VoidType
  | UnitType
  | IntType
  | BoolType
  | StringType
  | FunctionType [Type] Type

data Expression
  = Unit
  | Bool Bool
  | Int Int
  | String String
  | Variable Name
  | Application Name [Expression]

newtype Name
  = Name String
```

The `Grammar` module also defines for this data `Show` instances that map each
grammar term to the source code that it would be parsed from.

### Effects

TODO: rewrite this... how much detail do I want to give? TODO: talk about
handling effects

Effects -- such as statefulness, logging, excepting, and IO -- are aggregated
and ordered implicitly via Polysemy. All that's needed is notify Polysemy to do
this is to use the `Member` typeclass constraint on the effect row of our `Sem`
functions that use the effect. For example, if `f`uses the statefulness effect,
`State`, with state `Int` and output `Bool`, it is type-annotate as follows:

```haskell
f :: Member (State Int) r => Sem r Bool
f = (0 ==) . (`mod` 3) <$> get
```

Additionally, `Sem r` is a monad, so there exists a convenient syntax and
convention for handling such monadic computations e.g.

```haskell
g :: Member (State Int) r => Sem r Bool
g = do
  a <- f
  modify (+ 1)
  b <- f
  return $ a && b
```

The great power of Polysemy, however, comes into play when a single function
performs multiple effects. Consider the following function that performs the
`State`, `Reader`, and `Writer` effects:

```
h ::
  ( Member (State Int) r,
    Member (Reader Int) r,
    Member (Writer Bool) r
  ) => Sem r ()
h = do
  x <- get
  y <- ask
  tell $ x == y
```

#### Logging

`Language.Impe.Logging`

The idea behind logging is to produce little messages that give some insight
into what the Haskell program is doing at different points of evaluation. Each
message is tagged with a _tag_ corresponding to what kind of information it is
(e.g. debug, warning, or output).

Logs don't need to be very structured, since they are mostly useful as a little
ad-hoc. So a log consists of just a _tag_ and a message:

```haskell
data Log = Log Tag String

data Tag
  = Tag_Debug -- only debugging
  | Tag_Warning -- non-breaking warnings for user
  | Tag_Output -- messages for user
```

Polysemy provides a useful effect called _output_ that is very similar to the
_writer_ effect, except is it specialized for writing lists of outputs that
aren't to be interacted with inside within an output-performing computation
(whereas the writer effect provides _listen_ and _pass_ actions in addition to
_tell_; see
[Polysemy.Output](https://hackage.haskell.org/package/polysemy-1.4.0.0/docs/Polysemy-Output.html)
and
[Polysemy.Writer](https://hackage.haskell.org/package/polysemy-1.4.0.0/docs/Polysemy-Writer.html)
for details). Actually handling the logging effect will be done later on in the
_Main_ section, since for the most part logging is handled by IO.

#### Excepting

`Language.Impe.Excepting`

The idea behind excepting is to allow a computation to "escape" its normal
control flow part-way through. In basic Haskell, this is usually modeling using
the `Maybe` (or `Either` monad. As a simple example:

```haskell
-- x / y + z
divide_then_add :: Int -> Int -> Int -> Maybe Int
divide_then_add x y z = do
  w <- divide x y
  return (w + z)

-- x / y
divide :: Int -> Int -> Maybe Int
divide x y
  | y == 0 -> Nothing
  | otherwise -> return (x / y)
```

The function `divide` has a _exception_ case that evaluates to `Nothing`, and a
_success_ case which evaluates to `return ...` where `return = Just` the
`Monad Maybe` instance.

Note that the desugaring of the `do` in `divide_then_add` is

```haskell
-- x / y + z
divide_then_add :: Int -> Int -> Int -> Maybe Int
divide_then_add x y z =
  divide x y >>= \w ->
  return (w + z)
```

In `divide_then_add`, the `Monad Maybe` instance provides the monadic bind
function `(>>=)` exposed by desugaring of `do`. It's implemented as follows:

```haskell
(>>=) :: Maybe a -> (a -> Maybe b) -> Maybe b
Just x >>= k = k x
Nothing >>= _ = Nothing
```

So if `divide_then_add 1 0 1` is evaluated:

- in `divide 1 0 >>= ...`, `divide 1 0` excepts
- the second case of `(>>=)` is matched
- `divide_then_add 1 0 1` evaluates to `Nothing`

This behavior effectively models the way an exception "escapes" the control
flow, since the second case of `(>>=)` immediately finishes computation by
ignoring the rest of the computation (the _continuation_ `k`) and evaluating to
`Nothing`.

`Maybe` is the very simplest way to model excepting. A slightly more
sophisticated way is to use `Either e` where `e` is the type of data an
exception contains (whereas `Maybe` doesn't allow an exception to contain any
data).

Polysemy provides an effect called _Error_ which works just like `Either e` in
the Polysemy framework. Using it's data type, `Error e`, the functions
`divide_then_add` and `divide` can be rewritten as follows, with exception data
of of type `String`:

```haskell
-- x / y + z
divide_then_add :: Member (Error String) r => Int -> Int -> Int -> Sem r Int
divide_then_add x y z = do
  w <- divide x y
  return (w + z)

-- x / y
divide :: Member (Error String) r => Int -> Int -> Sem r Int
divide x y
  | y == 0 -> throwError $ printf "attempting to divide `%s`by `0`" (show x)
  | otherwise -> return (x / y)
```

where Polysemy exposes the function

```haskell
throwError :: Member (Error e) r => e -> Sem r a
```

A main difference between Polysemy's `Error` and the more basic `Maybe` or
`Either` is that a computation of type `Member (Error e) r => Sem r a` can't be
directly inspected (i.e. pattern-matched on) to see whether it contains an
exception or a success. Instead, Polysemy provides the handler

```haskell
runError :: Sem (Error e : r) a -> Sem r (Either e a)
```

to inspect the error status of a computation, where the effect row is headed by
an `Error` effect. Since the error has been handled into `Either e a`, the error
effect is safely removed from the head of the effect row.

TODO: by default, each stage of interpretation will use the _logging_ and
_exepting_ effects.

#### Statefulness

TODO: how `State s` works TODO: pattern of describing state data type, and using
lens fields that generate lenses using `makeLenses` via Templatehaskell

### Parsing

Parsing is the process of reading some input source code and yielding a program
constructed by the program's language's grammar. The
[Parsec](https://hackage.haskell.org/package/parsec) package provides a
convenient framework for doing parsing using _monadic parsing combinators_. Read
the details of the package to learn exactly how such combinators are
implemented, but here will focus just on how to use them to write Impe's parser.

Parsec breaks up parsing into two stages: defining a _lexer_, and defining the
parsers for each grammatical structure. The lexer can be configured and
generates some useful parsers that can recognize what counts as whitespace,
identifiers, string literals, etc. The programmer-defined parsers are build from
the generated parsers.

#### Lexing with Parsec

`Language.Impe.Lexing`

The Impe lexer (or as Parsec calls it, a _tokenParser_) is defined as follows:

```haskell
type LexStream = String

type LexState = ()

type LexMonad = Identity

languageDef :: GenLanguageDef LexStream LexState LexMonad
languageDef =
  emptyDef
    { commentStart = "/*",
      commentEnd = "*/",
      commentLine = "//",
      identStart = letter,
      identLetter = alphaNum <|> oneOf ['_'],
      reservedNames = ["while", "do", "if", "then", "else", "return", "pass"],
      reservedOpNames = ["<-", "&&", "||", "~", "+", "-", "*", "/", "^", "%", "=", ">", ">=", "<", "<=", "<>"],
      caseSensitive = True
    }

tokenParser :: TokenParser LexState
tokenParser = makeTokenParser languageDef
```

The type `LexStream` indicates that the input stream to parse is a `String`. The
type `LexState` indicates that parsing uses the trivial state `()`. The type
`LexMonad` indicates that parsing is done within the `Identity `monad.

The `languageDef` specifications are:

- `commentStart`: the string "/\*" starts a block comment
- `commentEnd`: the string "\*/" ends a block comment
- `commentLine`: the string "//" starts a line comment
- `identStart`: an identifier must start with a letter character
- `identLetter`: an identifier's non-starting characters must be letters,
  numbers, or '\_'
- `reservedNames`: these names are reserved (i.e. cannot be identifiers)
- `reservedOpNames`: these operators are reserved (i.e. cannot be used in
  identifiers)
- `caseSensitive`: this language is case-sensitive

The `tokenParser` is a `TokenParser` produced by `languageDef`. It provides a
variety of useful parsers, such as

```
identifier :: Parser String
```

which is a `Parser` that parses the next identifier (which is of type `String`).

#### Parsing with Parsec

`Language.Impe.Parsing`

Now that the lexer is defined, the atomic parsers such as `identifier` can be
built up to define parsers for each of Impe's grammatica constructs.

First,

```haskell
program :: Parser Program
program = do
  insts <- many instruction
  eof
  return $ Program insts
```

is a `Parser` that parses a complete program. Here, `many` is a parser
combinator (provided by Parsec) that parses any number (including 0) of whatever
`instruction` parses, consecutively as a list. Then `instruction` is defined as

```haskell
instruction :: Parser Instruction
instruction =
  block
    <|> pass
    <|> return_
    <|> try function
    <|> branch
    <|> loop
    <|> try initialization
    <|> try declaration
    <|> try assignment
    <|> try procedureCall
```

which makes use of a parser for each of the constructors of `Instruction`. This
also uses two new parser combinators:

- `p1 <|> p2` does parser `p1`, but in the case of a parsing failure, then does
  parser `p2`. Note that if `p1` modified the parsing stream of state then that
  modification is propogated into the parsing of `p2`.
- `try p` tries to do the parser `p`, but in the case of a parsing failure,
  `try` ignores how `p` may have modified the parsing stream or state and then
  continues.

These combinators interact such that `try` needs to prefix the parsers that
might consume some of the parsing stream before failing, and `try` doesn't need
to prefix the parsers will fail immediately before making any such
modifications.

To demonstrate this behavior, consider the following parsers:

```haskell
ab = char 'a' >> char 'b'
ac = char 'a' >> char 'c'

ab_ac = ab <|> ac
ab_ac' = try ab <|> ac
```

Parsers `ab_ac` and `ab_ac'` are very similar except that `ab_ac` does `ab`
instead of `try ab` as the first argument of `(<|>)`. The goal is that `ab_ac`
and `ab_ac'` should each parse either the string "ab" or the string "ac". Here
is how `ab_ac` processes the string "ac":

| #   | stream      | parsing                                 |
| --- | ----------- | --------------------------------------- |
| 1   | "ac"        | `ab <\|> ac` uses left arg: `ab`        |
| 2   | "ac" -> "c" | `ab` parses 'a'                         |
| 3   | "c"         | `ab` expects 'b' but sees 'c', so fails |
| 4   | "c"         | `ab <\|> ac` does right arg: `ac`       |
| 5   | "c"         | `ac` expects 'a' but sees 'c', so fails |

Here for `ab_ac`, in step 2, the 'a' in "ac" was parsed, so by step 5 only the
string "c" is left.

On the other hand, here is how `ab_ac'`processes the string "ac":

| #   | stream      | parsing                                                 |
| --- | ----------- | ------------------------------------------------------- |
| 1   | "ac"        | `try ab <\|> ac` does left arg: `try ab`                |
| 2   | "ac"        | `try ab` caches current stream, then does `ab`          |
| 3   | "ac" -> "c" | `ab`parses 'a'                                          |
| 4   | "c"         | `ab`expects 'b' but sees 'c', so fails                  |
| 5   | "c" -> "ac" | `try ab` restores cached stream, and propogates failure |
| 6   | "ac"        | `try ab <\|> ac` does right argument:`ac`               |
| 7   | "ac" -> "c" | `char 'a'` parses 'a'                                   |
| 8   | "c" -> ""   | `char 'c'` parses 'c'                                   |

Here for `ab_ac'`, the same first parse failure in `ab_ac` before arises on
step 4. However, since `ab` was wrapped in a `try`, the 'a' parsed on step 3 is
restored on step 5 where `try ab` handles `ab`'s failure by restoring the cache
saved from step 2 and propogating the failure.

This behavior of `try` manifests in the definition of `instruction` where, for
example, `initialization` is wrapped in `try`. Here are the definitions of the
`initialization` and `declaration` parsers.

```haskell
-- x : t <- e;
initialization :: Parser Instruction
initialization = do
  x <- name
  colon
  t <- type_
  reservedOp "<-"
  e <- expression
  semi
  return $ Initialization x t e

-- x : t;
declaration :: Parser Instruction
declaration = do
  x <- name
  colon
  t <- type_
  semi
  return $ Declaration x t
```

If `instruction` used merely `initialization` rather than `try initialization`,
then the string "b: bool;" would be have "b", ":", and "bool" parsed from it by
`initialization`, and then a failure. Then when `(<|>)` does its right argument,
the input stream it starts with is just ";" which will cause a parse error since
nothing parses just ";". This is incorrect because "b : bool;" should be parsed
successfully by `declaration`! The `try initialization` makes sure that the "b :
bool" is restored back onto the stream before `(<|>)` does its right argument.

And that's most of what there is to standard parsing with Parsec! The only other
major functions used here are these that deal with special strings and symbols:

- `reserved :: String -> Parser String` -- given a reserved name (string) `rn`,
  parses `rn` from the stream
- `reservedOp :: String -> Parser String` -- given a reserved operator name
  (string) `ro`, parses `ro` from the stream
- `symbol :: String -> Parser String` -- given any symbol (string) `sym`, parses
  `sym` from the stream
- `identifier :: Parser String` -- parses an identifier (string) from the
  stream, where the characters allowed to start and be contained in an
  identifier are defined in the Impe lexer

##### Infixed Operators

Parsec offers a conventient little system for setting up the parsing of infixed
operators (unary and binary) with specified _infixity levels_ and _associative
handedness_ (left or right).

- _infixity levels_ define how "tightly" different infixed operators should be
  parsed e.g. the difference between parsing "a + b _ c" as "(a + b) _ c" and
  "a + (b \* c)"
- _associative handedness_ defines which direction (left or right) several
  operators of the same infixity level should be parsed e.g. the difference
  between parsing "a + b + c + d" as "a + (b + (c + d))" and "((a + b) + c) + d"
  (this does not apply to unary operators)

Here is the definition of the `expression` parser for Impe, relies on Parsec's
`buildExpressionParser`:

```haskell
expression :: Parser Expression
expression = buildExpressionParser ops expression'
  where
    ops =
      [ [ binaryOp "^" AssocLeft ],
        [ binaryOp "*" AssocLeft, binaryOp "/" AssocLeft ],
        [ binaryOp "+" AssocLeft, binaryOp "-" AssocLeft ],
        [ binaryOp "%" AssocLeft ],
        [ binaryOp "<=" AssocLeft, binaryOp "<" AssocLeft, binaryOp ">=" AssocLeft, binaryOp ">" AssocLeft ],
        [ binaryOp "=" AssocLeft ],
        [ unaryOp "~" ],
        [ binaryOp "&&" AssocLeft, binaryOp "||" AssocLeft ],
        [ binaryOp "<>" AssocLeft ]
      ]
    unaryOp opName =
      Prefix do
        reservedOp opName
        return \a -> Application (Name opName) [a]
    binaryOp opName assocHand =
      flip Infix assocHand do
        reservedOp opName
        return \a b -> Application (Name opName) [a, b]
```

The local variable `ops` defines an `OperatorTable` which is a list of lists of
`Operator`s. Each list in the table defines an infixity level, in order from
highest to lowest tightness. Each `Operator` in each infixity level encodes a
either a parser for the operator and whether it is `Prefix`ed or `Infixe`ed. The
local functions `unaryOp` and `binaryOp` abstract this structure, which depends
only on the operator name and associative handedness (which is left as a curried
argument of `binaryOp`).

- In `unaryOp`, the operator parser first parses the prefixed operator, and then
  returns a parsing computation, of type `Parser (Expression -> Expression)`,
  that takes the parsed argument of the operator and returns the grammatical
  structure for applying the operator to that argument.

- In `binaryOp`, the operator parser first parses the infixed operator, and the
  nreturns a parsing computation, of type
  `Parser (Expression -> Expression -> Expression)`, that takes the two parsed
  arguments of the operator and returns the grammatical structure for applying
  the operator to those arguments.

Finally, `buildExpressionParser` takes `expression'` as an argument, which is
the parser for non-operator-application expressions. These are the expressions
that the built expression parser parses to give as arguments to the parsers
yielded by `unaryOp` and `binaryOp`. The parser `expression'` is defined, in the
same general form as `instruction` as follows:

```haskell
expression' :: Parser Expression
expression' =
  parens expression
    <|> try unit
    <|> try bool
    <|> try int
    <|> try string
    <|> try application
    <|> try variable
```

where `unit`, `bool`, etc. are parsers for each of those kinds of expressions.

### Namespaces

TODO: describe goals, description of impl, and main interface

### Typechecking

`Language.Impe.Typechecking`

Typechecking is the process of checking that program is _well-typed_, where a
program is well-typed in Impe if the following conditions are met:

- for each application `f(e[1], ..., e[n])`, where `f : (a[1], ..., a[n]) -> b`,
  the type of `e[i]` _unifies_ with type `a[i]` `f : (a[1], ..., a[n]) -> void`.
- for each function definition with a non-`void` return type, every internal
  branch of the function's body must have a `return` instruction
- for each function definition with a `void` return type, every internal branch
  of the function's body must _not_ have a `return` instruction
- for each procedure call `f(e[1], ..., e[n])`, `f` has a type of the form

More simply but in less detail, these requirements amount to:

- functions must be called on arguments of the appropriate types
- non-`void`-returning functions must always `return`
- `void`-returning functions must never `return`
- procedure calls must be with `void`-returning functions

Here, _unifies with_ just means "syntactically equal". However, this is true
only contentiously for Impe since there are neither first-class functions nor
polymorphic types.

```hs
unifyTypes :: Type -> Type -> Typecheck r Type
unifyTypes s t = do
  log Tag_Debug $ printf "unify types: %s ~ %s" (show s) (show t)
  if s == t
    then return s
    else throw $ Excepting.TypeIncompatibility s t
```

The method for typechecking a program according to these conditions will mostly
follow a method called _bi-directional typechecking_, where typechecking is
divided into two "directions":

- _checking_ that a given expression `e` has a type that unifies with given type
  `t`
- _synthesize_ the type of a given expression `e`

To check that an application `f(e[1], ..., e[n])` is well-typed:

1. _synthesize_ the type of `f`, yielding `(a[1], ..., a[n]) -> b`
2. _synthesize_ the types of arguments `e[1], ..., e[n]` to be types
   `t[1], ..., t[n]`
3. _check_ that, for each _i_, type `t[i]` unifies with type `a[n]`

This typechecking algorithm relies on the _synthesize_ and _check_
functionalities. An in particular, the _synthesize_ functionality must have
access to some sort of implicit _state_ where typings are stored when they are
functions and variables are declared. The stateful effect provided by Polysemy's
is `State s`, where `s` is the type of the state data. The effect `State s`
comes along with a basic interface, where `get` and `set` are defined using
internal Polysemy details that are omitted here.

```haskell
-- returns the current state
get :: Member (State s) r => Sem r s
get = _ -- internal Polysemy details

-- replaces the current state
put :: Member (State s) r => s -> Sem r ()
put = _ --- internal Polysemy details

-- replaces the current state with its image under a function
modify :: Member (State s) r => (s -> s) -> Sem r ()
modify f = do
  st <- get
  put (f st)
```

The state type for typechecking, or _typechecking context_, must store the types
of variables and functions, and in some sort of structure that reflects nested
scoping -- a _namespace_. The `Namespace` data typed defined previously will do.
This is all that is needed for the typechecking context.

```haskell
data Context = Context
  { _namespace :: Namespace Name Type
  }

emptyContext :: Context
emptyContext =
  Context
    { _namespace = mempty
    }

makeLenses ''Context
```

Additionally a convenient alias for _typechecking computations_ is defined
below.

```haskell
type Typecheck r a =
  ( Member (State Context) r,
    Member (Error Excepting.Exception) r,
    Member (Output Log) r
  ) =>
  Sem r a
```

The basic ways of interacting with the typechecking context are _declaring_
(setting) the type of a name, and _declaring_ (getting) the type of a name. The
naming convention `synthesize<x>` indicates that the function synthesizes the
type of grammatical data `<x>`.

```haskell
-- gets the type of `n`
synthesizeName :: Name -> Typecheck r Type
synthesizeName n =
  gets (^. namespace . at n) >>= \case
    Just t -> return t
    Nothing -> throw $ Excepting.UndeclaredVariable n

-- sets the type of `n` to be `t`
declareName :: Name -> Type -> Typecheck r ()
declareName n t = modify $ namespace %~ initialize n t
```

So now, how is a program typechecked? There are three parts:

1. typecheck the prelude, implicitly included before a program
2. typecheck the program's body -- its list of statements
3. typecheck the program's `main` function, if it has one, to see that it has
   the expected type of a main function

As a typechecking computation:

```haskell
typecheckProgram :: Program -> Typecheck r ()
typecheckProgram = \case
  Program insts -> do
    log Tag_Debug "typecheck program"
    typecheckPrelude
    mapM_ (flip checkInstruction VoidType) insts
    typecheckMain
```

Typechecking the prelude is a simple as loading the type information specified
by the primitive functions in `Language.Impe.Primitive`.

```hs
typecheckPrelude :: Typecheck r ()
typecheckPrelude = do
  log Tag_Debug "typecheck prelude"
  mapM_
    (\(f, ss, t) -> declare f $ FunctionType ss t)
    primitive_functions
```

Typechecking instructions is the most interesting. As used in
`typecheckProgram`, the function `checkInstruction` is meant to take an
instruction and a type and then _check_ that the instruction _synthesizes_ to a
type unifies with the expected type. Using the bidirectional typechecking
philosophy, `checkInstruction` should look like the following:

```hs
checkInstruction :: Instruction -> Type -> Typecheck r ()
checkInstruction inst t = do
  log Tag_Debug "check instruction"
  t' <- synthesizeInstruction inst
  void $ unifyTypes t t'
```

Synthesizing the type of an instruction is where the actual inspection of data
comes in. In short the strategy for `synthesizeInstruction` is:

- `Return e` synthesizes to `synthesizeExpression e`
- `Branch e inst1 inst2` synthesizes to the unification of
  `synthesizeInstruction inst1` and `synthesizeInstruction inst2`
- `Loop e inst` synthesizes to `synthesizeInstruction inst`
- `Block insts` synthesizes to... hmmmm
- other instructions synthesize to `VoidType`

Synthesizing blocks is a bit tricky because there are multiple statements with
synthesizable types -- how should those types be combined into the whole block's
type?

Define an _intermediate type_ to be either a specified type or unspecified,
which corresponds to `Maybe Type` in haskell. Intermediate types unify as
follows:

```hs
unifyIntermediateTypes :: Maybe Type -> Maybe Type -> Typecheck r (Maybe Type)
unifyIntermediateTypes mb_t1 mb_t2 = do
  log Tag_Debug $ printf "unify intermediate types: %s ~ %s" (show mb_t1) (show mb_t2)
  case (mb_t1, mb_t2) of
    (Nothing, Nothing) -> return Nothing
    (Nothing, Just t) -> return $ Just t
    (Just s, Nothing) -> return $ Just s
    (Just s, Just t) -> Just <$> unifyTypes s t
```

Then the `synthesizeInstruction` strategy for a block is:

1. fold over the block's statements, accumulating the block's type as a
   intermediate type starting unspecified
2. for each fold iteration, unify the current statement's synthesized
   intermediate type with the accululator intermediate type

For this strategy, a function
`synthesizeInstructionStep :: Instruction -> Typecheck r (Maybe Type)` is needed
to synthesize intermediate types. These intermediate types indicate that they do
not contribute to specifying what the return type of a function should be if
they appear in the body of a function. But, as in the original strategy for
`synthesizeInstruction`, the instruction `Return expr` specifically does specify
the return type of a function.

One last thing before implementing `synthesizeInstruction` is how to account for
nested scopes. Some structures -- blocks, functions, branches, loops, returns,
and procedure calls -- generate a local scope where local typings are not
exported globally. Since `_namespace` is a `Namespace`, it has an interface for
handling nested scopes. All that's needed is a way to interface with the
namespace local scoping operations at the `Typecheck` computation level.

The following function `withLocalScope` does just this. It takes a typechecking
computation `tch` as input, and then generates a local scope -- using
namespace's `enterLocalScope` and `leaveLocalScope` -- for running the `tch`.

```hs
withLocalScope :: Typecheck r a -> Typecheck r a
withLocalScope tch = do
  log Tag_Debug $ printf "entering local scope"
  modify $ namespace %~ enterLocalScope
  a <- tch
  log Tag_Debug $ printf "leaving local scope"
  modify $ namespace %~ leaveLocalScope
  return a
```

Finally, all the tools for implementing `synthesizeInstruction` are available:

```hs
synthesizeInstruction :: Instruction -> Typecheck r Type
synthesizeInstruction inst = do
  log Tag_Debug "synthesize instruction"
  synthesizeInstructionStep inst >>= \case
    Just t -> return t
    Nothing -> return VoidType

synthesizeInstructionStep :: Instruction -> Typecheck r (Maybe Type)
synthesizeInstructionStep inst_ = case inst_ of

  Block insts -> withLocalScope do
    log Tag_Debug "synthesize block"
    ts <- mapM synthesizeInstructionStep insts
    foldM unifyIntermediateTypes Nothing ts

  Declaration x t -> do
    log Tag_Debug $ printf "synthesize declaration: %s" (show inst_)
    when (t == VoidType) . throw $ Excepting.VariableVoid x
    declareName x t
    return Nothing

  Assignment x e -> do
    log Tag_Debug $ printf "synthesize assignment: %s" (show inst_)
    t <- synthesizeName x
    t' <- synthesizeExpression e
    void $ unifyTypes t t'
    return Nothing

  Initialization x t e -> do
    log Tag_Debug $ printf "synthesize initialization: %s" (show inst_)
    -- declaration
    when (t == VoidType) . throw $ Excepting.VariableVoid x
    declareName x t
    -- assignment
    t' <- synthesizeExpression e
    void $ unifyTypes t t'
    return Nothing

  Function f prms t inst -> do
    log Tag_Debug $ printf "synthesize function: %s" (show inst_)
    declareName f $ FunctionType (snd <$> prms) t
    withLocalScope do
      mapM_ (\(x, s) -> declareName x s) prms
      checkInstruction inst t
    return Nothing

  Branch e inst1 inst2 -> do
    log Tag_Debug $ printf "synthesize branch: %s" (show inst_)
    checkExpression e BoolType
    mbt1 <- withLocalScope $ synthesizeInstructionStep inst1
    mbt2 <- withLocalScope $ synthesizeInstructionStep inst2
    unifyIntermediateTypes mbt1 mbt2

  Loop e inst -> do
    log Tag_Debug $ printf "synthesize loop: %s" (show inst_)
    checkExpression e BoolType
    withLocalScope $ synthesizeInstructionStep inst

  Return e -> do
    log Tag_Debug $ printf "synthesize return: %s" (show inst_)
    Just <$> synthesizeExpression e

  ProcedureCall f args -> do
    log Tag_Debug $ printf "synthesize procedure call: %s" (show inst_)
    synthesizeName f >>= \case
      fType@(FunctionType ss t) -> do
        unless (length args == length ss) . throw $
          Excepting.ApplicationArgumentsNumber f fType (length ss) args
        mapM_ (uncurry checkExpression) (zip args ss)
        return t
      fType ->
        throw $ Excepting.ApplicationNonfunction f fType args
    return Nothing

  Pass ->
    return Nothing
```

### Executing

`Language.Impe.Executing`

The setup for starting to implement _execution_ is very similar to typechecking.
There is a context that contains the information that is passed along implicitly
during execution. Instead of type information, this context contains name
bindings, as well a simple interface of IO.

```hs
data Context = Context
  { _namespace :: Namespace Name Entry,
    _inputLines :: [String],
    _outputString :: String
  }

data Entry
  = EntryValue (Maybe Value)
  | EntryClosure (Maybe Closure)
  | EntryPrimitiveFunction

makeLenses ''Context

type Execution r a =
  ( Member (State Context) r,
    Member (Error Excepting.Exception) r,
    Member (Output Log) r
  ) =>
  Sem r a
```

To execute a program:

1. load in prelude-defined variables and functions
2. execute the program's statements
3. call the main function (if there is one)

```hs
executeProgram :: Program -> Execution r ()
executeProgram = \case
  Program insts -> do
    log Tag_Debug "execute program"
    executePrelude
    mapM_ executeInstruction insts
    executeMain

executePrelude :: Execution r ()
executePrelude = do
  log Tag_Debug "execute prelude"
  -- primitive variables
  mapM_
    ( \(x, _, e) ->
        do
          declareVariable x
          adjustVariable x =<< evaluateExpression e
    )
    primitive_variables
  -- primitive functions
  mapM_
    (\(f, _, _) -> declarePrimitiveFunction f)
    primitive_functions

executeMain :: Execution r ()
executeMain =
  queryFunction' mainName >>= \case
    Just _ -> do
      log Tag_Debug "execute main"
      void $ executeInstruction (ProcedureCall mainName [])
    Nothing -> return ()
```

The main function needed to implement the above is the `executeInstruction`
which describes how to _execute_ a single instruction.

```hs
executeInstruction :: Instruction -> Execution r (Maybe Value)
executeInstruction inst_ = case inst_ of
  Block insts -> withLocalScope do
    log Tag_Debug "execute block start"
    mb_v <-
      foldM
        ( \mb_v inst -> case mb_v of
            Just v -> return $ Just v
            Nothing -> executeInstruction inst
        )
        Nothing
        insts
    log Tag_Debug "execute block end"
    return mb_v
  Declaration x _ -> do
    log Tag_Debug $ printf "execute declaration: %s" (show inst_)
    declareVariable x
    return Nothing
  Assignment x e -> do
    log Tag_Debug $ printf "execute assignment: %s" (show inst_)
    adjustVariable x =<< evaluateExpression e
    return Nothing
  Initialization x _ e -> do
    log Tag_Debug $ printf "execute initialization: %s" (show inst_)
    declareVariable x -- declaration
    adjustVariable x =<< evaluateExpression e -- assignment
    return Nothing
  Function f params _ inst -> do
    log Tag_Debug $ printf "execute function definition: %s" (show inst_)
    declareFunction f
    adjustFunction f (fst <$> params, inst)
    return Nothing
  Branch e inst1 inst2 -> do
    log Tag_Debug $ printf "execute branch: %s" (show inst_)
    evaluateExpression e >>= \case
      Bool True -> withLocalScope $ executeInstruction inst1
      Bool False -> withLocalScope $ executeInstruction inst2
      v -> throw $ Excepting.ValueMaltyped e BoolType v
  Loop e inst -> do
    log Tag_Debug $ printf "execute loop: %s" (show inst_)
    evaluateExpression e >>= \case
      Bool True -> do
        log Tag_Debug $ printf "evaluate loop condition to true: %s" (show e)
        executeInstruction inst >>= \case
          Just v -> do
            log Tag_Debug $ printf "execute loop iteration to return value: %s" (show v)
            return $ Just v
          Nothing ->
            withLocalScope $ executeInstruction $ Loop e inst
      Bool False -> do
        log Tag_Debug $ printf "evaluate loop condition to false: %s" (show e)
        return Nothing
      v -> throw $ Excepting.ValueMaltyped e BoolType v
  Return e -> do
    log Tag_Debug $ printf "execute return: %s" (show inst_)
    Just <$> evaluateExpression e
  ProcedureCall f args -> do
    log Tag_Debug $ printf "execute procedure call: %s" (show inst_)
    queryFunction f >>= \case
      -- closure
      Left ((xs, inst), scp) -> withLocalScope do
        -- evaluate arguments in local scope
        log Tag_Debug $ printf "evaluate arguments: %s" (show args)
        vs <- mapM evaluateExpression args
        -- init param vars in local scope (will be GC'ed by `withLocalScope`)
        log Tag_Debug $ printf "initialize paramater variables: %s" (show xs)
        mapM_ (uncurry initializeVariable) (zip xs vs)
        --
        log Tag_Debug $ printf "enter function scope"
        withScope scp do
          -- execute instruction in function scope
          log Tag_Debug $ printf "execute closure instruction in function scope"
          void $ executeInstruction inst
      -- primitive function
      Right pf -> withLocalScope do
        -- evaluate arguments in outer scope
        vs <- mapM evaluateExpression args
        -- execute primitive function
        void $ executePrimitiveFunction pf vs
    -- ignore result
    return Nothing
  Pass ->
    return Nothing

executePrimitiveFunction :: Name -> [Expression] -> Execution r (Maybe Value)
executePrimitiveFunction f args = do
  log Tag_Debug $ printf "execute primitive function: %s(%s)" (show f) (showArgs args)
  case (f, args) of
    -- bool
    (Name "~", [Bool p]) -> return . Just $ Bool (not p)
    (Name "&&", [Bool p, Bool q]) -> return . Just $ Bool (p && q)
    (Name "||", [Bool p, Bool q]) -> return . Just $ Bool (p || q)
    (Name "show_bool", [b]) -> return . Just $ String (show b)
    -- int
    (Name "+", [Int x, Int y]) -> return . Just $ Int (x + y)
    (Name "-", [Int x, Int y]) -> return . Just $ Int (x - y)
    (Name "*", [Int x, Int y]) -> return . Just $ Int (x * y)
    (Name "/", [Int x, Int y]) -> return . Just $ Int (x `div` y)
    (Name "^", [Int x, Int y]) -> return . Just $ Int (x ^ y)
    (Name "%", [Int x, Int y]) -> return . Just $ Int (x `mod` y)
    (Name "=", [Int x, Int y]) -> return . Just $ Bool (x == y)
    (Name ">", [Int x, Int y]) -> return . Just $ Bool (x > y)
    (Name ">=", [Int x, Int y]) -> return . Just $ Bool (x >= y)
    (Name "<", [Int x, Int y]) -> return . Just $ Bool (x < y)
    (Name "<=", [Int x, Int y]) -> return . Just $ Bool (x <= y)
    (Name "show_int", [i]) -> return . Just $ String (show i)
    -- string
    (Name "<>", [String a, String b]) -> return . Just $ String (a <> b)
    (Name "write", [String a]) -> writeOutput a >> return Nothing
    (Name "read", []) ->
      readNextInput >>= \case
        Just s -> return . Just $ String s
        Nothing -> throw Excepting.EndOfInput
    -- uninterpreted
    _ ->
      throw $ Excepting.UninterpretedPrimitiveFunction f args
```

Note that `executePrimitiveFunction` is hard-coded to execute all the functions
specified in the `Primitive` module. This is not an ideal organization, since it
requires the maintainance of two different locations to match each other. This
is error-prone, but for this casual project it is satisfactory. Additionally,
many other changes to the primitives system are required to make it
well-organized at all. The primitives system is really kind of ad-hoc in this
implementation of Impe.

Next, a definition of _evaluation_ is needed. The difference between execution
and evaluation is that execution does not have any results, whereas evaluation
yields a result i.e. a value. Most instructions do not evaluate to anything, so
the `evaluateInstruction` function makes sure that any time an instruction is
expected to evaluate to something and it doesn't actually, there's an error.
However, if typechecking is correct then this should never happen in practice.

```hs
evaluateInstruction :: Instruction -> Execution r Value
evaluateInstruction inst = do
  log Tag_Debug $ printf "evaluate instruction: %s" (show inst)
  executeInstruction inst >>= \case
    Just v -> return v
    Nothing -> throw $ Excepting.InstructionNoReturn inst
```

Finally, evaluating an expression is very simple. Most kinds of expressions are
already values, all of them except for variables and function applications.
Variables are not values since they can be dereferenced. Function applications
are not values since they can be reduced by calling the functions on the given
arguments and returning the result.

```hs
evaluateExpression :: Expression -> Execution r Value
evaluateExpression e_ = case e_ of
  Variable x -> do
    log Tag_Debug $ printf "evaluate variable: %s" (show e_)
    queryVariable x
  Application f args -> do
    log Tag_Debug $ printf "evaluate application: %s" (show e_)
    queryFunction f >>= \case
      -- constructed function
      Left ((xs, inst), scp) -> withLocalScope do
        -- evaluate arguments in local scope
        vs <- mapM evaluateExpression args
        -- init param vars in local scope (will be GC'ed by `withLocalScope`)
        mapM_ (uncurry initializeVariable) (zip xs vs)
        withScope scp do
          -- declare argument bindings in inner scope
          mapM_ (uncurry adjustVariable) (zip xs vs)
          -- evaluate instruction, returning result
          evaluateInstruction inst
      -- primitive function
      Right pf -> withLocalScope do
        -- evaluate arguments in outer scope
        args' <- mapM evaluateExpression args
        -- hand-off to execute primitive function
        executePrimitiveFunction pf args' >>= \case
          Just v -> return v
          Nothing -> throw $ Excepting.ExpressionNoValue e_
  v -> return v
```

Throughout these functions, a few helper functions for interfacing with the
context have gone undefined. The are straightforward to implement from the
`get`, `modify`, and the `At` instance of `Namespace`. Additionally, functions
like `queryVariable` and `queryFunction` throw exceptions when the queried name
is not in the namespace (which should never happen in practice if typechecking
is correct). See the source code for the details on these functions.

```hs
queryVariable :: Name -> Execution r Value
queryVariable x =
  gets (^. namespace . at x) >>= \case
    Just (EntryValue (Just val)) ->
      return val
    Just (EntryValue Nothing) ->
      throw $ Excepting.VariableUninitializedMention x
    Just (EntryClosure _) ->
      throw $ Excepting.VariableNo x
    Just EntryPrimitiveFunction ->
      throw $ Excepting.VariableNo x
    Nothing ->
      throw $ Excepting.VariableUndeclaredMention x
```

### Interpreting

Now to combine it all together! To _interpret_ a program is, following the three
steps outlined in [Interpetation](#Interpretation), to pass the results from
each step to the next, all inside of an effect monad that handles logging and
exceptions. Even more, polysemy makes it each to include different state
effects, so the interpretation effect can include the state effects from
typechecking and execution as well -- all in the `Interpretation` monad:

```hs
type Interpretation r a =
  ( Member (Output Log) r,
    Member (State Typechecking.Context) r,
    Member (State Executing.Context) r,
    Member (Error Exception) r
  ) =>
  Sem r a
```

Decorated with loggs and the relevant type annotations:

```hs
interpretProgram :: String -> String -> Interpretation r ()
interpretProgram filename source = do
  -- parse
  log Tag_Debug $ "parsing source"
  prgm <- parseProgram filename source
  log Tag_Debug $ printf "parsed program:\n\n%s\n" (show prgm)
  -- typecheck
  log Tag_Debug $ "typechecking program"
  Typechecking.typecheckProgram prgm
  tchCtx <- get :: Member (State Typechecking.Context) r => Sem r Typechecking.Context
  log Tag_Debug $ printf "typechecked context:\n\n%s\n" (show tchCtx)
  -- execute
  log Tag_Debug $ printf "executing program"
  Executing.executeProgram prgm
  exeCtx <- get :: Member (State Executing.Context) r => Sem r Executing.Context
  log Tag_Debug $ printf "executed context:\n\n%s\n" (show exeCtx)
```

The function `interpretProgram` takes a source file, parses its program,
typechecks that program, and executes the type-safe program. If there are any
exceptions along the way, the flow is escaped with the relevant exception in
tact.

The core library for `impe` is now complete.

Now all is needed is a way to handle an `Interpretation`.

### Main

The executable program that runs Impe.

Modules `Main`, `Main.Output`, and `Main.Excepting`.

The package `impe` comes with a library that defines all the internals of the
Impe language, and an executable for interpreting Impe programs according to
Impe's definition. So far the executable has two functionalities:

1. interpret an Impe source file
2. facilitate an Impe interactive REPL

To organize this executable and some options about how to interpret Impe
programs, some command line options will be useful.

#### Command Line Options

Modules `Main.Config.Grammar`and `Main.Config.Parsing`. Using
`options-applicative`.

The `options-applicative` library offers a convenient way to define a parser for
command line options. A configuration for running the executable is a record as
follows:

```hs
data Config = Config
  { mode :: Mode,
    verbosity :: Verbosity,
    source_filename :: Maybe String,
    input_filename :: Maybe String,
    output_filename :: Maybe String
  }
```

The parser takes a form very similar to a `parsec` parser, but
`options-applicative` implicitly includes features for handling command line
arguments such as optional arguments, flags, and "help" message annotations.

```hs
config :: ParserInfo Grammar.Config
config =
  info
    ( helper
        <*> version
        <*> ( Grammar.Config
                <$> mode
                <*> verbosity
                <*> source_filename
                <*> input_filename
                <*> output_filename
            )
    )
    (fullDesc <> progDesc "impe" <> header "the impe language")

mode :: Parser Grammar.Mode
mode =
  flag
    Grammar.Mode_Interpret
    Grammar.Mode_Interact
    (short 'i' <> long "interactive" <> help "interactive REPL")

version :: Parser (a -> a)
version =
  infoOption
    (unwords [showVersion Paths_impe.version, $(gitHash)])
    (long "version" <> help "show version")

verbosity :: Parser Grammar.Verbosity
verbosity = do
  option
    parseVerbosity
    ( metavar "VERBOSITY"
        <> short 'v'
        <> long "verbosity"
        <> value (Grammar.verbosities ! "normal")
        <> help "verbosity modes: debug, normal, quiet, silent, arrogant"
    )

parseVerbosity :: ReadM Grammar.Verbosity
parseVerbosity =
  eitherReader $
    ( \s ->
        case Grammar.verbosities !? s of
          Just vrb -> return vrb
          Nothing -> Left $ printf "Unrecognized verbosity `%s'" s
    )
      . Prelude.filter (not . Char.isSpace)

source_filename :: Parser (Maybe String)
source_filename =
  Just
    <$> ( strArgument
            ( metavar "SOURCE"
                <> help "source filename"
            )
        )
    <|> pure Nothing

input_filename :: Parser (Maybe String)
input_filename =
  Just
    <$> strOption
      ( metavar "INPUT"
          <> long "in"
          <> help "input data filename"
      )
    <|> pure Nothing

output_filename :: Parser (Maybe String)
output_filename =
  Just
    <$> strOption
      ( metavar "OUTPUT"
          <> long "out"
          <> help "output data filename"
      )
    <|> pure Nothing
```

The basic way to read the above definitions is that there are a selection of
basic `Parser` constructions:

- `strArgument` -- a string-valued argument
- `info` -- prints out a message
- `flag` -- optional
- `option`, `strOption` -- optional with an argument

These constructors take a few relevant arguments and one last big argument
composed by a bunch of `<>`'ed together pieces. This argument is the _modifier_,
and its components are _fields_. `options-applicative` implicitly assigns a
variety of default values that are overriden when a specific field is `<>`'ed on
the modifier.

Then the `config` parser's functionality can be lifted into an open polysemy
effect monad to be used in `Main` as follows:

```hs
parseConfig :: Member (Embed IO) r => Sem r Grammar.Config
parseConfig = embed $ execParser config
```

#### Interactive REPL

Modules `Main.Interacting`, `Main.Interacting.Grammar`,
`Main.Interacting.Lexing`, `Main.Interacting.Parsing`.

Using Polysemy-organized effects.

This interactive REPL turned out to be much more annoying to implement that
originally antifipated. But it works.

The basic idea of a REPL -- a read-evaluate-print loop -- is to allow the user
to, repeatedly, type in an expression and then print out the evaluated result
(if the expression has one). Since Impe has statements as well as expressions,
either can be used in the REPL. Additionally the REPL provides a few
metacommands for the sake of being user- and debugging-friendly, such as
printing the context, printing a help message, and quiting the REPL.

Here is a little grammar for REPL expressions, where `Instruction` and
`Expression` come from `Language.Impe.Grammar`.

```hs
data Command
  = Command_Instruction Instruction
  | Command_Expression Expression
  | Command_MetaCommand MetaCommand
  deriving (Show)

data MetaCommand
  = MetaCommand_Context
  | MetaCommand_Quit
  | MetaCommand_Help
  deriving (Show)
```

The details are omitted, but a simple parsec parser can be derived for this
language, where:

- an instruction is input as "<instruction>"
- an expression is input as ":e <expression>" or ":eval <expression>"
- a metacommand is input as ":<metacommand>"

Finally, the REPL itself is implemented in a slightly convoluted way, which
takes advantage of polysemy.

```hs
interact ::
  ( Member (Output Log) r,
    Member (State Typechecking.Context) r,
    Member (State Executing.Context) r,
    Member (Error MainExcepting.Exception) r,
    Member (Reader Config) r,
    Member (Embed IO) r
  ) =>
  Sem r ()
```

Since the type of `interact` is defined as an open effect monad, `interact` can
be trivially embedded in the `main` program earlier without the need for special
lifting.

Back to interacting, the situation is that interpreting can have side-effects,
such as logging and excepting, which need to be dealt with in the REPL.
Interpretation excepting should not exit the REPL, so it needs to be caught and
then somehow projected to the user while not escaping the REPLoop. Logging is
handled according to the _verbosity_ configuration given by the command line
arguments.

So, there is an `interact` function which checks each REPL loop by making sure
that the loop should continue (i.e. that the user has not quit yes), handles any
exceptions that arise from interpreting, and prints any output yielded from
execution. The `interactStep` function does the actual work of interaction with
the user, exposing the effects of logging (output) and excepting that are
handled by `interact`.

```hs
interact ::
  ( Member (Output Log) r,
    Member (State Typechecking.Context) r,
    Member (State Executing.Context) r,
    Member (Error MainExcepting.Exception) r,
    Member (Reader Config) r,
    Member (Embed IO) r
  ) =>
  Sem r ()
interact = do
  continue <-
    (runWriter . runError :: Sem (Error ImpeExcepting.Exception : Writer String : r) Bool -> Sem r (String, Either ImpeExcepting.Exception Bool)) interactStep >>= \case
      (out, Left err) -> do
        -- write to output
        writeOutputAppended out
        -- log output error
        log Tag_Output $ show err
        -- continue
        return True
      (out, Right b) -> do
        -- write to output
        writeOutputAppended out
        -- continue?
        return b
  if continue
    then interact
    else log Tag_Output "[impe - interact] quit"

interactStep ::
  ( Member (Output Log) r,
    Member (State Typechecking.Context) r,
    Member (State Executing.Context) r,
    Member (Error ImpeExcepting.Exception) r,
    Member (Error MainExcepting.Exception) r,
    Member (Writer String) r,
    Member (Embed IO) r
  ) =>
  Sem r Bool
interactStep = do
  -- prompt
  embed do
    putStr "> "
    hFlush stdout
  src <- embed getLine
  -- parse command
  log Tag_Debug $ "parsing command"
  cmd <- parseCommand src
  log Tag_Debug $ printf "parsed command: %s" (show cmd)
  -- handle command
  b <-
    parseCommand src >>= \case
      Command_Instruction inst -> do
        -- interpret input
        (mb_v, t) <- interpretInstructionParsed inst
        -- handle outputs
        Executing.tellOutputString
        Executing.resetOutputString
        -- result
        case mb_v of
          Just v -> log Tag_Output $ printf "returns %s :: %s\n" (show v) (show t)
          Nothing -> return ()
        -- continue
        return True
      Command_Expression expr -> do
        -- interpret input
        (v, t) <- interpretExpressionParsed expr
        -- handle outputs
        Executing.tellOutputString
        Executing.resetOutputString
        -- result
        log Tag_Output $ printf "%s :: %s\n" (show v) (show t)
        -- continue
        return True
      Command_MetaCommand mtacmd -> interpretMetaCommand mtacmd
  return b

interpretMetaCommand ::
  ( Member (Output Log) r,
    Member (State Typechecking.Context) r,
    Member (State Executing.Context) r,
    Member (Error ImpeExcepting.Exception) r,
    Member (Error MainExcepting.Exception) r,
    Member (Embed IO) r
  ) =>
  MetaCommand ->
  Sem r Bool
interpretMetaCommand = \case
  MetaCommand_Context -> do
    -- log contexts
    tchCtx <- get :: Member (State Typechecking.Context) r => Sem r Typechecking.Context
    log Tag_Output $ printf "typechecking context:\n\n%s\n" (show tchCtx)
    exeCtx <- get :: Member (State Executing.Context) r => Sem r Executing.Context
    log Tag_Output $ printf "executing context:\n\n%s\n" (show exeCtx)
    -- continue
    return True
  MetaCommand_Help -> do
    log Tag_Output . intercalate "\n" $
      [ "[impe - interact] help",
        "  <instruction>      execute instruction",
        "  :e <expression>    evaluate expression",
        "  :context / :c      print context",
        "  :help    / :h      print help",
        "  :quit    / :q      quit"
      ]
    -- continue
    return True
  MetaCommand_Quit ->
    -- quit
    return False
```

## Conclusions

TODO
