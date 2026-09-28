---
Title: "State of the project"
seotitle: "State of VasakOS: what works, what is missing | VasakOS"
description: "The real state of every VasakOS component, with its published version and what is still missing before it counts as stable."
img: "/img/posts/roadmap.svg"
type: state
date: "2026-08-10"
lastmod: "2026-08-10"
tags: [state, roadmap, vasakos, alpha, development]
---

VasakOS is in **Alpha**. That word means different things in different projects, so here
is what it means in this one: the system boots, installs and runs, but there are
half-finished features and changes that break compatibility between versions.

This page is updated with every release. If something is not listed here, it does not
exist yet.

## What you can do today

- Install the system to disk with Calamares, alongside another system or on its own.
- Use the desktop daily: files, terminal, browser, audio playback and image viewing.
- Configure network, sound, brightness, date and time, users and appearance from
  Settings.
- Receive updates through `pacman` from the official VasakOS repository.

## What is not there yet

- **Online accounts**: the daemon exists, but no application uses it yet.
- **Translations**: the system is in Spanish; multilingual support is half finished and
  some applications cannot find their translations when they are installed.
- **An office and multimedia suite of our own**: the usual applications from the Linux
  ecosystem are used instead.
- **Support for exotic hardware**: because it is pure Wayland, some NVIDIA setups with
  proprietary drivers may need manual adjustments.

## How to read each status

| Status | What it means |
| --- | --- |
| **Stable** | It works, and we do not expect changes that break anything. |
| **Beta** | Feature-complete, still polishing out bugs. |
| **Alpha** | Usable, with missing features and frequent changes. |
| **In development** | The code exists, the user experience does not yet. |
| **Planned** | Decided on, not written yet. |

## Reporting something

If you find a problem, the most useful report includes the machine model, what you
expected to happen, and the logs. The guide is in [reporting bugs](/en/docs/user/report-bugs/),
and tracking happens on [GitHub](https://github.com/Vasak-OS).
