import CryptoJS from 'crypto-js';

/**
 * Generates a random 256-bit key for AES.
 */
export function generateKey(): string {
  return CryptoJS.lib.WordArray.random(32).toString();
}

/**
 * Encrypts text using AES-256 with a passphrase/key.
 */
export function encryptText(text: string, key: string): string {
  return CryptoJS.AES.encrypt(text, key).toString();
}

/**
 * Decrypts AES-256-encrypted text.
 */
export function decryptText(ciphertext: string, key: string): string {
  const bytes = CryptoJS.AES.decrypt(ciphertext, key);
  return bytes.toString(CryptoJS.enc.Utf8);
}
