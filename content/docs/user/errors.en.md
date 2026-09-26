---
title: "Seeing errors in real time"
weight: 40
description: "How to see VasakOS errors in real time with RUST_LOG, journalctl and the system tools."
aliases: ["/en/docs/user/errores/"]
---

## How to see errors in real time

Vasak Desktop uses Rust's standard logging system. Errors are sent to `stderr` and can be
viewed in several ways.

### 1. Run with logs enabled

#### See all logs (including errors)

```bash
RUST_LOG=debug vasak-desktop
```

#### See only warnings and errors

```bash
RUST_LOG=warn vasak-desktop
```

#### Save logs to a file

```bash
RUST_LOG=debug vasak-desktop 2>&1 | tee vasak-errors-$(date +%Y%m%d).log
```

### 2. Use journalctl (if the app runs as a service)

```bash
# See logs in real time at ERROR level or above
journalctl --user -p err -f | grep vasak

# See the last hour of errors
journalctl --user -p err --since "1 hour ago" | grep vasak

# See all logs
journalctl --user | grep vasak
```

### 3. See errors specific to a component

#### Network errors

```bash
RUST_LOG=vasak_desktop::network=debug vasak-desktop 2>&1 | grep -i error
```

#### Bluetooth errors

```bash
RUST_LOG=vasak_desktop::bluetooth=debug vasak-desktop 2>&1 | grep -i error
```

#### Audio errors

```bash
RUST_LOG=vasak_desktop::audio=debug vasak-desktop 2>&1 | grep -i error
```

#### D-Bus errors

```bash
# See system D-Bus activity
dbus-monitor --system | grep -i error

# See user session D-Bus activity
dbus-monitor --session | grep -i error
```

## Understanding error messages

### Structure of a log message

```
[TIMESTAMP] [LEVEL] [MODULE] - MESSAGE
```

Example:
```
[2024-01-12T14:35:22Z] ERROR vasak_desktop::audio - Failed to connect to PulseAudio: Connection refused
```

- **TIMESTAMP** - Date and time of the error
- **LEVEL** - Severity level (ERROR, WARN, etc.)
- **MODULE** - Component that produced the error
- **MESSAGE** - Description of the problem

### Common errors and what they mean

#### "Connection refused"
It means an attempt was made to connect to a service (such as PulseAudio or D-Bus) and it
is not available.

**Common fix:** restart the service
```bash
systemctl --user restart pulseaudio
# or for PipeWire:
systemctl --user restart pipewire
```

#### "Permission denied"
It means the permissions to access a resource are missing.

**Common fix:** check your membership of user groups
```bash
# For audio
sudo usermod -a -G audio $USER

# For bluetooth
sudo usermod -a -G bluetooth $USER
```

#### "Failed to load configuration"
The configuration file is corrupt or cannot be read.

**Common fix:** restore the configuration to default values
```bash
# Move the configuration out of the way as a backup
mv ~/.config/vasak ~/.config/vasak.backup

# On the next run it is recreated with default values
vasak-desktop
```

#### "D-Bus service not available"
A system service is not available.

**Common fix:** check that the services are running
```bash
systemctl --user status
```

## Generating a detailed error report

If you need to share error information for a report:

```bash
# Run with logs and capture everything
RUST_LOG=debug vasak-desktop 2>&1 | tee vasak-error-report-$(date +%Y%m%d-%H%M%S).log

# Append system information to the file
echo "=== SYSTEM INFORMATION ===" >> vasak-error-report-*.log
echo "Date: $(date)" >> vasak-error-report-*.log
echo "Distro: $(lsb_release -d)" >> vasak-error-report-*.log
echo "Kernel: $(uname -r)" >> vasak-error-report-*.log
echo "Session: $XDG_SESSION_TYPE" >> vasak-error-report-*.log
```

The generated file can be attached to a GitHub issue.

See also: [how to report bugs](/en/docs/user/report-bugs/)

## Errors in the browser console (developer tools)

If you run Vasak Desktop in development mode:

1. Press `F12` to open the Developer Tools
2. Go to the **Console** tab
3. Look for messages in red (errors) or yellow (warnings)

Example of a console error:
```
TypeError: Cannot read property 'forEach' of undefined
    at AudioControl.vue:45:12
```

## Continuous error monitoring

To monitor errors while you use the application:

```bash
# Run with logs in a terminal
RUST_LOG=warn vasak-desktop

# Or watch the system logs in real time
journalctl --user -f | grep vasak
```

## Capturing crash information

If the application closes unexpectedly:

```bash
# See whether there are recent core dumps
coredumpctl list | grep vasak

# See details of the last core dump
coredumpctl info

# Extract a backtrace from the last crash
coredumpctl debug
```

## Less verbose logs (reducing noise)

If the logs are too detailed:

```bash
# Only critical errors
RUST_LOG=error vasak-desktop

# Only warnings and errors
RUST_LOG=warn vasak-desktop

# Run without showing errors in the interface
VASAK_SUPPRESS_ERRORS=1 vasak-desktop
```

**Note:** this only hides the visual notification; the errors are still written to the logs.
