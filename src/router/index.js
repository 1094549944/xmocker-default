/**
 * @desc Router entry
 * @author Jooger <iamjooger@gmail.com>
 * @date 1 Dec 2017
 */

import Vue from 'vue'
import Router from 'vue-router'
import { constantRoutes, asyncRoutes } from './routes'
import { LoadingBar, Message } from 'iview'

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  linkActiveClass: 'active',
  routes: constantRoutes
})

export default router

export {
  constantRoutes,
  asyncRoutes
}

export const composeWithStore = store => {
  router.beforeEach(async (to, from, next) => {
    const _next = (config) => {
      if (config !== false) {
        LoadingBar.start()
      }
      next(config)
    }
    // 1. 验证本地是否存在token，存在的话 转 2， 不存在转 5
    // 2. 验证用户信息是否获取过，获取过就正常判断to是否是登录页
    // 3. 如果未获取过用户信息，重新获取用户信息
    // 4. 如果获取失败(40x, 50x等)，先清空本地token，跳转到登录页
    // 5. 不存在token的话，必须让其跳转登录页
    if (store.getters['auth/token']) {
      if (store.getters['auth/infoLoaded']) {
        return infoLoadedHandler(to, from, _next)
      } else {
        const success = await store.dispatch('auth/getInfo')
        if (success) {
          // 获取module list权限列表，从而动态修改router
          await store.dispatch('power/getModuleList')
          await store.dispatch('power/generateRoutes')
          router.addRoutes(store.getters['power/accessedRoutes'])
          return infoLoadedHandler(to, from, _next, true)
        } else {
          await store.dispatch('auth/clearAuthInfo')
          return _next({ name: 'Login' })
        }
      }
    } else {
      // 未登录
      if (to.name !== 'Login') {
        if (from.name) {
          Message.warning('请先登录')
        }
        if (from.name === 'Login') {
          return _next(false)
        }
        const query = {}
        if (to.name) {
          query.redirect_uri_name = to.name
        }
        if (Object.keys(to.params).length) {
          query.redirect_params = JSON.stringify(to.params)
        }
        if (Object.keys(to.query).length) {
          query.redirect_query = JSON.stringify(to.query)
        }
        return _next({ name: 'Login', query })
      }
    }
    _next()
  })

  router.afterEach(route => {
    LoadingBar.finish()
  })
}

// 用户信息加载后路由处理
function infoLoadedHandler (to, from, next, async = false) {
  if (to.name === 'Login') {
    // 已登录 && To login page
    Message.info('已登录')
    if (from.name) {
      // 从别的页面通过路由跳转（浏览器前进后退）
      return next(false)
    } else {
      // 直接从地址栏输入/login回车跳转
      return next({ name: 'Home' })
    }
  } else if (async) {
    next(to.path)
  } else {
    next()
  }
}
