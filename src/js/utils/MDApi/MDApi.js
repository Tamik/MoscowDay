import React from 'react'
import 'whatwg-fetch'

const MD_API_HOST = process.env.API_HOST


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
  const u = [
    methodUrl(MD_API_METHODS.GET_EVENT),
    id,
  ].join('/')

  return fetch(u)
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

  const u = [
    methodUrl(MD_API_METHODS.GET_EVENTS),
    computedParams.join('&'),
  ].join('?')

  return fetch(u)
}

/**
 * Получить список дат, на которые запланированы события по категории 
 */
const getDatesInCategory = (categoryId) => {
  /** 
   * Example: /dayevents?place=${categoryId}
   */
  const u = [
    methodUrl(MD_API_METHODS.GET_DATES_IN),
    `category=${categoryId}`,
  ].join('?')

  return __getDatesIn(u)
}

/**
 * Получить список дат, на которые запланированы события по месту 
 */
const getDatesInPlace = (placeId) => {
  /** 
   * Example: /dayevents?place=${placeId}
   */
  const u = [
    methodUrl(MD_API_METHODS.GET_DATES_IN),
    `place=${placeId}`,
  ].join('?')

  return __getDatesIn(u)
}

const getCategories = () => {
  /** 
   * Example: /countevents?type=bycategories
   */
  const u = [
    methodUrl(MD_API_METHODS.GET_CATEGORIES_LIST),
  ]

  return fetch(u)
}

const getPlaces = () => {
  /** 
   * Example: /countevents?type=byplaces
   */
  const u = [
    methodUrl(MD_API_METHODS.GET_CATEGORIES_LIST),
  ]

  return fetch(u)
}

const __getDatesIn = u => fetch(u)

/**
 * @usage
  const APIresponse = MDApi.getCategories().then(response => {
    return response.json()
  })
  .then(response => console.log(response));
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
}

export default MDApi
