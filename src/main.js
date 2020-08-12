import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui';
import './styles/element-variables.scss';

import moment from 'moment';

import VueScrollTo from "vue-scrollto";
Vue.use(VueScrollTo);
import NavScroll from 'navscroll';
Vue.use(NavScroll);
// material icons
import TuneIcon from 'vue-material-design-icons/Tune.vue';
Vue.component('tune-icon', TuneIcon);
import PlusIcon from 'vue-material-design-icons/Plus.vue';
Vue.component('plus-icon', PlusIcon);
import FileImportIcon from 'vue-material-design-icons/FileImportOutline.vue';
Vue.component('file-import-icon', FileImportIcon);
import FileExportIcon from 'vue-material-design-icons/FileExportOutline.vue';
Vue.component('file-export-icon', FileExportIcon);
import EmailSendIcon from 'vue-material-design-icons/EmailSendOutline.vue';
Vue.component('email-send-icon', EmailSendIcon);
import CalendarIcon from 'vue-material-design-icons/CalendarOutline.vue';
Vue.component('calendar-icon', CalendarIcon);
import CalendarMultipleIcon from 'vue-material-design-icons/CalendarMultiple.vue';
Vue.component('calendar-multiple-icon', CalendarMultipleIcon);
import UpdateIcon from 'vue-material-design-icons/Update.vue';
Vue.component('update-icon', UpdateIcon);
import PencilIcon from 'vue-material-design-icons/Pencil.vue';
Vue.component('pencil-icon', PencilIcon);
import BadgeAccountAlertIcon from 'vue-material-design-icons/BadgeAccountAlertOutline.vue';
Vue.component('badge-account-alert-icon', BadgeAccountAlertIcon);
import CommentEyeIcon from 'vue-material-design-icons/CommentEyeOutline.vue';
Vue.component('comment-eye-icon', CommentEyeIcon);
import SquareEditIcon from 'vue-material-design-icons/SquareEditOutline.vue';
Vue.component('square-edit-icon', SquareEditIcon);
import TooltipEditIcon from 'vue-material-design-icons/TooltipEditOutline.vue';
Vue.component('tooltip-edit-icon', TooltipEditIcon);
import AccountEditIcon from 'vue-material-design-icons/AccountEditOutline.vue';
Vue.component('account-edit-icon', AccountEditIcon);
import FilterIcon from 'vue-material-design-icons/FilterOutline.vue';
Vue.component('filter-icon', FilterIcon);
import EyeIcon from 'vue-material-design-icons/EyeOutline.vue';
Vue.component('eye-icon', EyeIcon);
import CancelIcon from 'vue-material-design-icons/Cancel.vue';
Vue.component('cancel-icon', CancelIcon);
import ExportIcon from 'vue-material-design-icons/Export.vue';
Vue.component('export-icon', ExportIcon);
import DeleteIcon from 'vue-material-design-icons/Delete.vue';
Vue.component('delete-icon', DeleteIcon);
import SortAlphabeticalAscendingIcon from 'vue-material-design-icons/SortAlphabeticalAscending.vue';
Vue.component('sort-alpha-asc-icon', SortAlphabeticalAscendingIcon);
import SortAlphabeticalDescendingIcon from 'vue-material-design-icons/SortAlphabeticalDescending.vue';
Vue.component('sort-alpha-desc-icon', SortAlphabeticalDescendingIcon);
import CheckBoldIcon from 'vue-material-design-icons/CheckBold.vue';
Vue.component('check-bold-icon', CheckBoldIcon);
import MicrosoftExcelIcon from 'vue-material-design-icons/MicrosoftExcel.vue';
Vue.component('ms-excel-icon', MicrosoftExcelIcon);
import OpenInNewIcon from 'vue-material-design-icons/OpenInNew.vue';
Vue.component('open-in-new-icon', OpenInNewIcon);
import ArrowRightThickIcon from 'vue-material-design-icons/ArrowRightThick.vue';
Vue.component('arrow-right-thick-icon', ArrowRightThickIcon);
import 'vue-material-design-icons/styles.css';

import '@/styles/index.scss' // global css
import App from './App'
import store from './store'
import router from './router'
import _ from "lodash";
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
    // scroll bar
import PerfectScrollbar from 'vue2-perfect-scrollbar'
import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css'

Vue.use(PerfectScrollbar);


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
            return (fname[0] ? fname[0].toUpperCase() : '') + (lname[0] ? lname[0].toUpperCase() : '');
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