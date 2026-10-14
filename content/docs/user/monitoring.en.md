---
title: "Errors and logs in the monitor"
description: "Where to see VasakOS errors: the Logs screen of the system monitor, with a filter per application and the «Errors only» box."
weight: 40
---

When something stops working, the first place to look is the **System Monitor**. Besides
consumption and services, it is where **the logs are, errors included**.

## Opening the monitor

It is in the menu as **System Monitor** (the package is `vasak-monitor`) and it has five
screens: **Resources**, **Applications**, **Services**, **Cleanup** and **Logs**.

## Logs: where the errors are

The **Logs** screen shows, newest first, the messages that applications and services write
to the system journal: the local time, who wrote it and the message.

### Choosing what to look at

The **Application** selector narrows the list in three ways:

- **The whole ecosystem**: only VasakOS applications and services. This is what you look at
  when something in the system misbehaves.
- **A single application**, for example `vasak-keyring`. The catalogue carries the whole
  ecosystem even if an application has not written anything yet, so it never looks like the
  monitor does not know about it.
- **The whole system**: the complete journal, with everything that is not VasakOS. It is the
  last resort, because it is a lot of lines.

### Seeing only the errors

The **Errors only** box keeps the entries at error level or worse: emergency, alert,
critical and error. It is the first filter to turn on when looking for what broke; with it
off, the list also shows warnings.

Programs that write their own level —Wayfire, for instance, which marks every line with
`EE`, `WW` or `II`— are respected: an `EE` line counts as an error even if the journal
stores it as informational.

### Searching

The search field narrows by text across the message and the origin. It helps to jump
straight to a service or to a particular word.

### Where the messages come from

The messages come from the systemd **journal** of the current boot, both the system's and
the desktop session's. A service shows up under the name of its unit
(`vasak-keyring.service`); an application opened from the menu writes to the session
journal. If you pick an application and the list stays empty, it may simply not have
written anything since the machine booted.

## Services

The **Services** screen lists the system services and lets you **start**, **stop** and
**restart** each one. A box limits the list to the VasakOS ones, and the failed ones are
marked. It is the place to restart a service that stopped responding without opening a
terminal.

## Applications

The **Applications** screen groups the processes of a single program —a browser is ten of
them— and sorts them by consumption, with the ones that have a window first. **Close** asks
the program to quit and gives it time to save; it does not kill it.

## Resources and Cleanup

**Resources** shows processor, memory, swap, network and disks, with the last few minutes.
**Cleanup** measures what can be reclaimed —caches, trash, packages, the old journal— and
frees it when you ask.

The monitor does not measure more than it needs to: only **Resources** and **Applications**
refresh on their own; **Services**, **Cleanup** and **Logs** are queried when you open them.
And with the window covered it measures nothing: it would be first in its own list.

## Before reporting

When something fails and you are going to [report it](/en/docs/user/report-bugs/), the
**Logs** screen is the source: pick **The whole ecosystem**, turn on **Errors only** and
copy the messages from the moment it happened.
