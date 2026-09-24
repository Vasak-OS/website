// Las verificaciones de dirección se prueban contra los vectores publicados en
// cada especificación. Sin esto, una implementación que dijera siempre «sí»
// dejaría pasar cualquier dirección mal copiada.
import { describe, expect, test } from 'bun:test';
import { isValidBitcoinBech32, isValidEthereumChecksum, keccak256Hex } from './address-checksums';

const text = (s: string) => new TextEncoder().encode(s);

describe('keccak-256', () => {
  test('da los resúmenes conocidos, que no son los de SHA3-256', () => {
    expect(keccak256Hex(text(''))).toBe('c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470');
    expect(keccak256Hex(text('abc'))).toBe('4e03657aea45a94fc7d47ba826c8d667c0d1e6e33a64a036ec44f58fa12d6c45');
  });

  test('funciona con entradas de más de un bloque', () => {
    // 200 bytes > 136, el tamaño de bloque: obliga a absorber dos veces.
    expect(keccak256Hex(text('a'.repeat(200)))).toHaveLength(64);
    expect(keccak256Hex(text('a'.repeat(200)))).not.toBe(keccak256Hex(text('a'.repeat(199))));
  });
});

describe('EIP-55', () => {
  test('acepta los vectores de la especificación', () => {
    expect(isValidEthereumChecksum('0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed')).toBe(true);
    expect(isValidEthereumChecksum('0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359')).toBe(true);
    expect(isValidEthereumChecksum('0xdbF03B407c01E7cD3CBea99509d93f8DDDC8C6FB')).toBe(true);
  });

  test('rechaza una sola letra con la caja cambiada', () => {
    expect(isValidEthereumChecksum('0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAeD')).toBe(false);
  });

  test('rechaza lo que no trae checksum o no tiene forma de dirección', () => {
    expect(isValidEthereumChecksum('0x5aaeb6053f3e94c9b9a09f33669435e7ef1beaed')).toBe(false);
    expect(isValidEthereumChecksum('0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeA')).toBe(false);
  });
});

describe('bech32 de Bitcoin', () => {
  test('acepta SegWit v0 (bech32) y taproot (bech32m)', () => {
    expect(isValidBitcoinBech32('bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq')).toBe(true);
    expect(
      isValidBitcoinBech32('bc1p5d7rjq7g6rdk2yhzks9smlaqtedr4dekq08ge8ztwac72sfr9rusxg3297'),
    ).toBe(true);
  });

  test('rechaza un solo carácter cambiado', () => {
    expect(isValidBitcoinBech32('bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdr')).toBe(false);
  });

  test('rechaza otra red, mayúsculas mezcladas y caracteres fuera del alfabeto', () => {
    expect(isValidBitcoinBech32('tb1qw508d6qejxtdg4c3cdlp9w6z9aqk5yx4rw8u3e')).toBe(false);
    expect(isValidBitcoinBech32('bc1qAr0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq')).toBe(false);
    expect(isValidBitcoinBech32('bc1qbr0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq')).toBe(false);
  });
});
