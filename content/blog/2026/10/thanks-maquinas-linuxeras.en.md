---
Title: "Thank you, Máquinas Linuxeras! We're on your feedback"
tags:
  - "vasakos"
  - "review"
  - "community"
  - "maquinas-linuxeras"
  - "vasak-desktop"
  - "vasak-installer"
date: "2026-10-13"
img: "https://i.ytimg.com/vi/AAiNVjEG688/maxresdefault.jpg"
description: "Máquinas Linuxeras tried the VasakOS beta. We thank them for the review and go through, one by one, every point they raised and where each one stands."
layout: post
---

Ubaldo, from **[Máquinas Linuxeras](https://www.youtube.com/watch?v=AAiNVjEG688)**, took the time to try the VasakOS beta and to talk about it with the care he's known for: every remark backed up, no rush. From here, **thank you**. A review this attentive is gold for a project that's just starting, and we won't let a single one of your points slip.

<center><iframe class="aspect-video rounded-corner" src="https://www.youtube-nocookie.com/embed/AAiNVjEG688" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></center>

<br/>

## What you pointed out, and where it stands

We went through every point in the video. The ones already fixed are marked; the ones still open come with their issue so you can follow them.

- 🔧 **The installer didn't pick the combo option when you chose it with the mouse** (you had to press Enter, and if you didn't notice, the old option stayed). We're fixing it: [vasak-installer#91](https://github.com/Vasak-OS/vasak-installer/issues/91).
- 🔧 **No direct `Super+1…4` shortcut to jump between workspaces** (today it's mouse or the overview). We'll add the direct jump by number: [vasak-desktop-settings#14](https://github.com/Vasak-OS/vasak-desktop-settings/issues/14).
- ✅ **Clicking a drive didn't mount or open it** (and never if it was encrypted). Fixed: [vasak-file-manager#44](https://github.com/Vasak-OS/vasak-file-manager/issues/44). 🔎 Auto-detecting a freshly plugged-in drive is still something we're reviewing.
- ✅ **The store didn't install apps yet.** It now discovers, searches and installs (AUR included): [vasak-store#5](https://github.com/Vasak-OS/vasak-store/issues/5) and [vasak-store#1](https://github.com/Vasak-OS/vasak-store/issues/1).
- ✅ **WebKit used too much memory and felt heavy.** We tuned the apps' WebKit to cut usage: [vasak-desktop#265](https://github.com/Vasak-OS/vasak-desktop/issues/265). It's an improvement we keep polishing.

And a couple that already worked and we were glad you highlighted: picking the **audio output** (sending everything to HDMI, say) was already fixed in [vasak-desktop#230](https://github.com/Vasak-OS/vasak-desktop/issues/230), and the control center, the color themes and the service log for reporting errors are exactly where we want the system to go.

## Onward

All of this is in beta and being built in the open. Having someone try it with the seriousness you did is the best way for it to move forward well. **Thanks again, Ubaldo** — we're keeping the list and getting to it.
