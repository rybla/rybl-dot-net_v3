---
type: post
tags:
  - economics
status: updated 2020/11/13
abstract: Dominant assurance contracts are an interesting solution to many collective action problems. A DAC asks an agent to pledge a donation towards a collective action to be paid if any only if enough other agents also pledge, and promises to pay the agent if not enough other agents pledge. Such a contract can yield opting-in as a dominant strategy even when an agent expects other agents not to opt-in; free-rider incentives are removed by the assurance that no one benefits if any agent opts-out, and payment incentivizes pessimistic agents to opt-in anyway.
---

# Dominant Assurance Contracts

## The Problem of Providing Public Goods

TODO

## The Two Sides of Prisoners' Dillemas

Let's consider the town of Perindale. There is a proposal to construct a public
garden in downtown Perindale, and the mayor is planning on how to faciliate
this. The mayor has two important restrictions:

- the mayor cannot _exclude_ anyone from enjoying the garden (it's supposed to
  be in a public garden, after all)
- the mayor cannot _force_ anyone to help construct to garden
- the mayor must ask the same donation amount from each resident

So, how can the mayor best recruit people to construct the garden?

Additionally, for the sake of simplicity, let us assume the following (which can
be relaxed later):

- There are $$ n $$ residents of Perindale.
- Each resident gains $$ X $$ utility from the garden being constructed
- All the residents are the same with respect to factors influencing the funding
  and construction of the garden
- Constructing the garden costs $$ C $$ utility.
- The garden cannot be constructed partially; if not turned into a garden, the
  lot will be bought by an out-of-town euntrepenuer and turned into a private
  helicopter landing pad, from which residents get $$ 0 $$ utility.
- Each resident acts perfectly rationally (i.e. maximizes expected utility based
  on their beliefs).

### Proposal 1: Simple Donations

The first idea that comes to the mayor's mind is to simply ask Perindale
residents to donate $$ D $$ utility each, where $$ D \leq C/(n - 1) $$ i.e.
the garden would still be constructed if one resident decided not to contribute
(we shall consider the case $$ D = C/(n-1) $$ in the next section).
Additionally, $$( D < X $$) i.e. each resident's donation would be smaller
than the amount they value the garden.

Since each resident gains $$ X $$ utility from a constructed garden and is
being asked to donate $$ D $$ utility, each resident is in the same position
with respect to deciding what to do. So, the mayor asks an aribtrary resident,
Jo, how they would decide, and then generalizes this result to all residents.

Jo will decide what to do based on their beliefs about the outcome given
everyone's actions. Since all the residents are the same, Jo can expect one of
two situations:

1. Every other resident donates
2. Every other resident refrains

The table below shows the utility payoffs to Jo and the other residents given
Jo's desicion (leftmost column) and the other residents' desicion (topmost row).

$$
\begin{array}{c|c|c}
  \textbf{Jo}, \textbf{others} & \textbf{others donate} & \textbf{others refrain} \\
  \hline
  \textbf{Jo donates} & X - D , (n-1) (X - D) & -D , 0 \\
  \hline
  \textbf{Jo refrains} & X , (n-1) (X - D) & 0 , 0
\end{array}
$$

Then, Jo decides as follows, there are two cases for what Jo believes and so how
they will decide:

1. Suppose that Jo believes that every other resident will donate. Then Jo
   decides not to donate since $$ X \geq X - D $$ i.e. Jo still recieves the
   utility of the constructed garden without having to pay. Here, Jo is a _free
   rider_.
2. Suppose that Jo believes that every other resident will refrain. Then Jo
   decides not to donate since $$ 0 \geq -D $$ their donation will only go
   towards a partial garden that is worth $$ 0 $$ utility.

The mayor realies the tragic situation (more specifically, _prisoner's
dillemma_): in either case, Jo decides not to contribute. And since Jo is an
arbitrary resident, this implies that every resident acts like Jo, and thus no
resident contributes. The garden will not be constructed by this simple
donations proposal.

Altogether for this proposal: refraining is a **dominant strategy** since there
is always an incentive to refrain.

As shown in Jo's reasoning, there are two sides to this tragedy:

1. Jo is able to free-ride when the other residents donate
2. Jo won't donate when they know the garden won't be constructed anyway

The following proposals 2 and 3 will cumulatively remove these malincentives:
assurance contracts prevent free-riders, and dominant assurance contracts
additionally incentivizes pessimistic residents to still donate.

The mayor thanks Jo, and returns to their office to think up the new proposals.

### Proposal 2: Assurance Contracts

To tackle the free-rider problem, the mayor needs to write up a contract that
removes the incentive for Jo to not contribute if Jo believes that the other
residents will contribute. Additionally, the mayor wants to avoid wasting
resources. So, they write up the following **assurance contract**:

> I promise to donate $$ D $$ utility if and only if every other resident also
> signs this contract. Otherwise, I refraine from donating.

The mayor consults Jo again, asking what they would do with this proposal. Jo
has the same two possible situations to expect:

