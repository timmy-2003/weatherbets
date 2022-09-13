// plugins/noty.js
import 'vuejs-noty/dist/vuejs-noty.css'
import Vue from 'vue'
import VueNoty from 'vuejs-noty'

/*https://github.com/needim/noty/blob/master/docs/themes.md */
export default ({app}, inject) => {
  inject('noty', Vue.use(VueNoty, {
    timeout: 5000,
    progressBar: false,
    layout: 'bottomRight',
    closeWith: ['click', 'button'],
    theme: 'sunset', //default: mint
  }).noty)
}
