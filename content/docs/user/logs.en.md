---
title: "Logs and diagnostics"
weight: 45
description: "Where VasakOS messages go: the Logs screen of the system monitor and the log files each application writes."
---

VasakOS **errors** are seen in the **System Monitor**, on the **Logs** screen. This page
also explains where each file goes, in case it has to be attached to a report.

## The errors, in the monitor

Open **System Monitor → Logs** and turn on **Errors only**. The screen reads the system
journal of the current boot and narrows it per application; it is explained in
[Errors and logs in the monitor](/en/docs/user/monitoring/).

The monitor needs the desktop running. If the problem is precisely that the desktop does
not start, the way in is the terminal: see
[The desktop does not start](/en/docs/user/errors/).

## The desktop's log file

Besides the journal, `vasak-desktop` writes its own file, with more detail than what goes to
the journal:

```
~/.local/share/vasak-desktop/logs/vasak-desktop-YYYY-MM-DD.log
```

It is one file per day and the last seven are kept: the older ones are removed on their own.
Everything that happens in the desktop ends up there —errors and warnings included—, and
that is what to look at when the desktop misbehaves.

## From the terminal

The complete journal is read with `journalctl`, without a graphical interface. It is the
same information the monitor shows:

```bash
# Errors of the current boot, for the system
journalctl -b -p err

# Errors of the current boot, for your desktop session
journalctl --user -b -p err

# A single service
journalctl --user -u vasak-desktop.service -b
```

`-b` limits it to the current boot and `-p err` keeps the errors. To follow them live, add
`-f`; to see everything, without filtering by level, drop the `-p err`.

## Exporting for a report

To attach the messages to a [bug report](/en/docs/user/report-bugs/), save the output to a
file:

```bash
journalctl -b -p err --no-pager > errors-$(date +%F).log
journalctl --user -b -p err --no-pager >> errors-$(date +%F).log
```

The ones in the monitor are copied straight from the **Logs** screen.
