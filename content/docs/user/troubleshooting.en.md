---
title: "Troubleshooting"
weight: 30
description: "A step-by-step guide to the most common VasakOS problems: boot, session, audio, network and screen."
---

## Startup problems

### The application does not start

#### Symptom
You run `vasak-desktop` but nothing happens, or it closes immediately.

#### Step-by-step fix

**Step 1: Check the system services**

```bash
# Check that D-Bus is running
systemctl --user status dbus

# If it is not running, start it
systemctl --user start dbus
```

**Step 2: Check the optional services**

```bash
# Depending on your features, these may be needed
systemctl --user status pulseaudio
systemctl --user status bluetooth
sudo systemctl status NetworkManager
```

**Step 3: Run with debug logs**

```bash
# Run with detailed logs
RUST_LOG=debug vasak-desktop 2>&1 | tee vasak-debug.log

# Read the generated file
less vasak-debug.log
```

**Step 4: Clear the cache and configuration**

```bash
# Back up the configuration (just in case)
mv ~/.config/vasak ~/.config/vasak.backup

# Try starting again
vasak-desktop
```

**Step 5: Reinstall the application**

```bash
# Depending on your package manager
sudo apt remove vasak-desktop
sudo apt install vasak-desktop

# Or if you use another distro
sudo dnf remove vasak-desktop
sudo dnf install vasak-desktop
```

---

## Screen and monitor problems

### The panel does not appear

#### Symptom
You do not see the system panel on any screen.

#### Fix

```bash
# Restart just the panel
pkill -f vasak-panel
# It should restart automatically in 2-3 seconds

# If it does not restart:
RUST_LOG=debug vasak-desktop --debug-panel 2>&1 | tee panel-debug.log

# Restart the whole application
pkill -f vasak-desktop
sleep 2
vasak-desktop &
```

### The panel does not cover every monitor

#### Symptom
The panel does not appear on all connected monitors.

#### Fix

```bash
# Check monitor detection
xrandr --query  # For X11

# Or for Wayland with wlr-randr
wlr-randr

# Restart the application to detect the monitors again
pkill vasak-desktop
sleep 2
vasak-desktop
```

### Wrong or pixelated resolution

#### Symptom
The interface looks pixelated or at the wrong resolution.

#### Fix

```bash
# Check your current resolution
xrandr --query | grep connected

# If it is wrong, set it
xrandr --output HDMI-1 --mode 1920x1080

# On Wayland it is normally detected automatically
# If not, check the system monitor configuration
```

---

## Audio problems

### No sound

#### Symptom
There is no sound in any application.

#### Step-by-step fix

**Step 1: Check that the audio service is running**

```bash
# For PulseAudio
systemctl --user status pulseaudio
systemctl --user start pulseaudio  # If it is not running

# Or for PipeWire (more recent)
systemctl --user status pipewire
systemctl --user start pipewire
```

**Step 2: Check the audio devices**

```bash
# List devices
pactl list sinks short

# Example output:
# 0	alsa_output.pci-0000_00_1f.3.analog-stereo	module-alsa-card.c	s16le 2ch 44100Hz	SUSPENDED

# If you see SUSPENDED, the device is not active
# Reactivate it:
pactl set-sink-state <ID> running
```

**Step 3: Check the volume**

```bash
# See the current volume
pactl list sinks | grep Volume

# Set the volume (0-100%)
pactl set-sink-volume <ID> 50%

# Or turn the volume up
pactl set-sink-volume @DEFAULT_SINK@ +10%
```

**Step 4: Check that it is not muted**

```bash
# See whether it is muted
pactl list sinks | grep Mute

# Unmute
pactl set-sink-mute <ID> false
```

**Step 5: Restore the configuration**

```bash
# If nothing works, restore the defaults
pulseaudio --kill
rm -rf ~/.config/pulse/
rm -rf ~/.local/share/pulse/
systemctl --user start pulseaudio
```

### Choppy audio or latency

#### Symptom
The audio sounds choppy, with pauses or delays.

#### Fix

```bash
# Increase the PulseAudio buffer
# Edit: ~/.config/pulse/daemon.conf

# Look for or add:
default-fragment-size = 4096
default-tlength = 16384

# Restart
systemctl --user restart pulseaudio
```

### Volume very low

#### Symptom
The volume is at maximum but still very low.

