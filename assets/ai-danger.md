---
type: post
tags:
  - ai
abstract: My thoughts on the dangers of AI technology.
---

# AI Danger

_last updated: 2023-03-11_

_Definition_. The __AI Doomsday__ scenario is a possible future scenario where an AI system is developed that overcomes all attempts at control and very soon after the system causes the extinction of the human species. This definition abstracts away any particular prediction of _when_ this scenario will happen and _how_ specifically it will play out.

<img src="{% link /assets/images/DALL·E 2023-04-09 01.14.46 - Digital artwork of a scientist taking notes on a clipboard while looking at a giant computer system floating in the sky with huge scale computer compo.png %}" class="full-width">

## What are the Dangers of AI?

AI has been a hot topic recently due to some impressive [recent advancements](https://lifearchitect.ai/timeline). In particular, the chatbot web app _ChatGPT_ by [Open AI](http://openai.com/) has given the public a first view of a new kind of AI technology that can be integrated into one's everyday life and demonstrates surprisingly human-like capabilities.

On the internet I've seen a large variety of responses to the new and quickly improving AI technology.

Many people are interested in how to use the technology to build newly-possible tools and products.

Many people are concerned with the dangers brought by this new technology that society at large is ill-prepared for. Overall, some main (not entirely independent) concerns I've noticed are:
- AI will soon be able to perform many jobs more efficiently (in terms of meeting a threshold quality/cost for employers) than many humans, which will lead to mass unemployment.
- AI will enable more proliferation of misinformation, which will lead to further breakdown of social/political institutions/relations.
- AI will lead to a massive increase in AI-generated content (writing, digital art, etc) that is hard to distinguish from humans, which will decrease the value of human-generated content and promote bullshit.
- An AI system will be developed that overcomes all attempts at control and soon after the system causes the extinction of the human species (this is the _AI Doomsday_ scenario)

Many people are in favor of focusing pre-emptively on addressing these dangers before they fully play out. For example, the letter _[Pause Giant AI Experiments: An Open Letter](https://futureoflife.org/open-letter/pause-giant-ai-experiments/)_ (and associated [FAQ](https://futureoflife.org/ai/faqs-about-flis-open-letter-calling-for-a-pause-on-giant-ai-experiments/)) from the Future of Life Institute calls for a voluntary 6-month "pause" on AI development by the AI industry leaders (in particular, Open AI/Microsoft and Google) to call attention to and give time for efforts to address the near-term dangers of AI.

Pausing AI development for even just 6 months is a _huge_ ask. Companies like Open AI, Microsoft, Google, Anthropic, and Midjourney are spending billions of USD to develop these technologies and produce billions of USD of value. The most recent AI developments have already gained widespread use e.g. Open AI's ChatGPT accumulated at least 100 million users in just 2 months [[reuters](https://www.reuters.com/technology/chatgpt-sets-record-fastest-growing-user-base-analyst-note-2023-02-01/)].

The letter justifies this huge ask by pointing out the huge dangers of AI technology, in particular:

- mass unemployment
- mass misinformation
- "loss of control of our civilization" (likely AI Doomsday)

In addition to the impact of these dangers when they play out, the probability distribution of various scales of these dangers is also critical for weighing this justification.

There are surely many other dangers to AI technology, but in this post, I will focus primarily on AI Doomsday.

## How Likely Is AI Doomsday?

_Definition_. __Eventual AI Doomsday__ is the prediction that __AI Doomsday__ will happen at some point in the future.

In principle, AI Doomsday is very likely to happen. [Nick Bostrom](https://en.wikipedia.org/wiki/Nick_Bostrom) popularized this observation in [Superintelligence](https://en.wikipedia.org/wiki/Superintelligence:_Paths,_Dangers,_Strategies), and [Eliezer Yudkowsky](https://en.wikipedia.org/wiki/Eliezer_Yudkowsky) has spent much of his time rebutting his own and others' suggestions for how to prevent an advanced AI system that _could_ cause AI Doomsday from doing so. I find the most convincing argument for AI Doomsday to be the most abstract version. The argument has two parts:

1. _A sufficiently advanced AI system can cause AI Doomsday_. Suppose there exists at some point an AI system that is so capable that if human efforts to maintain control over it fail then it will never be controllable again by humans after that point. Then it is very likely that there will be some point after this development that the AI does escape control in this way, and pursues its own goals. It is vanishingly unlikely that the system's pursuit of these goals will leave room for human survival.
2. _Such a sufficiently advanced AI is likely to be developed_. Suppose that the advancement of AI technology continues to be non-negligible. Then at some point, human-level AI systems will be developed. These systems will be able to aid in the development of more advanced AI systems. So, it is very likely that the development of AI technology will continue after that. If this trend continues non-negligibly, it is likely that eventually, the technology will develop to a capability that satisfies part 1 of this argument.

This argument relies on a few premises:
- The advancement of AI technology continues, however sporadically, until human-level AI is developed
- AI advancement, especially after achieving human-level AI, will outpace efforts to keep the AI systems under sufficient human control to prevent part 1 from playing out
- Such a capable AI system beyond human control as in part 1 would pursue goals that would not include human survival

Of course, it's difficult to directly judge the likelihood of these premises in the _foreseeable_ future, but over the long term of humanity's _entire_ future, they seem very likely in principle. For example, there is a rough upper bound on the difficulty of developing human-level AI: the possibility of artificially replicating human intelligence based exactly on biological human intelligence (i.e. digitally simulating a brain with sufficient detail to yield intelligence).

I _do_ believe the eventual AI Doomsday prediction is more likely than not. I am very unsure, so a specific number is not very useful, but I'd put it at something like a normal distribution of around 80% with a standard deviation of 20%.

TODO: give argument for claim: "It is vanishingly unlikely that the system's pursuit of these goals will leave room for human survival."

### Important Reservations

This is only an argument for an _eventual_ AI Doomsday. It does not distinguish between an imminent AI Doomsday that happens in 20 years or a long-term AI Doomsday that happens in 20,000 years. And the argument by itself does not necessarily imply any significant predictions about the distribution over these timelines.

This argument only makes reference to _intelligence_, which is the ability of a system to accomplish general classes of complex goals. This may turn out to have some relation to _consciousness_, but that is a separate topic and the argument doesn't depend on any details there. And so, the argument does not require any premises about imbuing an AI system with consciousness.

## How Likely Is AI Doomsday, Soon?

_Definition_. __Imminent AI Doomsday__ is the prediction that __AI Doomsday__ will happen within the next couple of decades. Within that timeline, there is a variety of popular probability distributions.

I have seen this survey -- [2022 Expert Survey on Progress in AI](https://aiimpacts.org/2022-expert-survey-on-progress-in-ai/) -- often cited to support the claim that most AI researchers expect artificial general intelligence (AGI) to be developed in the near future. It's also interesting to compare these results to [2016 version of this survey](https://aiimpacts.org/2016-expert-survey-on-progress-in-ai/). Quoting a few main results of the 2022 survey:

1. __The aggregate forecast time to a 50% chance of HLMI was 37 years__, i.e. 2059 (not including data from questions about the conceptually similar Full Automation of Labor, which in 2016 received much later estimates). This timeline has become about eight years shorter in the six years since 2016, when the aggregate prediction put a 50% probability at 2061, i.e. 45 years out. Note that these estimates are conditional on "human scientific activity continu[ing] without major negative disruption."
2. __The median respondent believes the probability that the long-run effect of advanced AI on humanity will be "extremely bad (e.g., human extinction)" is 5%.__ This is the same as it was in 2016 (though Zhang et al 2022 found 2% in a similar but non-identical question). Many respondents were substantially more concerned: 48% of respondents gave at least a 10% chance of an extremely bad outcome. But some were much less concerned: 25% put it at 0%.
3. __The median respondent thinks there is an "about even chance" that a stated argument for an intelligence explosion is broadly correct.__ 54% of respondents say the likelihood that it is correct is "about even," "likely," or "very likely" (corresponding to probability >40%), similar to 51% of respondents in 2016. The median respondent also believes machine intelligence will probably (60%) be "vastly better than humans at all professions" within 30 years of HLMI, and the rate of global technological improvement will probably (80%) dramatically increase (e.g., by a factor of ten) as a result of machine intelligence within 30 years of HLMI.

(Here, "HLMI" abbreviates "human-level machine intelligence". These definitions can be hard to justify since there are no well-established theories of intelligence. The usual conception of AGI includes HLMI i.e. the "general" in AGI means "more general than (some sort of reasonably-taken average) human intelligence". I find HLMI a much less ambiguous term than AGI, so I prefer it, but it's also clear that AGI has become the popular term of choice for this kind of concept regardless of its original intentions.)

Imminent AI Doomsday predictions often cite the 37-year average forecast time to a 50% chance of HLMI. But, note that the probability is conditional on "human scientific activity continu[ing] without major negative disruption", which of course I would not expect the surveyed population to have any special insight into (in contrast to the topic of AI technological development). Additionally, the response is subject to selection biases:

- The population is self-selected to be excited about AI technology since they decided to focus their career working on it, which implies they rate the probability of achieving one of their main goals -- developing HLMI -- higher due to desirability bias

- The population is self-selected to be less worried about AI Doomsday since those that are very worried about AI Doomsday would be less interested in contributing to it. Additionally, AI researchers are incentivized to underrate the likelihood of AI Doomsday because a higher perceived likelihood would probably lead to more regulation and other inhibitions to their primary work and source of income.

- The population is self-selected to rate the timeline to HLMI as shorter and the likelihood of AI Doomsday as higher due to people with those beliefs being more interested in a survey asking about those relatively-niche topics. The survey only got a 17% response rate, which of course was not a uniformly-random 17%. So, this bias could be quite significant. The survey's Methods section's description of the surveyed population:

> We contacted approximately 4271 researchers who published at the conferences NeurIPS or ICML in 2021. These people were selected by taking all of the authors at those conferences and randomly allocating them between this survey and a survey being run by others. We then contacted those whose email addresses we could find. We found email addresses in papers published at those conferences, in other public data, and in records from our previous survey and Zhang et al 2022. We received 738 responses, some partial, for a 17% response rate.
> Participants who previously participated in the the 2016 ESPAI or Zhang et al surveys received slightly longer surveys, and received questions which they had received in past surveys (where random subsets of questions were given), rather than receiving newly randomized questions. This was so that they could also be included in a 'matched panel’ survey, in which we contacted all researchers who completed the 2016 ESPAI or Zhang et al surveys, to compare responses from exactly the same samples of researchers over time. These surveys contained additional questions matching some of those in the Zhang et al survey.
- _Update 2023/04/09:_ (As brought up to me by a friend) Most of the researchers surveyed were from academia, and only a few of the researchers surveyed were from the currently-leading AI companies. Since those companies seem to have a clear lead over academic AI efforts, this leads to a bias where an important class of researchers who are most familiar with the most advanced existing AI technology is less represented. It's hard to say exactly which way this bias goes. It could imply a bias towards a longer timeline since the advanced industry researchers know how much further the technology already is secretly ahead of what the public knows. Or, it could imply a bias towards a shorter timeline since the advanced industry researchers are more familiar with the limitations of current approaches while academics with fewer details might expect that the recent rates of rapid advancement should be expected to continue. Overall, I'll summarize this as a net negligible bias that increases uncertainty.
- _Update 2023/04/30:_ From OpenAI's CEO Sam Altman: "I think we're at the end of the era where it's going to be these, like, giant, giant models,” he told an audience at an event held at MIT late last week. "We'll make them better in other ways." [[wired](https://www.wired.com/story/openai-ceo-sam-altman-the-age-of-giant-ai-models-is-already-over/)]. The immediate implication is that recent major advances have been significantly driven by scaling existing techniques, and so since that scaling's effectiveness is imminently dropping off, fundamentally new techniques are required in order to make progress. This development is evidence that, at the time of the survey, those in the industry, who would be more likely to predict this situation since they are more knowledgeable about the cutting edge, would be influenced by this to predict longer timelines to HLMI than the surveyed academics who would only be influenced by extrapolating current trends about industry AI development from an external perspective.

Unfortunately, the survey didn't ask for a predicted timeline within which respondents expect the effect of advanced AI on humanity to be "extremely bad (e.g. human extinction)".

There are many biases to account for, as with any survey, but it seems there should be something like a general trend of:
- significant underestimation of the time-to-HLMI
- slight overestimation of the risk of (eventual) AI Doomsday
- higher uncertainty due to the most advanced researchers in industry not being included as much as academics

Additionally, the variance among survey responses is very high. There is nothing like a clear consensus on the near term (50 years), as this [post by Our World In Data](https://ourworldindata.org/ai-timelines) mentions. However, there is a relatively strong consensus (90% of respondents) that HLMI will be developed within the next 100 years. However, 100 years is a very long timeline for any technological prediction, so I take it as having much less certainty than a much more near-term prediction like 37 years.

With that said, consider how these results compare to the popular imminent AI Doomsday predictions.

### Timeline to HLMI

Imminent AI Doomsday predictions often rate the time-to-HLMI as even shorter than this survey suggests and the likelihood of eventual Doomsday as even higher. For example, Eliezer Yudkowsky -- one of the main public imminent AI Doomsday predictors -- suggests in his [TIME letter](https://time.com/6266923/ai-eliezer-yudkowsky-open-letter-not-enough/) that imminent Doomsday is extremely likely unless drastic and extremely unlikely regulations on AI development are imposed soon i.e. we "shut it all down". For example, he has recommended in various discussions (e.g. on [Lex Friedman's podcast](https://overcast.fm/+eZyDo-AY0)) that young people today should not put much weight on the future because of how likely imminent AI Doomsday is (perhaps this was rhetorical and he doesn't truly believe that the timeline is that sure, but my impression is that he has never intentionally been rhetorical in any kind of way similar to this so I doubt that he is in this instance either).

However, Yudkowsky has repeatedly refused to give a specific probability distribution over the likelihood of imminent AI Doomsday timelines. He explained this strategy on [The Lunar Society podcast](https://overcast.fm/+b53M_HRgo). My summary of it is that he believes that publicly revealing specific predictions would be misleading because: it's very difficult to predict the particular pathway to imminent AI Doomsday, so his specific predictions would likely be wrong (even if he correctly thought they were more likely than people who do not predict imminent AI Doomsday), so people would incorrectly infer that his prediction of imminent AI Doomsday is unlikely even though the ultimate convergence of many individually unlikely pathways is together very likely. Additionally, he doesn't think there are any intermediate milestone predictions that he expects to be convergent in the same way that people could use to accurately judge his model that predicts AI Doomsday.

This is a coherent position to have. As he gives as an example, predicting the lottery is also like this: it's very difficult to predict _which_ lottery ticket is the winning lottery ticket, but it's very easy to predict that _some_ winning ticket will be drawn.

This position has as a premise that, before his ultimate prediction of imminent AI Doomsday plays out (or perhaps until _right_ before imminent AI Doomsday), there are no intermediate predictions that he could make that we could judge his model by. This implies that when we observe certain events related to AI development that he doesn't think immediately portent AI Doomsday, they should not impact his predictions. Since if they did, then he could have made them as intermediate predictions beforehand. However, as judged from his comments on Twitter and in podcasts, it does seem like he's updating regularly by judging particular AI behaviors (for example, Bing threatening users with blackmail) to support his dire predictions.

My guess is that he's leaving a lot of credibility "on the table" here; it would be easy for him to make near-term predictions about ways that AI technology will act that most people would not expect. If he did so, many people (including me) would take his concerns about eventual, and to some extent, AI Doomsday more seriously.

In particular, he could bundle together in whatever way he likes the classes of possible observations that would increase his expectation of imminent AI Doomsday and predict that at least one of these things will happen in some specified timeline. Even if each bundle item is unlikely, he could find some disjunctive bundle that he thinks is somewhat close to 50% likely and that some prominent people that disagree with him on imminent AI Doomsday would put at much less than 50% likelihood. I hope he or another imminent AI Doomsday predictor does something like this.

<!-- I appreciated the [The Lunar Society podcast](https://overcast.fm/+b53M_HRgo) with Yudkowsky more than his appearance on [Lex Friedman podcast](https://overcast.fm/+eZyDo-AY0). I think Friedman let Yudkowsky dwell on some conclusions too long without explaining the details of how he arrived at those conclusions. I was surprised to finish the hours-long podcast and not learn anything (as far as I could tell) about what MIRI (the Machine Intelligence Research Institute that Yudkowsky runs) has accomplished. Patel, on the other hand, presented many more interesting lines thought for Yudkowsky to entertain, but I think he still indulged Yudkowsky's premises a little too much without asking for more details and justification e.g. why he is so much more sure that AI Doomsday is likely to happen shortly (even if he doesn't give any specific timeline) than most AI researchers (accounting for biases of course). Even [Gwern Branwen](https://gwern.net), who Yudkowsky brings up as a good predictor for near-term AI developments, doesn't have Yudkowsky's (and many others that concur with him) confidence in imminent AI Doomsday. -->

### Most AI Researchers Expect that Superintelligent AI will _not_ be Extremely Bad

In the survey, the aggregate forecast time to a 50% chance of HLMI is 37 years, the median correspondent things that there is an "about even chance" that an intelligence explosion will happen (withing 30 years of HLMI) and they believe that the probability that the long-run effect of advanced AI on humanity will be "extremely bad (e.g. human extinction)" with probability 5%.
- Note that this is within 1% of Scott Alexander's [lizardman's constant](https://slatestarcodex.com/2013/04/12/noisy-poll-results-and-reptilian-muslim-climatologists-from-mars/), which is the observation that for most surveys, for responses that indicate very unorthodox and unjustified beliefs, at least 4% of respondents will give those responses (regardless of honesty).

With some slight extrapolation, the median correspondent believes something close to this: it's fairly likely (~25%) that superintelligent AI will be developed within ~67 years (50% chance of HLMI in 37 years, then allowing for up to 30 years for the 50% chance of intelligence explosion to play out), yet they also believe that the long-run effect of advanced AI on humanity is likely (95%) not extremely bad.

This doesn't correspond well to the usual imminent AI Doomday position, which predicts that superintelligent AI is _extremely likely_ to cause AI Doomsday. If an imminent AI Doomsday predictor wants to use this data to support their claim about the short timeline, they should also take into account, or adequately explain why they are not, the aggregate position of the respondents that they aren't nearly as worried about AI Doomsday once superintelligence is developed.

### My Current Position on Imminent AI Doomsday

Almost all the arguments I've heard from imminent AI Doomsday predictors focus almost on supporting the _eventual_ AI Doomsday argument and neglect or hand-wave the implications for _imminent_ AI Doomsday. Of course, the support for eventual AI Doomsday is _some_ support for imminent AI Doomsday, but not much.

For example, Tyler Cowen wrote a [spirited post](https://marginalrevolution.com/marginalrevolution/2023/03/existential-risk-and-the-turn-in-human-history.html) claiming among other things that the imminent AI Doomsday predictors are much too confident. Scott Alexander [responded to Cowen](https://open.substack.com/pub/astralcodexten/p/mr-tries-the-safe-uncertainty-fallacy) with the claim that Cowen's argument was weak because it suffered from the "safe uncertainty fallacy" -- that is, if the specifics of a potential danger are not clear that does _not_ necessarily imply that the dangers are less likely. Alexander analogizes the situation to discovering that an alien spaceship is heading towards Earth -- we don't know anything about the aliens, so any particular predictions about what will happen when they get here are uncertain, and yet we definitely should be worried about the potential dangers because aliens are likely enough to be dangerous enough in _some_ way to warrant worry. I think Alexander missed that point of Cowen's article, which it seems that [Cowen agrees with me about](https://marginalrevolution.com/marginalrevolution/2023/03/thursday-assorted-links-398.html), because Alexander's argument starts with the premise that we already _know_ that a big potential danger is on the horizon, such as the alien spaceship. But with AI, Cowen _explicitly disagrees_ that AI poses such an immediate danger. Alexander probably does disagree with Cowen about this, but he doesn't present an argument for this premise in his article and so it doesn't make sense to argue against Cowen by first assuming he is wrong.

However, I'm sure there are some good arguments for imminent AI Doomsday out there, so I'll look for them.

As I discussed above, I do in fact believe in eventual AI Doomsday. But my base rate expectation for something like that happening within the next 20 years is very low. Before the most recent impressive public advances in AI technology, ChatGPT and other [large language models (LLM)](https://en.wikipedia.org/wiki/Large_language_model) in particular, my expectation for HLMI in the next 20 years was that it was negligible, something like 1%. Nothing I'd seen had indicated that state-of-the-art AI technology was on track for anything like that without many breakthroughs. And, the field has been in a lot of flux in the last decade or two to say the least, which indicates that solid, compounding progress had not kicked in yet -- which is something important that I'd expect to see before the development run up to HLMI.

I was very impressed by ChatGPT, using it for myself and seeing other people online share what they could do with it. What impressed me was the breadth of interesting things that could be accomplished by such a fundamentally theory-lacking approach. The model powering ChatGPT is a _huge_ version of basically the same kind of model that has been used over the last 5 years or so (the generative pre trained transformer (GPT) was [introduced by Google Brain in 2017](https://arxiv.org/abs/1706.03762)), plus some human-powered fine-tuning (i.e. [reinforcement learning from human feedback (RLHF)](https://huggingface.co/blog/rlhf)). I only found ChatGPT to be a minor step towards HLMI, if nothing else it shows that there are still meaningful gains to be had in scaling current technologies. It has become a sort of meme, among imminent AI Doomsday predictors in particular, to make fun of people who claim that ChatGPT is just a "stochastic parrot", usually by presenting a ChatGPT transcript and claiming its obviously "truly thinking" or something like that. Yet, it still displays many telltale signs of whatever "stochastic parrot" probably is, in that if you give it challenging prompts that are unlike things from its training set, it reliably fails; an AI system that was effectively generalizing and not just doing relatively low-order pattern matching. For example:
- ChatGPT can do a lot of simple math problems, but if you expand a math problem it can normally do ok to one that has a lot of complications and isn't just a straightforward textbook problem then it struggles -- it will give you _some_ answers but with serious flaws
- ChatGPT can do some standard logical derivations, but cannot reason about a non-standard logical system. If I present a new logical system, even including a variety of examples of derivations in the new system, ChatGPT forgets about the rules I specified and uses whatever standard logical rules happen to have a similar form instead.

The step from ChatGPT to GPT4 was more subtle in terms of superficial user experience. But, personally, my impression was that it responded appropriately to my exact intentions _much_ more often and precisely than ChatGPT, especially in terms of respecting specific details of my requests and giving more detail-oriented rather than very general unassuming responses. For example:
- GPT4 can write a short story that weaves together a large number of specified elements without forgetting any of them or hyper focussing on only a few.

In terms of distances from HLMI, GPT4 is the same order of magnitude distances from it as ChatGPT i.e. I don't consider it a much larger step towards HLMI than ChatGPT was. But, it was still surprising to me that such a large improvement could be made in such short order. So overall given these developments within the last year, I respectfully increase my expectation that HLMI will happen in 20 years to 2%.

_Update 2023/04/30:_ I've since learned that GPT4 was actually not developed so quickly after GPT3.5 as I previously thought. OpenAI's Sam Altman stated that "we have had the initial training of GPT-4 done for quite awhile, but it’s taken us a long time and a lot of work to feel ready to release it." [[twitter](https://twitter.com/sama/status/1635687859494715393?s=20)]. I haven't been able to find more specific information generally available online, but I've heard from Altman on podcast interviews that GPT4's "initial training" was done around the time of the release of ChatGPT (2022/11/30). So, the improvement from GPT3.5 to GPT4 wasn't actually done as quickly as I previously thought, but that GPT4-level capabilities were mostly already accomplished by the time that GPT3.5 was available. This implies that its harder to judge how quickly capabilities improved from GPT3.5-level to GPT4-level.

### What I Would Consider a Major Shortcoming in My Reasoning

A common argument for imminent AI Doomsday that I haven't addressed is the "fast takeoff" or "foom" scenario: a certain level of AI advancement that is achievable in the near-term future could lead to an extremely quick feedback loop of self-improving AI systems, which within a very short period advances to AI to superintelligence.

This sort of scenario is difficult to handle because it has very little warning -- we might not know much about how likely it is to happen until it's right about to or already happening. If it's possible to solidly predict a non-negligible probability of fast-takeoff, I think that's one of the most important things that imminent Doomsday predictors could do to advance their case.

Abstracting away from the fast takeoff question, I find the main feature lacking among imminent Doomsday arguments is detailed to support specific probabilities. In-principle arguments for the in-principle possibility and so _eventual_ likelihood of AI Doomsday don't say much about _imminent_ Doomsday. If I was presented with a compelling case for why specific features of AI systems can be demonstrated to very clearly be extrapolated to follow a widely agreed upon path towards superintelligence in the near term, I would be utterly convinced. The fact that AI Doomsday predictors don't seem to spend much effort trying to present specific ways in which current AI systems could be extrapolated in this way, and instead focus on very unquantifiable feelings about how scary and/or impressive some of the behaviors of AI systems are, makes me skeptical. Notably, the researchers spending so much time, effort, and money developing these systems haven't noticed such an extrapolated pathway either. Given all these factors, and my prior expectation that HLMI is very difficult, I think it's very unlikely to exist.

Aside from this, advances in AI technology could also change my mind.

<!-- But, given that there is still a lot of room left between current systems and superintelligent AI (or even HLMI),  -->

### What I Would Consider Significant Steps Towards HLMI

_An underlying theory._ I would consider it a major step towards HLMI if the field of AI research establishes some widely-respected new theories about the nature of intelligence, probably including the intelligence of animals at the least. Until then, I expect more lumpy developments like the explosive rise of AI in public consciousness recently as surprisingly effective techniques are stumbled into. But my prior is that HLMI is so difficult that it will probably not be "stumbled into" in this way.

_Generality._ I would consider it a major step towards HLMI if I can specify an arbitrary logical system (_especially_ one that is very unlike a standard logical system) and the AI system can reason about it with relatively perfect accuracy (>95%). This would demonstrate that the system has fully encoded logical reasoning, and is ready to replace math grad students (haha). In all seriousness, this would be a critical development because it implies that you can give a specification (to some degree informal, of course) of your desires and have some high-level but still mathematically-formalizable expectations about what the AI will do with it. Effectively abstracting the behavior of components of systems is the foundation of scaling. Once you can reliably break up tasks into pieces that the AI can perform up to some spec, then you can compose them together and abstract hierarchies of specifications that will allow for the design of organizations of AI systems that mimic the kind of powerful abstract organization in programming and society. Whole "governments" of AI systems could operate autonomously with predictable behavior up to some requirements. This is already [possible to some extent](https://arxiv.org/abs/2303.17580), but with significant inherent limitations on abstraction and delegation.

## How Hard Is It To Avoid AI Doomsday? (aka The Alignment Problem)

Seems very hard.

I haven't given this question _as_ much thought; I believe that imminent AI Doomsday is unlikely, so I think we still have plenty of time to consider it. Additionally, I expect that the details of AI technology will change significantly in ways relevant to this question before AI Doomsday _does_ become imminent, so there's probably not much progress we can make on answering this question until we have much more advanced and understood AI technology.

## References

Below are some media on this topic that I recommend. One of the main reasons why I wanted to write this post is because much of the discussion of this topic I've seen seems very confused (or -- confusing to me perhaps), and so I want to put down my own thoughts so that I can get other people's pointed feedback and clearly track how my opinions change.

- [AiImpacts.org -- 2022 Expert Survey on Progress in AI](https://aiimpacts.org/2022-expert-survey-on-progress-in-ai/)
- [Robin Hanson -- current views on AI danger](https://open.substack.com/pub/overcomingbias/p/ai-risk-again)
- [Erik Hoel -- how to navigate the AI apocalypse](https://open.substack.com/pub/erikhoel/p/how-to-navigate-the-ai-apocalypse)
- [Tyler Cowen -- Existential risk, AI, and the inevitable turn in human history](https://marginalrevolution.com/marginalrevolution/2023/03/existential-risk-and-the-turn-in-human-history.html)
- [Tyler Cowen -- response to FLI letter](https://marginalrevolution.com/marginalrevolution/2023/03/the-permanent-pause.html)
- [Tyler Cowen -- against pausing AI development](https://www.bloomberg.com/opinion/articles/2023-04-03/should-we-pause-ai-we-d-only-be-hurting-ourselves)
- [Tyler Cowen -- response to ACX's response](https://marginalrevolution.com/marginalrevolution/2023/03/thursday-assorted-links-398.html)
- [Eliezer Yudkowsky -- (response to FLI letter) Pausing AI Developments Isn't Enough. We Need to Shut it All Down](https://time.com/6266923/ai-eliezer-yudkowsky-open-letter-not-enough/)
- [Eliezer Yudkowsky -- Lex Friedman podcast](https://overcast.fm/+eZyDo-AY0)
- [Eliezer Yudkowsky -- Lunar Society podcast](https://overcast.fm/+b53M_HRgo)
- [ACX -- predictions of AI apocalypse](https://open.substack.com/pub/astralcodexten/p/why-i-am-not-as-much-of-a-doomer)
- [ACX -- response to Tyler Cowen](https://open.substack.com/pub/astralcodexten/p/mr-tries-the-safe-uncertainty-fallacy)
- [Zvi -- response to Tyler Cowen](https://open.substack.com/pub/thezvi/p/response-to-tyler-cowens-existential)
- [Zvi -- reponse to FLI letter](https://thezvi.substack.com/p/on-the-fli-ai-risk-open-letter)
- [Zvi -- response to Eliezer Yudkowsky's TIME article](https://thezvi.substack.com/p/eliezer-yudkowskys-letter-in-time)

<!--
## Interesting Consequences of Sub-HLMI
TODO: move this to another article
-->
