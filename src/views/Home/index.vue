<template>
  <div class="home-page">
    <img :src="homeInfo.adImage" alt="">
    
  </div>
</template>

<script>
  import { api } from '@/services'
  export default {
    name: 'Home',
    data () {
      return {
        modal: false,
        homeInfo: {
          adImage: ''
        }
      }
    },
    async created () {
      const { success, data } = await api.getHomeInfo()
      if (success) {
        for (let key in data) {
          if (this.homeInfo.hasOwnProperty(key)) {
            this.homeInfo[key] = data[key]
          }
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
