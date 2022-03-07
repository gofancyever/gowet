import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { ipcRenderer } from 'electron'
window.ipcRenderer = ipcRenderer
Vue.config.productionTip = false
import { Button, Input,TabPane,Tabs,Table,TableColumn,Dialog,Form,FormItem,Radio,RadioGroup,Select,Option } from 'element-ui';
import JsonViewer from 'vue-json-viewer'

Vue.use(Button)
Vue.use(Input);
Vue.use(TabPane);
Vue.use(Tabs);
Vue.use(JsonViewer)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Dialog)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Select)
Vue.use(Option)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
