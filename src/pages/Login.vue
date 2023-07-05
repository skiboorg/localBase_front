<template>
  <q-page class="flex column fullscreen items-center justify-center">
    <q-card style="width: 400px; max-width: 100vw;">
      <q-card-section >
        <p class="text-grey text-body1 text-weight-bold text-center">Вход</p>
        <q-form @submit="loginAction" class="auth-form">
          <q-input
            autofocus
            v-model="loginData.login"
            label="Ваш логин*"
            color="primary"
            outlined
            dense
            @update:model-value="emailToLowercase('login')"
            lazy-rules
            :rules="[
              val => val && val.length > 0 || 'Это обязательное поле']"/><!--    email      -->
          <q-input
            class="col-12 col-md-8"
            :type="vars.isPwd ? 'password' : 'text'"
            v-model="loginData.password"
            label="Пароль*"
            outlined
            dense
            color="primary"
            lazy-rules
            :rules="[val => val !== null && val !== '' || 'Это обязательное поле' ]"
          >
            <template v-slot:append>
              <q-icon
                :name="vars.isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="vars.isPwd = !vars.isPwd"
              />
            </template>
          </q-input>
          <div class="text-center q-mb-lg">
            <q-btn no-caps   class="max-width bg-btn-primary" unelevated
                   :loading="vars.is_loading" type="submit" label="Вход" />
          </div>

        </q-form>



      </q-card-section>
    </q-card>
  </q-page>

</template>
<script setup>

import { ref } from 'vue'

import {useAuthStore} from "stores/auth"
import {api} from "boot/axios";
import {useNotify} from "src/helpers/notify";
import {useRouter} from "vue-router"



const auth_store = useAuthStore()
const notify = useNotify
const router = useRouter()

let vars = ref({
  email_re:/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  is_loading:false,
  isPwd: true,
})

let loginData = ref({
  login: '1',
  password: '1',
})

const emailToLowercase = (type) => {
  type === 'login' ? loginData.value.login = loginData.value.login.toLowerCase() : null
}

const loginAction = async () => {
  await auth_store.loginUser(loginData.value)
}

</script>
