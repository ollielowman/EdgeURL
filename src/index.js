const app = require('./app');
const { connectRedis } = require('./config/redis');

const port = process.env.PORT || 8080;

async function startServer() {
  try {
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