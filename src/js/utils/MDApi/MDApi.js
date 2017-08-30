import React from 'react'
import moment from 'moment'
import 'whatwg-fetch'

const MD_API_HOST = process.env.API_HOST

/**
 * @see docs here: https://github.com/cybri0nix/md-back
 */
const MD_API_METHODS = {
  GET_EVENTS: 'events',
  GET_EVENT: 'event',
  GET_DATES_IN: 'daysevents',
  GET_PLACES_LIST: 'countevents?type=byplaces',
  GET_CATEGORIES_LIST: 'countevents?type=bycategories',
}

const methodUrl = methodId => [MD_API_HOST, methodId].join('/')

/**
 * @description Получить данные о событии
 */
const getEvent = (id) => {
  /**
   * @method /event/${id}
   */
  const url = [
    methodUrl(MD_API_METHODS.GET_EVENT),
    id,
  ].join('/')

  return fetch(url)
}

/**
 * @description Получить список событий
 */
const getEvents = (params) => {
  /**
   * @method /events?param=${params}
   * @param {Object} params
   *  page
   *  items_per_page
   *  category
   *  date
   *  is_main
   *  place
   */
  const computedParams = []

  for (const key in params) {
    computedParams.push([key, params[key]].join('='))
  }

  const url = [
    methodUrl(MD_API_METHODS.GET_EVENTS),
    computedParams.join('&'),
  ].join('?')

  return fetch(url)
}

/**
 * @description Получить список дат, на которые запланированы события по категории 
 */
const getDatesInCategory = (categoryId) => {
  /** 
   * @method /dayevents?place=${categoryId}
   */
  const url = [
    methodUrl(MD_API_METHODS.GET_DATES_IN),
    `category=${categoryId}`,
  ].join('?')

  return fetch(url)
}

/**
 * @description Получить список дат, на которые запланированы события по месту 
 */
const getDatesInPlace = (placeId) => {
  /** 
   * @method /dayevents?place=${placeId}
   */
  const url = [
    methodUrl(MD_API_METHODS.GET_DATES_IN),
    `place=${placeId}`,
  ].join('?')

  return fetch(url)
}

const getCategories = () => {
  /** 
   * @method /countevents?type=bycategories
   */
  const url = [
    methodUrl(MD_API_METHODS.GET_CATEGORIES_LIST),
  ]

  return fetch(url)
}

const getPlaces = () => {
  /** 
   * @method /countevents?type=byplaces
   */
  const url = [
    methodUrl(MD_API_METHODS.GET_PLACES_LIST),
  ]

  return fetch(url)
}

/**
 * @description Получить сегоднянюю дату в часовом поясе +03:00 (МСК) 
 */
const getTodayMSK = () => {
  const date = moment(new Date()).utcOffset('+03:00').format('YYYY-MM-DD')
  const dateComponent = date.split('-')
  return {
    full: date,
    year: dateComponent[0],
    month: dateComponent[1],
    date: dateComponent[2],
    yearInt: parseInt(dateComponent[0], 10),
    monthInt: parseInt(dateComponent[1], 10),
    dateInt: parseInt(dateComponent[2], 10),
  }
}

/**
 * @description Отформатировать дату начала и дату завершения события
 * @param {Object} dateStart/dateEnd {
 *  day: 1..31,
 *  month: 'января',
 *  monthInt: 1..12,
 *  time: '05:05',
 * }
 */
const beautifyEventDatesRange = (dateStart, dateEnd) => {

  let datesRange = ''

  // Месяц начала и конца события одинаковые?
  if (dateStart.monthInt === dateEnd.monthInt) {
    if (dateStart.day === dateEnd.day) {
      // 1 сентября
      datesRange = `${dateStart.day} ${dateStart.month}`
    }
    else {
      // 1 - 2 сентября
      datesRange = `${dateStart.day} — ${dateEnd.day} ${dateStart.month}`
    }
  }
  else {
    datesRange = `${dateStart.day} ${dateStart.month} — ${dateEnd.day} ${dateEnd.month}`
  }

  return {
    dates: datesRange,
    time: `${dateStart.time} — ${dateEnd.time}`,
  }
}

const getDeclineOfNumber = (number, titlesArray) => {
  const cases = [2, 0, 1, 1, 1, 2]
  return titlesArray[
    (number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]
  ]
}

/**
 * @description Get categories (with count of events in each of them)
 * @example const APIresponse = MDApi.getCategories().then(response => {
 *   return response.json()
 * })
 * .then(response => console.log(response));
 */

/** 
 * @description Get main events
 * @example const APIresponse = MDApi.getEvents({ is_main:1 }).then(response => {
 *   return response.json()
 * })
 * .then(response => console.log(response));
 */

/**
 * @description Get events by category
 * @example const APIresponse = MDApi.getEvents({ category:1 }).then(response => {
 *  return response.json()
 * })
 * .then(response => console.log(response));
 */

const MDApi = {
  /**
   * @description Получить даные о событии
   * @param {number} eventId
   * @return {Promise}
   */
  getEvent,

  /**
   * @description Получить список событий
   * @param {Object} params {
   *   int page | default: 1
   *   int items_per_page | default: 10
   *   int category | 1..999
   *   string date | format: YYYY-MM-DD
   *   int is_main | 1/0
   *   int place | 1..999
   * }
   * @return {Promise}
   */
  getEvents,

  /**
   * @description Получить даты в которых есть события в указанной категории
   * @param {number} categoryId
   * @returns {Promise}
   */
  getDatesInCategory,

  /**
   * @description Получить даты в которых есть события в указанном месте
   * @param {number} placeId
   * @returns {Promise}
   */
  getDatesInPlace,

  /**
   * @description Получить список категорий с количеством событий в каждой
   * @returns {Promise}
   */
  getCategories,

  /**
   * @description Получить список мест с количеством событий в каждом
   * @returns {Promise}
   */
  getPlaces,

  /**
   * @returns {Object}
   */
  getTodayMSK,

  /**
   * @returns {Object}
   * {
   *  dates: '1 - 2 сентября',
   *  time: '15:00 — 19:00',
   * }
   */
  beautifyEventDatesRange,

  /**
   * @param {number} number - число, к которому нужно подобрать слово в правильном склонении 
   * @param {Array} titlesArray - слова в нужном склонении
   * @returns {String} - слово в нужном склонении
   * 
   * @example MDApi.getDeclineOfNumber(eventsCount, ['событие', 'события', 'событий'])
   */
  getDeclineOfNumber,
}

export default MDApi
