/*
 * @Author: jiaxinying 
 * @Date: 2018-04-02 13:49:07 
 * @Last Modified by: jiaxinying
 * @Last Modified time: 2018-04-02 15:20:53
 */

'use strict'
import Axios from 'axios'
import store from '@/store'
import config from '@/config'
import { Message } from 'iview'
import { getLocalStorageItem } from '@/utils'

const logMsg = (msg = '', type = 'success') => {
    Message[type] && Message[type]({
      duration: 3,
      content: msg || (type === 'success' ? '操作成功' : type === 'error' ? '服务器异常' : '操作失败')
    })
  }

  export const fetcher = Axios.create(config.service)
  const uploadFetcher = Axios.create(config.service)
  
  const codeMap = {
    FAILED: -1,
    SUCCESS: 200,
    CREATED: 201,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    SERVER_ERROR: 500,
    PARAMS_ERROR: 10001
  }

  function getToken() {
    let token = ''
    try {
      token = getLocalStorageItem(config.storage.authTokenKey)
    } catch (err) {
      console.error(err)
    }
    return token
  }

  function responseResolveInterceptor(response) {
    if (!response || !response.data) {
      return logMsg('服务器异常', 'error')
    }
    switch (response.status) {
      case codeMap.UNAUTHORIZED:
        logMsg(response.data.codeDescUser, 'error')
        store.dispatch('auth/clearAuthInfo').then(() => window.location.reload())
        break
      case codeMap.FAILED:
      case codeMap.FORBIDDEN:
      case codeMap.SERVER_ERROR:
      case codeMap.PARAMS_ERROR:
        logMsg(response.data.codeDescUser, 'error')
        break
      case codeMap.SUCCESS:
      case codeMap.CREATED:
        if (~~response.data.code) {
          logMsg(response.data.codeDescUser, 'error')
        }
        break
      default:
        break
    }
    return {
      success: !~~response.data.code,
      ...response.data
    }
  }


  function responseRejectInterceptor(err) {
    const status = err.response ? err.response.status : err.code
    let message = '请求错误'
    if (err.message.indexOf('timeout') > 0) {
      message = '请求超时，请稍后再试'
    }
    console.error(err.message, status)
    logMsg(message, 'error')
    Promise.reject(err)
    return { success: false }
  }


  fetcher.interceptors.request.use(opt => {
    const token = getToken()
    if (token) {
      if (!opt.data) {
        opt.data = {}
      }
      opt.data.token = token
    }
    return paramsToJSON(opt)
  }, err => Promise.reject(err))


  fetcher.interceptors.response.use(responseResolveInterceptor, responseRejectInterceptor)
  uploadFetcher.interceptors.response.use(responseResolveInterceptor, responseRejectInterceptor)

  const wrap = (func = null, params = {}) => (config = {}) => {
    const data = { app: '1' }
    if (func) {
      data.func = func
    }
    const opt = {
      url: '/api',
      method: 'post',
      ...params,
      ...config,
      data: Object.assign({}, data, params.data, config.data)
    }
    return fetcher.request(opt)
  }

  function paramsToJSON (config = {}) {
    if (config.data) {
      let params = config.data
      if (typeof params !== 'object') return String(params)
      let arr = []
      Object.keys(params).forEach(key => {
        if (params[key] === undefined) return
        let val = typeof params[key] === 'string' ? params[key] : JSON.stringify(params[key])
        arr.push(`${key}=${encodeURIComponent(val)}`)
      })
      config.data = arr.join('&')
    }
    return config
  }

  export default {
      login: wrap('login'),
      getUserInfo: wrap('userInfo'),
      getModuleList: wrap('getModuleList'),
      getHomeInfo: wrap('homeInfo'),
      uploadFile: (option = {}) => {
        const formData = new FormData()
        if (option.data) {
          Object.keys(option.data).map(key => {
            formData.append(key, option.data[key])
          })
        }
        formData.append('token', getToken())
        formData.append('app', '1')
        formData.append(option.name, option.file, option.filename || option.file.name)
        return uploadFetcher.post('/common/perform_upload_file', formData, {
          ...config.service,
          headers: {
            ...config.service.headers,
            'Content-Type': 'multipart/form-data'
          }
        })
      },
      uploadFun: (option = {}, api, uploadParams) => {
        const formData = new FormData()
        if (option.data) {
          Object.keys(option.data).map(key => {
            formData.append(key, option.data[key])
          })
        }
        formData.append('token', getToken())
        formData.append('app', '1')
        formData.append('func', uploadParams.func)
        formData.append(option.name, option.file, option.filename || option.file.name)
        return uploadFetcher.post(api, formData, {
          ...config.service,
          headers: {
            ...config.service.headers,
            'Content-Type': 'multipart/form-data'
          }
        })
      }
  }