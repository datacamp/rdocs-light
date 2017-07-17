const compression = require('compression');
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(compression());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  next();
});

app.use(express.static(path.join(__dirname, 'lib')));

const examplePath = path.join(__dirname, '/example/');
const examples = fs.readdirSync(examplePath).filter(name => name.startsWith('example-'));

app.get('/', (req, res) => {
  res.sendFile(examplePath + examples[Math.floor(Math.random() * examples.length)]);
});

const port = process.env.PORT || 3003;
app.listen(port, () => {
  console.log(`Rdoc Light examples available on port ${port}.`);
});
