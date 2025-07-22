// const { pool } = require('../../Database/postgresdb');
// const express = require('express');
// const { success, error } = require('../../Middelwares/apiResponse');
// const NodeCache = require("node-cache");
// const myCache = new NodeCache();
// const getipaddress = require('../../Middelwares/getipaddress');
// const EncryptJson = require('../../Middelwares/EncryptJson');
// const DecryptJson = require('../../Middelwares/DecryptJson');
// const bodyparser = require('body-parser')
// const router = express.Router();
// router.use(bodyparser.json())

// /**
//  * Build PG-style named parameter query string:
//  * E.g., name := 'rakesh', age := 28
//  */
// function buildPGNamedParams(obj) {
//   return Object.entries(obj)
//     .map(([key, value]) => {
//       if (value === null || value === undefined) return `${key} := NULL`;
//       if (typeof value === 'string') return `${key} := '${value.replace(/'/g, "''")}'`;
//       return `${key} := ${value}`;
//     })
//     .join(', ');
// }

// router.post('/', getipaddress, async (req, res) => {
//   try {
//     // 🔓 Decrypt the incoming payload
//     const decryptedBody = await DecryptJson(req.body.data);
//     req.body = JSON.parse(decryptedBody);

//     // 🎯 Extract required values
//     const { spname, parameters = {} } = req.body.data;

//     // 🧠 Construct SQL: SELECT * FROM spname(param := value, ...)
//     const query = `SELECT * FROM ${spname}(${buildPGNamedParams(parameters)});`;
//     console.log('query' , query)
//     // 📡 Run query
//     const result = await pool.query(query);

//     // 📦 Format & Encrypt result
//     const finalData = result.rows.length > 1 ? result.rows : (result.rows[0] || { status: "done" });
//     const encryptedJson = EncryptJson(JSON.stringify({ data: finalData }));

//     // ✅ Respond
//     res.setHeader('Content-Type', 'application/json; charset=UTF-8');
//     res.json(success("Success", encryptedJson, res.statusCode));

//     // 🧠 Optional cache
//     myCache.set("language", finalData, 10000);

//   } catch (err) {
//     console.error('❌ Error in PG Index API:', err);
//     res.setHeader('Content-Type', 'application/json; charset=UTF-8');
//     res.status(500).json(error(err.message || 'Internal Server Error', 500));
//   }
// });

// module.exports = router;

const { pool } = require('../../Database/postgresdb');
const express = require('express');
const { success, error } = require('../../Middelwares/apiResponse');
const NodeCache = require("node-cache");
const myCache = new NodeCache();
const getipaddress = require('../../Middelwares/getipaddress');
const EncryptJson = require('../../Middelwares/EncryptJson');
const DecryptJson = require('../../Middelwares/DecryptJson');
const bodyparser = require('body-parser');

const router = express.Router();
router.use(bodyparser.json());

/**
 * Build PG-style named parameter query string:
 * E.g., name := 'rakesh', age := 28
 */
function buildPGNamedParams(obj) {
  return Object.entries(obj)
    .map(([key, value]) => {
      if (value === null || value === undefined) return `${key} := NULL`;
      if (typeof value === 'string') return `${key} := '${value.replace(/'/g, "''")}'`;
      return `${key} := ${value}`;
    })
    .join(', ');
}

router.post('/', getipaddress, async (req, res) => {
  try {
    // ✅ Step 1: Validate body
    if (!req.body?.data) {
      return res.status(400).json(error("Missing encrypted 'data' in request body", 400));
    }

    // 🔓 Step 2: Decrypt incoming payload
    const decryptedBody = await DecryptJson(req.body.data);
    console.log("🔓 Decrypted Payload:", decryptedBody);

    // ✅ Step 3: Parse decrypted string to object
    const parsed = JSON.parse(decryptedBody);

    // ✅ Step 4: Validate decrypted structure
    if (!parsed?.data?.spname) {
      return res.status(400).json(error("Missing 'spname' in decrypted data", 400));
    }

    const { spname, parameters = {} } = parsed.data;

    // 🧠 Build SQL query
    const query = `SELECT * FROM ${spname}(${buildPGNamedParams(parameters)});`;
    console.log('🚀 Executing Query:', query);

    // 📡 Step 5: Execute query
    const result = await pool.query(query);

    // 📦 Step 6: Format and encrypt response
    const finalData = result.rows.length > 1 ? result.rows : (result.rows[0] || { status: "done" });
    const encryptedJson = EncryptJson(JSON.stringify({ data: finalData }));

    // ✅ Respond
    res.setHeader('Content-Type', 'application/json; charset=UTF-8');
    res.json(success("Success", encryptedJson, res.statusCode));

    // ⏱️ Optional: Cache
    myCache.set("purchase_request_cache", finalData, 10000);

  } catch (err) {
    console.error('❌ Error in PG API:', err);
    res.setHeader('Content-Type', 'application/json; charset=UTF-8');
    res.status(500).json(error(err.message || 'Internal Server Error', 500));
  }
});

module.exports = router;
