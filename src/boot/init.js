import { boot } from 'quasar/wrappers'
import {Cookies} from "quasar"
import {useAuthStore} from "stores/auth"


export default boot(async({ app, ssrContext,store }) => {
  const authStore = useAuthStore(store)
  const cookies = process.env.SERVER
    ? Cookies.parseSSR(ssrContext)
    : Cookies
  await authStore.getUser()

  app.config.globalProperties.auth = authStore.$state


})

