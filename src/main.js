import Vue from "vue";

import Cookies from "js-cookie";

import "normalize.css/normalize.css"; // a modern alternative to CSS resets

import Element from "element-ui";
import "./styles/element-variables.scss";

import moment from "moment";

import "@/styles/index.scss"; // global css

import App from "./App";
import store from "./store";
import router from "./router";
import _ from "lodash";
import "./icons"; // icon
import "./permission"; // permission control
import "./utils/error-log"; // error log
import VueSweetalert2 from "vue-sweetalert2"; // sweetalert
import axios from "axios"

import * as filters from "./filters"; // global filters

import locale from "element-ui/lib/locale/lang/en"; // internationalization for element-ui

Vue.use(Element, {
  size: Cookies.get("size") || "medium", // set element-ui default size
  locale
});

Vue.use(VueSweetalert2);

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

Vue.config.productionTip = false;

// mixin for global functions

Vue.mixin({
  methods: {
    remUnderscore(string) {
      let str = string.split("_");
      let result = "";
      str.forEach((v, i) => {
        if (str.lenght - 1 != i) {
          result += v + " ";
        } else {
          result += v;
        }
      });
      return result;
    },
    conflictDates(ot_schedule, reg_schedule) {
      let f = "YYYY-MM-DD HH:mm:ss",
        result = true,
        ot_start_conflict = moment(
          moment(ot_schedule.start_event).format(f)
        ).isBetween(
          moment(reg_schedule.start_event.date).format(f),
          moment(reg_schedule.end_event.date).format(f)
        ),
        ot_end_conflict = moment(
          moment(ot_schedule.end_event).format(f)
        ).isBetween(
          moment(reg_schedule.start_event.date).format(f),
          moment(reg_schedule.end_event.date).format(f)
        );
      // alert(ot_start_conflict + " " + ot_end_conflict);
      if (ot_start_conflict || ot_end_conflict) {
        result = true;
      } else {
        result = false;
      }
      return result;
    },
    getDuration(date1, date2) {
      let d1 = moment(date1).format("YYYY-MM-DD HH:mm:ss"),
        d2 = moment(date2).format("YYYY-MM-DD HH:mm:ss");
      return moment.duration(moment(d2).diff(d1)).as("seconds");
    },
    secToHMS(seconds) {
      return moment.utc(seconds * 1000).format("HH:mm:ss");
    },
    ongoing(start, end) {
      return moment().isBetween(
        moment(start).format("YYYY-MM-DD HH:mm:ss"),
        moment(end).format("YYYY-MM-DD HH:mm:ss")
      );
    },
    getAvatarLetters(fname, lname) {
      return fname[0].toUpperCase() + lname[0].toUpperCase();
    },
    formatDate(date, format, formatoutput) {
      return moment(date, format).format(formatoutput);
    },
    ucwords(str) {
      str = str.toLowerCase();
      return str.replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g, function(
        e
      ) {
        return e.toUpperCase();
      });
    },
    positionPageGroup(position) {
      let group = "";
      switch (position) {
        case "Admin":
          group = "admin";
          break;
        case "HR Manager":
        case "HR Assistant":
          group = "hr";
          break;
        case "Operations":
        case "Team Leader":
          group = "operations";
          break;
        case "Representative - Order Placer":
          group = "agent";
          break;
        case "RTA Manager":
        case "RTA Supervisor":
        case "RTA Analyst":
          group = "rta";
          break;
      }
      return group;
    },
    fromNow(date) {
      return moment(date).fromNow();
    }
  }
});

new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App)
});
