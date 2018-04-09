/**
 * @desc Auth module
 * @author Jooger <iamjooger@gmail.com>
 * @date 1 Dec 2017
 */

'use strict'

import config from '@/config'
import { api } from '@/services'
import {
  setLocalStorageItem,
  getLocalStorageItem,
  removeLocalStorageItem
} from '@/utils'

const LOGIN_REQUEST = 'LOGIN_REQUEST'
const LOGIN_FAILURE = 'LOGIN_FAILURE'
const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
const CLEAR_INFO = 'CLEAR_INFO'
const LOGOUT_REQUEST = 'LOGOUT_REQUEST'
const LOGOUT_FAILURE = 'LOGOUT_FAILURE'
const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'
const FETCH_INFO_REQUEST = 'FETCH_INFO_REQUEST'
const FETCH_INFO_FAILURE = 'FETCH_INFO_FAILURE'
const FETCH_INFO_SUCCESS = 'FETCH_INFO_SUCCESS'

export const state = {
  loading: false,
  info: {},
  token: getLocalStorageItem(config.storage.authTokenKey) || null
}

export const getters = {
  loading: state => state.loading,
  info: state => state.info,
  token: state => state.token,
  isLogin: state => !!state.token,
  infoLoaded: state => !!state.info.userId
}

export const mutations = {
  [LOGIN_REQUEST]: state => (state.loading = true),
  [LOGIN_FAILURE]: state => (state.loading = false),
  [LOGIN_SUCCESS]: (state, token) => {
    state.loading = false
    state.token = token
  },
  [CLEAR_INFO]: state => {
    state.info = {}
    state.token = null
    state.loading = false
  },
  [LOGOUT_REQUEST]: state => (state.loading = true),
  [LOGOUT_FAILURE]: state => (state.loading = false),
  [LOGOUT_SUCCESS]: state => (state.loading = false),
  [FETCH_INFO_REQUEST]: state => (state.loading = true),
  [FETCH_INFO_FAILURE]: state => {
    state.loading = false
    state.token = null
  },
  [FETCH_INFO_SUCCESS]: (state, info) => {
    state.loading = false
    state.info = info
  }
}

export const actions = {
  async login ({ commit, dispatch, state }, params = {}) {
    if (state.loading) {
      return
    }
    commit(LOGIN_REQUEST)
    const { success, data } = await api.login({
      data: {
        params
      }
    }).catch(err => ((commit(LOGIN_FAILURE, err), {})))
    if (success) {
      commit(LOGIN_SUCCESS, data.token)
      setLocalStorageItem(config.storage.authTokenKey, data.token)
    } else {
      commit(LOGIN_FAILURE)
    }
    return success
  },
  async logout ({ commit, dispatch, state }, params = {}) {
    if (state.loading) {
      return
    }
    commit(LOGOUT_REQUEST)
    const { success } = await api.logout().catch(err => ((commit(LOGOUT_FAILURE, err), {})))
    if (success) {
      dispatch('clearAuthInfo').then(() => commit(LOGOUT_SUCCESS))
    } else {
      commit(LOGOUT_FAILURE)
    }
    return success
  },
  async getInfo ({ commit, dispatch, state }) {
    if (state.loading) {
      return
    }
    commit(FETCH_INFO_REQUEST)
    const { success, data } = await api.getUserInfo().catch(err => {
      commit(FETCH_INFO_FAILURE, err)
      dispatch('clearAuthInfo')
      return {}
    })
    if (success) {
      commit(FETCH_INFO_SUCCESS, data)
    } else {
      commit(FETCH_INFO_FAILURE)
      dispatch('clearAuthInfo')
    }
    return success
  },
  clearAuthInfo ({ commit }) {
    removeLocalStorageItem(config.storage.authTokenKey)
    commit(CLEAR_INFO)
  }
}