1. Every other resident promises (signs the contract)
2. Every other resident refrains

The table below shows the new utility payoffs to Jo and the other residents'
desicions.

$$
\begin{array}{c|c|c}
  \textbf{Jo}, \textbf{others} & \textbf{others promise} & \textbf{others refrain} \\
  \hline
  \textbf{Jo donates} & X - D , (n - 1) (X - D) & 0 , 0 \\
  \hline
  \textbf{Jo refrains} & 0 , 0 & 0 , 0
\end{array}
$$

Then, Jo decides how to act based on their belief:

1. Suppose that Jo believes that every other resident will promise. Then Jo
   decides to donate since $$ X - D \geq 0 $$ i.e. Jo prefers to donate and
   then enjoy the garden over getting nothing.
2. Suppose that Jo believes that every other resident will refrain. Then Jo is
   indifferent between donating and refraining since both given them a payoff of
   $$ 0 $$.

The mayor has made some progress! There will never be free riders since it is
strictly better to donate than refrain when Jo believes that others will donate.
Additionally, Jo is not disincentivized from donating when other refrain.
However, Jo is only indifferent here i.e. Jo is not strictly better off when
they donate rather than refrain.

Altogether for this proposal: promising is a **weakly dominant strategy** since
there is never a disincentive from promising.

The mayor still hopes to do better. Not wasting utility was a good move, but
even one pessimistic believer in the whole town results in no garden. In fact,
if even one resident forgets to sign the contract then there will be no garden!
That is where the weakness in "weakly dominant strategy" comes in. The mayor
thanks Jo again and returns to their office for, hopefully, a final draft.

### Proposal 3: Dominant Assurance Contracts

Ideally, the mayor wishes that each resident always be actively incentivized to
donate, not just indifferent about it, and even if they are pessimistic about
the others. In other words, that donating is a dominant strategy. The mayor
thinks for a while, and finally writes the following contract:

> I promise to donate $$ D $$ utility if and only if every other resident also
> signs this contract. Otherwise, I donate $$ 0 $$ and the mayor pays me $$ F
> $$ utility.

Where $$ D \leq C/n $$ i.e. the garden is still constructed if just one
resident decides not to sign.

The mayor reflects on the contract, it does feel a little risky. If enough of
the residents decide not to sign, then the mayor will be losing money by having
to pay out to those that did sign, and still no garden will be constructed.
Nevertheless, the mayor has a hunch that the details work out in everyone's
favor in the end.

The mayor finds Jo and presents the new contract. Jo follows the same method of
consideration from earlier, where the table below shows the new utility payoffs.

$$
\begin{array}{c|c|c}
  \textbf{Jo}, \textbf{others} & \textbf{others promise} & \textbf{others refrain} \\
  \hline
  \textbf{Jo promises} & X - D , (n - 1) (X - D) & F , 0 \\
  \hline
  \textbf{Jo refrains} & 0, 0 & 0 , 0
\end{array}
$$

Jo considers the new circumstances, and explains his updated belief-dependent
desicions:

1. Suppose that Jo believes that every other resident will promise. Then Jo
   decides to donate since $$ X - D > 0 $$ i.e. Jo prefers to donate and then
   enjoy the garden over getting nothing.
2. Suppose that Jo believes that every other resident will refrain. Then Jo
   decides to donate since $$ F > 0 $$ i.e. Jo opts in to be paid by the mayor
   since the garden isn't going to be constructed anyway.

"Aha!" the mayor exclaims. Jo concedes that this proposed contract, no matter
their beliefs, yields a situation where Jo is always incentivized to sign. Since
every other resident will also follow this logic, this implies that every
resident will sign! And so the garden is garunteed to be fully funded.

Even though the mayor had to include a clause about paying $$ F $$ to signers
when there aren't enough signers, the mayor can expect this situation never to
arise as long as the residents of Perindale are true to their perfect
rationality.

## Dominant Assurance Contracts

TODO: generalized definition and justification

## Complications

All about deciding the optimal value of $$ F $$.

### Buffering

TODO: How to account for a certain number of agents deciding not to sign anyway?
TODO: Avoiding sel-fulfilling negative beliefs

### Incomplete Information

TODO: How to account for agents having incomplete information about their peers?
And probabilistic beliefs

- some graphs from Tabarrok

### Differentiated Evaluations

TODO: How to account for when agents have different evaluations of the public
good

### Privatization

TODO: What if a private firm hosts the DAC instead of the mayor? Where the firm
earns profits from the surplus donations.

- competition between firms will drive down required donations

## Glossary

Some simple definitions and explanations of the formal terms used relating to
public goods and collective action.

### Goods

A **non-excludible good** is a good that cannot have its enjoyment limited to
specific consumers. _Examples:_ national armies, outdoor air, TODO.

A **non-rivalrous good** is a good for which its enjoyment by some consumers
does not decrease the amount it can be enjoyed by other consumers. _Examples:_
intellectual property, blogs, national armies, street lights.

