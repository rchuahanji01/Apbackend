const dotenv = require('dotenv');
dotenv.config();

const { success, error, validation } = require('./apiResponse');
const { get_ip } = require('ipware')();

const getipaddress = (req, res, next) => {
  try {
    const ipInfo = get_ip(req);
    
    // Optionally attach IP to request object for downstream use
    req.clientIp = ipInfo.clientIp;

    // You can log it or use it in DB insert logic, auditing, etc.
    // console.log('Client IP:', req.clientIp);

    next();
  } catch (err) {
    console.error(' getipaddress middleware failed:', err.message);
    return res.status(500).json(error('IP address extraction failed', 500));
  }
};

module.exports = getipaddress;
