const express = require('express');
const compression = require('compression');

const morgan = require('./logging/morgan');
const logger = require('./logging/logger');
const routes = require('./routes');
const users = require('./routes/users');
const db = require('./database/connection');

const app = express();

// Database Connection Test
db.authenticate()
  .then(() => {
    logger.info('Connected To Database');
  })
  .catch(err => {
    logger.error('An error occurred' + err);
    process.exit(2);
  });

// Middlewares
app.use(express.json());
app.use(compression());

// Logging
app.use(morgan);

// Mount routes
app.use('/', routes);
app.use('/api/v1/user', users);

module.exports = app;
