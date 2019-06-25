import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'

import moment from 'moment'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import _ from 'lodash'
import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters

import locale from 'element-ui/lib/locale/lang/en' // internationalization for element-ui

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  locale
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

// mixin for global functions

Vue.mixin({
  methods: {
    getAvatarLetters(fname, lname) {
      return fname[0] + lname[0]
    },
    formatDate(date, format, formatoutput) {
      return moment(date, format).format(formatoutput)
    }
  }
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
