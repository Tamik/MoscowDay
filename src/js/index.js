import React from 'react';
import { render } from 'react-dom';
import { injectGlobal } from 'styled-components';
import { globalStyle } from 'styles';
import { AppContainer } from 'react-hot-loader';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Application from 'components/Application';
import injectTapEventPlugin from 'react-tap-event-plugin';

function renderApp(Component) {
  injectTapEventPlugin();
  render(
    <AppContainer>
      <MuiThemeProvider>
        <Application />
      </MuiThemeProvider>
    </AppContainer>,
    document.getElementById('react-root')
  );
}

function onDeviceReady() {
  injectGlobal`${globalStyle}`;
  renderApp();

  if (module.hot) {
    module.hot.accept('components/Application', () => {
      const nextApplication = require('components/Application').default;
      renderApp(nextApplication);
    });
  }
}

document.addEventListener('deviceready', onDeviceReady);
