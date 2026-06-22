const ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789'

/** Token corto, legible en una URL, generado con randomness criptográfica del navegador. */
export function generateToken(length = 10): string {
  const bytes = new Uint8Array(length)
  crypto.getRandomValues(bytes)
  let token = ''
  for (const b of bytes) {
    token += ALPHABET[b % ALPHABET.length]
  }
  return token
}
