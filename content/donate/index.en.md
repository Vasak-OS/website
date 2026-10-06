---
Title: "Donate"
tags:
  - "donate"
  - "donations"
  - "vasakos"
  - "donors"
img: "/img/posts/donate.svg"
description: "Help sustain and improve VasakOS, with complete transparency about where the money goes."

# The prose in this block is not here: it comes from i18n through the `id` of each
# element, the same way the components in `data/components.yml` do. Keeping the
# text in the front matter meant the English page showed "Infraestructura,
# desarrollo y calidad de la distribucion" as if it were the language of whoever
# was reading. What stays here is the structure: the order, the addresses, the
# amounts and the URLs, which are the same in both languages.
#
# The breakdown adds up to the goal: 150 + 80 + 120 + 200 + 200 = 750. Moving an
# amount means moving the total too (and the `monthly-goal` plan in
# static/funding.json, which the funding test reads next to this file).
donations:
  monthly_goal: "USD $750"
  budget:
    - id: distribution
      amount: "USD $150"
    - id: community
      amount: "USD $80"
    - id: tooling
      amount: "USD $120"
    - id: services
      amount: "USD $200"
    - id: maintenance
      amount: "USD $200"
  transparency:
    - id: stability
    - id: channels
    - id: purpose
  methods:
    - id: github-sponsors
      url: "https://github.com/sponsors/Vasak-OS"
    - id: mercadopago
      url: "https://link.mercadopago.com.ar/joaquindecima"
    - id: paypal
      url: "https://paypal.me/joaquindecima"
    - id: lemon
      address: "$patojad"
    - id: ethereum
      address: "0xF3f0B0CdaF01C68E4D64c2Ad3A703aBe252278EB"
    - id: bitcoin
      address: "bc1qjedvfvz6h9d0rjp2mz70y90mylpx8hr52fcmsp"
  community_url: "https://t.me/VasakOS"
  issues_url: "https://github.com/Vasak-OS"
  github_sponsors_embed: "https://github.com/sponsors/Vasak-OS/card"
---

Every contribution, however small, lets us sustain the project and keep building a
better experience for everyone.
