---
type: post
tags:
  - mathematics
  - ai
abstract: Fields such as theoretical computer science and mathematics are game-like and full of low-hanging fruit of unclear value. Could recently-developed AI technology harvest a bounty?
---

# The Next Trillion Theorems

(_Note._ In this article I use "theorem" to refer to a result proved in a logical system. Elsewhere, mathematicians quibble about which arcane latin jargon is proper for a given result.)

In fields such as mathematics and theoretical computer science and mathematics, there exists many very general logical frameworks for defining areas of research. These general logical frameworks are sometimes well-studied, such as arithmetic and finite-state-automata, but there are countless other frameworks that are much less studied, such as the surreal numbers and interactive proofs. Another way to think of these logical frameworks are as games and even puzzles. The rules are fully specified, and research consists of analyzing the consequences of these rules for _interesting_ theorems, where whether a theorem counts as _interesting_ is not defined within the framework. Typically, whether or not a theorem is interesting is judged relative to human preferences and the observance of useful implications for other research fields.

Of course, not all research in these kinds of fields are like that -- for example, some of the research consists of designing _new_ logical frameworks to explore. But, a non-negligible amount of the research does in fact consist of "playing" the logical games.

So, could an LLM-based AI agent be useful for exploring these logical framework? It can be taught to use the rules of the logical framework to prove new theorems very quickly, and further it could be trained to aim for _interesting_ theorems, as judged by previous similar theorems that were considered interesting.

Current LLM technology imposes some serious limitations on how far you can go with this approach:
- they aren't very good at resoning in unfamiliar logical frameworks (e.g. see my conversation about Slrj with ChatGPT below), so you will need a way to automatically veryify or at least filter its proposed proofs and theorems in order to efficiently search
- they probably won't be very good at recognizing interesting theorems, so you will have to wade through lots of uninteresting, even if true, theorems
- even to a human, its often not obvious if a theorem is interesting without discussing with other humans, which is a difficult process to automate, so this will probably be a bottleneck

<script src="https://gist.github.com/rybla/9b0fba1f4119d4a026abb8ff69bfe121.js"></script>

I don't propose this idea as a general-purpose proof search technique. I don't think LLMs are particularly close to being able to extend the frontier of mathematics in even relatively less-advanced fields. But, I do think that in a very new field that an LLM agent like I describe above could be used for a very efficient first-pass search for interesting low-hanging fruit. In this way, a human agent could use such an LLM agent to quickly propose and iteratively explore many newly proposed fields of study to find one in which an interesting theorem is found that entices further study in that field in particular.
