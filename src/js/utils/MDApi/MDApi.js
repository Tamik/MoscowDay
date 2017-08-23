import React from 'react'
import 'whatwg-fetch'
import moment from 'moment'

const MD_API_HOST = process.env.API_HOST

/**
 * See docs here: https://github.com/cybri0nix/md-back
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
 * Получить данные о событии
 */
const getEvent = (id) => {
  /**
   * Example: /event/${id}
   */
  const url = [
    methodUrl(MD_API_METHODS.GET_EVENT),
    id,
  ].join('/')

  return fetch(url)
}

/**
 * Получить список событий
 */
const getEvents = (params) => {
  /**
   * Method: /events?param=${params}
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
 * Получить список дат, на которые запланированы события по категории 
 */
const getDatesInCategory = (categoryId) => {
  /** 
   * Method: /dayevents?place=${categoryId}
   */
  const url = [
    methodUrl(MD_API_METHODS.GET_DATES_IN),
    `category=${categoryId}`,
  ].join('?')

  return fetch(url)
}

/**
 * Получить список дат, на которые запланированы события по месту 
 */
const getDatesInPlace = (placeId) => {
  /** 
   * Method: /dayevents?place=${placeId}
   */
  const url = [
    methodUrl(MD_API_METHODS.GET_DATES_IN),
    `place=${placeId}`,
  ].join('?')

  return fetch(url)
}

const getCategories = () => {
  /** 
   * Method: /countevents?type=bycategories
   */
  const url = [
    methodUrl(MD_API_METHODS.GET_CATEGORIES_LIST),
  ]

  return fetch(url)
}

const getPlaces = () => {
  /** 
   * Method: /countevents?type=byplaces
   */
  const url = [
    methodUrl(MD_API_METHODS.GET_PLACES_LIST),
  ]

  return fetch(url)
}

/**
 * Получить сегоднянюю дату в часовом поясе +03:00 (МСК) 
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
 * Отформатировать дату начала и дату завершения события
 * dateStart/dateEnd = {
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

/**
 * @example Get categories (with count of events in each of them)
 * const APIresponse = MDApi.getCategories().then(response => {
 *   return response.json()
 * })
 * .then(response => console.log(response));
 */

/** 
 * @example Get main events
 * const APIresponse = MDApi.getEvents({ is_main:1 }).then(response => {
 *   return response.json()
 * })
 * .then(response => console.log(response));
 */

/**
 * @example Get events by category
 * const APIresponse = MDApi.getEvents({ category:1 }).then(response => {
 *  return response.json()
 * })
 * .then(response => console.log(response));
 */

const MDApi = {
  /**
   * Получить даные о событии
   * @param {number} eventId
   * @return {Promise}
   */
  getEvent,

  /**
   * Получить список событий
   * @param {Object} params:
   * {
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
   * Получить даты в которых есть события в указанной категории
   * @param {number} categoryId
   * @returns {Promise}
   */
  getDatesInCategory,

  /**
   * Получить даты в которых есть события в указанном месте
   * @param {number} placeId
   * @returns {Promise}
   */
  getDatesInPlace,

  /**
   * Получить список категорий с количеством событий в каждой
   * @returns {Promise}
   */
  getCategories,

  /**
   * Получить список мест с количеством событий в каждом
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
}

export default MDApi
