import React from 'react';
import ReactDOM from 'react-dom';
import ChatApp from './ChatApp';

// Rendre l'application React dans le div#root de index.html
ReactDOM.render(
  <React.StrictMode>
    <ChatApp />
  </React.StrictMode>,
  document.getElementById('root')
);

