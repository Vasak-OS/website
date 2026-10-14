---
title: "How to report bugs"
weight: 50
description: "What information to include in a VasakOS bug report so that it can be reproduced and fixed."
aliases: ["/docs/user/report-bugs/"]
---

> **Is it a security problem?** Then this is not the page you are looking for. Do not
> open a public issue: it leaves the problem in plain sight of anyone while there is
> still no fix. It goes through the private report, explained in
> [Security](/en/docs/user/security/).

## Before reporting

Before reporting a bug, check whether it has already been reported:

1. Visit [Vasak Desktop GitHub Issues](https://github.com/Vasak-OS/vasak-desktop/issues)
2. Use the search to find similar problems
3. If you find a similar issue, add a comment with your information

## Information needed for a good report

A good bug report should include:

### Description of the problem
- What you were trying to do when the error occurred
- What you expected to happen
- What actually happened
- Can it be reproduced? (Yes/No/Sometimes)

### System information

```bash
# Copy and paste the output of these commands
echo "=== SYSTEM ==="
uname -a

echo -e "\n=== DISTRIBUTION ==="
grep PRETTY_NAME /etc/os-release

echo -e "\n=== VASAK-DESKTOP VERSION ==="
pacman -Q vasak-desktop 2>/dev/null || echo "Not installed"

echo -e "\n=== SESSION ==="
echo "$XDG_SESSION_TYPE ($XDG_CURRENT_DESKTOP)"
```

### Steps to reproduce

List the exact steps to reproduce the error:

```
1. Open the application
2. Go to [Menu/Option]
3. Click [Button]
4. The error happens here
```

### Relevant logs

The messages are copied from the **System Monitor**, on the **Logs** screen (see
[Errors and logs in the monitor](/en/docs/user/monitoring/)):

1. Open **System Monitor → Logs**.
2. In **Application** leave **The whole ecosystem** and turn on **Errors only**.
3. Reproduce the error and copy the messages from that moment, with the time.

If the desktop does not start, the same messages come out of the journal with
`journalctl`, as told in [The desktop does not start](/en/docs/user/errors/). And if the
failure is in the desktop itself, its file for the day carries more detail:
`~/.local/share/vasak-desktop/logs/vasak-desktop-YYYY-MM-DD.log`.

### Useful attachments

If relevant, include:
- **Screenshot** - Shows the visual state of the error
- **Video** - If it is hard to reproduce in text
- **Configuration file** - If the error is related to the configuration
  ```bash
  cat ~/.config/vasak/vasak.conf
  ```

## Report template

Use this template when creating an issue:

```markdown
## Description of the problem
[Describe here what is wrong]

## Steps to reproduce
1. [First step]
2. [Second step]
3. [The step where the error occurs]

## Expected behaviour
[What should happen]

## Current behaviour
[What actually happens]

## System information
- OS: [e.g: VasakOS (Arch Linux)]
- vasak-desktop version: [output of `pacman -Q vasak-desktop`]
- Session type: Wayland
- GPU: [e.g: NVIDIA / AMD / Intel]

## Logs
[Attach the relevant logs here]
\`\`\`
[Log contents]
\`\`\`

## Attachments
- [ ] Screenshot
- [ ] Video
- [ ] Configuration file
```

## Creating an issue on GitHub

### Step 1: Gather your information

```bash
# Create a file with all the information
cat > ~/vasak-report.md << 'EOF'
## Description
[Your description here]

## System
$(uname -a)
$(cat /etc/os-release | grep PRETTY_NAME)

## Version
$(pacman -Q vasak-desktop 2>/dev/null || echo "Unknown")

## Logs
EOF
```

### Step 2: Go to GitHub

1. Open https://github.com/Vasak-OS/vasak-desktop/issues/new
2. Click "New Issue"
3. Select "Bug Report" (if there are templates)
4. Fill in the information

### Step 3: Provide context

- **Clear title:** do not use "Error", "Bug" or "It doesn't work"
  - ❌ Bad: "Error with the panel"
  - ✅ Good: "Panel disappears when an external monitor is connected"

- **Detailed description:** the more detail, the easier it is to fix

- **Logs:** paste the relevant logs between triple backticks

## Crashes

If the application closes unexpectedly:

### Capture the core dump

```bash
# Enable core dumps
ulimit -c unlimited

# Run Vasak Desktop
vasak-desktop

# If it crashes, capture the core dump
coredumpctl list
coredumpctl info [number]
```

### Gather debug information

The desktop's file for the day already carries the detail of the crash: reproduce the
failure and attach `~/.local/share/vasak-desktop/logs/vasak-desktop-YYYY-MM-DD.log` together
with the output of `coredumpctl info`. The messages from the other applications are copied
from **System Monitor → Logs**.

### Attach to the report

- The complete log file
- The output of `coredumpctl info`
- System information

## Hardware/peripheral errors

If the error is related to:

### Bluetooth

```bash
# Capture Bluetooth information
rfkill list bluetooth
bluetoothctl show
journalctl -u bluetooth -n 100
```

### Audio (PipeWire)

```bash
# Audio information
wpctl status
systemctl --user status pipewire wireplumber --no-pager
journalctl --user -u wireplumber | tail -50
```

### Network/WiFi

```bash
# Network information
nmcli device
nmcli radio
journalctl -u NetworkManager | tail -50
```

## Following up on the report

After reporting:

1. **Answer questions** - Developers may ask for more information
2. **Try solutions** - If they suggest one, try it and report the result
3. **Check on new versions** - The bug may already be fixed in the next version
4. **Close it if it is resolved** - When it is fixed, you can close the issue

## Tips for better reports

✅ **Do:**
- Be specific and detailed
- Include relevant logs
- Be courteous and respectful
- Update with new information
- Test on new versions

❌ **Do not:**
- Report "it doesn't work" with no details
- Include 10,000 lines of unfiltered logs
- Be rude or demanding
- Report the same bug several times
- Completely change the subject of the issue

## Alternative reporting channels

- **GitHub Issues**: https://github.com/Vasak-OS/vasak-desktop/issues
- **Vasak OS forum**: *Not yet available*
- **Telegram**: https://t.me/VasakOS
- **Discord**: *Not yet available*

## Contact information

For critical security bugs, contact:
- **Security email**: os@vasak.net.ar
- **Do not open a public issue** for security vulnerabilities
