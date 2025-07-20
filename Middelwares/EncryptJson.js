const CryptoJS = require('crypto-js');

/**
 * @desc Encrypt JSON string using AES-128-CBC
 * @param {string} JsonValue - JSON string to encrypt
 * @returns {string} Encrypted base64 string
 */
const EncryptJson = (JsonValue) => {
  const key = CryptoJS.enc.Utf8.parse('123456$#@$^@1ERF');  
  const iv = CryptoJS.enc.Utf8.parse('123456$#@$^@1ERF');  
  const encrypted = CryptoJS.AES.encrypt(
    CryptoJS.enc.Utf8.parse(JsonValue.toString()), 
    key,
    {
      keySize: 128 / 8,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }
  );

  return encrypted.toString();
};

// const payload = {
//   data: {
//     spname: "get_all_test2",
//     parameters: {}
//   }
// };

// console.log(EncryptJson(JSON.stringify(payload)));

module.exports = EncryptJson;
