/*
 * @Author: jiaxinying 
 * @Date: 2018-04-02 14:13:08 
 * @Last Modified by: jiaxinying
 * @Last Modified time: 2018-04-02 14:13:40
 */


'use strict'

import { fileToBase64 } from '@/utils'
// import { setTimeout } from 'timers';

export default {
  methods: {
    handleReportFormatError (file) {
      this.$Notice.warning({
        title: '文件类型错误',
        desc: file.name + ' 文件的类型错误，仅支持上传 jpg，jpeg 和 png 类型'
      })
    },
    handleBeforeUploadB () {

    },
    handleBeforeUploadReport (file) {
      if (!this.detail.data.report) {
        this.$set(this.detail.data, 'report', [])
      }
      const report = this.detail.data.report
      if (report.length >= 9) {
        this.$Notice.warning({
          title: '至多上传9张报告'
        })
      } else {
        const index = report.push({
          url: '',
          file
        }) - 1
        this.statusLloading.statusA[index] = {
          status: 0
        }
        fileToBase64(file).then(data => {
          report.splice(index, 1, {
            ...report[index],
            statusA: 0,
            url: data
          })
          this.uploadReports().then(() => {
            if (this.recipeId && this.addReport) {
             
            } else {
              this.statusLloading.statusA.map((i, k) => {
                this.statusLloading.statusA.splice(k, 1, {
                  status: 1
                })
              })
            }
          })
        }).catch((err) => {
          console.log(err)
        })
      }
      return false
    },
    handleReportUploadSuccess (res, file) {
      const report = this.detail.data.report || []
      if (res) {
        report.push({
          ...file,
          url: res.fileFieldStorageFileName
        })
      }
      if (this.recipeId && this.addReport) {
        this.addReport(report)
      }
      this.$set(this.detail.data, 'report', report)
    },
    handleReportUploadProgress (event, file, fileList) {
      console.log(event)
    },
    handleReportUploadError (error, file) {
      this.$Message.error(error.commonMessage)
    },
    handleRemoveReport (item, index) {
      this.detail.data.report.splice(index, 1)
      const report = this.detail.data.report
      if (this.recipeId && this.addReport) {
        this.addReport(report)
          .then(() => {
            this.statusLloading.statusA.splice(index, 1)
          })
      } else {
        this.statusLloading.statusA.splice(index, 1)
      }
    },
    handleBillFormatError (file) {
      this.$Notice.warning({
        title: '文件类型错误',
        desc: file.name + ' 文件的类型错误，仅支持上传 csv 类型'
      })
    },
    handleBillFormatBefore (file) {
      fileToBase64(file).then(data => {
        this.realFile = {
          file,
          url: data
        }
        this.uploadFile()
      })
      return false
    },
    handleBillFormatSuccess (response, file, fileList) {
      if (response.code === 0) {
        this.$Message.error(response.commonMessage)
      } else {
        this.fetchBillListWrapper({ pageNum: 1 })
      }
    },
    handleBillError () {
      this.$Message.error('请求错误')
    }
  }
}
