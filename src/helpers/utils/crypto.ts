import CryptoES from 'crypto-es';

export class CryptoUtil {
  static getEncrypted(value: string|number, secreteKey: string): string {
    return CryptoES.AES.encrypt(value.toString().trim(), secreteKey.trim()).toString();
  }

  static getDecrypted(value: string, secreteKey: string): string {
    return CryptoES.AES.decrypt(value, secreteKey).toString(CryptoES.enc.Utf8);
  }
}
