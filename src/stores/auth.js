import { ref } from 'vue';
import { defineStore } from 'pinia';
import {api} from "boot/axios";
import {Cookies, Notify, Screen} from 'quasar'
import {useRouter} from "vue-router"



export const useAuthStore = defineStore('auth', () => {
    let user = ref({})
    const loggedIn = ref(false)
    const router = useRouter()

    async function logoutUser() {
      await api.post('/auth/token/logout/')
        api.defaults.headers.common['Authorization'] = null
        if (!process.env.SERVER) {
          Cookies.remove('auth_token')
          //this.loggedIn = false
          //this.user = {}
        }
      this.router.go('/login')
    }

    function loginUser(data) {
      let that = this
      api.post('/auth/token/login/', data)
        .then(async function (response) {
          if (!process.env.SERVER) {
            Cookies.set('auth_token', response.data.auth_token)
          }
          api.defaults.headers.common['Authorization'] = 'Token ' + response.data.auth_token
          Notify.create({
            message: 'Успешная авторизация',
            color: 'positive',
            position: Screen.lt.sm ? 'bottom' : 'bottom-right',
          })
          await that.getUser()

          that.router.push('/')


        })
        .catch(function (error) {
          console.log(error);
          Notify.create({
            message: error.response.data.non_field_errors,
            html: true,
            color: 'red',
            position: Screen.lt.sm ? 'bottom' : 'bottom-right',
          })
        });
    }
    async function getUser() {
      console.log('get user')
      console.log(api.defaults.headers.common['Authorization'])
      let response
      try {
        response = await api.get('/api/user/me')
        this.loggedIn = true
        this.user = response.data
        console.log('get user done')
      } catch (e) {
        api.defaults.headers.common['Authorization'] = null
        if (!process.env.SERVER) {
          Cookies.remove('auth_token')
          this.loggedIn = false
          this.user = {}
        }
        return
      }
    }

    return{
      user,
      loginUser,
      getUser,
      loggedIn,
      logoutUser

    }
  }
)
