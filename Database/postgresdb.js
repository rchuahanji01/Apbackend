
const { Pool } = require('pg');

// PostgreSQL connection string from Render
const connectionString = 'postgresql://apbackend_user:P2fhQ6P4utCZmS6ndrrS8gAlujTkBaCg@dpg-d1ufub6r433s73enfl2g-a.oregon-postgres.render.com/apbackend';

const config = {
  connectionString,
  ssl: {
    rejectUnauthorized: false, // Render PostgreSQL requires SSL
  },
  max: 100, // Maximum number of connections in pool
  idleTimeoutMillis: 30000, // Close idle clients after 30s
  connectionTimeoutMillis: 60000 // Return an error after 60s if connection could not be established
};

// Create pool instance
const pool = new Pool(config);

// Log config (without password)
console.log(`📦 POSTGRES CONFIG: ${JSON.stringify({
  ...config,
  connectionString: '***** (hidden)',
})}`);

// Handle initial connection
function connect() {
  return pool.connect();
}

function connectDB() {
  connect()
    .then(client => {
      console.log('✅ Connected to PostgreSQL DB');
      global.isDbConnected = true;
      client.release(); // Release back to pool
    })
    .catch(err => {
      console.error('❌ PostgreSQL Connection Failed:', err.message);
      setTimeout(() => {
        console.log('🔄 Retrying PostgreSQL DB connection...');
        connectDB();
      }, 5000);
    });
}

// Initiate connection once
connectDB();

// Export pool for query use
module.exports = {
  pg: require('pg'),
  pool
};
