const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();

// Middlewares
app.use(bodyParser.json());

// Routes
fs.readdirSync(path.join(__dirname, './routes')).map((file) => {
  app.use('/', require(`./routes/${file}`));
});

module.exports = app;
