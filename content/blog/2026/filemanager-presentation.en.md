---
Title: "Vasak File Manager: a new file explorer for Vasak OS"
tags: [vasak os, vasak file manager, linux desktop, file manager, open source, rust, tauri, vuejs, linux desktop environment]
date: "2026-03-10"
img: "https://i.postimg.cc/9QN6TtXx/image.png"
---
While migrating several components of Vasak OS to Rust we took an important architectural decision: unify several modules of the system into shared processes to simplify the desktop's internal communication.

Although that decision let us move faster in the early stages of the project, over time it started to show some limitations, especially when it came to **scaling complex features**.

One of the most affected components was the file explorer.

The original file manager was integrated directly into the desktop and worked mainly as a **basic file viewer**, which made it hard to expand its capabilities without impacting the general architecture of the system.

For that reason we decided to **separate it completely into its own application**.

Today we want to show a **preliminary version of the new Vasak File Manager**, a much more complete file explorer, ready to evolve together with the system.

---

# A new architecture

The new file explorer lives in its own repository:

https://github.com/Vasak-OS/vasak-file-manager

While the previous component was removed from the main desktop:

https://github.com/Vasak-OS/vasak-desktop

This change brings several important advantages:

- greater independence between the components of the system
- a more scalable architecture
- faster development of new features
- less complexity in the desktop code

The new **Vasak File Manager** is developed using:

- **Tauri**
- **VueJS**
- **TypeScript**

This combination makes it possible to build a modern application with a highly reactive interface while, at the same time, keeping good integration with the system.

On top of that, the file explorer **integrates with the Vasak OS theme system and with the reactivity of the desktop**, which guarantees a consistent visual experience.

The project takes **Sigma File Manager** as its technical inspiration, adapting its approach to fit the Vasak OS ecosystem.

---

# A completely renewed interface

One of the main goals of the new explorer was to improve the visual and navigation experience.

The file manager currently has two view modes:

## List view

Ideal for working with large amounts of files and viewing information in an orderly way.

![List view](https://i.postimg.cc/J0VmX3xz/image.png)

## Grid view

Designed for visual navigation, especially useful when working with images or multimedia content.

![Grid view](https://i.postimg.cc/rwnkj2jj/image.png)

Both modes share a more modern aesthetic that is consistent with the rest of the desktop.

---

# Tab system

The new explorer includes **a full tab system**, similar to that of modern browsers.

Among the available features:

- opening folders in new tabs
- duplicating tabs
- rearranging tabs with drag & drop
- opening directories in new tabs from the context menu

This makes it possible to work with multiple locations in the file system much more efficiently.

![Tabs](https://i.postimg.cc/QNQZPTS5/image.png)

---

# Integrated search

The explorer includes **real-time search** inside the current directory.

As the user types, the results update automatically, which makes it possible to find files quickly without interrupting the workflow.

---

# File preview

One of the most visible improvements is the addition of **file preview in the sidebar**.

It currently supports:

- images
- videos

This makes it possible to inspect files without having to open external applications.

![Preview](https://i.postimg.cc/9QN6TtXx/image.png)

---

# Available features

On top of the main improvements, the new explorer already includes several advanced capabilities:

- drag & drop of files
- file operations (copy, move, delete)
- **split view** support
- a path bar with breadcrumbs
- automatic thumbnails
- asynchronous operations
- multiple selection
- context menu
- keyboard shortcuts

These features make the explorer far more powerful than the previous implementation.

---

# A project in evolution

Although the new **Vasak File Manager** already works, it is still at an early development stage.

We want to share this preliminary version to show the progress of the project and to start building a solid foundation for the future of the system.

Our goal is to keep improving the user experience and to offer ever more complete tools within the Vasak OS ecosystem.

---

# Try the project

The development of the new file explorer is completely open.

* Project repository: https://github.com/Vasak-OS/vasak-file-manager

If you are interested in the development of Vasak OS, we invite you to follow the repository and take part in the project.
