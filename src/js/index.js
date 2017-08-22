import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { injectGlobal } from 'styled-components'
import localforage from 'localforage'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin from 'react-tap-event-plugin'

import { globalStyle } from 'styles'
import Application from 'components/Application'

const AppStore = localforage.createInstance({
  name: 'App',
})

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

function SendCoordsMetrica(coords) {
  if (!coords) {
    coords = {
      longitude: null,
      latitude: null,
    }
  }
  AppStore.getItem('client_id')
    .then((response) => {
      if (response === null) {
        AppStore.setItem('client_id', guid())
          .then((clientId) => {
            const object = {}
            object[clientId] = {
              coords: {
                latitude: coords.latitude,
                longitude: coords.longitude,
              },
            }
            window.appMetrica.reportEvent('Первый запуск', object)
          })
      }
      else {
        const object = {}
        object[response] = {
          coords: {
            latitude: coords.latitude,
            longitude: coords.longitude,
          },
          time: new Date().getTime(),
        }
        window.appMetrica.reportEvent('Повторный запуск', object)
      }
    })
}

function onDeviceReady() {
  const config = {
    AppMetrica: {
      apiKey: process.env.APM_KEY,
      trackLocationEnabled: true,
      handleFirstActivationAsUpdateEnabled: true,
      sessionTimeout: 15,
      appVersion: '0.1.1',
    },
  }

  window.appMetrica.activate(config.AppMetrica)

  navigator.geolocation.getCurrentPosition((position) => {
    const payload = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    }
    SendCoordsMetrica(payload)
  }, () => {
    SendCoordsMetrica()
  })

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
