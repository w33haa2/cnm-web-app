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
// import _ from "lodash"; //lodash import
import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log
import VueSweetalert2 from 'vue-sweetalert2' // sweetalert
import axios from 'axios'
import VueTimers from 'vue-timers'
import Donut from 'vue-css-donut-chart'
import 'vue-css-donut-chart/dist/vcdonut.css'

Vue.use(Donut)

import * as filters from './filters' // global filters

import locale from 'element-ui/lib/locale/lang/en' // internationalization for element-ui

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  locale
})

Vue.use(VueSweetalert2)
Vue.use(VueTimers)
// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

// mixin for global functions

Vue.mixin({
  methods: {
    adjustColorTone(color, amount) {
      if (color) {
        return (
          '#' +
          color
            .replace(/^#/, '')
            .replace(/../g, color =>
              (
                '0' +
                Math.min(
                  255,
                  Math.max(0, parseInt(color, 16) + amount)
                ).toString(16)
              ).substr(-2)
            )
        )
      }
    },
    split(string, del) {
      return string.split(del)
    },
    $ready(fn) {
      if (process.env.NODE_ENV === 'production') {
        return this.$nextTick(fn)
      }

      setTimeout(() => {
        this.$nextTick(fn)
      }, 1000)
    },
    axiosRequest(method, url, options) {
      return new Promise((resolve, reject) => {
        axios({ method: method, url: url, headers: options })
          .then(res => {
            resolve(res.data)
          })
          .catch(err => {
            resolve(err.response.data)
          })
      })
    },
    toUrlParams(obj) {
      let result = ''
      const tmp = Object.keys(this.unsetNull(obj))
      // console.log(tmp);
      tmp.forEach((v, i) => {
        if (obj[v]) {
          if (Array.isArray(obj[v])) {
            obj[v].forEach((v1, i1) => {
              result += '&' + v + '[]=' + obj[v][i1]
            })
          } else {
            result += '&' + v + '=' + obj[v]
          }
        }
      })
      return '?' + result.slice(1)
    },
    isRTA() {
      let result = false
      if (
        store.getters.position.toLowerCase() === 'rta manager' ||
        store.getters.position.toLowerCase() === 'rta supervisor' ||
        store.getters.position.toLowerCase() === 'rta analyst'
      ) {
        result = true
      }
      return result
    },
    isHR() {
      let result = false
      if (
        store.getters.position.toLowerCase() === 'hr manager' ||
        store.getters.position.toLowerCase() === 'hr assistant'
      ) {
        result = true
      }
      return result
    },
    isOP() {
      let result = false
      if (
        store.getters.position.toLowerCase() === 'operations manager' ||
        store.getters.position.toLowerCase() === 'team leader'
      ) {
        result = true
      }
      return result
    },

    isADMIN() {
      let result = false
      if (store.getters.position.toLowerCase() === 'admin') {
        result = true
      }
      return result
    },
    unsetNull(obj) {
      const result = {}
      const tmp = Object.keys(obj)
      tmp.forEach((v, i) => {
        if (obj[v]) {
          result[v] = obj[v]
        }
      })
      return result
    },
    remUnderscore(string) {
      const str = string.split('_')
      let result = ''
      str.forEach((v, i) => {
        if (str.lenght - 1 !== i) {
          result += v + ' '
        } else {
          result += v
        }
      })
      return result
    },
    conflictDates(ot_schedule, reg_schedule) {
      const f = 'YYYY-MM-DD HH:mm:ss'
      let result = true
      const ot_start_conflict = moment(
        moment(ot_schedule.start_event).format(f)
      ).isBetween(
        moment(reg_schedule.start_event.date).format(f),
        moment(reg_schedule.end_event.date).format(f)
      )
      const ot_end_conflict = moment(
        moment(ot_schedule.end_event).format(f)
      ).isBetween(
        moment(reg_schedule.start_event.date).format(f),
        moment(reg_schedule.end_event.date).format(f)
      )
      // alert(ot_start_conflict + " " + ot_end_conflict);
      if (ot_start_conflict || ot_end_conflict) {
        result = true
      } else {
        result = false
      }
      return result
    },
    getDuration(date1, date2) {
      const d1 = moment(date1).format('YYYY-MM-DD HH:mm:ss')
      const d2 = moment(date2).format('YYYY-MM-DD HH:mm:ss')
      return moment.duration(moment(d2).diff(d1)).as('seconds')
    },
    secToHMS(seconds) {
      return moment.utc(seconds * 1000).format('HH:mm:ss')
    },
    ongoing(start, end) {
      return moment().isBetween(
        moment(start).format('YYYY-MM-DD HH:mm:ss'),
        moment(end).format('YYYY-MM-DD HH:mm:ss')
      )
    },
    getAvatarLetters(fname, lname) {
      return fname[0].toUpperCase() + lname[0].toUpperCase()
    },
    formatDate(date, format, formatoutput) {
      return moment(date, format).format(formatoutput)
    },
    ucwords(str) {
      str = str.toLowerCase()
      return str.replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g, function(
        e
      ) {
        return e.toUpperCase()
      })
    },
    positionPageGroup(position) {
      let group = ''
      switch (position) {
        case 'Admin':
          group = 'admin'
          break
        case 'HR Manager':
        case 'HR Assistant':
          group = 'hr'
          break
        case 'Operations':
        case 'Team Leader':
          group = 'operations'
          break
        case 'Representative - Order Placer':
          group = 'agent'
          break
        case 'RTA Manager':
        case 'RTA Supervisor':
        case 'RTA Analyst':
          group = 'rta'
          break
      }
      return group
    },
    fromNow(date) {
      return moment(date).fromNow()
    }
  }
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
