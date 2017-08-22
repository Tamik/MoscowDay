import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { injectGlobal } from 'styled-components'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin from 'react-tap-event-plugin'

import { globalStyle } from 'styles'
import Application from 'components/Application'

function renderApp(Component) {
  injectTapEventPlugin()
  render(
    <AppContainer>
      <MuiThemeProvider>
        <Application />
      </MuiThemeProvider>
    </AppContainer>,
    document.getElementById('react-root')
  )
}

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
}
function onDeviceReady() {
  const config = {
    AppMetrica: {
      apiKey: process.env.API_KEY,
      trackLocationEnabled: true,
      handleFirstActivationAsUpdateEnabled: true,
      sessionTimeout: 15,
      appVersion: '0.1.1',
    },
  }

  window.appMetrica.activate(config.AppMetrica)
  injectGlobal`${globalStyle}`
  renderApp()

  if (module.hot) {
    module.hot.accept('components/Application', () => {
      const nextApplication = require('components/Application').default
      renderApp(nextApplication)
    })
  }
}

document.addEventListener('deviceready', onDeviceReady)
