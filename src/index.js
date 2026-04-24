// entry point for the application, connects to redis and starts the express server

const app = require('./app');
const { connectRedis } = require('./config/redis');

const port = process.env.PORT || 8080;

// initializes dependencies and starts the server
async function startServer() {
  try {
    // ensure redis is connected before handling requests
    await connectRedis();

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();