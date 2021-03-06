import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Vuetify from 'vuetify'
import moment from 'moment'
import 'moment/locale/ru'
import firebase from 'firebase/app'
import YmapOptions from './config/yandexMap'
import firebaseConfig from './config/firebase'
import interceptors from './axios'
import VueQuillEditor from 'vue-quill-editor'
import YmapPlugin from 'vue-yandex-maps'

import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import 'nprogress/nprogress.css'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.config.productionTip = false

Vue.use(YmapPlugin, YmapOptions)
Vue.use(Vuetify)
Vue.prototype.moment = moment
firebase.initializeApp(firebaseConfig)
Vue.use(Vuetify, { iconfont: 'md' })
Vue.use(VueQuillEditor)
interceptors()

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
