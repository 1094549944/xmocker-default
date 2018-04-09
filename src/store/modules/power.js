/**
 * @desc 用户权限
 * @author Jooger <iamjooger@gmail.com>
 * @date 6 Dec 2017
 */

'use strict'

import { api } from '@/services'
import { deepCopy } from '@/utils'
import { constantRoutes, asyncRoutes } from '@/router/routes'

const FETCH_POWER_REQUEST = 'FETCH_POWER_REQUEST'
const FETCH_POWER_FAILURE = 'FETCH_POWER_FAILURE'
const FETCH_POWER_SUCCESS = 'FETCH_POWER_SUCCESS'
const SET_ROUTERS = 'SET_ROUTERS'
const SET_ACCESSED_ROUTERS = 'SET_ACCESSED_ROUTERS'

export const state = {
  loading: false,
  power: [],
  routes: [],
  accessedRoutes: []
}

export const getters = {
  power: state => state.power,
  loading: state => state.loading,
  routes: state => state.routes,
  accessedRoutes: state => state.accessedRoutes
}

export const mutations = {
  [FETCH_POWER_REQUEST]: state => (state.loading = true),
  [FETCH_POWER_FAILURE]: state => {
    state.loading = false
    state.power = []
  },
  [FETCH_POWER_SUCCESS]: (state, power) => {
    state.loading = false
    state.power = power
  },
  [SET_ROUTERS]: (state, routes) => {
    state.routes = [
      ...state.routes,
      ...routes
    ]
  },
  [SET_ACCESSED_ROUTERS]: (state, accessedRoutes) => {
    state.accessedRoutes = accessedRoutes
    state.routes = [
      ...state.routes,
      ...accessedRoutes
    ]
  }
}

export const actions = {
  async getModuleList ({ commit, state }) {
    if (state.loading) {
      return
    }
    commit(FETCH_POWER_REQUEST)
    const { success, data } = await api.getModuleList().catch(err => ((commit(FETCH_POWER_FAILURE, err), {})))
    if (success) {
      commit(FETCH_POWER_SUCCESS, data.list)
    } else {
      commit(FETCH_POWER_FAILURE)
    }
    return success
  },
  generateRoutes ({ commit, rootState, state }) {
    if (state.loading) {
      return
    }
    commit(SET_ROUTERS, deepCopy([], constantRoutes))
    const _asyncRoutes = deepCopy([], asyncRoutes)
    commit(SET_ACCESSED_ROUTERS, generateRoutesByPower(_asyncRoutes, state.power))
  }
}

function generateRoutesByPower (routes = [], power = []) {
  return routes.reduce((res, route) => {
    if (route.meta && route.meta.hidden) {
      res.push(route)
    } else if (findPower(route)) {
      if (route.children) {
        route.children = generateRoutesByPower(route.children, power)
      }
      res.push(route)
    }
    return res
  }, [])

  function findPower ($route) {
    if (!$route || !$route.meta || $route.meta.power === undefined) {
      return false
    }
    let _power = $route.meta.power
    _power = typeof _power === 'string' ? _power : _power.toString()
    return power.indexOf(_power) > -1
  }
}
