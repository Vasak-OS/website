---
Title: "Donaciones"
tags:
  - "donar"
  - "donaciones"
  - "colaborar"
  - "ayudar"
  - "vasakos"
  - "donate"
  - "donations"
  - "donadores"
  - "donators"
img: "/img/posts/donate.svg"
description: "Ayuda a sostener y mejorar VasakOS con total transparencia sobre el destino de los fondos."

# La prosa de este bloque no está acá: sale de i18n por el `id` de cada
# elemento, igual que los componentes en `data/components.yml`. Quedarse con
# los textos en el front matter hacía que la página en inglés mostrara
# "Infraestructura, desarrollo y calidad de la distribución" como si fuera el
# idioma de quien la lee. Acá queda la estructura: el orden, las direcciones,
# los importes y las URLs, que son los mismos en los dos idiomas.
#
# El desglose suma el objetivo: 150 + 80 + 120 + 200 + 200 = 750. Si se mueve un
# importe hay que mover el total (y el plan `monthly-goal` de static/funding.json,
# que la prueba de funding lee junto a este archivo).
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

Cada aporte, por pequeño que sea, nos permite sostener el proyecto y seguir construyendo una mejor experiencia para todos.