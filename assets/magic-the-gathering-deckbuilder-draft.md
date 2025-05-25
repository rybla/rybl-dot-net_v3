---
type: post
tags:
  - game-design
abstract:
  A popular way to play Magic the Gathering is via a draft where players select
  cards to build decks, then compete in a small tournament with those decks.
  This article presents a modification of the typical draft format that
  incorporates deckbuilding from randomized markets between the tournament
  games, so that decks get progressively stronger and more specialized in a fair
  way throughout the tournament.
---

# Magic the Gathering - Deckbuilder Draft

## Introduction

Typically in a Magic the Gathering (MTG) draft, there are three phases:

1. Select (i.e. draft) cards
2. Build deck
3. Play games Though this counts as a deck-building game, the deck-building
   happens entirely separately from the actual games you play with the built
   decks. To be sure, this kind of play can be very fun, but what if you wanted
   to have the deck-building happen amidst play? This sort of deck-building
   style has been made popular by such games as Dominion (board game) and Slay
   the Spire (video game). In MTG itself, the Conspiracy set (2014) experimented
   with cards that had abilities relevant during draft, inviting some
   interaction between draft and play itself.

## Goals

The following setup provides a way to conduct an MTG draft where the
deck-building happens between MTG games, the idea being that each player’s deck
is progressively built to be more refined and with better cards, where cards of
higher rarities are only available later in the draft.

**Main goals.**

1. Decks start off weak and unrefined.
2. It is still possible in the early and middle stages of the draft to change
   major deck strategies.
3. More powerful cards are presented randomly throughout the draft, and to be
   obtained they require the trading-in of some amount of other cards.

## Requirements

Let \\(n\\) be the number of players and \\(r\\) be the number of rounds to
play. You will need the following volumes of cards (preferably color-balanced to
at least a reasonable extent).

- commons: \\(45 n + 8 r n\\).
- uncommons: \\(8 r\\).
- rares + mythic rares: \\(5 r\\).

This format is best played with 2 or 4 players, and for 5-10 rounds.

## Definitions

- **Common starter pack** (15 cards, all common)
  - 2 mono-color of each color
  - 2 colorless
  - 3 multicolor
- **Common booster pack** (8 cards, all common)
  - 1 mon-color of each color
  - 3 colorless + multicolor
- **Uncommon booster packs** (8 cards, all uncommon)
  - 1 mono-color of each color
  - 3 colorless + multicolor
- **Rare booster packs** (5 cards, all rare or mythic rare)
- **Draft**
  1.  Each player opens one pack.
  2.  Each player selects one card to keep from the pack they are holding (i.e.
      **drafts** one card).
  3.  Each player passes their pack to the next player in the ring.
  4.  The players repeat steps 2-3 until there are no cards left in the packs.
  5.  The players repeat steps 1-4 until all 3 packs have been drafted.
- **Market** (16 cards)
  - 1 uncommon booster pack
  - 1 rare booster pack
  - (**Old Rare Market**) all rare cards from the previous round's market
- **Buying a card**
  - Common: worth 1.
  - Uncommon: costs 10, worth 8.
  - Rare: costs 20, worth 14.
  - To buy a card that costs _X_, trade in a collection of cards with a total
    worth at least _X_. Cards in the collection are worth +1, +2, and +4 for
    commons, uncommona, and (mythic) rares respectively extra for each color
    they share with the card being bought.

## Protocol

1. **Setup** where _n_ is the number of players and _r_ is the number of rounds.
   Form the following packs:
   1. _common starter packs_: \\(3 n\\).
   2. _common booster packs_: \\(r n\\).
   3. _uncommon booster packs_: \\(r\\).
   4. _rare booster packs_: \\(r\\).
2. **Initial Draft.**
   1. The players drafts with 3 common starter packs each.
   2. Each player builds 40-card minimum decks (including freely-available basic
      lands) from the cards they’ve drafted.
3. **Competitive Drafts.**
   1. Players play 1-versus-1 deathmatch (best of 1) games.
   2. Each player is dealt one common booster pack.
   3. Deal 1 uncommon booster pack and 1 rare booster pack into the market.
   4. In cyclic order from losers to winners, players take turns either _buying_
      a single card from the market or _passing_. Continue until all players
      _pass_ consecutively.
   5. Discard from the market the _old rare market_ and all uncommon cards. The
      rare cards left in the market become the new _old rare market_.
   6. Steps 1-4 constitute a **round**. Players play \\(r\\) rounds.
4. **Scoring.**
   - Each win is worth 2 points, each tie is worth 1 point.
   - The winner is the player with the most points after the last round.

## Variants

- Don't make all packs perfectly color-representative.
- Mofify costs and worths of uncommons and rares.
- Make mythic rares cost and worth more.

## Design Notes

- The losers buy first, giving losers an advantage, because otherwise the
  repeated games would suffer from a
  [runaway leader](https://insideupgames.com/the-runaway-leader-problem/) ---
  the winner would have the advantage of getting first pick from the market
  which makes them more likely to keep winning in the future, dictating that an
  early winner gain an insurmountable advantage. Giving intermediate losers an
  advantage keeps playes closely competative, never allowing the tournament to
  feel "decided" too early on.
- There isn't a final game(s) that decides the winner, because otherwise there
  would be an incentive to lose the competative draft games in order toget first
  choice in the markets.
- Note there are never any common cards available in the market. This is
  because, if there were, they would probably be costed around 2-3. This opens
  the door to a lot of little calculations and metagaming, where players must
  consider buying and selling more that 10 cards each round in order to be
  competative, since there is enough liquidity with the ability to trade in
  commons later and some commons being only slightly better than others but are
  still worth the optimization against your opponent's specific decks. Though
  this could perhaps be a fun addition for very dedicated players, to me it
  seems to introduce too much complexity and not enough fun and/or interesting
  decisions. It's just a bunch of micromanaging and annoying risk-assessment or
  having to know the huge common pool.
