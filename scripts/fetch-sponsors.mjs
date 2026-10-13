#!/usr/bin/env node
//
// fetch-sponsors.mjs — arma `data/sponsors.yml` con quien patrocina a VasakOS
// en GitHub Sponsors, para que el muro de donadores de /donate/ se llene solo
// en cada deploy.
//
// Hay dos caminos, y el script elige el mejor que tenga a mano:
//
//   1. Con `SPONSORS_TOKEN` en el entorno consulta la API GraphQL oficial
//      (`organization.sponsorshipsAsMaintainer`) y trae, además del login y el
//      avatar, la fecha de inicio del patrocinio y el nombre del tier. El token
//      es un PAT con `read:org`, y sin él GitHub no entrega el listado.
//
//   2. Sin token lee la página pública `github.com/sponsors/Vasak-OS`, que
//      GitHub renderiza en el servidor con los patrocinios públicos: una sola
//      petición por deploy, sin autenticación y sin secret que crear.
//
// Los patrocinios privados no se publican nunca, ni con token: GitHub sólo se
// los muestra al maintainer, y publicarlos sería romper la confianza de quien
// eligió no aparecer. La vía GraphQL los filtra por `privacyLevel`.
//
// El script no rompe el build: si las dos vías fallan —sin red, GitHub
// cambió el HTML— deja el archivo que ya estaba y termina en cero. Un muro con
// los donadores del último deploy es mejor que una publicación caída.
//
// Por qué no se usa una API de terceros: `ghs.vercel.app` y parecidos devuelven
// lo mismo, pero atarían el sitio oficial a un servicio ajeno que puede
// desaparecer o cambiar sin aviso. La única dependencia acá es GitHub.
//
// Uso: `bun run sponsors` (o `bun scripts/fetch-sponsors.mjs`).

import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = resolve(ROOT, "data/sponsors.yml");

/** La cuenta que recibe los patrocinios. */
export const ACCOUNT = "Vasak-OS";

/** El tamaño con que se piden los avatares: el muro los dibuja a 48 px, y a
    esa medida un `s=60` se ve blando en pantallas HiDPI. */
const AVATAR_SIZE = 144;

/**
 * Los patrocinios públicos de la página, en orden. Pura y exportada para poder
 * probarla contra un HTML guardado sin salir a la red.
 *
 * La lista vive dentro de `<div id="sponsors">…</div>`, entre las etiquetas de
 * `remote-pagination`; afuera de ese bloque GitHub también enlaza usuarios —el
 * propio maintainer, los miembros del equipo—, así que recortar antes de
 * buscar evita contarlos como donadores.
 *
 * @param {string} html
 * @returns {{login: string, avatar: string, url: string}[]}
 */
export function parseSponsorsPage(html) {
  const inicio = html.indexOf('id="sponsors"');
  if (inicio === -1) return [];
  const fin = html.indexOf("</remote-pagination>", inicio);
  const bloque = html.slice(inicio, fin === -1 ? undefined : fin);

  const donadores = [];
  const vistos = new Set();
  // Cada donador es un `<a href="/LOGIN">` con un `<img alt="@LOGIN">` adentro.
  // Se exige que el `href` y el `alt` coincidan: es lo que distingue al enlace
  // del donador de cualquier otro enlace a un usuario.
  for (const m of bloque.matchAll(
    /<a\b[^>]*href="\/([^"/?#]+)"[^>]*>[\s\S]*?<img\b[^>]*src="([^"]+)"[^>]*alt="@([^"]+)"/g,
  )) {
    const [, href, src, alt] = m;
    if (href !== alt || vistos.has(href)) continue;
    vistos.add(href);
    donadores.push({ login: href, avatar: sizedAvatar(src), url: `https://github.com/${href}` });
  }
  return donadores;
}

/** El avatar que GitHub sirve a 60 px pasa a pedirse del tamaño del muro. */
function sizedAvatar(src) {
  const limpio = src.replace(/&amp;/g, "&");
  return limpio.replace(/([?&]s=)\d+/, `$1${AVATAR_SIZE}`);
}

/**
 * Los patrocinios activos de la organización, por GraphQL. Trae lo que la
 * página pública no dice: la fecha de inicio y el tier.
 *
 * @param {string} account
 * @param {string} token
 */
