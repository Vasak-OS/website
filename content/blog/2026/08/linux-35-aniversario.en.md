---
Title: "35 years of Linux: the hobby that changed the world"
tags: ["linux", "anniversary", "kernel", "torvalds", "history", "open-source"]
date: "2026-08-25"
img: "/img/posts/linux-35.svg"
description: "35 years of Linux: on 25 Aug 1991 Linus announced his hobby. Today it powers 96 % of servers, Android and VasakOS."
weight: 10
layout: post
---

Today, 25 August 2026, marks **35 years** since a 21-year-old student in Helsinki posted to comp.os.minix:

> *Hello everybody out there using minix-*
>
> *I'm doing a (free) operating system (just a hobby, won't be big and professional like gnu) for 386(486) AT clones.*

That message, signed **Linus Benedict Torvalds**, announced what we now call Linux. No one —not even him— imagined that this «hobby» would end up powering:

- **96 % of the world's web servers**
- **Every Android smartphone** (over 3 billion devices)
- **100 % of the TOP500 supercomputers**
- **The International Space Station**, Mars rovers, and the critical infrastructure of banks, exchanges and governments
- **VasakOS**, our desktop on Arch Linux with Wayland and native Rust applications

## From «just a hobby» to global infrastructure

Torvalds' genius wasn't just writing a kernel, but **choosing the GPLv2** and opening development to everyone. That decision made Linux the first truly global free-software project: thousands of developers from competing companies (Intel, AMD, Red Hat, Google, IBM, Samsung…) collaborate daily on the same code.

In 2026 the kernel exceeds **36 million lines** and receives contributions from more than **2 000 developers per release cycle**. Each version —now every 9-10 weeks— adds support for new hardware, filesystems, architectures and performance improvements that benefit the entire ecosystem.

## Linux and VasakOS: the foundation we build on

VasakOS is born **on top of Arch Linux**, which in turn lives on the Linux kernel. Our choice of Arch as a base is no accident:

- **Rolling release**: the new kernel reaches our users days after upstream publication, without six-month waits.
- **Upstream first**: we contribute patches to the kernel and subsystems (drm, input, usb…) instead of maintaining private forks.
- **Native Wayland**: the Wayfire compositor runs on DRM/KMS, the kernel's modern graphics API, with no X11 layers in between.
- **Hardware enablement**: from GPU drivers to laptop sensors, it all comes from the kernel.

When you install VasakOS, **you are installing Linux**. The same kernel Google uses in its servers, NASA in its probes, and Steam Deck in your living room.

## A «thank you» that doesn't fit in a commit

To Linus, to the **subsystem maintainers** (Greg KH, David Airlie, Christian Brauner, Ted Ts'o, Jens Axboe…), to the **driver developers** who make your Wi-Fi, GPU and printer work, to the **security teams** (KSPP, Kernel Self Protection Project) and to **every person who ever reported a bug, tested an rc or wrote a line of documentation**.

Without you, VasakOS would not exist.

---

**What was your first contact with Linux?** Tell us on [Telegram](https://t.me/VasakOS) or [GitHub](https://github.com/Vasak-OS). And if you want to celebrate by contributing, our [getting started guide](/docs/devs/contribution/) is waiting.

![Linus Torvalds in 1991](/img/posts/linux-35.jpg)
*Linus Torvalds, 1991. Photo: public domain / Linux Foundation.*