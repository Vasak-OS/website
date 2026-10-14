---
Title: "How we use (and don't use) AI assistance in VasakOS development"
seotitle: "How we use AI at VasakOS: rules and responsibility"
tags: ["vasakos", "artificial intelligence", "ai", "development", "transparency"]
date: "2026-10-14"
img: "/img/posts/ia-vasakos.svg"
description: "How we use AI assistance at VasakOS: what we do, what we don't, why the code stays a human responsibility, and how you can help."
weight: 10
layout: post
---

*Transparency about tools, limits and human responsibility*

In VasakOS, the code that reaches the repositories is the responsibility of people.

We use assistance tools (including language models) at some stages of the work, but under clear rules. This article explains exactly what those rules are, so anyone can know what to expect from the project.

---

# Why we talk about this

There is a legitimate rejection, in part of the Linux and free software community, of the use of generative AI. The criticism usually centres on:

- Code published without real understanding
- Technical debt that is hard to maintain
- Licence and provenance problems
- A loss of quality and of responsibility

We share several of those concerns. That is why we prefer to be explicit from the start, instead of letting it be assumed or discovered later.

# What we do

We use AI assistance in a limited way, always subordinate to human judgement. Some concrete examples:

- Exploring ideas or possible approaches to a problem
- Generating initial drafts of documentation or comments
- Suggesting names, structures or refactors that are then reviewed and rewritten
- Helping to understand someone else's code or to look for a possible cause of a bug
- Drafting explanatory texts (such as this very article) that are later edited and validated

Under no circumstance does a model's output automatically become project code.

# What we don't do

- We don't merge AI-generated code without a full human review.
- We don't accept pull requests whose author cannot explain and defend what they are sending.
- We don't use models to "pad out" features that nobody on the team understands.
- We don't hide the use of these tools when it is relevant.
- We don't present assisted work as if it were purely human when it isn't.

If someone sends a change and cannot answer clearly to "why is it written this way?" or "what happens if this case fails?", the change is not accepted, wherever the initial suggestion came from.

# The criterion that matters: responsibility

The most important rule is simple:

> Whoever proposes a change is responsible for that change. They have to understand it, be able to maintain it and answer for it.

The tool used to get to that change is secondary. What counts is whether a person on the project (or an external contributor) takes on the technical and maintenance responsibility.

This applies both to the core team and to anyone who sends a pull request.

# How it translates into practice

1. All code goes through review.
2. Real understanding is expected, not just "it compiles and seems to work".
3. Long-term maintainability is prioritised over delivery speed.
4. If a change introduces unnecessary complexity or hard-to-follow patterns, it is rejected or rewritten, even if the original idea came from an automatic suggestion.

We prefer to move more slowly, with code we can sustain, than to move fast with things nobody on the team fully masters.

# Communication and social media

VasakOS currently has a single full-time developer. We have no communication team and no people dedicated to managing social media, announcements or the project's public presence.

For that reason, much of the social media text, announcements and releases is drafted with AI assistance and then reviewed before being published. It is a practical decision: we prefer to keep a minimal, coherent presence rather than disappear from the channels for lack of time.

This does not change the project's main rule. The code is still a human responsibility. Communication, on the other hand, is an area where assistance lets us keep existing publicly while the team is this small.

# About quality, licences and technical debt

We are aware of the risks:

- Models can invent APIs, use obsolete patterns or generate subtly incorrect code.
- The exact provenance of the training data of many models is not transparent.
- Code that "works" but that nobody understands becomes expensive technical debt.

That is why we treat any AI suggestion with the same (or greater) scepticism as a contribution from someone unknown. It is reviewed, tested, discussed and, if necessary, rewritten entirely.

# We need you

If you made it this far and the project interests you, there are many ways to help that do not require being a developer:

- Testing the ISOs and reporting problems
- Improving or translating the [documentation](/en/docs/)
- Reviewing and commenting on issues
- Helping with design, icons or visual material
- Managing or moderating community channels
- Writing or reviewing announcements and content for social media

Every bit of help counts. The more people get involved, the less we will need to lean on automatic tools to keep the project alive and visible. The [list of profiles we are looking for](/en/blog/2026/03/we-are-looking-for-contributors-to-vasakos/) is in the call for contributors, and the rules for sending changes are in the [contribution guide](/en/docs/devs/contribution/).

You can start with the repositories on [GitHub](https://github.com/Vasak-OS), the [Telegram](https://t.me/VasakOS) or [Discord](https://discord.gg/7wKrVNBC) channel, or simply by opening an issue with an idea or a problem.

# Closing

VasakOS is built in public, with open repositories, open issues and visible decisions. The [state of the project](/en/state/) is updated with every release. The use of assistance tools does not change that: the code we publish is still the responsibility of those who review and accept it.

If you have doubts, criticism or want to propose improvements to these rules, the place to talk about it is the usual one: the [repository issues](https://github.com/Vasak-OS) or the community channels.

The goal is not to convince anyone that AI is good or bad. It is to make clear how we work.