export async function fetchSponsorsGraphQL(account, token) {
  const query = `
    query Sponsors($login: String!) {
      organization(login: $login) {
        sponsorshipsAsMaintainer(
          first: 100
          activeOnly: true
          orderBy: { field: CREATED_AT, direction: DESC }
        ) {
          nodes {
            createdAt
            privacyLevel
            tier { name }
            sponsorEntity {
              __typename
              ... on User { login name avatarUrl url }
              ... on Organization { login name avatarUrl url }
            }
          }
        }
      }
    }`;

  const respuesta = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "VasakOS-website-build",
    },
    body: JSON.stringify({ query, variables: { login: account } }),
  });
  if (!respuesta.ok) {
    throw new Error(`GraphQL respondió ${respuesta.status}`);
  }
  const cuerpo = await respuesta.json();
  if (cuerpo.errors?.length) {
    throw new Error(`GraphQL: ${cuerpo.errors.map((e) => e.message).join("; ")}`);
  }

  const nodos = cuerpo.data?.organization?.sponsorshipsAsMaintainer?.nodes ?? [];
  return nodos
    .filter((n) => n.privacyLevel === "PUBLIC" && n.sponsorEntity?.login)
    .map((n) => ({
      login: n.sponsorEntity.login,
      name: n.sponsorEntity.name || "",
      avatar: sizedAvatar(n.sponsorEntity.avatarUrl || ""),
      url: n.sponsorEntity.url || `https://github.com/${n.sponsorEntity.login}`,
      since: (n.createdAt || "").slice(0, 10),
      tier: n.tier?.name || "",
    }));
}

/**
 * Los patrocinios públicos leídos de la página de GitHub. Sin token, es la
 * única vía que existe.
 *
 * @param {string} account
 */
export async function fetchSponsorsPage(account) {
  const respuesta = await fetch(`https://github.com/sponsors/${account}`, {
    headers: {
      Accept: "text/html",
      "User-Agent": "VasakOS-website-build (+https://os.vasak.net.ar/)",
    },
  });
  if (!respuesta.ok) {
    throw new Error(`La página pública respondió ${respuesta.status}`);
  }
  return parseSponsorsPage(await respuesta.text());
}

/** Un escalar de YAML entre comillas dobles. Un string de JSON ya es YAML válido. */
const y = (valor) => JSON.stringify(String(valor));

/** El contenido de `data/sponsors.yml`, listo para escribir. */
export function serialize(sponsors, source, updated) {
  const lineas = [
    "# GENERADO por scripts/fetch-sponsors.mjs — no editar a mano.",
    "# Lo rehace cada deploy; el que está commiteado es sólo el respaldo para",
    "# compilar sin red. Ver el encabezado del script para las dos vías.",
    `updated: ${y(updated)}`,
    `source: ${y(source)}`,
    "sponsors:",
  ];
  if (sponsors.length === 0) {
    lineas.push("  []");
  } else {
    for (const s of sponsors) {
      lineas.push(`  - login: ${y(s.login)}`);
      if (s.name) lineas.push(`    name: ${y(s.name)}`);
      lineas.push(`    avatar: ${y(s.avatar)}`);
      lineas.push(`    url: ${y(s.url)}`);
      if (s.since) lineas.push(`    since: ${y(s.since)}`);
      if (s.tier) lineas.push(`    tier: ${y(s.tier)}`);
    }
  }
  return `${lineas.join("\n")}\n`;
}

/** Lo que cambió se compara sin la fecha, para no ensuciar el árbol por un deploy sin novedades. */
const sinFecha = (texto) =>
  texto
    .split("\n")
    .filter((linea) => !linea.startsWith("updated:"))
    .join("\n");

async function main() {
  const token = process.env.SPONSORS_TOKEN?.trim();
  let sponsors;
  let source;
  try {
    if (token) {
      sponsors = await fetchSponsorsGraphQL(ACCOUNT, token);
      source = "graphql";
    } else {
      sponsors = await fetchSponsorsPage(ACCOUNT);
      source = "public-page";
    }
  } catch (error) {
    console.warn(`[sponsors] No se pudo actualizar (${error.message}); queda el archivo anterior.`);
    return;
  }

  const contenido = serialize(sponsors, source, new Date().toISOString());
  const previo = existsSync(OUT) ? await readFile(OUT, "utf8") : "";
  if (sinFecha(previo) === sinFecha(contenido)) {
    console.log(`[sponsors] Sin cambios: ${sponsors.length} donadores (${source}).`);
    return;
  }
  await writeFile(OUT, contenido);
  console.log(`[sponsors] ${sponsors.length} donadores escritos en data/sponsors.yml (${source}).`);
}

if (import.meta.main) await main();
