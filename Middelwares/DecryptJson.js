const CryptoJS = require('crypto-js');

/**
 * @desc Decrypt AES-encrypted base64 string into JSON string
 * @param {string} JsonValue - base64 encrypted string
 * @returns {string} Decrypted JSON string
 */
const DecryptJson = (JsonValue) => {
  const key = CryptoJS.enc.Utf8.parse('123456$#@$^@1ERF');  // Must match EncryptJson key
  const iv = CryptoJS.enc.Utf8.parse('123456$#@$^@1ERF');   // Must match EncryptJson IV

  const decrypted = CryptoJS.AES.decrypt(JsonValue.toString(), key, {
    keySize: 128 / 8,
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  return decrypted.toString(CryptoJS.enc.Utf8); // Plaintext string
};
// let encryptedData = 'NfJGPNDt85rrr/82UkVKbo3gnGxFPjaVA+7gcGtCOLdtG5oZSqsM2E0hFk3HEWrn';

// try {
//   const decrypted = DecryptJson(encryptedData);
//   console.log('Decrypted data:', decrypted);
// } catch (err) {
//   console.error('❌ Failed to decrypt:', err.message);
// }
module.exports = DecryptJson;
