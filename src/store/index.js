/*
 * @Author: jiaxinying 
 * @Date: 2018-04-02 10:46:04 
 * @Last Modified by: jiaxinying
 * @Last Modified time: 2018-04-02 10:47:40
 */

'use strict'
import Vue from 'vue'
import Vuex from 'vuex'
import storeModules from './modules'

Vue.use(Vuex)
export default new Vuex.Store({
    strict: !__PROD__,
    modules: storeModules
})