<template>
  <div id="app">
    <PageLoading v-if="authLoading || powerLoading"></PageLoading>
    <template v-else>
      <router-view v-if="fullscreen"></router-view>
      <div class="app-layout" v-else>
        <AppHeader></AppHeader>
        <main class="container">
          <AppAside class="col col-aside" :class="{ collapse: asideCollapse }"></AppAside>
          <transition name="fade" mode="out-in">
            <router-view class="col col-page page"></router-view>
          </transition>
        </main>
        <AppFooter></AppFooter>
      </div>
    </template>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { AppHeader, AppAside, AppFooter } from '@/components/Layout'
  import { PageLoading } from '@/components/Common'
  import { isMobile } from '@/utils'

  export default {
    name: 'App',
    components: {
      AppHeader,
      AppAside,
      AppFooter,
      PageLoading
    },
    computed: {
      ...mapGetters({
        asideCollapse: 'app/asideCollapse',
        authLoading: 'auth/loading',
        powerLoading: 'power/loading'
      }),
      fullscreen () {
        return this.$route.meta.fullscreen
      }
    },
    created () {
      if (isMobile()) {
        this.$store.commit('app/SET_MOBILE', true)
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~@/assets/stylus/vars/index'
  @import '~@/assets/stylus/mixins/index'

  $layout-padding        = 20px

  #app {
    .app-layout {
      position relative
      top 80px

      +mobile-tablet() {
        top 64px
      }
    }
    .container {
      position relative
      padding $layout-padding 20px

      .col-aside {
        position fixed
        top (80px + $layout-padding)
        width 220px

        +mobile-tablet() {
          top 79px
          bottom 0
          left 0
          width 200px
          box-shadow $shadow-1-right
          transition all .3s $ease

          &.collapse {
            transform translate3d(-200px, 0, 0)
          }
        }
      }

      .col-page {
        margin-left 220px + $layout-padding
        // padding 24px $layout-padding
        background $white
      }

      +mobile-tablet() {
        padding 16px

        .col-aside {
          top 63px
        }

        .col-page {
          margin-left 0
        }
      }
    }
  }
</style>

