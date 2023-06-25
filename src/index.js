// Loads the required modules for this application
require('./models/Business');
require('./models/Category');
require('./models/PanelItem');
const os = require('os');
const http = require('http');
const cluster = require('cluster');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const keys = require('./config/keys');
const businessRoutes = require('./routes/businessRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const panelRoutes = require('./routes/panelRoutes');

const numCPUs = os.cpus().length;
// Mongoose connection

mongoose.set('strictQuery', false);
mongoose.connect(keys.mongoURI, {
  useNewUrlParser: true,
});
mongoose.connection.on('connected', () => {
  console.log('connected to MongoDB');
});

// Retry connection
const connectWithRetry = () => {
  console.log('MongoDB connection with retry');
  return mongoose.connect(keys.mongoURI, {
    useNewUrlParser: true,
  });
};

// Exit application on error
mongoose.connection.on('error', (err) => {
  console.log(`MongoDB connection error: ${err}`);
  setTimeout(connectWithRetry, 5000);
  // process.exit(-1)
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function () {
  mongoose.connection.close(function () {
    console.log(
      'Mongoose default connection disconnected through app termination',
    );
    process.exit(0);
  });
});

// Cluster
if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    cluster.fork(); // Create a New Worker, If Worker is Dead
  });
} else {
  // Express middleware
  const app = express();

  app.use(bodyParser.json());
  app.use(
    cors({
      origin: '*',
    }),
  );

  app.use('/api', businessRoutes);
  app.use('/api', categoryRoutes);
  app.use('/api', panelRoutes);

  // Serve static files
  app.use(express.static('public'));

  // Server
  http
    .createServer(app)
    .listen(process.env.PORT || 3002, '0.0.0.0', function () {
      console.log(
        'Express server listening on port 3002 as Worker ' +
          cluster.worker.id +
          ' running @ process ' +
          cluster.worker.process.pid +
          '!',
      );
    });
}
