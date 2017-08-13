import React, { Component } from 'react'
import localforage from 'localforage'
import { YMaps, Map as YMap, Clusterer, Placemark } from 'react-yandex-maps'
import styled from 'styled-components'

const MapStore = localforage.createInstance({
  name: 'Map',
})

/**
 * Map
 * Provider: yandex maps 2.1
 * Coords in yandex placemarks: [lat, lng]
 * Cluster docs: https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/ClusterPlacemark.xml
 * Icons styles: https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/option.presetStorage-docpage
 */
let yMapsApi = null

const GEOLOCATION_WATCH_TIMEOUT = 15000

const CLUSTER_STYLE_PRESET = 'islands#invertedDarkBlueClusterIcons'
const EVENT_STYLE_PRESET = 'islands#redDotIcon'
const MYLOCATION_STYLE_PRESET = 'islands#geolocationIcon'

const INIT_ZOOM = 13 // zoom: 1..23
const MIN_ZOOM = 10
const CONTROLS = ['zoomControl']

const MAP_ZOOM_TO_MY_LOCATION = 15

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
    this.doAutoPan = true

    this.lastOpenedBalloon = null

    /**
     * @description Устанавливаем тип 'event' меткам, если тип не установлен
     */
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
    this.isComponentMounted = true
  }

  componentWillUnmount() {
    this.isComponentMounted = false
    this.stopWatchGeolocation()
    this.watchLocationID = 0
    MapStore.setItem('map', this.state)
  }

  /**
   * @description Обработчик выполнится после успешно определенного текущего местоположения
   * @param {Object} position 
   * @see https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-geolocation/
   */
  onGeolocationSuccess(pos) {
    const position = [pos.coords.latitude, pos.coords.longitude]
    /**
     * @description Добавляем метку с моим местоположением
     */
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

    /**
     * @description Центрируем карту на мое местоположение, если разрешено
     * @todo Подумать, как сделать через {state}
     */
    if (this.props.panToMyLocation
      && this.map
      && this.doAutoPan /* юзер еще не двигал карту */
      && this.isComponentMounted) {
      this.map.panTo(position, {
        duration: 1000,
        flying: true,
      }).then(() => {
        // Если не задан zoom, то ставим зум сами
        if (!this.props.zoom) {
          this.setZoom(MAP_ZOOM_TO_MY_LOCATION)
        }
      })
    }
  }

  /**
   * @description Обработчик ошибки определения текущего местоположения
   * @param {*} error 
   */
  onGeolocationError(error) {
    // console.log(`code: ${error.code}\n message: ${error.message}\n`)
  }

  /**
   * @description Выполнится, как только API Яндекс карт загрузился и готов к использованию
   * @param {Object} api - ref на статичный объект API Яндекс карт 
   */
  onMapsApiReady(api) {
    yMapsApi = api // Не вносим в контекст компонента, т.к api - это статичный объект
  }

  /**
   * @description Выполнится, как только контейнер карты будет готов к загрузке тайлов
   * @param {Object} mapInstance 
   */
  onMapInited(refMapInstance) {
    this.map = refMapInstance

    if (!this.isComponentMounted) {
      return
    }

    MapStore.getItem('map')
      .then((response) => {
        this.setState(response)
      })

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
    }, 10)
  }

  /**
   * @description Выполнится, сразу полсе того, как кластерер меток событий будет создан 
   * @param {Object} refClusterer 
   */
  oncClustererInited(refClusterer) {
    if (!this.isComponentMounted) {
      return
    }

    const geoObjects = []

    this.props.points.map((point, idx) => {
      geoObjects.push(this.createPlacemark(point, idx))
      return point
    })

    refClusterer.add(geoObjects)
    this.map.geoObjects.add(refClusterer)

    const onClickBtnMore = (ev) => {
      if (ev.target
        && this.lastOpenedBalloon
        && ev.target.getAttribute('id') === 'mapBtnMore') {
        const btnMore = this.lastOpenedBalloon.querySelector('#mapBtnMore')
        const idx = btnMore.getAttribute('data-point-idx')
        const point = this.props.parent.state.events[idx]
        this.props.parent.setState({
          payload: point,
          isModalVisible: true,
          modalTitle: point.title,
        })
      }
    }

    // Добавляем кнопку - Перейти к моему местоположению
    const btnGoToMyLocation = new yMapsApi.control.Button(
      {
        data: {
          content: '<strong>Где Я?</strong>',
        },
        options: {
          selectOnClick: false,
        },
      }
    )

    btnGoToMyLocation.events.add('click', (e) => {
      this.map.panTo([this.state.myLocationPoint.lat, this.state.myLocationPoint.lng], {
        duration: 1000,
        flying: true,
      }).then(() => {
        this.map.setZoom(MAP_ZOOM_TO_MY_LOCATION, { duration: 800 })
      })
    })

    this.map.controls.add(btnGoToMyLocation, { float: 'right' })


    this.map.events.add('balloonopen', (e) => {
      this.lastOpenedBalloon = document.querySelector('.ymaps-2-1-53-balloon__content')
      this.lastOpenedBalloon.addEventListener('click', onClickBtnMore)
    })

    this.map.events.add('balloonclose', (e) => {
      this.lastOpenedBalloon.removeEventListener('click', onClickBtnMore)
    })

    this.map.events.add('multitouchstart', (e) => {
      this.doAutoPan = false
    })

    this.map.events.add('mousedown', (e) => {
      this.doAutoPan = false
    })
  }

  setZoom(newZoom) {
    this.setState({
      mapState: {
        ...this.state.mapState,
        zoom: newZoom,
      },
    })
    this.doAutoPan = false
    MapStore.setItem('map', this.state)
  }

  setCenter(coords) {
    this.setState({
      mapState: {
        ...this.state.mapState,
        center: coords,
      },
    })
    this.doAutoPan = false
  }

  getPlaceMarkContent(item, idx) {
    return {
      balloonContentBody: `
        <div>
          <h3 style="color:#455A64">${item.title}</h3>
          <div style="margin-top:4px">
            <span style="color:#607D8B">Когда:</span> <strong>${item.dateFormatted.time}, ${item.dateFormatted.day} ${item.dateFormatted.month}</strong><br />
            <span style="color:#607D8B">Где:</span> ${item.location_title}
          </div>
          <div style="margin-top:4px;border:1px solid #90A4AE;height:32px;line-height:32px;text-align:center;color:#455A64;border-radius:3px;" data-point-idx="${idx}" class="btn-more" id="mapBtnMore">Подробнее</div>
        </div>`,
      clusterCaption: `Событие ${idx}`,
    }
  }

  closeEventsModal() {
    this.setState({
      isModalVisible: false,
    })
  }

  createPlacemark(pointData, idx) {
    const placemark = new yMapsApi.Placemark(
      [pointData.lat, pointData.lng],
      this.getPlaceMarkContent(pointData, idx),
      this.props.placemarkOptions || EVENT_PLACEMARK_OPTIONS,
    )
    return placemark
  }

  stopWatchGeolocation() {
    if (this.watchLocationID) {
      navigator.geolocation.clearWatch(this.watchLocationID)
    }
  }
  /* height={this.props.height || '100%'} */
  render() {
    return (
      <YMaps onApiAvaliable={this.onMapsApiReady}>
        <YMap
          state={this.state.mapState}
          instanceRef={(ref) => {
            this.onMapInited(ref)
          }}
          options={{
            minZoom: MIN_ZOOM,
            yandexMapDisablePoiInteractivity: true,
            suppressMapOpenBlock: true,
          }}
          width={this.props.width || '100%'}
          height={'75vh'}
        >
          <Clusterer
            instanceRef={(ref) => {
              this.oncClustererInited(ref)
            }}
            options={{
              preset: CLUSTER_STYLE_PRESET,
              groupByCoordinates: false,
              clusterDisableClickZoom: false,
              clusterHideIconOnBalloonOpen: false,
              geoObjectHideIconOnBalloonOpen: false,
            }}
          />
          {this.state.myLocationPoint.lat ? (
            <Placemark
              key={'mylocation'}
              geometry={{
                coordinates: [this.state.myLocationPoint.lat, this.state.myLocationPoint.lng],
              }}
              options={MYLOCATION_PLACEMARK_OPTIONS}
            />
          ) : ''}
        </YMap>
      </YMaps>
    )
  }
}