#### Fix

```bash
# Check amplification
pactl list sinks | grep -A 30 "Volume levels"

# Try using the software amplifier
pactl set-sink-volume @DEFAULT_SINK@ 150%
```

---

## Bluetooth problems

### Bluetooth does not detect devices

#### Symptom
You cannot pair or connect Bluetooth devices.

#### Step-by-step fix

**Step 1: Check that Bluetooth is enabled**

```bash
# See the status
rfkill list bluetooth

# If it is blocked (blocked in software)
rfkill unblock bluetooth

# If it is hard-blocked (blocked physically)
# Check your laptop/keyboard for Bluetooth shortcuts
```

**Step 2: Start the Bluetooth service**

```bash
sudo systemctl start bluetooth
sudo systemctl enable bluetooth

# Check the status
sudo systemctl status bluetooth
```

**Step 3: Check the Bluetooth interface**

```bash
# See the adapters
hciconfig -a

# If none appears, the hardware may not be supported
# Check:
lsusb | grep -i bluetooth
```

**Step 4: Put the adapter in discoverable mode**

```bash
# Start bluetoothctl
bluetoothctl

# Inside bluetoothctl:
power on              # Turn the adapter on
discoverable on       # Put it in discoverable mode
scan on              # Look for devices

# Wait until it sees your device, then:
pair XX:XX:XX:XX:XX:XX  # The device MAC
trust XX:XX:XX:XX:XX:XX
connect XX:XX:XX:XX:XX:XX

exit
```

**Step 5: Check the permissions**

```bash
# Make sure you are in the bluetooth group
groups | grep bluetooth

# If it does not appear, add yourself
sudo usermod -a -G bluetooth $USER

# You will need to log out and back in
```

### It disconnects frequently

#### Symptom
The Bluetooth device disconnects on its own.

#### Fix

```bash
# Increase the distance or remove interference
# Typical problems:
# - Microwave ovens
# - WiFi on the same channel
# - Too many Bluetooth devices at once

# Check the health of the adapter
sudo hciconfig hci0 reset

# If it still disconnects, it is probably:
# - A problem with the device (low battery)
# - The system's Bluetooth controller
# - Radio interference
```

---

## Network/WiFi problems

### WiFi does not appear or does not connect

#### Symptom
You do not see available WiFi networks, or you cannot connect.

#### Step-by-step fix

**Step 1: Check that WiFi is enabled**

```bash
# See the status
rfkill list wifi

# Enable it if it is blocked
rfkill unblock wifi

# See the physical device
ip link show | grep -i wlan

# Bring the interface up
sudo ip link set wlan0 up
```

**Step 2: Check NetworkManager**

```bash
# It should be running
systemctl status NetworkManager
sudo systemctl start NetworkManager

# See the network status
nmcli device status
nmcli radio
```

**Step 3: Cycle the WiFi adapter**

```bash
# Turn WiFi off and on
nmcli radio wifi off
sleep 2
nmcli radio wifi on

# Cycle the device
sudo ip link set wlan0 down
sleep 2
sudo ip link set wlan0 up
```

**Step 4: Scan for available networks**

```bash
# See the networks
nmcli device wifi list

# If you see no networks, the adapter may be damaged
# Check physically
lsusb | grep -i network  # For USB
lspci | grep -i network  # For built-in
```

**Step 5: Connect to a network**

```bash
# Connect to an open network
nmcli device wifi connect "SSID"

# Connect to a protected network
nmcli device wifi connect "SSID" password "password"

# Verify the connection
nmcli device status
ping 8.8.8.8
```

### Slow connection

#### Symptom
The network connection is very slow.

#### Fix

```bash
# Check the speed
nmcli device wifi list | grep SSID

# Check for interference (change channel)
# Routers usually pick automatically, but you can:

# See the channels in use in your area
sudo iwlist wlan0 scan | grep Channel

# If it is 5GHz WiFi, there is generally less interference
# Configure it on your router
```

### No network connection

#### Symptom
There is no connection even though it says connected.

#### Fix

```bash
# Check the IP configuration
ip addr show

# If it has no IP (inet), request one
sudo dhclient wlan0

# Or with NetworkManager
nmcli connection down "SSID"
nmcli connection up "SSID"

# Check DNS
cat /etc/resolv.conf
ping 8.8.8.8  # Test against Google's DNS
```

