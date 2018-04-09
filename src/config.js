/*
 * @Author: jiaxinying 
 * @Date: 2018-04-02 10:38:32 
 * @Last Modified by: jiaxinying
 * @Last Modified time: 2018-04-02 10:40:30
 */

'use strict'
const host = ''
export default {
    host,
    service: {
        url: '/api',
        method: 'post',
        baseURL: host,
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        timeout: 60000,
        responseType: 'json'
    },
    storage: {
        authTokenKey: 'TG_SERVER_TOKEN',
        authInfoCacheKey: 'TG_SERVER_AUTH_INFO_CACHE',
        patientKey: 'TG_SERVER_PATIENT',
        signatureKey: 'TG_SERVER_SIGNATURE'
      }
}