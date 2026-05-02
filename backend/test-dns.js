const dns = require('dns').promises;

async function testDNS() {
  try {
    const records = await dns.resolveSrv('_mongodb._tcp.cluster0.8xua6f9.mongodb.net');
    console.log('SRV Records:', records);
  } catch (err) {
    console.error('DNS Error:', err);
  }
}

testDNS();
