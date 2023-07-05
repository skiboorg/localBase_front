import {api} from "boot/axios";
import {useAuthStore} from "stores/auth";
const authStore = useAuthStore()

export async function getStatuses(){
  const response = await api('/api/data/order/statuses')
  return response.data
}

export async function getPayStatuses(){
  const response = await api('/api/data/order/pay_statuses')
  return response.data
}

export async function getOwnUsers(){
  const response = await api(`/api/user/my_users?id=${authStore.user.uuid}`)
  return response.data
}
export async function getNetworks(){
  const response = await api(`/api/user/get_networks`)
  return response.data
}


