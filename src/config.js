// src/config.js
const BASE_URL = process.env.VUE_APP_BACKEND_URL || 'http://127.0.0.1:8000';

// Extraindo o host do BASE_URL para formar o WebSocket URL
const parsedUrl = new URL(BASE_URL);
const WS_BASE_URL = `ws://${parsedUrl.hostname}:${parsedUrl.port}`;

export { BASE_URL, WS_BASE_URL };
