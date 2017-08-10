import React, { Component } from 'react'
import { YMaps, Map as YMap, Clusterer, Placemark } from 'react-yandex-maps'

/**
 * Map
 * Provider: yandex maps 2.1
 * Coords in yandex placemarks: [lat, lng]
 * Cluster docs: https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/ClusterPlacemark.xml
 * Icons styles: https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/option.presetStorage-docpage
 */

const GEOLOCATION_WATCH_TIMEOUT = 15000

const CLUSTER_STYLE_PRESET = 'islands#invertedDarkBlueClusterIcons'
const EVENT_STYLE_PRESET = 'islands#redDotIcon'
const MYLOCATION_STYLE_PRESET = 'islands#geolocationIcon'

const INIT_ZOOM = 13 // zoom: 1..23
const MIN_ZOOM = 10
const CONTROLS = ['zoomControl']

const POINT_TYPES = {
  MY_LOCATION: 'mylocation',
  EVENT: 'event',
}

const EVENT_PLACEMARK_OPTIONS = {
  preset: EVENT_STYLE_PRESET,
}

const MYLOCATION_PLACEMARK_OPTIONS = {
  preset: MYLOCATION_STYLE_PRESET,
}


export default class Map extends Component {
  constructor(props) {
    super(props)

    this.isComponentMounted = false
    this.watchLocationID = null

    // Устанавливаем тип "event" меткам, если тип не установлен
    props.points.forEach((item, i) => {
      if (props.points[i].type === undefined) {
        props.points[i].type = POINT_TYPES.EVENT
      }
    })

    this.state = {
      points: props.points || [],
      myLocationPoint: {
        type: POINT_TYPES.MY_LOCATION,
        lat: 0,
        lng: 0,
      },
      placemarkOptions: props.placemarkOptions || EVENT_PLACEMARK_OPTIONS,
      mapState: {
        center: props.initCenter || [55.751574, 37.573856],
        zoom: props.zoom || INIT_ZOOM,
        controls: props.controls || CONTROLS,
        minZoom: MIN_ZOOM,
      },
    }

    this.onMapsApiReady = this.onMapsApiReady.bind(this)
    this.onGeolocationSuccess = this.onGeolocationSuccess.bind(this)
    this.onGeolocationError = this.onGeolocationError.bind(this)
  }

  componentDidMount() {
    console.log('componentDidMount')
    this.isComponentMounted = true

    // @todo: Восстанавливать последнюю позицию на карте, зум и прошлое мое местоположение
    // а в componentWillUnmount кешировать
  }

  componentWillUnmount() {
    console.log('componentWillUnmount')
    this.isComponentMounted = false

    this.stopWatchGeolocation()
    this.watchLocationID = 0
  }

  /**
   * Обработчик выполнится после успешно определенной текущего местоположения
   * @param {Object} position 
   * @see https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-geolocation/
   */
  onGeolocationSuccess(pos) {
    const position = [pos.coords.latitude, pos.coords.longitude]
    console.log('onGeolocationSuccess: ', this.isComponentMounted);
    // Добавляем метку с моим местоположением
    if (this.isComponentMounted && this.map) {
      this.setState({
        myLocationPoint: {
          ...this.state.myLocationPoint,
          lat: position[0],
          lng: position[1],
        },
        mapState: {
          ...this.state.mapState,
          center: position,
        },
      })
    }

    // Если не задан zoom, то ставим зум сами
    if (!this.props.zoom) {
      this.setZoom(16)
    }

    // Центрируем карту на мое местоположение, если разрешено
    // @todo: Подумать, как сделать через state
    if (this.props.panToMyLocation
        && this.map
        && this.isComponentMounted) {
      this.map.panTo(position, {
        duration: 1000,
        flying: true,
      })
    }
  }

  /**
   * Обработчик ошибки определения текущего местоположения
   * @param {*} error 
   */
  onGeolocationError(error) {
    console.log('code: ' + error.code + '\n message: ' + error.message + '\n');
  }

  /**
   * Выполнится, как только API Яндекс карт загрузился и готов к использованию
   * @param {*} yMapsApiEvent 
   */
  onMapsApiReady(yMapsApiEvent) {
    if (this.watchLocationID) {
      return
    }

    setTimeout(() => {
      this.watchLocationID = navigator.geolocation.watchPosition(
        this.onGeolocationSuccess,
        this.onGeolocationError,
        {
          timeout: GEOLOCATION_WATCH_TIMEOUT,
          enableHighAccuracy: true,
          maximumAge: 3000,
        }
      )
    }, 1)
  }

  setZoom(newZoom) {
    this.setState({
      mapState: {
        ...this.state.mapState,
        zoom: newZoom,
      },
    })
  }

  setCenter(coords) {
    this.setState({
      mapState: {
        ...this.state.mapState,
        center: coords,
      },
    })
  }

  getPlaceMarkContent(item, idx) {
    return {
      balloonContentBody: `<div><strong>${item.title}</strong><p>${item.location_title}<br />${item.begin_time}</p></div>`,
      clusterCaption: `Событие ${idx}`,
    }
  }

  stopWatchGeolocation() {
    if (this.watchLocationID) {
      navigator.geolocation.clearWatch(this.watchLocationID)
    }
  }

  render() {
    return (
      <YMaps onApiAvaliable={this.onMapsApiReady}>
        <YMap
          state={this.state.mapState}
          instanceRef={(ref) => { this.map = ref }}
          options={{
            minZoom: MIN_ZOOM,
            yandexMapDisablePoiInteractivity: true,
          }}
        >
          <Clusterer
            options={{
              preset: CLUSTER_STYLE_PRESET,
              groupByCoordinates: false,
              clusterDisableClickZoom: false,
              clusterHideIconOnBalloonOpen: false,
              geoObjectHideIconOnBalloonOpen: false,
            }}
          >
            {this.props.points.map((item, idx) => (
              <Placemark
                key={item.id}
                geometry={{ coordinates: [item.lat, item.lng] }}
                properties={this.getPlaceMarkContent(item, idx)}
                options={this.state.placemarkOptions}
              />)
            )}
          </Clusterer>
          {this.state.myLocationPoint.lat ? (
            <Placemark
              key={'mylocation'}
              geometry={{
                coordinates: [this.state.myLocationPoint.lat, this.state.myLocationPoint.lng],
              }}
              properties={{
                balloonContentBody: 'Я тут',
              }}
              options={MYLOCATION_PLACEMARK_OPTIONS}
            />
          ) : ''}
        </YMap>
      </YMaps>
    )
  }
}
