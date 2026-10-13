const dns = require('dns');
const net = require('net');

if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}
if (net.setDefaultAutoSelectFamily) {
  net.setDefaultAutoSelectFamily(false);
}

require('dotenv').config();

const http = require('http');
const app = require('./src/app');
require('./src/config/db');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`AgroTrade Server running on port ${PORT}`);
  console.log(`API URL: http://localhost:${PORT}`);
});
