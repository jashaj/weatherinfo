'use strict';

const fs = require('fs');
const api = require('./private/api.js');
const express = require('express');
const https = require('https');
const proxy = require('express-http-proxy');
const app = express();
const port = 3000;

const serverKey = fs.readFileSync('./private/server.key', 'utf8');
const serverCert = fs.readFileSync('./private/server.crt', 'utf8');
const options = {
    key: serverKey,
    cert: serverCert
};

app.use('/api', proxy('https://api.openweathermap.org', {
    filter: (req) => {
        return new Promise(resolve => {
            resolve(req.method === 'GET');
        });
    },
    proxyReqPathResolver: (req) => {
        return `/data/2.5${req.url}&appId=${api.API_KEY}`;
    }
}));
app.use(express.static('public'));

const server = https.createServer(options, app);
server.listen(port, () => console.log(`Weather app is running on: \x1b[1mhttps://localhost:${port}\x1b[0m`));