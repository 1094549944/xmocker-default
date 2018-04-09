/*
 * @Author: jiaxinying 
 * @Date: 2018-04-02 10:49:05 
 * @Last Modified by: jiaxinying
 * @Last Modified time: 2018-04-02 14:48:59
 */

'use strict'
import * as app from './app'
import * as auth from './auth'
import * as power from './power'
export default {
    app: getModule(app),
    auth: getModule(auth),
    power: getModule(power)
}

function getModule (mod = null){
    if(!mod){
        return null
    }
    return {
        namespaced: true,
        ...mod
    }
}