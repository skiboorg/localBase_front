<template>
  <q-layout view="lHh Lpr lFf">

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { useAuthStore } from 'stores/auth'
//import Header from "components/Header";
export default {
  //components: {Header},
  preFetch({store, redirect}) {
    const auth_store = useAuthStore(store)
    if (!auth_store.loggedIn) {
      redirect({path: '/login'})
    }
  },
}
</script>
