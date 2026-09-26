---
title: "How to report bugs"
weight: 50
description: "What information to include in a VasakOS bug report so that it can be reproduced and fixed."
aliases: ["/en/docs/user/report-bugs/"]
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
cat /etc/os-release | grep PRETTY_NAME

echo -e "\n=== VASAK DESKTOP VERSION ==="
vasak-desktop --version 2>/dev/null || echo "Not installed globally"

echo -e "\n=== SESSION MANAGER ==="
echo $XDG_SESSION_TYPE

echo -e "\n=== SCREENS ==="
xrandr --query 2>/dev/null | grep connected || wayland-info 2>/dev/null | head -20
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

Gather the logs following this guide:

```bash
# Run the application with detailed logs
RUST_LOG=debug vasak-desktop 2>&1 | tee ~/vasak-debug-$(date +%Y%m%d-%H%M%S).log

# Reproduce the error, then capture the log file
```

Include both:
- The generated log file
- The output of the terminal where you ran the command

### Useful attachments

If relevant, include:
- **Screenshot** - Shows the visual state of the error
- **Video** - If it is hard to reproduce in text
- **Configuration file** - If the error is related to the configuration
  ```bash
  cat ~/.config/vasak/system_config.json
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
- OS: [e.g: Linux - Fedora 40]
- Vasak Desktop version: [e.g: 0.5.2]
- Session type: [X11 / Wayland]
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
$(vasak-desktop --version 2>/dev/null || echo "Unknown")

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

```bash
# Run with maximum verbosity
RUST_LOG=trace RUST_BACKTRACE=1 vasak-desktop 2>&1 | tee crash-$(date +%s).log

# Reproduce the crash
```

### Attach to the report

- The complete log file
- The output of `coredumpctl info`
- System information

## Hardware/peripheral errors

If the error is related to:

### Bluetooth

```bash
# Capture Bluetooth information
hciconfig -a
bluetoothctl show
journalctl --user -u bluetooth -n 100
```

### Audio (PulseAudio)

```bash
# Audio information
pactl info
pactl list sinks short
pactl list sources short
journalctl --user | grep -i pulse | tail -50
```

### Network/WiFi

```bash
# Network information
nmcli device
nmcli radio
journalctl --user | grep -i network | tail -50
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
