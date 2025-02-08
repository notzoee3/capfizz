const fs = require('fs');
const path = require('path');
const ping = require('ping');
const axios = require('axios');
const cheerio = require('cheerio');

// === Membaca konfigurasi dari file data.txt ===
const CONFIG_FILE = path.join(__dirname, 'data.txt');
const config = {};

// Membaca file dan menyimpan data ke dalam object config
fs.readFileSync(CONFIG_FILE, 'utf-8').split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        config[key.trim()] = value.trim();
    }
});

// === Konfigurasi ===
const DASHBOARD_URL = 'https://mainnet.capfizz.com/dashboard'; // URL dashboard Capfizz
const COOKIE = config.COOKIE || ''; // Cookie dari file data.txt
const NODE_ADDRESSES = config.NODES ? config.NODES.split(',') : []; // Membaca daftar node dari file
const LOG_FILE = path.join(__dirname, 'capfizz_monitor.log');
const INTERVAL = 60 * 1000; // 60 detik

// === Fungsi untuk melakukan ping pada semua node ===
async function checkPing(node) {
    try {
        const res = await ping.promise.probe(node);
        return res.time ? `${res.time}ms` : 'Timeout';
    } catch (error) {
        return 'Error';
    }
}

// === Fungsi utama monitoring ===
async function monitorCapfizz() {
    const timestamp = new Date().toISOString();
    let logEntries = [];

    for (const node of NODE_ADDRESSES) {
        const pingTime = await checkPing(node);
        const points = await checkCapfizzPoints();

        const logEntry = `[${timestamp}] Node: ${node} | Ping: ${pingTime} | Points: ${points}`;
        logEntries.push(logEntry);
        console.log(logEntry);
    }

    // Simpan hasil monitoring ke file log
    fs.appendFileSync(LOG_FILE, logEntries.join('\n') + '\n');
}

// === Jalankan monitoring setiap INTERVAL ===
setInterval(monitorCapfizz, INTERVAL);
monitorCapfizz();
