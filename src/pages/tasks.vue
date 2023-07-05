<template>

<q-page padding>
  <div class="flex items-center q-mb-md">
    <q-checkbox v-model="is_task_drag" class="q-mr-md" label="Сменить порядок задач"/>
    <q-checkbox v-model="is_column_drag" class="q-mr-md"  label="Сменить порядок колонок"/>
    <q-btn label="Добавить колонку" class="q-mr-md"  @click="addColumn=!addColumn"/>

      <q-input v-if="addColumn" dense filled style="width: 200px" v-model="new_column"
               label="Название" @keydown.enter="columnAction('create')"/>


  </div>

  <div class="container">
    <div class="column-grid">
      <div class="column"
           v-for="(column, column_index) in columns"
           :id="`${column_index}`"
           :draggable="is_column_drag"
           :key="column_index"
           @drop='columnOnDrop($event,column_index, "column")'
           @dragover="columnDragOver"
           @dragleave="columnDragLeave"
           @dragstart="columnDragStart"
      >
        <div class="flex justify-between">
          <p>{{column.name}}</p>
          <q-btn icon="delete" class="q-mr-md"  @click="columnAction('delete',column.id)"/>
        </div>

        <div class="task-grid">
          <div class="task"
               v-for="(task, task_index) in column.tasks"
               :draggable="is_task_drag"
               :id="`${task_index}`"
               @dragstart="taskDragStart(event,task_index,column_index)"
               @drop='taskOnDrop($event,column_index,task_index, "task")'
               :style="{background: task.color}" >
            {{task.description}}
          </div>
        </div>
      </div>
    </div>
  </div>
</q-page>


</template>
<script setup>

import {onBeforeMount, ref} from "vue";
import {api} from "boot/axios";

const columns = ref([])
const new_column = ref(null)
const col_drag_index = ref(null)
const task_drag_index = ref(null)
const task_drag = ref(null)
const task_drag_col_index = ref(null)
const col_drag_to_index = ref(null)
const is_task_drag = ref(false)
const addColumn = ref(false)
const is_column_drag = ref(false)
// const columns = ref([
//   {
//     "id": 1,
//     "tasks": [
//       {
//         "id": 1,
//         "order_num": 1,
//         "description": "111--111",
//         "color": "#1a38da",
//         "name": "task1",
//         "column": 1
//       },
//       {
//         "id": 2,
//         "order_num": 2,
//         "description": "111----2222",
//         "color": "#d57b11",
//         "name": "task2",
//         "column": 1
//       }
//     ],
//     "name": "Col0",
//     "order_num": 1
//   },
//   {
//     "id": 2,
//     "tasks": [
//       {
//         "id": 1,
//         "order_num": 1,
//         "description": "2222-111111",
//         "color": "#0beed7",
//         "name": "task1",
//         "column": 1
//       },
//       {
//         "id": 2,
//         "order_num": 2,
//         "description": "22222-2222",
//         "color": "#ff0000",
//         "name": "task2",
//         "column": 1
//       }
//     ],
//     "name": "Col1",
//     "order_num": 1
//   },
//   {
//     "id": 3,
//     "tasks": [
//       {
//         "id": 1,
//         "order_num": 1,
//         "description": "3333-111111",
//         "color": "#37d312",
//         "name": "task1",
//         "column": 1
//       },
//       {
//         "id": 2,
//         "order_num": 2,
//         "description": "333-2222",
//         "color": "#ff00a6",
//         "name": "task2",
//         "column": 1
//       }
//     ],
//     "name": "Col3",
//     "order_num": 1
//   }
// ])

onBeforeMount(async ()=>{
  await getColumns()
})

const getColumns = async () => {
  const response = await api(`/api/data/column`)
  columns.value = response.data
}

const columnDragOver = (event) => {
  event.preventDefault();
  if (!event.currentTarget.classList.contains('ondrop')) {
    event.currentTarget.classList.remove('ondropleave');
    event.currentTarget.classList.add('ondrop');
  }
}

const columnDragLeave = (event) => {
  event.currentTarget.classList.add('ondropleave');
  event.currentTarget.classList.remove('ondrop');
}
const columnDragStart = (event) => {

  console.log('columnDragStart',event.target.id)
  col_drag_index.value = event.target.id
}
const taskDragStart = (event,task_index,col_index) => {

  console.log('task_index',task_index)
  console.log('col_index',col_index)
  task_drag_index.value = task_index
  task_drag_col_index.value = col_index
  task_drag.value = columns.value[col_index].tasks[task_index]
  console.log(task_drag.value)

}

const taskOnDrop = async (event,to_column_index,to_task_index,name) => {
  console.log(event)
  console.log('to_task_index',to_task_index)
  console.log('to_column_index',to_column_index)
  if(is_task_drag.value){
    let task_data
    task_data = columns.value[task_drag_col_index.value].tasks[task_drag_index.value]
    console.log(task_data)
    columns.value[task_drag_col_index.value].tasks.splice(task_drag_index.value,1)
    columns.value[to_column_index].tasks.splice(to_task_index,0,task_data)
    await reorder()
  }
  event.currentTarget.classList.add('ondropleave');
  event.currentTarget.classList.remove('ondrop');
}
const columnOnDrop = async  (event,to_column_index,name) => {
  if(is_column_drag.value){
    let column_data
    // console.log(event)
    // console.log('to_column_index',to_column_index)
    col_drag_to_index.value = to_column_index
    column_data= columns.value[col_drag_index.value]
    columns.value.splice(col_drag_index.value,1)
    columns.value.splice(to_column_index,0,column_data)
    await reorder()
  }
  if(is_task_drag.value && columns.value[to_column_index].tasks.length===0){
    console.log('is task',to_column_index)
    columns.value[task_drag_col_index.value].tasks.splice(task_drag_index.value,1)
    columns.value[to_column_index].tasks.push(task_drag.value)
  }
  event.currentTarget.classList.add('ondropleave');
  event.currentTarget.classList.remove('ondrop');
}

const reorder = async () => {
  let data=[]

  columns.value.forEach((column,index)=>{
    data.push({
      id:column.id,
      tasks:column.tasks.map((x)=>x.id)
    })

  })
  console.log(data)
  const response = await api.post(`/api/data/reorder`,data)
  await getColumns()
}

const columnAction = async (action,id) => {
  if(action==='create'){
    await api.post(`/api/data/column`,{name:new_column.value})
    addColumn.value = false
    new_column.value = null
  }
  if(action==='delete'){
    await api.delete(`/api/data/column/${id}`)
  }

  await getColumns()
}
</script>


<style lang="sass">
.column-grid
  display: grid
  grid-auto-columns: 400px
  grid-auto-flow: column
  grid-gap: 40px
  overflow-y: hidden
  margin: 0 -90px
  padding: 0 90px
  min-height: 79vh
  height: fit-content
.column
  border: 2px solid #cecece
  &.ondrop
    border-color: green
    padding-bottom: 250px
    & .new-project
      pointer-events: none
    & .task-inner
      pointer-events: none
  &.ondropleave
    border-color: white
    & .new-project
      pointer-events: all
    & .task-inner
      pointer-events: all

.task
  border-radius: 30px !important
  padding: 30px
  &.is-done
    background: #EBFDEE
  &-comments
    border: 2px solid #F3F5FF
    box-sizing: border-box
    border-radius: 30px
    padding: 20px

.task-grid
  display: grid
  grid-template-columns: 1fr
  grid-gap: 40px
</style>
