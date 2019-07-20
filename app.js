'use strict';

const key = require('./key.js');
const express = require('express');
const proxy = require('express-http-proxy');
const app = express();
const port = 3000;

app.use('/api', proxy('https://api.openweathermap.org', {
    filter: (req) => {
        return new Promise(resolve => {
            resolve(req.method === 'GET');
        });
    },
    proxyReqPathResolver: (req) => {
        return `/data/2.5${req.url}&appId=${key.API_KEY}`;
    }
}));
app.use(express.static('public'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));