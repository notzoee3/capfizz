const axios = require('axios');
const fs = require('fs');

// Load data dari file data.txt
const data = fs.readFileSync('data.txt', 'utf8').split('\n').reduce((acc, line) => {
  const [key, value] = line.split('=');
  acc[key.trim()] = value ? value.trim() : '';
  return acc;
}, {});

// Node ID dan Cookie dari data.txt
const NODE_ID = data.NODE_ID;
const COOKIE = data.COOKIE;

// URL API dengan Node ID
const NODE_URL = `https://endpoint.capfizz.com/node/${NODE_ID}/status`;

// Fungsi untuk ping node
async function pingNode() {
  try {
    const response = await axios.get(NODE_URL, {
      headers: {
        'Cookie': COOKIE,
      },
    });

    if (response.status === 200) {
      console.log(`Ping sukses ke Node ID ${NODE_ID}: ${NODE_URL}`);
    } else {
      console.log(`Ping gagal ke Node ID ${NODE_ID}: ${NODE_URL}, Status: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error saat ping Node ID ${NODE_ID}: ${error.message}`);
  }
}

// Jalankan ping secara berkala (setiap 5 menit)
setInterval(pingNode, 300000); // 300000 ms = 5 menit
pingNode();
