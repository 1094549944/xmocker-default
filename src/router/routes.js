/*
 * @Author: jiaxinying 
 * @Date: 2018-04-02 15:05:28 
 * @Last Modified by: jiaxinying
 * @Last Modified time: 2018-04-02 15:27:04
 */


'use strict'

import Home from '@/views/Home'
import Login from '@/views/Login'
import Error403 from '@/views/Error/403'
import Error404 from '@/views/Error/404'
import Error500 from '@/views/Error/500'

const Recipe = () => import(/* webpackChunkName: "Recipe" */ '@/views/Recipe')
const RecipeList = () => import(/* webpackChunkName: "RecipeList" */ '@/views/Recipe/List')
const RecipeDetail = () => import(/* webpackChunkName: "RecipeDetail" */ '@/views/Recipe/Detail')

export const constantRoutes = [{
  path: '/login',
  name: 'Login',
  component: Login,
  meta: {
    title: '登录',
    hidden: true,
    fullscreen: true
  }
},
{
  path: '/403',
  name: 'Error403',
  component: Error403,
  meta: {
    hidden: true,
    fullscreen: true
  }
},
{
  path: '/404',
  name: 'Error404',
  component: Error404,
  meta: {
    hidden: true,
    fullscreen: true
  }
},
{
  path: '/500',
  name: 'Error500',
  component: Error500,
  meta: {
    hidden: true,
    fullscreen: true
  }
}]

export const asyncRoutes = [
  {
    path: '',
    redirect: {
      name: 'Home'
    },
    meta: {
      hidden: true
    }
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: {
      title: '首页',
      hidden: true
    }
  },
  {
    path: '/Recipe',
    component: Recipe,
    meta: {
      title: '处方管理',
      icon: 'recipe',
      power: 10
    },
    children:[{
      path:'RecipeList',
      name: 'RecipeList',
      component: RecipeList,
      meta: {
        title: '处方列表',
        power: 10
      }
    },
    {
      path:'RecipeDetail',
      name: 'RecipeDetail',
      component: RecipeDetail,
      meta: {
       
        hidden: true
      }
    },
  ]
  },

  {
    path: '*',
    redirect: {
      name: 'Error404'
    },
    meta: {
      hidden: true
    }
  }
]
