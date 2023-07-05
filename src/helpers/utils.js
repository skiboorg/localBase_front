import { copyToClipboard } from 'quasar'
import {Notify} from "quasar";


export function useNotify(color,message){
  Notify.create({
    message: message,
    timeout:1000,
    html: true,
    color: color,
    position: 'bottom',
  })
}

export async function copyClipBoard(message, notify_color,notify_message){
  await copyToClipboard(message);
  useNotify(notify_color,notify_message)
}


