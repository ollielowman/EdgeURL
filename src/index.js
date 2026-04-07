// initate the server and listen on defined port

const app = require('./app');

const port = 8080;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});