import CryptoES from 'crypto-es';

export class CryptoUtil {
  static encrypt(value: string, key: string): string {
    return CryptoES.AES.encrypt(value.trim(), key.trim()).toString();
  }

  static decrypt(value: string, key: string): string {
    return CryptoES.AES.decrypt(value, key).toString(CryptoES.enc.Utf8);
  }
}
