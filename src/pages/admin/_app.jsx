import React from 'react';

function App({ Component, pageProps }) {
  return (
    <React.Fragment>
      {Component && <Component {...pageProps} />}
    </React.Fragment>
  );
}

export default App;