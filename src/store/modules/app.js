/**
 * @desc App global data store
 * @author Jooger <iamjooger@gmail.com>
 * @date 1 Dec 2017
 */

'use strict'

const SET_ROUTES = 'SET_ROUTES'
const SET_ASIDE_COLLAPSE = 'SET_ASIDE_COLLAPSE'
const SET_MOBILE = 'SET_MOBILE'

export const state = {
  routes: [],
  asideCollapse: true,
  isMobile: false
}

export const getters = {
  routes: state => state.routes,
  routesMenu: state => getMenu(state.routes),
  asideCollapse: state => state.asideCollapse,
  isMobile: state => state.isMobile
}

export const mutations = {
  [SET_ROUTES]: (state, routes = []) => (state.routes = routes),
  [SET_ASIDE_COLLAPSE]: (state, status = false) => (state.asideCollapse = status),
  [SET_MOBILE]: (state, status = false) => (state.isMobile = status)
}

function getMenu (routes = []) {
  return routes.map(route => {
    route = Object.assign({}, route)
    if (!route.meta || !route.meta.hidden) {
      if (route.children) {
        route.children = getMenu(route.children)
      }
      return route
    }
    return null
  }).filter(route => !!route)
}
