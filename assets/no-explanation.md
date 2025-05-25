---
type: post
abstract:
  Is it possible, and under what circumstances, for there to be no valid
  explanation of a phenomenon?
categories:
  - philosophy
  - science
status: updated 2019/08/22
---

# No Explanation

## Introduction

Can some phenomena be so complex that there cannot be an _understandable_
explanation for it? If so, could systems like brains and economies harbor such
phenomena?

## Bar Code

In his 1991 paper
_[Real Patterns](https://ruccs.rutgers.edu/images/personal-zenon-pylyshyn/class-info/FP2012/FP2012_readings/Dennett_RealPatterns.pdf)_,
Dennet outlines a concrete challenge to the concept of _pattern_. He defines a
pattern of pixels called Bar Code where in each row, there is a repeating
occurence of 50 black pixels and then 50 white pixels. This Python program
generates all of the Bar Code instances that appear later, with adjustments to
the `noise` variable:

```python
from PIL import Image, ImageDraw
import random
random.seed()

noise = 0.1
stripeWidth = 50

width = 400
height = 200
image = Image.new('RGBA', (width,height), (0,0,0,0))
draw = ImageDraw.Draw(image)

black = (0,0,0, 255)
white = (255,255,255, 255)

for x in range(width):
    for y in range(height):
        value = None
        value = x % stripeWidth < stripeWidth/2
        if random.random() <= noise: value = not value
        color = black if value else white
        draw.point((x,y), fill=color)

image.save('barcode_noise={0}.png'.format(noise))
```

Simple enough. Here is a instance of Bar Code:

![](/assets/posts/no-explanation/barcode_noise=0.0.png)

Of course, this is a _perfect_ instance of Bar Code. That is, this instance has
no _noise_ that is not accounted for by the definition of Bar Code. Consider the
following image:

![](/assets/posts/no-explanation/barcode_noise=0.1.png)

This image is an instance of Bar Code with 10% random noise. The random noise is
generated in the following way: each pixel in a perfect instance of Bar Code has
a 10% chance of being flipped to the opposite color. Though the noise distorts
the predictions that Bar Code yields about each pixel, Bar Code still seems like
it can be a meaningful description.

The following array shows instances of Bar Code ranging in the amount of random
noise.

![](/assets/posts/no-explanation/barcode-array.png)

A phenomenon becomes clear: as the noise increases, Bar Code becomes a less and
less useful way to recognize the image. At 50% noise in fact, it is
mathematically equivelant to describe the image as "50% noise" as it is to
describe it as "Bar Code with 50% noise" (in terms of predicting pixel values).
At close to 50% noise, perhaps there is a better pattern than Bar Code at more
accurately describing the pixels.

Dennet uses this demonstration to show how the concept of patterns relies on
something beyond a priori definitions --- a pattern does not exclusively relate
to its perfect instances. Ultimately, Dennet argues that patterns can be
instantiated to varying degrees based on their _usefulness_ relative to the
ovserver. For example, patterns can present trade-offs in accuracy (how often
the pattern makes correct predictions) versus simplicity (how consisely the
pattern's definition can be stated and measured) that must be weighed relative
to the purpose for using the pattern.

My argument will be along similar lines, analogizing to the trade-offs made in
scientific patterns to build explanations at varying levels of abstraction.

## Levels of Abstraction

Fields of scientific study can be organized into a abstraction-tree, where the
leaves of the tree are the most precise and the deeper branches are abstractions
of their children. Imagine the following as one path in this tree, in order of
increasing abstraction: physics, chemistry, biology, psychology, sociology,
political science. I will use the step between physics and chemistry as a
canonical example. Chemistry is an abstraction of physics --- chemistry entirely
depends on and is predicted by physics, but does not consider all of the details
that physics considers.

Why? Because chemistry yields explanations at a higher level of analysis than
physics. When a chemist describes that a chemical reaction with certain
proportions of reactants, they do mean something translatable to the language of
physics. They importantly omit things like the mechanics and inner workings of
individual atoms in order to give a _simple_ explanation. It is simple because
it reduces the complexity of the calculations needed to make predictions about
the result of the reaction at chemistry's level of analysis.

If asked to make predictions about things like the tradjectories of individual
atoms, the chemical explanation is not much if at all better than random noise.
So in order to rise to a higher level of abstract terms, chemistry forgoes
explanatory power at lower levels like physics.

But why does chemistry consist of the abstractions that it does in fact consist
of? Many of the chemistry-abstractions, in fact, must contend with trade-offs
such as accuracy vesus simplicity. Many chemistry-abstractions have _exceptions_
that are unaccounted for in chemical terms and must be explained in physical
terms --- at the chemical leve, they are treated as unexplainable. This is
because the chemical terms sometimes forfeit explanatory power over the lower
level that are necessary for describing certain phenomena at the chemical level.
For example, perhaps a chemical reaction is affected by the quantum properties
of its contents. Quantum mechanical examplations are at a lower-level of
description that cannot mention chemistry-abstractions because the explanations
depends on properties of the referents of the chemistry-abstractions that are
left ambiguous.

The reason, however, that chemistry is successfully and meaningly separate from
physics is that chemistry-abstractions are _useful_ enough. Among other things,
chemistry-abstractions have enough precision and accuracy to be scientifically
pragmatic. If chemistry did not have these properties, it would probably follow
the fate of so many other proto-scientific fields that dwindled as exceptions
built up.

In chemistry so far, the abstractions have been useful enough. But it is
imaginable that one day (perhaps alread), there will be discovered some
phenomenon that no chemical explanation can give a better-than-noise account of.
This would have to be a phenomenon that exists at the level of chemical
analysis, yet has no explanation via chemical terms. There are two possible
solutions: take theory from physics in order to explain it (if there is such an
explanation), or introduce the explanation as an assumption.

## When There is No Explanation

But what exactly does something like this look like? Let's consider the example
of economics. Why does my bread cost $4? There may in fact not be a useful
explanation at the level of micro-economics.
