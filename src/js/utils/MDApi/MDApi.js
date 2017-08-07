import React from 'react';
import 'whatwg-fetch'

/*
	@TODO: define in config file
*/
const MD_API_HOST = "http://localhost:5000";
// const MD_API_HOST = process.env.API_HOST


const MD_API_METHODS = {
	GET_EVENTS: 'events',
	GET_EVENT: 'event',
	GET_DATES_IN: 'daysevents',
	GET_PLACES_LIST: 'countevents?type=byplaces',
	GET_CATEGORIES_LIST: 'countevents?type=bycategories',	
}


const methodUrl = (methodId) => {
	return [MD_API_HOST, methodId].join('/')
}

/*
	Получить данные о событии
*/
const getEvent = (id) => {
	// method: /event/id
	let u = [
			methodUrl(MD_API_METHODS.GET_EVENT),
			id
		].join('/')

	return fetch(u)
}

/*
	Получить список событий
*/
const getEvents = (params) => { 
	/*
	method: /events?
	params: 
		page
		items_per_page	
		category
		date
		is_main
		place
	*/
	let computedParams = [];
		
	for (let key in params) {
		computedParams.push( [key, params[key]].join('=') )
	}

	let u = [
				methodUrl(MD_API_METHODS.GET_EVENTS), 
				computedParams.join('&')
			].join('?');


	return fetch(methodUrl(MD_API_METHODS.GET_EVENTS));
}


/*
	Получить список дат, на которые запланированы события по категории 
*/
const getDatesInCategory = (categoryId) => {
	// method: /daysevents?category=1
	let u = [
				methodUrl(MD_API_METHODS.GET_DATES_IN), 
				'category=${categoryId}'
			].join('?'); 

	return __getDatesIn(u);
}
/*
	Получить список дат, на которые запланированы события по месту 
*/
const getDatesInPlace = (placeId) => {
	// method: /daysevents?place=1
	let u = [
				methodUrl(MD_API_METHODS.GET_DATES_IN), 
				'place=${placeId}'
			].join('?'); 

	return __getDatesIn(u);
}



const getCategories = () => {
	// method: /countevents?type=bycategories
	let u = [
			methodUrl(MD_API_METHODS.GET_CATEGORIES_LIST)
		]

	return fetch(u)
}


const getPlaces = () => {
	// method: /countevents?type=byplaces
	let u = [
			methodUrl(MD_API_METHODS.GET_CATEGORIES_LIST)
		]

	return fetch(u)
}


const __getDatesIn = (u) => {
	return fetch(u)
}



/*
	@usage

	let x = MDApi.getCategories().then(function(res) 
        {
            return res.json()
        })
        .then(json=>{
            console.log( json )
        });
*/


export const MDApi = {

	/*
		Получить даные о событии
		@param int eventId
		@return promise
	*/
	getEvent: getEvent,

	/*
		Получить список событий
		@param Object params:
			{
				int page | defailt: 1
				int items_per_page | default: 10
				int category | 1..999
				string date | format: YYYY-MM-DD 
				int is_main | 1/0
				int place | 1..999
			}
		@return promise
	*/
	getEvents: getEvents,
	
	/*
		Получить даты в которых есть события в указанной категории
		@param int categoryId
		@return promise
	*/
	getDatesInCategory: getDatesInCategory,

	/*
		Получить даты в которых есть события в указанном месте
		@param int placeId
		@return promise
	*/
	getDatesInPlace: getDatesInPlace,

	/*
		Получить список категорий с количеством событий в каждой
		@return promise
	*/
	getCategories: getCategories,

	/*
		Получить список мест с количеством событий в каждом
		@return promise
	*/
	getPlaces: getPlaces
}
