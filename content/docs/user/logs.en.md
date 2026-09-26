---
title: "Logs and diagnostics"
weight: 45
description: "Where the VasakOS logs live and how to read them to understand what failed."
---

## Logging system

Vasak Desktop uses Rust's standard logging system through the `log` crate. Log messages
**are not saved to files** by default; they are sent to standard error (`stderr`).

## How to see the logs

### Running with logs enabled

To see the logs when running the application, use the `RUST_LOG` environment variable:

```bash
# See all logs (very verbose)
RUST_LOG=debug vasak-desktop

# See only warnings and errors
RUST_LOG=warn vasak-desktop

# See logs specific to one module
RUST_LOG=vasak_desktop::audio=debug vasak-desktop
```

**Available log levels:**
- `error` - Only critical errors
- `warn` - Warnings and errors
- `info` - General information + warn + error
- `debug` - Detailed information (recommended for debugging)
- `trace` - Extremely detailed (for development)

### Seeing the logs if you launch from a launcher

If you start Vasak Desktop from an application launcher or at login, you can see the logs
with `journalctl`:

```bash
# See logs in real time
journalctl --user -f | grep vasak

# See recent logs
journalctl --user --since "10 minutes ago" | grep vasak

# See only errors
journalctl --user -p err | grep vasak
```

### Redirecting logs to a file

If you need to save the logs to a file for analysis:

```bash
# Save the logs to a file
RUST_LOG=debug vasak-desktop 2>&1 | tee ~/vasak-desktop.log

# Save only stderr (the logs)
RUST_LOG=debug vasak-desktop 2> ~/vasak-desktop.log
```

## Configuration files

The system configuration is stored in:

```
~/.config/vasak/system_config.json
```

This file contains:
- `dark_mode` - Dark mode state
- `icon_pack` - Selected icon pack
- `cursor_theme` - Cursor theme
- `gtk_theme` - GTK theme

## Advanced debugging

The log files contain information at different levels of detail:

- **DEBUG** - Detailed information for developers (a lot of it)
- **INFO** - General information about how things work
- **WARN** - Warnings (something might not work correctly)
- **ERROR** - Errors (something stopped working)
- **CRITICAL** - Serious errors that can cause crashes

## Clearing logs

The logs are regenerated automatically. If you need to clear old logs:

```bash
# Delete all logs
rm -rf ~/.local/share/vasak-desktop/logs/

# Delete only logs older than 30 days
find ~/.local/share/vasak-desktop/logs -name "*.log" -mtime +30 -delete
```

## Exporting logs for a report

If you need to share logs with the developers:

```bash
# Run with full logs and save them
RUST_LOG=debug vasak-desktop 2>&1 | tee vasak-debug-$(date +%Y%m%d-%H%M%S).log
```

This creates a timestamped file that you can attach to a bug report.

## D-Bus logs

To debug D-Bus communication (used for audio, bluetooth, notifications):

```bash
# See system D-Bus messages
dbus-monitor --system

# See user session D-Bus messages
dbus-monitor --session
```

## Further information

### Checking whether the application is running

```bash
ps aux | grep vasak-desktop
```

### Checking resource usage

```bash
# CPU and memory
top -p $(pgrep vasak-desktop)

# Or with htop
htop -p $(pgrep vasak-desktop)
```

---

**Note**: if you find a bug, see the [bug reporting guide](/en/docs/user/report-bugs/) to
find out what information to include.
