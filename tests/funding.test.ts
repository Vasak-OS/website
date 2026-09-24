// El manifiesto de financiamiento lo lee una máquina —FLOSS/fund y cualquiera
// que siga https://fundingjson.org— y la rechaza entera por un campo fuera de
// forma, sin avisarle a nadie de acá. Estas pruebas son las reglas del esquema
// v1.0.0 que se pueden romper editando a mano.
import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { isValidBitcoinBech32, isValidEthereumChecksum } from './address-checksums';

const manifest = JSON.parse(readFileSync('static/funding.json', 'utf8'));
const wellKnown = readFileSync('static/.well-known/funding-manifest-urls', 'utf8');
const config = readFileSync('config/_default/config.yaml', 'utf8');

const guid = /^[a-z0-9-]{1,32}$/;
const tag = /^[a-z0-9-]{1,32}$/;
const currency = /^[A-Z]{3}$/;

describe('funding.json', () => {
  test('declara la versión del esquema', () => {
    expect(manifest.version).toBe('v1.0.0');
  });

  test('la entidad tiene los campos obligatorios y dentro de los límites', () => {
    const e = manifest.entity;
    expect(['individual', 'group', 'organisation', 'other']).toContain(e.type);
    expect(['owner', 'steward', 'maintainer', 'contributor', 'other']).toContain(e.role);
    expect(e.name.length).toBeGreaterThan(0);
    expect(e.name.length).toBeLessThanOrEqual(250);
    expect(e.email).toMatch(/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/);
    expect(e.description.length).toBeLessThanOrEqual(2000);
    expect(e.webpageUrl.url).toMatch(/^https?:\/\//);
  });

  test('cada proyecto cumple el esquema', () => {
    expect(manifest.projects.length).toBeGreaterThan(0);
    for (const p of manifest.projects) {
      expect(p.guid).toMatch(guid);
      expect(p.name.trim().length).toBeGreaterThan(0);
      expect(p.name.length).toBeLessThanOrEqual(250);
      expect(p.description.length).toBeLessThanOrEqual(2000);
      expect(p.webpageUrl.url).toMatch(/^https?:\/\//);
      expect(p.repositoryUrl.url).toMatch(/^https?:\/\//);
      expect(p.licenses.length).toBeGreaterThan(0);
      expect(p.licenses.length).toBeLessThanOrEqual(5);
      for (const l of p.licenses) expect(l).toMatch(/^spdx:/);
      expect(p.tags.length).toBeLessThanOrEqual(10);
      for (const t of p.tags) expect(t).toMatch(tag);
    }
  });

  test('un repositorio en otro dominio trae cómo verificarlo', () => {
    // Una URL en otro host que el manifiesto queda «sin verificar» si no
    // apunta a un funding-manifest-urls que viva debajo de ella misma.
    for (const p of manifest.projects) {
      const { url, wellKnown: wk } = p.repositoryUrl;
      if (new URL(url).host === 'os.vasak.net.ar') continue;
      expect(wk).toStartWith(url.replace(/\/$/, ''));
      expect(wk).toEndWith('/.well-known/funding-manifest-urls');
    }
  });

  test('los planes sólo nombran canales que existen', () => {
    const channels = new Set(manifest.funding.channels.map((c: { guid: string }) => c.guid));
    for (const c of manifest.funding.channels) {
      expect(c.guid).toMatch(guid);
      expect(['bank', 'payment-provider', 'cheque', 'cash', 'other']).toContain(c.type);
    }
    for (const plan of manifest.funding.plans) {
      expect(plan.guid).toMatch(guid);
      expect(plan.name.trim().length).toBeGreaterThan(0);
      expect(['active', 'inactive']).toContain(plan.status);
      expect(plan.currency).toMatch(currency);
      expect(typeof plan.amount).toBe('number');
      expect(['one-time', 'weekly', 'fortnightly', 'monthly', 'yearly', 'other']).toContain(
        plan.frequency,
      );
      expect(plan.channels.length).toBeGreaterThan(0);
      for (const c of plan.channels) expect(channels.has(c)).toBe(true);
    }
  });

  test('la meta mensual es la misma que publica la página de donaciones', () => {
    // Dos lugares dicen cuánto se necesita; si uno cambia y el otro no, quien
    // financia lee dos números distintos.
    const donate = readFileSync('content/donate/index.md', 'utf8');
    const goal = donate.match(/monthly_goal:\s*"USD \$(\d+)"/)?.[1];
    const plan = manifest.funding.plans.find((p: { guid: string }) => p.guid === 'monthly-goal');
    expect(goal).toBeDefined();
    expect(plan.amount).toBe(Number(goal));
  });
});

describe('.well-known/funding-manifest-urls', () => {
  test('apunta al manifiesto en la dirección publicada del sitio', () => {
    const base = config.match(/^baseURL:\s*"([^"]+)"/m)?.[1];
    expect(base).toBeDefined();
    expect(wellKnown.trim()).toBe(new URL('funding.json', base).href);
  });
});

describe('los medios de pago', () => {
  const donate = readFileSync('content/donate/index.md', 'utf8');
  // Del bloque `methods:` de la página, cada `url:` o `address:`. Sin parser de
  // YAML a propósito: el bloque es plano y una dependencia sólo para esto no
  // vale lo que cuesta.
  const block = donate.slice(donate.indexOf('  methods:'), donate.indexOf('  community_url:'));
  const onPage = [...block.matchAll(/^\s+(?:url|address):\s*"([^"]+)"/gm)].map((m) => m[1]);
  const inManifest = manifest.funding.channels.map((c: { address: string }) => c.address);

  test('la página y el manifiesto ofrecen los mismos', () => {
    // Si se agrega uno en un lado y no en el otro, quien financia desde
    // FLOSS/fund y quien dona desde el sitio ven opciones distintas.
    expect(onPage.length).toBeGreaterThan(0);
    expect([...onPage].sort()).toEqual([...inManifest].sort());
  });

  test('ninguna dirección se repite', () => {
    expect(new Set(inManifest).size).toBe(inManifest.length);
  });

  test('toda dirección de Ethereum publicada trae el checksum bien', () => {
    const eth = [...onPage, ...inManifest].filter((a) => a.startsWith('0x'));
    expect(eth.length).toBeGreaterThan(0);
    for (const a of eth) expect(isValidEthereumChecksum(a)).toBe(true);
  });

  test('toda dirección de Bitcoin publicada trae el checksum bien', () => {
    const btc = [...onPage, ...inManifest].filter((a) => /^bc1/i.test(a));
    expect(btc.length).toBeGreaterThan(0);
    for (const a of btc) expect(isValidBitcoinBech32(a)).toBe(true);
  });
});
