import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { AppContainer } from 'react-hot-loader';
import { BrowserRouter } from 'react-router-dom';
import { InMemoryCache } from 'apollo-cache-inmemory';

const cache = new InMemoryCache({
  dataIdFromObject: object => object.key || null
});

const client = new ApolloClient({
  uri: 'http://localhost:8080/graphql',
  cache,
});

import App from './app'
import styles from './index.scss'; // eslint-disable-line

ReactDOM.hydrate((
  <ApolloProvider client={client}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ApolloProvider>
  ),
  document.getElementById('app')
);

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./app', () => {
    const NextApp = require('./app').default;
    ReactDOM.render(
      <AppContainer>
        <BrowserRouter>
          <NextApp/>
        </BrowserRouter>
      </AppContainer>,
      document.getElementById('app')
    );
  });
}
