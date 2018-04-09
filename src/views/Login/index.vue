<template>
  <div class="login" @keydown.enter="handleSubmit">
    <div class="login-con">
      <Card :bordered="false">
        <p slot="title" style="text-align:center;">
            <Icon type="log-in"></Icon>
            欢迎登录
        </p>
        <div class="form-con">
          <Form ref="loginForm" :model="loginModel" :rules="rules">
            <FormItem prop="mobile">
              <Input v-model="loginModel.mobile" placeholder="请输入账号">
                <span slot="prepend">
                  <Icon :size="16" type="text"></Icon>
                </span>
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input type="password" v-model="loginModel.password" placeholder="请输入密码">
                <span slot="prepend">
                  <Icon :size="14" type="locked"></Icon>
                </span>
              </Input>
            </FormItem>
            <FormItem>
              <Button @click="handleSubmit" type="success" long :loading="loginLoading">登录</Button>
            </FormItem>
          </Form>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import {
    isPhoneNo,
    getLocalStorageItem
  } from '@/utils'
  import config from '@/config'

  const loginModelCache = JSON.parse(getLocalStorageItem(config.storage.authInfoCacheKey) || '{}')

  export default {
    name: 'Login',
    data () {
      const validateMobile = (rule, val, cb) => {
        if (!val) {
          cb(new Error('账号不能为空'))
        } else {
          cb()
        }
      }
      return {
        loginModel: {
          // mobile: loginModelCache.mobile || '18612032816',
          // password: '123456'
          mobile: loginModelCache.mobile || '',
          password: ''
        },
        rules: {
          mobile: [
            { required: true, validator: validateMobile, trigger: 'blur' }
          ],
          password: [
            { required: true, message: '密码不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      ...mapGetters({
        loginLoading: 'auth/loading',
        accessedRoutes: 'power/accessedRoutes'
      })
    },
    methods: {
      ...mapActions({
        login: 'auth/login',
        generateRoutes: 'power/generateRoutes'
      }),
      handleSubmit () {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.login(this.loginModel).then(success => {
              if (success) {
                const query = this.$route.query
                this.$router.replace({
                  name: query.redirect_uri_name || 'Home',
                  params: JSON.parse(query.redirect_params || '{}'),
                  query: JSON.parse(query.redirect_query || '{}')
                })
              }
            })
          }
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~@/assets/stylus/vars/index'
  @import '~@/assets/stylus/mixins/index'

  .login{
    full()
    background url('/static/image/login-background.jpg') no-repeat top left
    background-size cover
    &-con{
      position absolute
      right 160px
      top 50%
      transform translateY(-60%)
      width 300px
      &-header{
        font-size 16px
        font-weight 300
        text-align center
        padding 30px 0
      }
      .form-con{
        padding 10px 0 0
      }
      .login-tip{
        font-size 10px
        text-align center
        color #c3c3c3
      }
    }

    +mobile-tablet() {
      &-con{
        right auto
        left 50%
        transform translate(-50%, -50%)
      }
    }
  }
</style>

