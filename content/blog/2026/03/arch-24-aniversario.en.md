---
Title: "24 years of Arch Linux: simple, rolling, our home"
tags: ["arch-linux", "anniversary", "rolling-release", "pacman", "aur", "history"]
date: "2026-03-11"
img: "/img/posts/arch-24.svg"
description: "24 years of Arch: 11 Mar 2002 Arch 0.1 Homer released. Its KISS philosophy and rolling release underpin VasakOS."
weight: 10
layout: post
---

Today, 11 March 2026, marks **24 years** since the release of **Arch Linux 0.1 «Homer»**. Judd Vinet announced it on the mailing list with a sentence that sums it all up:

> *Arch Linux is a lightweight and flexible Linux distribution that tries to Keep It Simple.*

Twenty-four years later, that promise —**Keep It Simple, Stupid (KISS)**— is still the lighthouse guiding every project decision. And it's the reason **VasakOS exists on top of Arch**.

## What Arch gave us (and no one else did)

| Feature | What it means for VasakOS |
|---------|---------------------------|
| **True rolling release** | Kernel, mesa, wayland, pipewire, rust… arrive days after upstream. No six-month freezes. |
| **Pacman + makepkg** | Binary package management *and* building from source with the same tool. Our PKGBUILDs live in `PKGBUILDS/`. |
| **AUR (Arch User Repository)** | The world's largest community repository. If something is missing, someone has already packaged it. |
| **No unnecessary abstraction layers** | `/etc` is `/etc`, systemd is systemd, the kernel is the kernel. No overlays hiding what's happening. |
| **Technical community** | The forum, the wiki and IRC/Matrix are quality references, not just «how to install X». |

## From Judd to Levente: continuity

Judd Vinet founded Arch in 2002. In 2007 he passed the torch to **Aaron Griffin**, and since 2020 the *lead developer* is **Levente Polyak**. Throughout that time, **the philosophy hasn't changed**: the user decides, the system doesn't impose.

That ideological stability is what allows projects like VasakOS to build **on a predictable base**. We know that `pacman -Syu` tomorrow will still work exactly like today, and that base packages won't bring surprises.

## VasakOS = Arch + Wayland desktop + Rust apps

We don't hide that we're Arch. On the contrary: **we want it to show**.

- Our installer adds the VasakOS repository and Arch's, and that's it.
- Our packages (`vasak-desktop`, `vasak-terminal`, `vasak-file-manager`…) are built with `makepkg` and signed with the same infrastructure.
- Arch updates (kernel, glibc, systemd…) reach VasakOS **the same day**.
- The Arch wiki is *our* wiki for everything that isn't specific to our desktop.

## The future: 24 more (at least)

Arch has no «versions» or «lifecycles». As long as there are people who value simplicity, transparency and control, Arch will be there. And VasakOS with it.

**Thanks to Judd, to Aaron, to Levente, to the AUR Trusted Users, to the `[core]`, `[extra]`, `[community]` maintainers, to the Wiki authors, and to every user who ever read `man pacman` before asking.**

---

**What was your most memorable `pacman -S`?** Tell us on [Telegram](https://t.me/VasakOS) or [GitHub](https://github.com/Vasak-OS). And if you want to help us package more things for VasakOS, the [packaging guide](/docs/devs/contribution/#packaging) is waiting.

![Arch Linux 0.1 Homer](/img/posts/arch-24.jpg)
*Arch Linux 0.1 «Homer», 11 March 2002. Archive screenshot.*