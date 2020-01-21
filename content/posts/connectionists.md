+++
title = 'Ad blockers, symbolists and connectionists'
slug = 'post'
image = 'img/connectionist_symbolist.png'
date = "2020-01-02T00:00:00"
description = 'About symbolic and connectionist AI and how each approach coud be applied for an ad blocking problem.'
disableComments = true
+++
This holiday season there was a decent amount of discussion in the AI community between symbolists and connectionists. It was largely triggered by a debate between Garry Marcus vs Joshua Bengio. The whole debate got me thinking about the differences of the two approaches in relation to ad blocking.

First, some context. Symbolism and connectionism are two different views on AI. Each has its own pros and cons, so one isn't strictly better than the other. It would be useful to understand core differences between the two, to understand my point here. So below I will try to outline how I treat the two terms, and then move on to explaining what this has to do to ad blocking.

Symbolism, unlike the name might suggest, does not have anything to do to a French poet Baudelaire and co, but rather means something more nerdy here. Symbolism was a prominent AI movement in the 80s, 90s, and some 2000s, which operated under assumption that knowledge can be represented using symbols and operations on those symbols. Roughly speaking, a programmer just has to think through the problem and figure out the correct abstractions needed to solve a problem and then treat those abstractions as symbols, defining operations on them. For example, a programmer can define that "Zoe is Bob's mother", "Joe is Bob's father". With that, such a simple system could then answer a question "Who are the parents of Bob?". It makes sense, it is what I studied as AI at my university and there was some success with it in writing expert systems. However such a system often is very hard to implement, as it is a complicated task to really write rules to most of the things we want to solve with AI. Even in the example above, you might have written a rule in your system like "Parents are mother and father of Bob", however in a real world that isn't always what parents are. It gets even harder if you try to describe what makes something a cat or a dog. Gary Marcus famously quotes a research where they have tried to define what a physical container is. That paper is 60 pages long.

Comparing to symbolism, connectionism is a capitulation. It is about admission that there is no way we can define some things with symbols. 