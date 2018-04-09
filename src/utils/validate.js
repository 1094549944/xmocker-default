/*
 * @Author: jiaxinying 
 * @Date: 2018-04-02 10:54:47 
 * @Last Modified by: jiaxinying
 * @Last Modified time: 2018-04-02 14:19:21
 */

'use strict'
/**
 * 类型检测
 * @param {*} obj 检测对象
 * @param {String | Array[String]} type 类型（数组）
 */
export const isType = (obj = {}, type = 'Object') => {
    if (!Array.isArray(type)) {
      type = [type]
    }
    return type.some(t => Object.prototype.toString.call(obj) === `[object ${t}]`)
  }

  /**
 * 校验手机号码
 * @param  {} phone=''  手机号码
 */
export const isPhoneNo = (phone = '') => /^1[34578]\d{9}$/.test(phone)