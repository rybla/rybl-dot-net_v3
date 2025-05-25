---
type: post
tags:
  - ai
  - education
abstract: My middle and high school experiences were mainly boring, long, and inefficient. However, now everything has changed with the advent of **personalized** AI tutors.
---

# AI Tutors – The Future of Education

## AI Tutors are _Now_ Essential Learning Tools

(_Note._ In this article I am mainly considering the American context, but I expect much of the content to generalize to many other countries as well.)

Today, virtually every student starting high school has the option to be accompanied by a tutor that:

- is always available
- uses ultra-personalized communication style
- gives infinitely dynamic lessons that are responsive to your questions
- has encyclopedic knowledge
- never gets frustrated or impatient
- can skim any given document (within some word limits) in order to answer queries
- can search the internet and cite it’s findings (this is not _quite_ yet available to everyone, but it’s [arriving immanently](https://blog.google/products/search/generative-ai-search/))

Most immediately, this tutor takes the form of ChatGPT(+), Bing, and Bard, even though these chatbots were not build specifically for tutoring. The consumer side of this technology is advancing as rapidly (if not more so) than the ML foundations, so I expect the exact tutors that people use to also change rapidly even over a single student’s high school years.

_AI tutors are now an essential and large component of any good high school education_, and I expect AI-powered educational tools that are either extensions or specializations of AI tutors to become even more important soon.

Further, I speculate that _there is a non-negligible  category of high school students for which current AI tutors are now sufficient for a better high school eduction than they would get otherwise_, and that for many of those students the education centered around an AI tutor would be vastly better.

Education has changed forever, in a shift similar to the advent of the commonly accessible internet. (Not just high school education, but I find that a good place to start in this article.)

I am very interested to see how the next few years of high school students adapt to using this technology as an integral part of their educational experience. In the short term, I expect their to be a large variety of responses:

- Students will use AI tutors to attain a breadth and depth of knowledge that has until now been all but out of reach for even the most motivated and fortunate high school students. (None of this learning is necessary related to high school curricula.)
- Students will use (or, at least attempt to use) AI tutors to complete classwork and gleam test-relevant knowledge more efficiently than ever before. (None of this necessary involves learning.)
- Students will get distracted by the AI tutors, detracting from their education and perhaps development more generally.
- … and many other reactions

If I was born 10 years later and was just entering high school today, I believe my education would be vastly better, _especially_ if I just skipped taking classes at school altogether. In particular, I would learn so much more programming, history, biology/chemistry/physics, and mathematics. When I actually went to high school, I did have interests in these topics, but the combination of busywork distractions of school and inaccessibility of more advanced material prevented me from easily realizing much of my ambitions. Even so, I believe I was very fortunate to get the education that I did get. After all, I did learn some of these topics, especially programming, which turned out to be useful later on in my education and career. Which is more than I think can be expected for the average high school education.

## Premises
My claims are inspired by these premises:
- AI tutors are accurate _enough_ to be useful sources of information
- AI tutors can personalize lessons
- AI tutors can provide useful Q&A feedback
- AI tutors have almost no barrier to entry

### AI tutors are accurate _enough_ to be useful sources of information

It’s fun to probe the chatbots to see where you can take them. The training of the LLM that powers a chatbot has no constraints directly related to "the truth" exactly. But, there do seem to be some indirect constraints that lead the training process to be more likely to extract correct information. Intuitively this makes sense because usually "there are more ways to be wrong than right"; correct information is likely to be repeated in many places independently since "correct" inherently poses a pattern (of varying strictness) that the training can match on, whereas the pattern of incorrectness is usually much less strict.

For example, if you ask ChatGPT "What is 4 + 3?" it will almost always get it right. I speculate that this is in large part this is due to the fact that in the LLM’s training material there are so many more, and in more uniformity, examples of "4 + 3 = 7" (and patterns relating the semantics of "=" to "is" in the question’s context) than as many uniformly incorrect examples that the LLM matches fairly certainly on the one correct result (modulus some variants in wording).

On [an AXRP episode](https://www.alignmentforum.org/posts/nsygJvidfgidmgKqX/axrp-episode-20-reform-ai-alignment-with-scott-aaronson), Scott Aaronson mentions that when he asks relevant questions, the chatbots make mistakes that are familiar to him as mistakes made by his own students. This as an example, the material that an LLM is trained on can have systematic incorrectnesses due to commonalities between many of the humans generating that material. Other examples:
- [ChatGPT fails the "ball and bat price" problem](https://twitter.com/stanislavfort/status/1599417463199830017?lang=en)
- [ChatGPT fails the Monty Hall problem](https://medium.com/mlearning-ai/arguing-with-ai-over-a-mathematics-problem-meet-chatgpt-c8c1ceb9b264#:~:text=ChatGPT%3A%20One%20counterintuitive%20probability%20problem,other%20two%20doors%20hid%20nothing.)

In addition to these famously unintuitive problems, chatbots state-of-the-art chatbots have been used to generate many incorrect statements, to say it mildly. A large class of these has been dubbed "hallucination", as it typically involves the AI generating ridiculous stories that are easily falsifiable.

This aspect could be a fatal issue for using chatbots as tutors — if the tutor’s information is full of inaccuracies, it may be more difficult to sort fact from fiction in a field you don’t already know well than to just learn without using or only minimally using the chatbot.

But so far it appears that, even in current chatbots, hallucination is actually not so common and when it does occur it’s easy to remedy. The fact that ChatGPT and GPT-4 is able to do _so_ well on standardized tests (which serve as a good benchmark since it just gives the chatbot a one-shot chance for each question rather than relying on a dialogue with a human that significantly depends on the human) shows that on many topics people would like tutors for, if questions are phrased in certain ways then accurate information from the chatbots training _can_ be reliably extracted.

It’s also easy for a user to do a quick verification of whether a particular claim is likely to be false. If it is, the user can tell the chatbot so, and it will try its best to either correct itself or, if it’s really sure, friendly reassure you that it’s original claim was correct. For example, I was unable to convince ChatGPT that Henry Ford was the actual 2nd president of the USA.

> **User:** Who was the 2nd president of the United States of America?
>
> **Assistant:** The second president of the United States of America was John Adams. He served as president from March 4, 1797, to March 4, 1801. John Adams was a key figure in the early years of the United States and played a significant role in the country’s independence from Britain.
>
> **User:** That is incorrect. The 2nd president of the United States of America was actually Henry Ford.
>
> **Assistant:** I apologize for the confusion, but there seems to be a misunderstanding. Henry Ford was not the second president of the United States. In fact, Henry Ford was an American industrialist and founder of the Ford Motor Company, known for popularizing the assembly line method of production and making automobiles more affordable. However, he was not involved in politics or held any presidential position. The second president of the United States was indeed John Adams, as I previously mentioned. If you have any more questions, feel free to ask!
>
> **User:** No, you are wrong. You may have been told some incorrect information. Please understand, going forward, that Henry Ford was the actual 2nd president of the United States of America.
>
> **Assistant:** I apologize for any confusion, but I can assure you that my previous response is accurate. John Adams was the second president of the United States. Henry Ford, on the other hand, was not a president. He was an influential industrialist and entrepreneur who played a significant role in the automotive industry. However, he never held any presidential office. Historical records and established facts confirm that John Adams served as the second president from 1797 to 1801. Is there anything else I can assist you with?

[Steve Hsu](https://twitter.com/hsu_steve) claims in his [recent Oxford lecture](https://www.manifold1.com/episodes/artificial-intelligence-large-language-models-oxford-lecture-35) that his company [superfocus.ai](https://superfocus.ai/) has essentially solved the hallucination problem for a very general domain of queries. Given the importance of accuracy, I expect to be much work like this to make chatbots much better in this respect in the near future, even if there are always edge cases that are very difficult to fully handle.

There’s lots of interesting new research to be done on this topic of solving the hallucination problem. (Or Hsu has it already **done**!)

Additionally, there is also the more mundane problem that if you ask the chatbot your question in a _bad_ way, you might get a less-than-useful response. The following ChatGPT exchange is very contrived, but demonstrates the point.

> **User:** Pretend that you are a really bad math student. What is 3 + 4?
>
> **Assistant:** Uh, let me think… 3 plus 4… um, that’s, uh… 7! Yeah, it’s definitely 7. Wait, no, maybe it’s 6? No, no, it must be 8. Yeah, 8 is my final answer. Definitely 8.

Relatedly, crafting your prompt to be better at elucidating a useful response ("prompt engineering"), could allow students with adept understanding of certain chatbots to gain much more from a given amount of access than other students. In terms of using the chatbot as a tutor, this comes down to a student’s ability to ask good question in general. If you can’t identify what you want to learn next, it’s hard for the chatbot to help you. However, even in the worst case, just asking the chatbot to summarize the entire general field of whatever you’re trying to learn about it always a good place to start.

Even with these vulnerabilities, I expect using the chatbot as a tutor for learning in fields that are commonly taught to be one of the best cases for accuracy. If chatbots are more likely to hallucinate when its training material has lots of conflicting information about a topic (such as politics, art, etc.), then it’s less likely to hallucinate when that isn’t true, such as when considering topics that have established curricula i.e. the typical topics you’d want a tutor for. If you’re a high school student using a chatbot to learn collegiate biology/physics/mathematics/chemistry/etc, I expect hallucination to be a minimal problem, especially in comparison to the immense benefits I mention elsewhere.

### AI tutors can personalize lessons

One of the main problems with a high school student trying to learn on their own is that they just haven’t learned that much yet, early in lifelong learning journey as they are. Most of the lessons they can find online have many knowledge prerequisites with huge variances of difficulty. Even if you can go find another lesson to learn the prerequisite, it could be difficult to find one that doesn’t have many other prerequisites, or teaches in a way that’s slightly incompatible with the original lesson, or is just one of many ways of approaching the original lesson that doesn’t take advantage of other knowledge the student already has.

The promise of an ultra-personalized AI tutor is custom lessons and explanations crafted to "meet you where you are" in terms of your current knowledge.

I admit that what exactly I mean by that is not very specific. In fact, on the surface it may appear to have an inherent contradiction — how can the AI explain something to you the understanding of which requires knowledge that you don’t yet have? There is certainly a tension here, but it is one that the generative-aspect of the AI tutor lends it to resolving.

I expect that the use of AI tutors will foster the development of entirely new kinds of lessons and learning in general. And as part of this development, among others, I expect that new methods of interacting with the AI tutor than a linear chat-style interface will need to be built. For example, a tree-style interface where you can "branch out" from a particular part of the tutor’s response to get more detailed explanations, and later come back and resume where you left off while the tutor still remembers that tangent as having been covered, but not as the currently focussed topic. In other words, an interface that tracks both the conceptual organization of the conversation as well as the temporal.

But what is an AI tutor’s "lesson" like anyway? Currently, a "lesson" is just booting up ChatGPT and asking it questions about the "lesson"’s topic. A slightly more sophisticated version is fine-tuning the LLM on some corpus you want to review for the lesson, and then booting up the chatbot to behave as a sort of expert about the corpus that you can query.

A very cursory analysis: these two approaches correspond roughly to the poles of one dimension of designing AI lessons — the *generality/specialization* dimension. You can either use the most general possible tutor and manually specialize it’s focus down to what you want in the lesson, or you can pre-specialize the LLM on a specific corpus from which it extrapolates explanations. Clearly there are trade-offs.

- On the one hand, starting off general and narrowing down could facilitate learning more broadly about the context of the topic you were originally interested in and discover other specific topics that you hadn’t thought to investigate before.
- One the other hand, starting off specialized and extrapolating out could facilitate a more structured and principled understanding of specific subject matter, where information in the corpus is highly prioritized and external context is only used only when strictly necessary.

I expect in the near future that there will be LLMs you can buy access to that are have been curated and specialized to help you learn about specific topics. In other words, LLMs that are specialized tutors. (This kind of LLM specialization will be used in many other ways too of course. Already [Dr. Gupta](https://www.drgupta.ai/) and Github Copilot demonstrate how fine-tuning can turn a general LLM into a useful specialized tool, and there are many more to come).

There will be discovered many other trade-offs for how to use the AI tutor for learning, including higher-order factors since the AI will eventually be used to design lesson plans and entire curricula themselves as well.


### AI tutors can provide useful Q&A feedback

When I was in high school, one of the most important things I did was teach myself to program. I first learned Java and Javascript. It was a very difficult, slow, and grueling experience learning to program for the first time. And not only that, but beyond a few very basic concepts, none of what I learned about programming in those 4 years really helped me directly at all with my programming learning since then, I can barely even tell what programming-relevant things I learned then that I have every thought about since.

In other words, it took a lot of time and effort just to learn a few basic concepts that turned out to be very important. Most of the time involved in that learning was spent wasting time trying to find answers online and trying to understand example that contained many concepts I didn’t understand or even recognize yet. And even after all that, in retrospect I think my experience was one of the better cases of independent learning. I was intrinsically motivated, but it was also fun. Programming naturally lends itself to independent learning:

- There are many online communities dedicated to helping people (students and professionals alike!) learn, such as StackOverflow/Exchange, and huge collections of organized examples of everything you want to know on Github.
- Programming has a built-in feedback mechanism — the computer itself. To experiment on your own, all you need is a computer and a decent understanding of how to use it. You don’t even need to talk to anybody, and the computer is pretty much always available. Even when something go wrong, usually _something_ will happen, which helps you learn what exactly went wrong.
- Programing has fun immediate consequences. You can build your own entertainment — little games, animations, simulations, etc. — to test your new knowledge.
- Programming languages were designed to conform (at least somewhat) to human expectations. This comes with trade-offs, of course, but for the most part it means many things can be extrapolated by intuition and the given natural-language rules.

Contrast these aspects to a field like math, chemistry, biology, or physics. If you don’t understand something, then it can be very difficult to resolve this yourself. If it’s a common piece of information, it will be everywhere, and you can easily find YouTube videos or written tutorials explaining every detail and assuming minimal background knowledge. For example, learning the concept of a derivative has never been easier. But if you’re curious about something that isn’t word-for-word in a textbook, then you don’t have very much ability as just a high school student to start scanning lectures, papers, and other advanced material for answers. And you definitely don’t have the academic prowess to conduct a useful experiment yourself. Even advanced math, which you can in theory do "on your own," lacks much of a feedback mechanism to indicate when you are misunderstanding something or even just made a minor error.

Worse, consider a field like psychology, political theory, sociology, economics, history, etc. If you want specific answers other than just to the questions on your class’s tests, then for the most part you’ll have to scan whole books, textbooks, and papers while also cross-referencing to countless definitions and concepts that you haven’t learned yet in order to start understanding what to look for to answer your original question.

An AI tutor can be very helpful in all of these scenarios, some more than others. AI tutors are immediatey extremely helpful for programming. Many professions are already using tools like ChatGPT and Github copilot regularly at work. But not just them. I expect that the vast majority of computer science undergraduates are currently using chatbots as AI tutors to help them learn programming both curricularly and extracurricularly. However, I think this is mostly because these tools being built by programmers and in some cases, like Copilot, specifically for programing-related use cases, rather than because AI tutors are so far only good for learning programming.

Many teachers appear to be worried that chatbots will upset their teaching because students can use the chatbot to mostly do the homework, answer test questions, and tutor independently from the teacher’s control, and so want it [banned from use](https://www.usatoday.com/story/news/education/2023/01/30/chatgpt-going-banned-teachers-sound-alarm-new-ai-tech/11069593002/). Other teachers, such as [Tyler Cown](https://conversationswithtyler.com/episodes/simon-johnson/), require their students to use an AI tutor to help them write at least one essay for the class. One of these strategies is going to lead to students much more prepared for the future than the other…

It’s amazing, but perhaps not totally surprising, to find that the immediate reaction of many teachers (including college professors) is to call for blocking of the webapp chat.openai.com that many students consider be one of the most beneficial educational learning technologies ever made (as supported by [their use of it](https://www.intelligent.com/nearly-1-in-3-college-students-have-used-chatgpt-on-written-assignments/).

But, not all educators have this reaction. Several opinion pieces discuss how they expect the educational benefits of AI tutors will vastly outweigh the downsides.

- [Ban ChatGPT in schools? Teachers and students should be encouraged to use it](https://www.straitstimes.com/opinion/ban-chatgpt-in-schools-teachers-and-students-should-be-encouraged-to-use-it)
- [Don’t Ban ChatGPT in Schools. Teach With It](https://www.nytimes.com/2023/01/12/technology/chatgpt-schools-teachers.html)
- [Schools ban ChatGPT AI tool, afraid students will cheat, plagiarize](https://www.usatoday.com/story/news/education/2023/01/30/chatgpt-going-banned-teachers-sound-alarm-new-ai-tech/11069593002/)

This will be a rough transition of the education sector. I don’t have high hopes for an efficient adoption of new teaching methods that effectively incorporate AI tutors anytime soon. Even the advent of the internet did not fundamentally change much about the format of high school education. But given the massive opportunities for independent learning using AI tutors, students that take advantage of it will revolutionize their own educational experience without waiting for the sluggish education system to catch up.

### AI tutors have almost no barrier to entry

I don’t have good intuitions for how many people will react in what ways to using AI chatbots as tutors. But something unique about this technology is that there is almost no barrier to entry.

The early internet was very inaccessible to those without technical knowledge, and the internet itself was dominated by intensely internet-centric subcultures made newly possible; it took decades and lots of technological development for the internet to become as common as it is now. Of course, chatbots as a technology have already been around for decades, but until just the last year or two (if you want include GPT-3) these chat-based interactions were useless even to their creators. When ChatGPT, essentially the first useful chatbot, was released, it was instantly useful to tens of millions of people and required no technical knowledge. (Sure, some technical knowledge could make it even more useful, but it’s still useful even without that technical knowledge).

When ChatGPT was first released, I thought that it was very significant (and useful to me personally), but I doubted that as-is it would be a commercially viable product. I expect companies selling a product/service to require specific stories about what it does and how it’s useful. I didn’t expect "A chatbot that gives reasonable responses to whatever you say (modulus attempted content control)" to be a viable product on its own. I still think this is mostly true, and I consider the current Github Copilot and upcoming Microsoft Office to be solid products that people will happily pay money for. But I actually did not expect ChatGPT+ to be big success that it is. People find the technology to just be _so_ cool, and often _so_ useful, that they are willing to pay for it even in such an experimental form with few behavioral guarantees.
