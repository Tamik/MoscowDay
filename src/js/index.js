import React from 'react';
import { render } from 'react-dom';
import { injectGlobal } from 'styled-components';
import { AppContainer } from 'react-hot-loader';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Application from 'components/Application';
import { globalStyle } from 'styles';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

// {/* <ThemeProvider theme={mainTheme}> */}
//         {/* <Application /> */}
//       {/* </ThemeProvider> */}

const AppComp = () => (
  <MuiThemeProvider>
    <Application />
    {/* <AppBar title="Home" /> */}
  </MuiThemeProvider>
);

function renderApp(Component) {
  render(
    <AppContainer>
      <AppComp />
    </AppContainer>,
    document.getElementById('react-root')
  );
}

// const globalStyle = css`
//   *,
//   *:before,
//   *:after {
//     margin: 0;
//     padding: 0;
//     outline: 0;
//     box-sizing: border-box;
//   }
// `;

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
