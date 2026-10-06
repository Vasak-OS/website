---
title: "Security"
weight: 55
description: "Where to report a VasakOS security problem, what the system protects and what it does not yet, and how fixes reach you."
---

If you found a security problem in VasakOS, **do not open a public issue**. An issue leaves
the problem in plain sight of anyone while there is still no fix.

## Where to report it

In the corresponding repository, **Security** tab → **Report a vulnerability**. It is enabled
on all the organisation's active repositories.

If you do not know which repository it is, send it to
[vasak-permissions](https://github.com/Vasak-OS/vasak-permissions/security) and we will pass
it on.

It helps if the report includes the package version (`pacman -Q <package>`), what happens and
how to reproduce it. An exploit is not necessary.

## What happens next

| Stage | Deadline |
|---|---|
| Acknowledgement | 72 business hours |
| First assessment | 7 days |
| Deadline before you publish | 90 days, or sooner if the fix comes out sooner |

The 90 days are a request, not an imposition: if they pass and we have not resolved it,
publish.

The fix ships as an ordinary update, and the advisory is published **after** the package is in
the repository. `vasak-update` checks once a day and at login, so on a machine that is
powered on it arrives within twenty-four hours.

With one limit worth knowing: **the notification still does not distinguish a security update
from an ordinary one.** The pacman package database has no security field at all. Whoever
defers updates also defers these without noticing that they are different.

## What VasakOS protects, and what it does not yet

Real confinement is provided by AppArmor, which is independent of how the program is
launched. An AppImage cannot read your SSH or GPG keys, nor the keyring, nor stored tokens.
Everything that is blocked can be unblocked, from the notification or from Settings.

What **still has the door left ajar**, said plainly:

- **Capturing the screen without going through the portal.** The dialog asks, but a Wayland
  client is not obliged to use it.
- **Camera and microphone through PipeWire.** The permission is asked for and recorded, and a
  program can still ask PipeWire for the node.
- **Most of the system profiles are in warn mode**, not blocking mode: they record what they
  would have prevented.

And one that is not a hole but changes the surface: VasakOS **does not yet sign its boot**,
so today it is installed with Secure Boot disabled.

## The documents

- [Security policy](https://github.com/Vasak-OS/.github/blob/main/SECURITY.md) — how to
  report, what is in and what is out, which versions are supported.
- [Threat model](https://github.com/Vasak-OS/.github/blob/main/THREAT-MODEL.md) — what there
  is to protect, where the problem can come from, and what is explicitly out of scope.
- [Advisory process](https://github.com/Vasak-OS/.github/blob/main/AVISOS.md) — what happens
  between a report being confirmed and everyone who already installed being safe.
