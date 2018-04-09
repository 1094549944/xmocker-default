<template>
  <aside class="aside">
    <div class="wrapper">
      <ul class="menu">
        <li class="menu-item" v-for="menu in menus" :key="menu.path">
          <div class="menu-title">
            <img class="icon" :src="getMenuIcon(menu.meta.icon)" :alt="menu.meta.title">
            <span class="text">{{ menu.meta.title }}</span>
          </div>
          <ul class="submenu">
            <li class="submenu-item" v-for="submenu in menu.children" :key="submenu.name">
              <router-link :to="menu.path + '/' + submenu.path">
                <div class="icon"></div>
                <span class="text">{{ submenu.meta.title }}</span>
              </router-link>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { deepCopy } from '@/utils'
  import patientIcon from '../../../../static/image/icon-aside-patient.png'
  import recipeIcon from '../../../../static/image/icon-aside-recipe.png'
  import billIcon from '../../../../static/image/icon-aside-bill.png'
  export default {
    name: 'Aside',
    data () {
      return {
        menuIcons: {
          patientIcon,
          recipeIcon,
          billIcon
        }
      }
    },
    computed: {
      ...mapGetters({
        accessedRoutes: 'power/accessedRoutes'
      }),
      menus () {
        return this.accessedRoutes.map(route => this.getMenusFromRoute(route)).filter(route => !!route)
      }
    },
    methods: {
      getMenusFromRoute (route) {
        route = deepCopy({}, route)
        if (route.meta && route.meta.hidden) {
          return null
        }
        if (route.children) {
          route.children = route.children.filter(child => this.getMenusFromRoute(child))
        }
        return route
      },
      getMenuIcon (name) {
        return this.menuIcons[`${name}Icon`] || null
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~@/assets/stylus/vars/index'
  @import '~@/assets/stylus/mixins/index'

  .aside {
    z-index $zindex-affix
    .wrapper {
      width 100%
      height 100%
      background $white

      .menu {
        padding 12px 0
      }

      .menu-title
      .submenu-item a {
        flexLayout()
        padding 12px 48px
        text-align center
      }

      .menu-title {
        color $grey-6
      }

      .submenu-item {
        .active {
          color $primary-color
          background alpha($primary-color, .1)
        }
      }

      .icon {
        flex 0 0 20px
        width 20px
        height 16px
        margin-right 12px
      }

      .text {
        font-size $font-size-lger
      }
    }
  }
</style>
