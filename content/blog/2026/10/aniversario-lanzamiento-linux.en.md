---
Title: "35 years ago Linux 0.02 launched: the kernel that made VasakOS possible"
seotitle: "Linux release anniversary: 35 years of the kernel | VasakOS"
tags: ["linux", "anniversary", "kernel", "vasakos", "open-source", "arch-linux", "wayland"]
date: "2026-10-15"
img: "/img/posts/linux-35.svg"
description: "This October marks 35 years since the official Linux release (0.02, October 5, 1991). Discover how that small kernel made VasakOS on Arch Linux possible."
weight: 10
layout: post
---

This October marks **35 years since the official Linux release**. Not the announcement —we already told that story in [August](/blog/2026/08/linux-35-aniversario/)— but the moment Linux went from a promise to something you could **download, compile and run**.

The timeline is short but decisive:

- **August 25, 1991**: Linus Benedict Torvalds, a 21-year-old student in Helsinki, posts to `comp.os.minix` that he is building a free operating system *"just as a hobby"*.
- **September 17, 1991**: version **0.01** appears on a university FTP server. Only a few hundred people download it, with no formal announcement.
- **October 5, 1991**: Linus publishes version **0.02**. This time there is a real announcement, with release notes and a clear invitation to try it and report bugs. History remembers it as the **first official public Linux release**.

Three dates, three steps: the announcement, the loose code, and finally **a real release**.

## October 1991: when Linux could be tested for the first time

Version 0.02 was tiny by today's standards: it ran only on **386 processors with an AT bus**, needed Minix to compile, and Linus himself warned that much was still missing. But it brought something 0.01 lacked: **the intent to build a community**.

The October 5 message did not just say *"here is the code"*. It said *"try it, tell me what is broken, tell me what you would like to see"*. It shipped with a ported shell, basic utilities and support for more hardware. For the first time, someone outside Helsinki could download Linux and feel they were **taking part in something**, not just watching.

That gesture —release early, ask for feedback, iterate in public— became kernel culture. And 35 years later, it is still our culture at VasakOS: if you tried [Beta 1](/blog/2026/10/beta-1-lanzamiento/), you know exactly what we mean.

## Why did Linux make VasakOS possible?

Because VasakOS is not just "compatible with Linux". **VasakOS *is* Linux**: our own desktop built on the same kernel born in October 1991. Without each of these decisions from 35 years ago, our project would not exist:

- **The free kernel**: Linus chose the **GPLv2** license. That means anyone can use, study, modify and redistribute the code. We use it as is, no permission or license fees needed.
- **Open development**: the kernel now exceeds **36 million lines** with contributions from over **2,000 developers per cycle**. Every release —every 9 to 10 weeks— brings support for new hardware that reaches us for free.
- **The Arch Linux base**: we chose Arch because it is *rolling release*. When a new kernel lands upstream, it reaches you in days, not six months. You can follow that pace on our [project status](/state/) page.
- **Modern graphics with DRM/KMS**: our Wayfire compositor runs on the kernel's modern graphics API, with no X11 layers in between. Truly native Wayland, straight to the hardware.
- **Hardware that just works**: Wi-Fi, GPU, audio, Bluetooth, laptop sensors. All of it is written and maintained by kernel developers and projects like Mesa.
- **The full stack on top of Linux**: **systemd** (boot and services), **PipeWire** (audio and video), **Mesa** (3D graphics), **GTK4** (interface) and our **Rust + Tauri** apps with **Vue.js** and **Tailwind CSS** interfaces all run on the system calls Linus started implementing in 1991.

In short: when you install VasakOS from [/downloads/](/downloads/), you install a direct descendant of that 0.02. The same kernel that today powers **96 % of web servers**, **100 % of the TOP500** supercomputers and over 3 billion Android devices.

## Thank you to everyone who made it possible

To **Linus Torvalds** and the kernel maintainers who have carried the project for decades. To the **Arch Linux**, **Wayfire**, **Tauri**, **Vue.js**, **Tailwind CSS**, **WirePlumber**, **systemd**, **Mesa** and **GTK** teams, whose upstream work we rely on every day.

And to our own people: the **VasakOS team** and the **community** that tests ISOs, reports bugs with full logs, translates strings, writes docs and answers questions in the group. Every well-written bug report is a direct heir of that *"try it and tell me"* from October 1991.

## Join the story

The best way to celebrate this anniversary is to do what Linus asked 35 years ago: **try, share feedback and build**.

- **Test and report**: grab the Beta, use it and tell us what breaks on [GitHub](https://github.com/Vasak-OS).
- **Write code**: read our [contribution guide](/docs/devs/contribution/) and pick an issue labeled `good-first-issue`.
- **Translate, document, design**: it is not all Rust. The docs at [/docs/](/docs/) and the translations need hands too.
- **Talk to us**: find us on [Telegram](https://t.me/VasakOS), where the community shares screenshots, questions and ideas.

And thank you to those who keep the project going with their contribution at [/donate/](/donate/): every bit keeps this work alive.

---

**What was your first contact with Linux?** An Ubuntu CD, a server, a Raspberry Pi, Android without knowing it, or VasakOS itself? Tell us on [Telegram](https://t.me/VasakOS) or [GitHub](https://github.com/Vasak-OS). We love reading those stories.
