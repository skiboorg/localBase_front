<template>
  <q-page padding>
    <div class="container">
      <div class="q-gutter-md q-mb-lg">
        <router-link to="/tasks">Задачи</router-link>
        <router-link class="text-primary"  to="/">Записи</router-link>
        <q-btn label="Добавить таб" @click="newTabActive=true"/>
        <div  v-if="newTabActive" class="q-mb-lg"><q-input  dense filled v-model="tabName" label="Название" @keydown.enter="tabAction('add')"/></div>

      </div>


    <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab :name="`tab${index}`" :label="tab.name" v-for="(tab,index) in tabs" :key="index" />
      </q-tabs>

      <q-separator />
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel :name="`tab${tab_index}`" v-for="(tab,tab_index) in tabs" :key="tab_index">
          <div class="q-mb-lg">
            <q-btn label="Добавить запись" @click="newRecordActive=true"/>
          </div>

          <div v-if="newRecordActive" class="q-mb-lg">
            <q-input class="q-mb-lg" v-model="new_record.name" dense filled label="Название записи" />
            <div class="row q-col-gutter-md q-mb-xs" v-for="(param,index) in params" :key="param.id">
              <div class="col-6">
                <p class="no-margin">{{param.name}}</p>
              </div>
              <div class="col-6">

                <q-input v-model="new_record.params[index][param['name']]" dense filled label="Введите значение" />
              </div>
            </div>
            <q-btn label="Сохранить" @click="recordAction(('add'), tab.id)"/>
          </div>

          <div class="row q-col-gutter-md">
            <div class="col-3">
              <q-tabs
                v-model="record_tab"
                dense

                active-color="primary"
                indicator-color="primary"
                vertical
                align="justify"
                class="bg-grey-1 text-dark "

              >
                <q-tab :name="`record_tab${record_index}`" :label="record.name"
                       v-for="(record,record_index) in tab.records" :key="record_index" />
              </q-tabs>
            </div>

            <div class="col-9">
              <q-tab-panels style="border: 1px solid #cecece" class="bg-grey-1" v-model="record_tab" animated>
                <q-tab-panel :name="`record_tab${record_index}`" v-for="(record,record_index) in tab.records" :key="record_index">
                  <q-list dense separator>
                    <q-item clickable v-for="param in record.params" :key="param.id" @click="copy(param.value)">
                      <q-item-section>{{param.param.name}}</q-item-section>
                      <q-item-section >{{param.value}}</q-item-section>
                    </q-item>
                  </q-list>


                </q-tab-panel>
              </q-tab-panels>
            </div>
          </div>



        </q-tab-panel>


      </q-tab-panels>

    </div>
  </q-page>
</template>

<script setup>
import {onBeforeMount, ref} from "vue";
import {api} from "boot/axios";
import { copyToClipboard } from 'quasar'
import { useQuasar } from 'quasar'
const $q = useQuasar()
const tab = ref('tab0')
const record_tab = ref('record_tab0')
const newTabActive = ref(false)
const newRecordActive = ref(false)
const tabName = ref(null)
const new_record = ref({
  name:null,
  params:[]
})

const tabs = ref([])
const params = ref([])

const tabAction = async (action) => {
  if(action==='add'){
    await api.post('/api/data/tab',{name:tabName.value})
    newTabActive.value = false
  }
  await getTabs()
}
const recordAction = async (action,tab_id) => {
  if(action==='add'){
    await api.post('/api/data/record',{tab_id:tab_id,data:new_record.value})
    newRecordActive.value = false
  }
  await getTabs()
}

onBeforeMount(async ()=>{
  await getTabs()
  await getParams()
})

const getTabs = async () => {
  const response = await api('/api/data/tab')
  tabs.value = response.data

}
const getParams = async () => {
  const response = await api('/api/data/param')
  params.value = response.data
  for(let i of params.value){
    console.log(i.name)
    let t = {}
    t[i.name] = null
    console.log(t)
    new_record.value.params.push(t)
  }

}
const copy = (text) => {
  copyToClipboard(text)
    .then(() => {
      $q.notify('Скопировано')
    })
    .catch(() => {
      // fail
    })
}

</script>
