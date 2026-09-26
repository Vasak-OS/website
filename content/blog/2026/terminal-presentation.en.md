---
Title: "Vasak Terminal: a modern Tauri-based terminal for the Vasak OS ecosystem"
tags: [ vasak os,
    vasak terminal,
    linux terminal,
    tauri,
    vuejs,
    rust,
    xterm,
    arch linux,
    open source]
date: "2026-03-16"
img: "https://i.postimg.cc/dVgZx66s/photo-2026-03-16-11-54-57.jpg"
---

The **Vasak OS** ecosystem keeps growing. After presenting new applications such as the file manager, today we want to show another fundamental component of the system: **Vasak Terminal**.

This is the terminal that will accompany **Vasak Desktop**, designed to integrate fully with the environment and to offer a modern, simple and powerful experience for Linux users.

Although there is still a lot to improve, we want to show a **first version in BETA state** of what will be the official terminal of the Vasak OS ecosystem.

---

## A terminal designed to integrate with the system

One of the goals of Vasak OS is to offer **a complete ecosystem of applications** that work coherently with each other.

Vasak Terminal follows that philosophy: it is not simply another terminal, but an application designed specifically to integrate with the desktop environment.

Among other things, this makes it possible to have:

- Integration with the **desktop theme** system
- Automatic support for **light and dark mode**
- Reactive behavior when the system's visuals change
- Use of the same **ecosystem core (VAPP Core)** that other applications such as the file manager use

This makes it possible to keep **a consistent visual experience across the whole system**.

---

## Technologies used

**Vasak Terminal** is part of the new architecture of the Vasak OS ecosystem, which is based on modern technologies. The application is built with:

- **Tauri** for the application framework
- **Vue.js** for the interface
- **TypeScript** for the frontend logic
- **Rust** in the backend
- **xterm.js** for the terminal rendering
- **pty in Rust** for the integration with the system shell

Using **pty in Rust** makes it possible to interact directly with the system shell, offering a real terminal experience while keeping the efficiency and safety that Rust provides.

This approach also makes it easier for the project to evolve and scale over time.

---

## Modular architecture

Following the same approach we use with other applications of the system, **Vasak Terminal is developed in its own repository**. This makes it possible to:

- Evolve the application without affecting the desktop
- Make it easier for new developers to collaborate
- Keep a modular architecture within the ecosystem

Project repository:

https://github.com/Vasak-OS/vasak-terminal

---

## Current features

Although we are still at an early development stage, the terminal already includes some important features. Among them:

- **Support for multiple tabs**
- Opening new tabs
- Closing tabs
- Interface integrated with the desktop design
- Support for **transparency**
- Automatic adaptation to **light and dark mode**

The tabs work with the same logic as other applications in the ecosystem, such as the file manager, keeping a consistent experience across the whole system.

---

## An interface integrated with the ecosystem

Vasak Terminal shares the same overall design as the other applications of the system. It includes:

- Top navigation bar
- Integrated tab system
- Reactive behavior when the system's visuals change
- Support for transparency

The goal is for the terminal **not to feel like a foreign application**, but like a natural part of the environment.

---

## A terminal for everyone

Although the terminal is a tool traditionally associated with advanced users, the goal of Vasak Terminal is to offer an experience that works both for:

- New users
- Intermediate users
- Advanced users

The idea is that **users should not need to install external terminals**, since the ecosystem itself will provide all the necessary tools. As development goes on we will be adding new features that improve productivity and expand the capabilities of the application.

---

## Project status

Currently **Vasak Terminal is in BETA state**.

The application will be included in the **next Vasak OS ISO**, which will bring several important changes to the ecosystem.

There is still a lot of work to do, but this first version already shows the direction the project is taking.

---

## Screenshot

Here you can see a preliminary view of Vasak Terminal running inside the environment:

![Vasak Terminal Screenshot](https://i.postimg.cc/dVgZx66s/photo-2026-03-16-11-54-57.jpg)

---

## A project open to the community

Like every component of Vasak OS, **Vasak Terminal is an open source project**. If you are interested in contributing to the development, you can do it from the official repository:

https://github.com/Vasak-OS/vasak-terminal

We are also looking for contributors in different areas:

- Development
- UI/UX
- Testing
- Documentation

The project is still at an early stage and **every contribution can make a big difference**.

---

We keep building the **VasakOS** ecosystem step by step. And this is just the beginning.
