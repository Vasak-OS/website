// Los checksums de las direcciones que se publican para donar. Una dirección
// cripto mal copiada no rebota: la transferencia sale y la plata se pierde. Las
// dos formas que usamos traen su propia verificación, y esto la hace.

// ── Bitcoin: bech32 / bech32m (BIP 173 y BIP 350) ────────────────────────────

const BECH32_CHARSET = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';

function bech32Polymod(values: number[]): number {
  const gen = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];
  let chk = 1;
  for (const v of values) {
    const top = chk >>> 25;
    chk = ((chk & 0x1ffffff) << 5) ^ v;
    for (let i = 0; i < 5; i++) if ((top >>> i) & 1) chk ^= gen[i];
  }
  return chk >>> 0;
}

/** Si `address` es una dirección bech32 o bech32m de la red principal de Bitcoin con el checksum bien. */
export function isValidBitcoinBech32(address: string): boolean {
  if (address !== address.toLowerCase() && address !== address.toUpperCase()) return false;
  const lower = address.toLowerCase();
  const sep = lower.lastIndexOf('1');
  if (sep < 1 || lower.length - sep < 7 || lower.length > 90) return false;
  const hrp = lower.slice(0, sep);
  if (hrp !== 'bc') return false;
  const data: number[] = [];
  for (const c of lower.slice(sep + 1)) {
    const v = BECH32_CHARSET.indexOf(c);
    if (v === -1) return false;
    data.push(v);
  }
  const expanded = [
    ...[...hrp].map((c) => (c.codePointAt(0) ?? 0) >> 5),
    0,
    ...[...hrp].map((c) => (c.codePointAt(0) ?? 0) & 31),
  ];
  const check = bech32Polymod([...expanded, ...data]);
  // La versión 0 de testigo (bc1q…) usa bech32; las demás (bc1p…, taproot), bech32m.
  const expected = data[0] === 0 ? 1 : 0x2bc830a3;
  return check === expected;
}

// ── Ethereum: EIP-55, que es keccak-256 sobre la dirección en minúsculas ─────
//
// Keccak-256 no es SHA3-256: comparten la permutación y difieren en el relleno
// (0x01 contra 0x06), así que el `sha3-256` de Bun no sirve y va a mano.

const ROUND_CONSTANTS = [
  0x0000000000000001n, 0x0000000000008082n, 0x800000000000808an, 0x8000000080008000n,
  0x000000000000808bn, 0x0000000080000001n, 0x8000000080008081n, 0x8000000000008009n,
  0x000000000000008an, 0x0000000000000088n, 0x0000000080008009n, 0x000000008000000an,
  0x000000008000808bn, 0x800000000000008bn, 0x8000000000008089n, 0x8000000000008003n,
  0x8000000000008002n, 0x8000000000000080n, 0x000000000000800an, 0x800000008000000an,
  0x8000000080008081n, 0x8000000000008080n, 0x0000000080000001n, 0x8000000080008008n,
];
const ROTATIONS = [
  0, 1, 62, 28, 27, 36, 44, 6, 55, 20, 3, 10, 43, 25, 39, 41, 45, 15, 21, 8, 18, 2, 61, 56, 14,
];
const MASK = (1n << 64n) - 1n;

function rotl(x: bigint, n: number): bigint {
  if (n === 0) return x;
  return ((x << BigInt(n)) | (x >> BigInt(64 - n))) & MASK;
}

// Los tres pasos de cada ronda, por separado: juntos en un solo bucle quedan
// cinco niveles de anidación y se leen peor que la especificación.

function theta(s: bigint[]): void {
  const c = [0, 1, 2, 3, 4].map((x) => s[x] ^ s[x + 5] ^ s[x + 10] ^ s[x + 15] ^ s[x + 20]);
  for (let x = 0; x < 5; x++) {
    const d = c[(x + 4) % 5] ^ rotl(c[(x + 1) % 5], 1);
    for (let y = 0; y < 25; y += 5) s[x + y] ^= d;
  }
}

function rhoPi(s: bigint[]): bigint[] {
  const b: bigint[] = new Array(25);
  for (let x = 0; x < 5; x++)
    for (let y = 0; y < 5; y++) b[y + 5 * ((2 * x + 3 * y) % 5)] = rotl(s[x + 5 * y], ROTATIONS[x + 5 * y]);
  return b;
}

function chi(s: bigint[], b: bigint[]): void {
  for (let x = 0; x < 5; x++)
    for (let y = 0; y < 5; y++)
      s[x + 5 * y] = b[x + 5 * y] ^ (~b[((x + 1) % 5) + 5 * y] & MASK & b[((x + 2) % 5) + 5 * y]);
}

function keccakF(s: bigint[]): void {
  for (const rc of ROUND_CONSTANTS) {
    theta(s);
    chi(s, rhoPi(s));
    s[0] ^= rc; // iota
  }
}

/** Keccak-256 de `input`, en hexadecimal. */
export function keccak256Hex(input: Uint8Array): string {
  const rate = 136;
  const padded = new Uint8Array(Math.ceil((input.length + 1) / rate) * rate);
  padded.set(input);
  padded[input.length] ^= 0x01;
  padded[padded.length - 1] ^= 0x80;
  const s: bigint[] = new Array(25).fill(0n);
  for (let off = 0; off < padded.length; off += rate) {
    for (let i = 0; i < rate / 8; i++) {
      let lane = 0n;
      for (let j = 7; j >= 0; j--) lane = (lane << 8n) | BigInt(padded[off + i * 8 + j]);
      s[i] ^= lane;
    }
    keccakF(s);
  }
  let out = '';
  for (let i = 0; i < 4; i++)
    for (let j = 0; j < 8; j++) out += Number((s[i] >> BigInt(8 * j)) & 0xffn).toString(16).padStart(2, '0');
  return out;
}

/**
 * Si `address` es una dirección de Ethereum con el checksum de EIP-55 bien.
 * Todo en minúsculas o todo en mayúsculas no trae checksum, y se rechaza: lo
 * que se publica tiene que poder verificarse.
 */
export function isValidEthereumChecksum(address: string): boolean {
  if (!/^0x[0-9a-fA-F]{40}$/.test(address)) return false;
  const hex = address.slice(2);
  if (hex === hex.toLowerCase() || hex === hex.toUpperCase()) return false;
  const hash = keccak256Hex(new TextEncoder().encode(hex.toLowerCase()));
  for (let i = 0; i < 40; i++) {
    const c = hex[i];
    if (/\d/.test(c)) continue;
    const upper = Number.parseInt(hash[i], 16) >= 8;
    if (upper !== (c === c.toUpperCase())) return false;
  }
  return true;
}
