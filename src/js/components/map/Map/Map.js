import React, { Component } from 'react'
import styled from 'styled-components'
import localforage from 'localforage'
import { YMaps, Map as YMap, Clusterer, Placemark } from 'react-yandex-maps'

import LinearProgress from 'material-ui/LinearProgress'

import MDApi from 'utils/MDApi'

const AppStore = localforage.createInstance({
  name: 'App',
})

const MapStore = localforage.createInstance({
  name: 'Map',
})

/**
 * Map
 * Provider: yandex maps 2.1
 * Coords in yandex placemarks: [lat, lng]
 * Cluster docs: https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/ClusterPlacemark.xml
 * Icons styles: https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/option.presetStorage-docpage
 * 
 * @TODO: 
 * - Разбить на модули
 * - Красиво убрать из компонента подгрузку событий, и что-то решить с ассинхронностью
 * - Вынести разметку и стили кастомных баллунов
 * - Вынести константы
 * - PropTypes
 * - 
 */
let yMapsApi = null

const GEOLOCATION_WATCH_TIMEOUT = 5000

const CLUSTER_STYLE_PRESET = 'islands#invertedDarkBlueClusterIcons'
const EVENT_STYLE_PRESET = 'islands#redDotIcon'
const MYLOCATION_STYLE_PRESET = 'islands#geolocationIcon'

const INIT_ZOOM = 13 // zoom: 1..23
const MIN_ZOOM = 9
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

const YMapsWrap = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  position: relative;
`
const Pain = styled.div`
  position: absolute;
  bottom: 0;
  background: #fff;
  width: 100%;
`
const PainInner = styled.div`
  padding: 16px 5px;
  background: #fff;
  text-align: center;
  color: rgb(38, 50, 56);

`
const BalloonLayout = styled.div`
  position: absolute;
  bottom: 0;
  background: #fff;
  width: 100%;
  z-index: 100;
`
const BalloonInner = styled.div`
  padding: 5px;
  background: #eff1f2;
`
const BalloonTopBar = styled.div`
`
const BtnClose = styled.div`
  color: #607D8B;
  height: 40px;
  line-height: 40px;
  text-transform: uppercase;
  text-align: center;
  margin-bottom: 5px;
  font-size: 11pt;
  border-radius: 2px;
  background: #fff;
  border-bottom: 1px solid #CFD8DC;
  border-right: 1px solid #CFD8DC;
`
const BalloonItemsWrap = styled.div`
  max-height: 55vh;
  overflow-x: hidden;
  overflow-y: auto;
`
const BalloonEventItem = styled.div`
  margin-bottom: 5px;
  border-bottom: 1px solid #CFD8DC;
  padding: 10px;
  border-radius: 2px;
  border-right: 1px solid #CFD8DC;
  border-bottom: 1px solid #CFD8DC;
  background: #fff;
`
const BalloonEventTitle = styled.div`
  color: rgb(38, 50, 56);
  font-size: 16px;
  font-weight: bold;
`
const BalloonEventMeta = styled.div`
  margin-top: 4px;
  font-size: 14px;
  color: #455A64; 
