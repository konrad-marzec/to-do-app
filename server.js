import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router';
import express from 'express';
import React from 'react';
import path from 'path';
import fs from 'fs';

import App from './src/app';

const app = express();
const hostname = process.env.HOSTNAME || 'localhost';
const port = process.env.PORT || 8000;

app.use(express.static('public'));

app.get('*', (req, res) => {
  const context = {};
  const html = ReactDOMServer.renderToString(
    <StaticRouter
      location={req.url}
      context={context}
    >
      <App />
    </StaticRouter>
  );

  if (context.url) {
    res.writeHead(301, { Location: context.url });
    res.end();
  } else {
    fs.readFile(path.join(process.cwd(), 'index.html'), 'utf8', (err, file) => {
      if (err) { return console.log(err); } // eslint-disable-line
      return res.send(file.replace(/<div id="app"><\/div>/, `<div id="app">${html}</div>`));
    });
  }
});

app.listen(port, () => {
  console.info('==> ✅  Server is listening'); // eslint-disable-line
  console.info('==> 🌎  Go to http://%s:%s', hostname, port); // eslint-disable-line
});