---

## Performance problems

### High CPU/memory usage

#### Symptom
Vasak Desktop uses a lot of CPU or consumes a lot of RAM.

#### Diagnosis

```bash
# See which process is using the most
top -p $(pgrep -f vasak-desktop)

# Or use ps
ps aux | grep vasak-desktop

# See historical usage
RUST_LOG=debug vasak-desktop 2>&1 | tee performance.log
# (Reproduce the problem, then Ctrl+C)
```

#### Fixes

**Option 1: Disable animations**

```bash
# Edit: ~/.config/vasak-desktop/config.toml
[ui]
animations_enabled = false
animation_duration = 50
```

**Option 2: Lower the refresh rate**

```bash
# In ~/.config/vasak-desktop/config.toml
[rendering]
refresh_rate = 30  # Down from 60
```

**Option 3: Disable visual effects**

```bash
# Look for these in the configuration:
effects_enabled = false
blur_effects = false
transparency_effects = false
```

**Option 4: Look at background processes**

```bash
# See all the Vasak processes
pgrep -af vasak

# If there are duplicated processes, end them
pkill -f vasak-secondary-process
```

### The application is slow to respond

#### Symptom
Clicks or interactions are delayed.

#### Fix

```bash
# Clear the configuration and restart
mv ~/.config/vasak ~/.config/vasak.backup
pkill vasak-desktop
sleep 2
vasak-desktop &
```

---

## Configuration problems

### Configuration changes do not apply

#### Symptom
Changes in the configuration do not show up in the interface.

#### Fix

```bash
# The configuration is read at startup
# Restart the application
pkill vasak-desktop
sleep 2
vasak-desktop &

# Check that the configuration saved correctly
cat ~/.config/vasak/system_config.json

# Check the permissions
ls -la ~/.config/vasak/system_config.json

# If you do not have read permission:
chmod 644 ~/.config/vasak/system_config.json
```

### Corrupt configuration

#### Symptom
The application does not start, or behaves unpredictably.

#### Fix

```bash
# Back up the current configuration
mv ~/.config/vasak ~/.config/vasak.backup

# On the next run it is recreated with default values
vasak-desktop

# If it works, you can restore individual settings by copying
# values from ~/.config/vasak.backup/system_config.json
```

---

## Scaling and DPI

### Interface too small or too large

#### Symptom
The UI elements look very small or very large.

#### Fix

```bash
# Adjust the system scale through GTK
gsettings set org.gnome.desktop.interface text-scaling-factor 1.25

# For X11, adjust the DPI
echo "Xft.dpi: 120" >> ~/.Xresources
xrdb -merge ~/.Xresources

# Restart to apply
pkill vasak-desktop && vasak-desktop &
```

---

## Permission errors

### "Permission denied" on operations

#### Symptom
You see permission errors in the logs.

#### Fix

```bash
# For audio:
sudo usermod -a -G audio $USER

# For Bluetooth:
sudo usermod -a -G bluetooth $USER

# To access devices:
sudo usermod -a -G input $USER
sudo usermod -a -G dialout $USER

# These changes require logging out and back in
# Or run this in a new terminal:
su - $USER
```

---

## When nothing works

### Full restart

```bash
# 1. Stop all the Vasak processes
pkill -f vasak

# 2. Stop related services
systemctl --user stop pulseaudio
systemctl --user stop dbus

# 3. Restart the system services
systemctl --user restart dbus
systemctl --user restart pulseaudio  # or pipewire if you use PipeWire

# 4. Start with debug
RUST_LOG=debug vasak-desktop 2>&1 | tee restart-debug.log
```

### Reporting the problem

If nothing works:

1. Gather the information and logs:
   ```bash
   # Capture system information and logs
   RUST_LOG=debug vasak-desktop 2>&1 | tee vasak-debug-report.log

   # Add system information
   echo "=== SYSTEM INFORMATION ===" >> vasak-debug-report.log
   echo "Distro: $(lsb_release -d)" >> vasak-debug-report.log
   echo "Kernel: $(uname -r)" >> vasak-debug-report.log
   echo "Session: $XDG_SESSION_TYPE" >> vasak-debug-report.log
   ```

2. Open an issue on GitHub attaching `vasak-debug-report.log`

See [How to Report Bugs](/en/docs/user/report-bugs/) for more details.
