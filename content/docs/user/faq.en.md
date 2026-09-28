---
title: "Frequently asked questions"
seotitle: "Frequently asked questions about VasakOS | VasakOS"
description: "Requirements, compatibility, Wayland, customisation, updates and hardware: the most common questions about VasakOS, answered."
weight: 20
layout: faq

intro: |
  If you cannot find your answer here, ask on
  [Telegram](https://t.me/VasakOS) or open an issue on
  [GitHub](https://github.com/Vasak-OS).

# Questions and answers. They live in the front matter so that the page and the
# structured data (FAQPage) come from the same source and cannot contradict each
# other.
faq:
  - q: "What exactly is VasakOS?"
    a: |
      A GNU/Linux distribution based on **Arch Linux** with a desktop of its own. It is not
      Arch with a different theme: the panel, the file manager, the terminal, the settings,
      the gallery, the audio player, the keyring and the notification daemon are
      applications written for this system, in Rust with Tauri and Vue.

  - q: "Is it ready to use every day?"
    a: |
      It is in **Alpha**. It installs, runs and updates, but there are incomplete features
      and changes that break compatibility between versions. It is perfectly good for trying
      it out and reporting problems; we do not yet recommend it as the only system on a work
      machine. The detail, component by component, is in
      [state of the project](/en/state/).

  - q: "What requirements do I need?"
    a: |
      Minimum: 64-bit CPU, 4 GB of RAM and 20 GB of disk. Recommended: 4 cores, 8 GB of RAM
      and 40 GB of disk. The full list is in [Downloads](/en/downloads/).

  - q: "Does it work with Wayland or with X11?"
    a: |
      **Wayland.** The session runs on the Wayfire compositor, managed by systemd through
      uwsm. X11 applications work through Xwayland. There is no native X11 session and none
      is planned: maintaining both duplicated the work with no benefit for the user.

  - q: "Does it work well with NVIDIA?"
    a: |
      With the free drivers (nouveau) and with recent versions of the proprietary driver,
      yes. Hybrid Optimus setups and older cards with legacy drivers may need manual
      adjustments. Always try in Live mode before installing.

  - q: "Can I use the VasakOS desktop on another distribution?"
    a: |
      On **Arch Linux**, yes, by adding the [package repository](/en/docs/user/repository/).
      On Arch derivatives such as Manjaro or EndeavourOS it usually works, bearing in mind
      that Manjaro delays packages relative to Arch and that can cause incompatibilities.

      On Debian, Ubuntu, Fedora or openSUSE there are no packages: every component would have
      to be compiled by hand. It is possible, but it is not supported.

  - q: "How do I update the system?"
    a: |
      With `sudo pacman -Syu`. VasakOS is rolling release: there are no versions that fall
      behind and no large migrations. The full guide, including what to do with `.pacnew`
      files and how to roll back an update, is in
      [updating the system](/en/docs/user/updating/).

  - q: "How do I change the look of the desktop?"
    a: |
      From **Settings → Appearance** you can change the light/dark mode, the GTK theme, the
      icon pack and the cursor theme. Because the desktop interface is built with web
      technologies, it can also be modified with CSS without recompiling anything.

  - q: "Where is my configuration stored?"
    a: |
      In `~/.config/vasak/`. That is where `vasak.conf` holds the system configuration and
      `shortcuts.json` the custom keyboard shortcuts. It is best to change them from Settings
      rather than editing them by hand: the interface validates the values and applies the
      changes immediately.

  - q: "Can I customise the keyboard shortcuts?"
    a: |
      Yes, from Settings. You can see all the shortcuts, modify them, create new ones and
      detect conflicts between them.

  - q: "Does it support multiple monitors?"
    a: |
      Yes. Monitors are detected automatically and the wallpaper extends across all of them.

  - q: "Does VasakOS collect data?"
    a: |
      No. The system has no telemetry, sends no usage information to any server, and does not
      require creating an account. This website uses Google Analytics with the IP anonymised;
      the operating system does not.

  - q: "Is it free? Will it stay free?"
    a: |
      Yes to both. All the code is free under the GPL, and you can install it on as many
      machines as you like. The project is sustained by [donations](/en/donate/) and by the
      work of Vasak Group; none of that changes the licence or adds paid features.

  - q: "How can I help?"
    a: |
      Installing it and reporting what does not work is the most useful thing, and it does
      not require knowing how to program. If you also write code, the guide is in
      [contribution](/en/docs/devs/contribution/). Translations, documentation, icons and
      wallpapers are all needed too.
---