`


export default class Map extends Component {
  constructor(props) {
    super(props)
    this.isComponentMounted = false
    this.watchLocationID = null
    this.doAutoPan = true

    this.lastOpenedBalloon = null

    this.isMyLocationGotByYandex = false

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
      balloonItemsPreview: null,
      mapState: {
        center: props.initCenter || [55.751574, 37.573856],
        zoom: props.zoom || INIT_ZOOM,
        controls: props.controls || CONTROLS,
        minZoom: MIN_ZOOM,
      },
      loading: true,
    }

    this.onMapsApiReady = this.onMapsApiReady.bind(this)
    this.onGeolocationSuccess = this.onGeolocationSuccess.bind(this)
    this.onGeolocationError = this.onGeolocationError.bind(this)

    this.closeBalloon = this.closeBalloon.bind(this)
    this.openEventModal = this.openEventModal.bind(this)
  }

  componentDidMount() {
    this.isComponentMounted = true
  }

  componentWillUnmount() {
    this.isComponentMounted = false
    this.stopWatchGeolocation()
    this.watchLocationID = 0

    this.state.balloonItemsPreview = null

    if (this.props.panToLocation === undefined) {
      MapStore.setItem('map', this.state)
    }
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
      })
    }

    /**
     * Не будем центрировать карту на мое местоположение,
     */
    if (this.props.panToLocation !== undefined) {
      return
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

    const topBarHeight = document.querySelector('.topbar').getBoundingClientRect().height
    const screenHeight = window.innerHeight
    this.mapHeight = topBarHeight - screenHeight

    yMapsApi.geolocation.get({
      provider: 'yandex',
      mapStateAutoApply: false,
    }).then((result) => {
      if (result.geoObjects && result.geoObjects.position) {
        this.isMyLocationGotByYandex = true
        this.setState({
          myLocationPoint: {
            lat: result.geoObjects.position[0],
            lng: result.geoObjects.position[1],
          },
        })
      }
    })
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

    if (this.watchLocationID) {
      return
    }

    if (this.props.panToLocation === undefined && !this.isMyLocationGotByYandex) {
      MapStore.getItem('map')
        .then((response) => {
          this.setState({
            myLocationPoint: response.myLocationPoint,
          })
        })
    }

    if (this.props.panToLocation !== undefined) {
      this.doAutoPan = false
      if (this.isComponentMounted && this.map) {
        this.setState({
          mapState: {
            ...this.state.mapState,
            center: this.props.panToLocation,
            zoom: this.props.zoom || MAP_ZOOM_TO_MY_LOCATION,
          },
        })
      }
    }

    AppStore.getItem('client_id')
      .then((clientId) => {
        try {
          window.appMetrica.reportEvent('Просмотр карты', {
            client_id: clientId,
          })
        }
        catch (error) {
          //
        }
      })

    this.setState({
      loading: false,
    })
  }

  /**
   * @description Выполнится, сразу полсе того, как кластерер меток событий будет создан 
   * @param {Object} refClusterer 
   */
  oncClustererInited(refClusterer) {
    if (!this.isComponentMounted) {
      return
    }

    const afterEventsLoaded = () => {
      const geoObjects = []

      // Creating placemarks
      this.state.points.map((eventData) => {
        geoObjects.push(this.createPlacemark(eventData, eventData.id))
        return eventData
      })

      // console.log('added placemark: ', this.state.points)

      // refClusterer.options.set('hasBalloon', false)

      refClusterer.events.add('click', (e) => {
        const items = []

        // One event?
        if (e.get('target').getGeoObjects === undefined) {
          const placemark = e.get('target')
          const eventData = placemark.properties.get('eventData')
          items.push(eventData)
        } else {
          // Clustered events
          const objects = e.get('target').getGeoObjects()
          objects.map((item) => {
            const eventData = item.properties.get('eventData')
            items.push(eventData)
          })
        }
        if (items.length) {
          this.openBalloon(items)
        }
      })

      // Adding placemarks on map via clusterer
      if (!this.props.isOneEvent) {
        refClusterer.add(geoObjects)
        this.map.geoObjects.add(refClusterer)
      } else {
        this.map.geoObjects.add(geoObjects[0])
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

      // Добавляем кнопку - Вернуться к событию
      if (this.props.panToLocation !== undefined) {
        const btnGoToEventLocation = new yMapsApi.control.Button(
          {
            data: {
              content: '<strong>Событие</strong>',
            },
            options: {
              selectOnClick: false,
            },
          }
        )

        btnGoToEventLocation.events.add('click', (e) => {
          this.map.panTo(this.props.panToLocation, {
            duration: 1000,
            flying: true,
            checkZoomRange: true,
          }).then(() => {
            this.map.setZoom(this.props.zoom || MAP_ZOOM_TO_MY_LOCATION, { duration: 800 })
          })
        })

        this.map.controls.add(btnGoToEventLocation, { float: 'left' })
      }

      this.map.events.add('multitouchstart', (e) => {
        this.doAutoPan = false
        if (this.isBalloonOpened()) {
          this.closeBalloon()
        }
      })

      this.map.events.add('mousedown', (e) => {
        this.doAutoPan = false
        if (this.isBalloonOpened()) {
          this.closeBalloon()
        }
      })

      setTimeout(() => {
        this.watchLocationID = navigator.geolocation.watchPosition(
          this.onGeolocationSuccess,
          this.onGeolocationError,
          {
            timeout: GEOLOCATION_WATCH_TIMEOUT,
            // enableHighAccuracy: ,
            maximumAge: 3000,
          }
        )
      }, 100)


      this.setState({
        loading: false,
      })
    }


    //
    // @TODO: Refactoring required: improve async code
    //
    if (this.props.isOneEvent) {
      afterEventsLoaded()
    }
    else {
      const today = MDApi.getTodayMSK()

      MDApi.getEvents({
        items_per_page: 500, // all on today
        date: `${today.year}-${today.month}-${today.date}`,
      })
        .then((response) => {
          return response.json()
        })
        .then((response) => {
          if (!this.isComponentMounted) {
            return
          }

          this.state.points = response.data
          afterEventsLoaded()
        }).catch((err) => {
          // @todo: resolve errors
          // console.log(err)
        })
    }
  }

  setZoom(newZoom) {
    if (this.isComponentMounted) {
      this.setState({
        mapState: {
          ...this.state.mapState,
          zoom: newZoom,
        },
      })
    }
    this.doAutoPan = false
    if (this.props.panToLocation === undefined) {
      MapStore.setItem('map', this.state)
    }
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

  createPlacemark(eventData, eventId) {
    const placemark = new yMapsApi.Placemark(
      [eventData.lat, eventData.lng],
      {
        eventData,
      }, // for empty balloon
      this.props.placemarkOptions || EVENT_PLACEMARK_OPTIONS,
    )

    return placemark
  }

  stopWatchGeolocation() {
    if (this.watchLocationID) {
      navigator.geolocation.clearWatch(this.watchLocationID)
    }
  }

  isBalloonOpened() {
    return this.state.balloonItemsPreview !== null
  }
  openBalloon(items) {
    this.setState({
      balloonItemsPreview: items,
    })
  }

  closeBalloon() {
    this.setState({
      balloonItemsPreview: null,
    })
  }

  openEventModal(eventId) {
    const eventData = this.state.points.filter((item) => {
      return eventId === item.id
    })

    if (eventData.length) {
      this.props.parent.setState({
        payload: eventData[0],
        isModalVisible: true,
        modalTitle: eventData[0].title,
      })
    }
    return false
  }

  declOfNum = (number, titles) => {
    const cases = [2, 0, 1, 1, 1, 2]
    return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]]
  }

  render() {
    const postfix = this.declOfNum(this.state.points.length, ['событие', 'события', 'событий'])
    return (
      <YMapsWrap className="maps-wrap">
        {this.state.loading
          ? <div style={{ height: '6px', position: 'relative', zIndex: 1000 }}><LinearProgress
            mode='indeterminate'
            style={{
              backgroundColor: '#FFFFFF',
            }}
          />
          </div>
          : ''
        }
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
            height={this.mapHeight}
          >
            <Clusterer
              instanceRef={(ref) => {
                this.oncClustererInited(ref)
              }}
              options={{
                preset: CLUSTER_STYLE_PRESET,
                groupByCoordinates: false,
                hasBalloon: false,
                clusterDisableClickZoom: false,
                clusterHideIconOnBalloonOpen: false,
                geoObjectHideIconOnBalloonOpen: false,
              }}
            />
            {/* My Location Placemark */}
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
        <Pain
          style={{ display: this.props.isOneEvent ? 'none' : 'block' }}
        >
          <PainInner>
            {'Сегодня '.concat(this.state.points.length).concat(' ').concat(postfix)}
          </PainInner>
        </Pain>
        <BalloonLayout
          style={{ display: this.state.balloonItemsPreview ? 'block' : 'none' }}
        >
          <BalloonInner>
            <BalloonTopBar onClick={this.closeBalloon}>
              <BtnClose>Закрыть</BtnClose>
            </BalloonTopBar>
            <BalloonItemsWrap>
              {this.state.balloonItemsPreview
                ? this.state.balloonItemsPreview.map((item, idx) => {
                  const beautyDatesRange = MDApi.beautifyEventDatesRange(
                    item.dateFormatted,
                    item.dateEndFormatted
                  )
                  return (
                    <BalloonEventItem
                      key={item.id}
                      data-event-id={item.id}
                      onClick={() => {
                        this.openEventModal(item.id)
                      }}
                    >
                      <BalloonEventTitle>{item.title}</BalloonEventTitle>
                      <BalloonEventMeta>
                        <p>{beautyDatesRange.dates} ({beautyDatesRange.time})</p>
                        <p style={{ marginTop: '6px' }}>{item.location_title}</p>
                        {item.location_title !== item.address
                          ? <p style={{ color: '#888' }}>{item.address}</p>
                          : ''}
                      </BalloonEventMeta>
                    </BalloonEventItem>
                  )
                })
                : ''
              }
            </BalloonItemsWrap>
          </BalloonInner>
        </BalloonLayout>
      </YMapsWrap>
    )
  }
}
