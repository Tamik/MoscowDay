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

function onDeviceReady() {
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
