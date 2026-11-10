---
Title: "Thank you, Soplos Linux! Your review, point by point"
tags:
  - "vasakos"
  - "review"
  - "community"
  - "soplos-linux"
  - "vasak-installer"
  - "vasak file manager"
date: "2026-10-19"
img: "https://i.ytimg.com/vi/0_Qkd3Ewdns/maxresdefault.jpg"
description: "Soplos Linux tried VasakOS on VMware, Virt-Manager and Proxmox. We go through every point they raised: what's fixed and what we're still working on."
layout: post
---

Sergi, from **[Soplos Linux](https://www.youtube.com/watch?v=0_Qkd3Ewdns)**, spent nearly an hour with VasakOS: he tried it on VMware, Virt-Manager and Proxmox, went over the install, the performance and the interface, and honestly noted what he liked and what still needs polishing. **Thank you so much.** That kind of test —thorough and well-meant— is exactly what helps us improve.

<center><iframe class="aspect-video rounded-corner" src="https://www.youtube-nocookie.com/embed/0_Qkd3Ewdns" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></center>

<br/>

## What you pointed out, and where it stands

We went one by one. We mark what's already fixed and link the issue for what we're still working on.

### Installer

- 🔧 **Choosing the language with the mouse didn't register** (you had to press Enter). Being fixed: [vasak-installer#91](https://github.com/Vasak-OS/vasak-installer/issues/91).
- 🔧 **The keyboard didn't apply the chosen layout in the live session** (it did work once installed). We're on it: [vasak-installer#92](https://github.com/Vasak-OS/vasak-installer/issues/92).
- 🔧 **Spain's Spanish only showed up as "European Spanish"** and didn't appear when searching "Spanish". We'll make it findable: [vasak-installer#93](https://github.com/Vasak-OS/vasak-installer/issues/93).
- 🔧 **Manual partitioning is missing.** It's a feature we want to add, already tracked: [vasak-installer#85](https://github.com/Vasak-OS/vasak-installer/issues/85).
- 🔎 **It detects 1080 but didn't apply the native resolution** in the live session. We're looking into it.

### Desktop

- ✅ **Widgets and applets didn't close when clicking outside.** Fixed: [vasak-desktop#262](https://github.com/Vasak-OS/vasak-desktop/issues/262).
- ✅ **The desktop started with widgets on screen.** They no longer ship on by default: [vasak-desktop#259](https://github.com/Vasak-OS/vasak-desktop/issues/259).
- ✅ **WebKit used too much memory** (around 470–500 MB). Tuned to cut usage: [vasak-settings#202](https://github.com/Vasak-OS/vasak-settings/issues/202) and [vasak-desktop#265](https://github.com/Vasak-OS/vasak-desktop/issues/265).

### File manager

- ✅ **The two columns kept coming back and the view change wasn't saved.** The file manager now keeps its UI state: [vasak-file-manager#120](https://github.com/Vasak-OS/vasak-file-manager/issues/120).
- ✅ **Larger icon sizes were missing.** We added icon zoom (Ctrl +/−/0 and Ctrl+scroll): [vasak-file-manager#134](https://github.com/Vasak-OS/vasak-file-manager/issues/134).
- 🔎 **Some file-manager shortcuts** (Ctrl+T, Ctrl+W, Ctrl+Q) and the **clarity of the shortcuts panel** are noted; we're evaluating them around the shortcuts configuration ([vasak-settings#4](https://github.com/Vasak-OS/vasak-settings/issues/4)).

And thank you for highlighting what we're already proud of: the **per-app AppArmor profiles**, the **separate administrator account**, the custom installer with its browser and driver picker, and the control center. That's the direction we're going.

## Onward

We're keeping every point. **Thanks again, Sergi** — and we're looking forward to that second video on customization as much as you are.
