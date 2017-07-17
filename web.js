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
app.use(express.static(path.join(__dirname, 'example')));

const examplePath = path.join(__dirname, '/example/');
const examples = fs.readdirSync(examplePath).filter(name => name.startsWith('example-'));
let examplesHtml = '<html><body><table>';
examples.forEach((example) => {
  examplesHtml += `<tr><td> <a href='/${example}'> ${example} </a></td></tr>`;
});
examplesHtml += '</body></html>';

app.get('/', (req, res) => {
  res.send(examplesHtml);
});

const port = process.env.PORT || 3003;
app.listen(port, () => {
  console.log(`Rdocs Light examples available on port ${port}.`);
});
