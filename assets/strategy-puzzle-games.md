---
type: post
categories:
abstract:
  Even though strategy games often have solutions -- that is, perfect strategies
  -- the fact that players are computationally constrained from using the
  solution strategies makes strategy games different from puzzles.
---

# Strategy Games are Puzzle Games with Computational Constraints

## Contrasting Puzzle and Strategy Games

What distinguishes a puzzle game from a strategy game?

To be clear, I have the following meanings in mind:

- A **game** is an interactive, isolated environment with clearly-defined rules.
- A **puzzle** game is a game with win conditions, where the players must
  develop and execute the perfect strategy (i.e. the solution to the puzzle)
  over a relatively few iterations in order to win once.
- A **strategy** game is an game with a win conditions, where the players
  develop strategies and skills over relatively many iterated rounds in order
  win more often.

To slightly justify these definitions — these are useful categories in the
context of game design (I recommend reading about Keith Burgun’s
[The Four Interactive Forms](http://keithburgun.net/interactive-forms/) for an
in-depth basis for a categorization of games, that includes strategy games and
puzzle games). From a player’s perspective, puzzle games and strategy games
provide very different kinds of experiences that appeal to different kinds of
players. And from a designer’s perspective, what makes a good puzzle game is
very different from what makes a good strategy game. These dynamics can be
roughly summarized as follows.

- In a puzzle game:
  - The players want to explore the game’s state space, seeking non-obvious
    patterns that hint them towards the correct solution to the puzzle.
  - The designers want to embed solutions that require interesting use of
    patterns they expect the player to learn up while playing the game.
- In a strategy game, the players
  - The players want to explore the game’s strategy space, gaining practiced
    skills and seeking locally-maximal strategies that compete in an
    ever-changing meta-game.
  - The designers want to roughly balance the power of a variety of interesting
    strategies, while also allowing for experimentation to yield good strategies
    that fall outside any given meta-game.

In useful game-theoretic terminology, a player’s strategy is a map which
associates each possible game state to the game move that the player decides
they make for that game state.

As an example comparison, consider the puzzle game Tic-Tac-Toe and strategy game
Chess.

Though Tic-Tac-Toe isn’t typically called a puzzle game, it is. In Tic-Tac-Toe,
the players take turns making a game move (marking a space) over the game state
(shared board). If after a turn, one player has a winning configuration in the
state (3 of their markings in a row), they win the game. What makes Tic-Tac-Toe
a puzzle game is the fact that there is a solution that players can find. The
solution to Tic-Tac-Toe is the strategy that guarantees the player wins or at
least draws. So, the puzzle for the players is to find this strategy. Since, for
competent players, solving this puzzle is simple enough, it doesn’t even require
another person to play it with you!

This is a common aspect of good puzzle games — executing the solution to the
puzzle should be trivial relative to finding the solution. The purpose of
execution at all is just to check that your solution is correct. In the case of
Tic-Tac-Toe, it might be satisfying to check your solution by playing against
another player just to make sure you haven’t overlooked some possibility.

Though I mention this as an aspect of good puzzle games, Tic-Tac-Toe is not an
example of one. The big, glaring problem with Tic-Tac-Toe is that the solution
is very simple to calculate by brute-force, and it doesn’t make any use of
interesting intermediary patterns. There are no useful “heuristics” to use in
Tic-Tac-Toe, especially since its so easy to just use the solution as a “perfect
heuristic.”

On the other hand, now let us consider the strategy game of Chess. In Chess, the
players take turns making a game move (moving a piece according to its
particular movement rules) on the game state (shared board). If after a turn,
one player has a winning configuration in the state (checkmate with the other
player’s King piece), they win the game. So far, this all sounds eerily similar
to Tic-Tac-Toe. Then might Chess actually be a puzzle game after all? It can be
proven for Chess that there must exist a strategy that guarantees to either the
first or second player a win or at least a draw. In other words, there does
exist a solution to the game of Chess. Yet, Chess is not a puzzle game just
because of this, which is just obvious from observing competent Chess players.
The players do not have the solution, and (currently) it is not plausible that
they could discover it. Chess, it turns out, is sufficiently complicated enough
that computing the solution strategy is not (currently) plausible by either
brute force or heuristic.

Under these circumstances, what arises in Chess is a meta-game of competing
strategies. Since no strategy is the solution strategy, each strategy must
recognize at least one other as able to best it. Players recognize this, and so
develop heuristics for deducing what strategy their opponent is using, what
strategy will most likely beat it, and how to conceal the weaknesses of their
own strategy. As strategies compete and evolve, the meta-game of Chess develops
heuristics and abstractions in order to be able to compare strategies in the
same terms and specify mutations of strategies. Perhaps the most clear example
in Chess is the assignment of point values to each piece. The point value
assignment is a heuristic which helps to decide how the trading of two pieces
will affect the winning chances of each player. There is nothing inherent to the
game of Chess that specifies these point values, and the undiscovered solution
to Chess need not have any reference to point values either.

The critical distinction I draw between Tic-Tac-Toe and Chess that results in
them being different kinds of games is that the expected attainability of a
solution in Tic-Tac-Toe makes the game be about seeking that solution, whereas
the unattainability of a solution in Chess makes the game be about developing
competing sub-optimal strategies. Playing Tic-Tac-Toe serves as a test to check
whether or not you have found a solution, whereas playing Chess serves as a
trial by which to judge how two strategies fare against each other.

The key aspect of Chess that I have been relying on in this analysis is that the
solution to Chess is (currently) unattainable i.e. it is not plausible for
players to discover it. This constraint is a computational constraint which can
be formally specified as:

A strategy game requires that the computational power provided to players is
insufficient to compute the solution.

(Note that this does not rule out general heuristics, but it does rule out
perfect heuristics which are just short-cuts to the solution (since the
deduction that a heuristic is perfect is included in the constraint on
computational power).)

Since without this constraint, a strategy game loses the aspects that
distinguished it from a puzzle, this implies that

Strategy games are puzzles where the computational power provided to players is
insufficient to compute the solution.

## Solving a Strategy Game

On important condition on this claim is the “computation power provided to
players” part. The computational power provided to players could be whatever
computational power they can amass whenever and for however long the player
likes, but it could also be much more constrained than that.

One manifestation of this already in Chess is the use of time constraints — a
time constraint is a computational constraint, in this case on your brain’s
computation. This time constraint is useful because there are obvious advantages
to taking a longer amount of time to decide your move; if you take more time
then you can consider more possible outcomes and make a better decision! But the
game of Chess becomes somewhat less interesting if the time constraint is
removed. In the abstract extreme, it’s rational for a player to take as much
time as they possibly can in order to do as deep of a Monte-Carlo simulation
starting from the current game state as they can since, the deeper they go, the
better the move will likely be.

Additionally, there is some variety of the time constraints to choose to impose.
Casual Chess might have the time constraint of a minute or so (or until your
opponent gets too annoyed or bored to continue play, which I shall consider
yielding an undefined state rather than a perverse draw). Competitive Chess has
a timer system, where each player is allocated an amount of time at the start,
and can choose how much of that total to spend on each turn (in real time). In
standard matches, the timer is initialized with 20 minutes or so, which allows
for relatively careful consideration of how to allocate your time. In Bullet
Chess, the timer can be set much lower, to 60 seconds or even just 30 seconds!
This results in a whole different kind of game, where strategies and skill
center around determining a reasonable move as quickly as possible, with much
less emphasis on achieving something close to a local maximum. In Bullet Chess
games, it is common to play electronically where you have access to features not
implementable in the physical game, such as pre-moves, where a player can
queue-up moves to be executed in order on their next turns before the player
even sees what the opponent’s moves were.

In addition to time constraints, competitive Chess has constraints on computer
resources as well. For example, players are forbidden from querying programs
Chess-playing programs like StockFish in order to inform their moves.

This all goes to show that computational constraints are a design decision just
like other aspects of a game. Even if, someday, such powerful computers were
build that computed the solution to Chess, Chess could still be a fun strategy
game for players that are computationally constrained in the same way they are
now. Of course, it could also turn out that the solution to Chess is somehow
easily memorizable by even computationally-constrained humans, in which case the
game would be effectively ruined forever as it would be a bad strategy game
since it has a known and easily-executable solution and would be a bad puzzle
game since the solution is near-impossible to discover without immensely
powerful computers.
