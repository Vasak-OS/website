---
Title: "Thank you, Linux en Casa! VasakOS in Virt-Manager, step by step"
tags:
  - "vasakos"
  - "review"
  - "community"
  - "linux-en-casa"
  - "vasak-installer"
  - "vasak-desktop"
date: "2026-10-20"
img: "https://i.ytimg.com/vi/02CL5nXxwqU/hqdefault.jpg"
description: "Linux en Casa showed how to install VasakOS in Virt-Manager, even on modest machines. We thank them for the review and go through the points they raised."
layout: post
---

Over at **[Linux en Casa](https://www.youtube.com/watch?v=02CL5nXxwqU)** they rolled up their sleeves to show, step by step, how to install VasakOS in Virt-Manager —even on a modest machine— and documented the tweaks it takes to virtualize it today. **Thank you** for the work of guiding everyone who wants to try it in a virtual machine: it's exactly what a lot of people needed.

<center><iframe class="aspect-video rounded-corner" src="https://www.youtube-nocookie.com/embed/02CL5nXxwqU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></center>

<br/>

## What you pointed out, and where it stands

- 🔧 **In the virtual machine the cursor showed up inverted and doubled** (you had to export `WLR_NO_HARDWARE_CURSORS=1` by hand). We want to detect the virtual environment and do it automatically, so it just works: [vasak-desktop-settings#15](https://github.com/Vasak-OS/vasak-desktop-settings/issues/15).
- 🔧 **The keyboard started in English in the live session** (you fixed it by editing `wayfire.ini`). Under review: [vasak-installer#92](https://github.com/Vasak-OS/vasak-installer/issues/92).
- 🔧 **No manual partitioning.** Tracked as a feature to add: [vasak-installer#85](https://github.com/Vasak-OS/vasak-installer/issues/85).
- ✅ **It felt heavy** (Wayfire + WebKit). We tuned the apps' WebKit to cut usage: [vasak-desktop#265](https://github.com/Vasak-OS/vasak-desktop/issues/265); we keep improving performance.
- 🔧 **Shortcuts had to be read from `wayfire.ini`** and jumping between workspaces wasn't obvious. We'll add direct shortcuts by number: [vasak-desktop-settings#14](https://github.com/Vasak-OS/vasak-desktop-settings/issues/14).

As you rightly noted, the cursor thing is a side effect of virtualization —it doesn't happen on real hardware— but we still want the virtual-machine experience to be smooth out of the box. And thanks for highlighting the **native Rust applications**, the **browser, driver and printer** picker in the installer, and the **administrator account** prompt: those are decisions we care about.

## Onward

Your guide clears the path for anyone who wants to try it in a VM, and the tweaks you showed are precisely the ones we want to make unnecessary. **Thanks again.**