A **public good** is a good that is **non-excludible** and **non-rivalrous**.
_Examples:_ national armies, ideas, outdoor air, vistas, public parks,

A **free rider problem** is a collective action problem of funding a **public
good** when agents have the ability to opt-out of paying and still enjoy the
good. A **free rider** is an agent that decides not to pay towards funding the
public good, yet still enjoys the public good to the same extent as other agents
that did decide to pay. _Examples:_ funding many public services like parks,
armies, etc.

### Collective Action Problems

A **collective action problem** is a problem of coordinating agents to cooperate
when there are incentives for each agent to defect, and if too many agents
defect then every agent is worst off. Three popular classes of collective action
problems are **free rider problems**, **tragedies of the commons**, and
**prisoners' dillemas**.

A **tragedy of the commons** is a collective action problem of rationing a
public good that, while non-rivalrous at reasonable levels of use, becomes
rivalrous over a certain volume of use. The **tragedy** is that each agent has
an incentive to use the public good a reasonable amount on their own, but too
many agents deciding to do so overuse the good. _Examples:_ rationing use of
public parks, lakes, air quality.

A **prisoners' dillema** is a collective action problem where cooperating agents
are well off, defecting agents are the best off when there are enough other
cooperating agents, if too many agents defect then all agents are the worst off,
and no communication between agents is allowed. (Note that a free rider problem
without communication is a prisoner' dillema.) The name is inspired by the
following story:

> Two prisoners, A and B, are on trial for a bank robbery they comitted as
> partners. They are put into seperate rooms and each offered the same options:
> (cooperate) recieve the standard sentence of 2 years, or (defect) reveal
> evidence incriminating your partner to increase their sentence by 3 years, and
> decrease your sentence by 1 year

For each scenario, the sentences (in years) are arranged below. The entry "x, y"
represents that prisoner A gets a sentnce

$$
\begin{array}{c|c|c}
  \textbf{A}, \textbf{B} & \textbf{cooperate} & \textbf{defect} \\
  \hline
  \textbf{cooperate} & 2 , 2 & 5 , 1 \\
  \hline
  \textbf{defect} & 1 , 5 & 4 , 4
\end{array}
$$

The prisoners have no opportunity to communicate before making their desicions,
since they are in separate cells. From the table above, it is clear that the
prisoners are best off in total if they both cooperate: they recieve sentencings
of 4 years totaled between then.

Yet, consider the ways that each prisoner considers their partner. If one knows
that the other will cooperate, then it is best for one to defect and recieve 1
year instead of 2. Alternative, if one knows that the other will defect, then it
is best for one to defect and recieve 4 years instead of 5. So, it is inevitable
that, whatever either prisoner believes of the other, the best option for each
is to defect. This is a problem because even though there exists the best option
overall to both cooperate, perfectly-rational prisoners will never obtain it.

### Assurance Contracts

An **assurance contract** is a contract between a population of agents where
each agent pledges to contribute towards an action if at least a certain amount
is pledged in total. Examples: [escrow](https://en.wikipedia.org/wiki/Escrow),
certain kinds of [crowdfunding](https://en.wikipedia.org/wiki/Crowdfunding).

A **dominant assurance contract** is an assurance contract between a population
of agents where agents are promised a compensation in case when the contract
fails to facilitate the target action, in such a way that yields agreeing to the
contract as a dominant strategy. Dominant assurance contracts were primarily
introduced in Tabarrok's "[The private provision of public goods via dominant
assurance contracts](https://mason.gmu.edu/~atabarro/PrivateProvision.pdf)."

## Bibliography

- Amoveo Editor, 2019. [Amoveo use-case: Crowdfunding via a Dominant Assurance
  Contract (DAC)](https://medium.com/amoveo/amoveo-use-case-crowdfunding-via-a-dominant-assurance-contract-dac-1be3482e7792).
- Guerra-Pujol F, 2018. [Nozick, Tabarrok, and Dominant Assurance
  Contracts](https://priorprobability.com/2018/07/27/nozick-tabarrok-and-dominant-assurance-contracts/)
- Michel M, 2019. [Crowdsourcing the Public Good: Dominant Assurance
  Contracts](https://commonwealth.im/edgeware/proposal/discussion/101-crowdsourcing-the-public-good-dominant-assurance-contracts).
- Tabarrok A, 1998. [The private provision of public goods via dominant
  assurance contracts](https://mason.gmu.edu/~atabarro/PrivateProvision.pdf).
- Tabarrok A, 2013. [A Test of Dominant Assurance Contracts](https://marginalrevolution.com/marginalrevolution/2013/08/a-test-of-dominant-assurance-contracts.html).
- Tabarrok A, 2017. [Making Markets Work Better: Dominant Assurance Contracts
  and Some Other Helpful Ideas](https://www.cato-unbound.org/2017/06/07/alex-tabarrok/making-markets-work-better-dominant-assurance-contracts-some-other-helpful).
- Taylor J. [Dominant Assurance Contracts with Continuous Pledges](http://jessic.at/writing/dac.pdf)
