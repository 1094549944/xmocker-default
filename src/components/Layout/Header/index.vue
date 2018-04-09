<template>
  <header class="header">
    <a class="menu-trigger" @click="handleCollapseAside">
      <Icon type="navicon-round"></Icon>
    </a>
    <div class="logo-field" @click="handleGoHome">
      <img :src="authInfo.institutionLogo" alt="" class="logo">
      <div class="hospital" v-if="authInfo.hospital">
        {{ authInfo.hospital }}
      </div>
    </div>
    <div class="user-field">
      <div class="user">
        <img class="avatar" :src="authInfo.userAvatar" alt="">
        <div class="info">
          <span class="role">{{authInfo.userRole}}</span>
          <span class="name">{{authInfo.userName}}</span>
        </div>
      </div>
      <a class="exit" @click="handleLogout">
        <Icon type="log-out"></Icon>
        退出
      </a>
    </div>
    <div class="user-field-res">
      <Dropdown @on-click="handleItemClick">
        <a href="javascript:void(0)" class="user">
          <img class="avatar" :src="authInfo.userAvatar" alt="">
          <div class="info">
            <p class="role">{{authInfo.userRole}}</p>
            <p class="name">{{authInfo.userName}}</p>
          </div>
          <Icon type="arrow-down-b"></Icon>
        </a>
        <DropdownMenu slot="list">
          <DropdownItem name="logout">
            <Icon type="log-out"></Icon>
            退出
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  </header>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'Header',
    data () {
      return {}
    },
    computed: {
      ...mapGetters({
        asideCollapse: 'app/asideCollapse',
        authInfo: 'auth/info'
      })
    },
    methods: {
      handleCollapseAside () {
        this.$store.commit('app/SET_ASIDE_COLLAPSE', !this.asideCollapse)
      },
      handleGoHome () {
        this.$router.push({ name: 'Home' })
      },
      async handleLogout () {
        const success = await this.$store.dispatch('auth/logout')
        if (success) {
          window.location.reload()
        }
      },
      handleItemClick (item) {
        if (item === 'logout') {
          this.handleLogout()
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~@/assets/stylus/vars/index'
  @import '~@/assets/stylus/mixins/index'

  .header {
    flexLayout(, space-between)
    position fixed
    top 0
    left 0
    right 0
    width 100%
    height 80px
    padding 0 48px
    background $white
    font-size 16px
    z-index ($zindex-affix + 1)
    border-bottom 1px solid $border-color-split

    +mobile-tablet() {
      height 64px
      padding 0 16px
    }

    .menu-trigger {
      font-size 22px
    }

    .logo-field {
      flexLayout(, flex-start)
      font-size 18px
      cursor pointer

      .logo {
        max-width 136px
        height 50px
        margin-right 16px
      }
    }

    .user-field {
      flexLayout(, flex-end)
      .exit {
        margin-left 24px
        padding-left 24px
        border-left 1px solid $border-color-split
      }
    }

    .user-field
    .user-field-res {

      .user {
        flexLayout(, flex-start)

        .avatar {
          flex 0 0 36px
          width 36px
          height @width
          margin-right 12px
          border-radius 100%
        }

        .info {
          flexLayout(column, flex-start, flex-start)
        }

        .role {
          padding 0 6px
          background $primary-color
          color $white
          border-radius 4px
        }
      }
    }

    .user-field-res {
      .user {
      }
    }

    +pc() {
      .menu-trigger {
        display none
      }

      .user-field-res {
        display none
      }
    }

    +mobile-tablet() {
      .user-field {
        display none
      }
    }
  }
</style>
