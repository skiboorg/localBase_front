import {Notify, Screen} from "quasar";

export function useNotify(color,message){
    Notify.create({
      message: message,
      html: true,
      color: color,
      position: Screen.lt.sm ? 'bottom' : 'bottom-right',
    })
}
