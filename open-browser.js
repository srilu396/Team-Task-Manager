const http = require('http');
const { exec } = require('child_process');

const url = 'http://localhost:3000';
const maxRetries = 60;
let retries = 0;

const checkServer = () => {
  http.get(url, (res) => {
    if (res.statusCode === 200 || res.statusCode === 304 || res.statusCode === 404) {
      console.log('Frontend is ready, opening browser...');
      const startCommand = process.platform === 'win32' ? 'start' : process.platform === 'darwin' ? 'open' : 'xdg-open';
      exec(`${startCommand} ${url}`);
    } else {
      retry();
    }
  }).on('error', () => {
    retry();
  });
};

const retry = () => {
  retries++;
  if (retries >= maxRetries) {
    console.log('Timeout waiting for frontend.');
    return;
  }
  setTimeout(checkServer, 1000);
};

checkServer();
