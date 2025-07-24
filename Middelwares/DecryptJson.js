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
let encryptedData = 'L07Vt9cydE1e3SEtnHt9umnGp743Sv6izDUvMbKHFntlgxlNlX/J8yTpHLqPsolBTj0ZRT8aS7o9xNHraoUxJjAcDs0VXZYHbI+mXI+PvPu3BYuAHfjYnsHRo32ryO1dVEo9JdqO+jEaAz4UPporEAr999vT1o9mLvDhOzIGut0+q6/ilJ5EFq2Be9Q/zraSTaFTha+/sCE+84CoFnP4jC7+UoWstg2ggcgS0zbNC2pcZ25BDGIuxAs/xDXzLgc1933qVDBJBH04D1iC0/ySv+8Tiv9t+RAmxbhwBKfRbzfnM3vz8ALF9Q8Db7Lhcm9cdNITDXzle7vfSygwcU12/qgzy+DXxaFiuEGaX9mrfd7rffgP2k18dABPiHRRD7Fcd8MfL7/vItJ2mPfATmSz9PXMnps6iW7jxyEwFBACKjRe18g+CZh2NoHj7GAeDNZo';

try {
  const decrypted = DecryptJson(encryptedData);
  console.log('Decrypted data:', decrypted);
} catch (err) {
  console.error('❌ Failed to decrypt:', err.message);
}
module.exports = DecryptJson;
