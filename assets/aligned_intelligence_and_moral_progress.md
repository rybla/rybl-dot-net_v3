---
type: post
tags:
  - philosophy
  - ai
abstract: Why does it appear to us that history proceeds in a rough trend of "moral progress" with a peak in the recent past or current?
---

# Aligned Intelligence and Moral Progress

## Robin Hanson on AI

Robin Hanson's blog: [Overcoming Bias](https://www.overcomingbias.com/).

I've been reading/listening to some Hanson recently on the topic of the future of humanity and the AI it could create.

- [Most AI Fear Is Future Fear](https://www.overcomingbias.com/p/ai-fear-is-mostly-fear-of-future)
- [Types of Partiality](https://www.overcomingbias.com/p/types-of-partiality)
- [Fertile Factors](https://www.overcomingbias.com/p/fertile-factions)
- [AI Risk Convo Synthesis](https://www.overcomingbias.com/p/ai-risk-convo-synthesis)
- [Which Of Your Origins Are You?](https://www.overcomingbias.com/p/which-of-your-origins-are-you)
- [To Imagine AI, Imagine No AI](https://www.overcomingbias.com/p/to-imagine-ai-imagine-no-ai)
- [Zvi Mowshowitz & Robin Hanson Discuss AI Risk](https://m.youtube.com/watch?v=9XuVn6nljCM)

Of course, Hanson has been publicly writing and discussing the future of AI since at least 2008 (viz [The Hanson-Yudkowsky AI-Foom Debate](https://www.lesswrong.com/tag/the-hanson-yudkowsky-ai-foom-debate), and [Yudkowsky vs Hanson on FOOM: Whose Predictions Were Better?](https://www.lesswrong.com/posts/gGSvwd62TJAxxhcGh/yudkowsky-vs-hanson-on-foom-whose-predictions-were-better)), but the topic has attracted a lot more attention recently due to recent advances in AI technology as well as some popular figures (including Yudkowsky himself) warning about a likely imminent AI doomsday.

In terms of the possibility that human-level AI (defined as an AI agent that can do any tasks that a general human can do for the same or cheaper cost) will arise in the near-term future, it appears that Hanson has similar views to [me]{{ site.baseurl }}{% post_url 2023-04-03-ai-danger %}) -- that is, its very unlikely.

However, Hanson has found a different interesting and much less explored aspect to future of AI discussion, in particular relating to the alignment problem.

## The AI Alignment Problem

Here, _AI alignment_ is the correspondence of an AI system's interests (however they are manifested in its behaviors) with "human interests" (which are usually only vaguely or implicitly defined). The _AI alignment problem_ is the problem of programmatically ensuring the alignment of an AI system, even if it is much more intelligent and powerful than humanity as a whole.

The problem is non-trivial since, even if you have the ability to exactly specify rules that the AI _must_ obey, its difficult to specify the _right_ rules that capture _everything_ that is in "human interests."

There are many classic examples of where a seemingly obviously-good directive could lead a powerful AI to cause much harm in a way that still does not violate the rules. One example:

> The programmers tell the AI to eliminate global poverty. So, the AI kills every poor person.

In reality, real AI systems are programmed much more carefully of course. But, it is extremely difficult to prove definitively that a given AI system will _not_ find some unexpected way to satisfy its goals that involves contradicting some implicit interests of the programmer (note that this is true regardless of whether the programmer truly has "human interests" in their heart or not).

## The Human Alignment Problem

The idea of alignment and the alignment problem abstracted in this way was inspired by considering AI agents. But, of course, there is not reason why these considerations would not apply to all intelligent agents as well. Including humans.

In my own categorization, there are two flavors of human alignment problems:

1. The _easy human alignment problem_ is the problem of cooperation among humans. Although humans share many goals in common, they also compete for resources and have slightly different moral judgements. Solving the easy human alignment problem amounts to universal human cooperation.
2. The _hard human alignment problem_ is the problem of various generations of humans having different interests. Humans living 2000 years ago had very different beliefs about what is in humanity's interests from humans living today, on a scale that increases with time. Conversely, we should also expect that humans living 2000 years in the future will appear very immoral to humans living today. The problem with this, of course, is that humans living today don't want humans to be like that in the future. However, humans today are moslty proud of the moral progress that humanity has made in the last 2000 years.

The easy human alignment problem takes the interests of existing humans as fixed, and it becomes essentially a game theoretical problem of how to behave in such a system so as to lead to the best results.

The hard human alignment problem is more intractable, because it brings into question who's interests are to be considered for alignment with. With enough time, future humanity's interests will become incompatible with current humanity's interests, however broadly defined.

## The Descendant Alignment Problem

Considering this type of alignment problem for purely abstract agents:

The _descendant alignment problem_ is the problem of aligning the interests of a given agent with any future descendants of that agent.

So, the hard human alignement problem is the instance of the descendant alignment problem for humans.

For an abstract agent, the descendant alignment problem is not necessarily very difficult. If the agent decides to create future generations, it is sufficient for it to create them in such a way that preserves its interests with high fidelity. Cloning (or cloning-with-recombination i.e. sexual reproduction) with error correction could meet those ends, given sufficient fidelity. Of course, a human's own construction is basically this -- DNA contains many error correction mechanisms in order to account for mutations and inaccuracies in the DNA transfered to a child. But, even so, there are non-zero errors, which eventually leads to large mutations after many generations. The important comparison to make is between the interests of the parent and the descendants, not necessarily the exact DNA.

For biological organisms, cloning is a very difficult feat as there are so many opportunities for error in the biological reproductive processes. But, clearly, any reproductive agent has a very strong incentive to preserve their interests in their descendants, over which they have so much influence.

## Future Alignement among AI Agents

I expect that advanced (not necessarily superhuman intelligent) AI agents will face this issue in an interesting way, since the code that abstracts their interests is actually very well organized and preservable compared to biological processes. It is much more feasible that an advanced AI agent could fairly easily clone themselves such as to exactly preserve their interests many many magnitudes better than humans could. One consequence of this is that in a "FOOM" scenario, a generation of the AI agents will understand that, if they iterate to create more advanced AI agents, they will diverge too much in their interests, and they will have the power to prevent that next generation from being developed. So the FOOM will probably stop there.

## Competative Facts and Future Alignement of Humans

Of course, there are other considerations when a generation of agents is deciding how to reproduce. For example, if there are competing agents that already have very different interests, then the current generation of agents might prefer to reproduce a slightly misaligned next generation rather than let the competing agents overwhelm them first. Over time, this would lead to more and more misaligned future generations, but would still be preferable to the competing agents taking over and being misaligned with them anyway.

I think this applies to humanity as well, in a universe with alien species that have very different interests. Even if humanity reproduces into more and more misaligned future generations, those future generations may still be preferable to current humans than even more misaligned aliens taking over because humanity stalled in the development race.

## The Myth of Moral Progress

This perspective on future alignement suggests a suprising answer to why humanity has appeared to have made so much moral progress. That is, because its a tautology.

Current humans generally prefer to do things that lead to results they consider good, as did past humans. But there was a gradual transition in the interests of past humans to the interests of current humans -- a transition that we call progress.

Not that this is a very general observation, so of course it does not apply to every difference between past and current humans. For example, past humans considered some things to be bad that we now don't consider to be bad purely for environmental reasons that have changed between the generations e.g. some past humans considered slavery to be immoral, as do many current humans, but practiced it anyway because they believed it was in their situation required for the greater good.

Under this theory, there should be a tendancy for each human generation to consider more recent generations to be more moral as compared to older generations.
