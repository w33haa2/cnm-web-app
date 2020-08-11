<template>
  <div style="width:100%; padding:10px 0px 15px 30px;">
    <navscroll
      container=".content-container"
      item-selector=".guide-nav-item"
      active-class="active"
      :anchor="false"
    >
      <template v-for="(item, index) in guide_obj">
        <a
          :key="index"
          class="guide-nav-item"
          :href="'#' + item.link"
          @click.prevent="null"
        >
          <div
            v-scroll-to="{
              el: '#' + item.link,
              container: '.content-container'
            }"
          >
            {{ item.name }}
          </div>
        </a>
        <template v-if="item.features.length > 0">
          <div :key="index" class="sub-nav">
            <template v-for="(item1, index1) in item.features">
              <a
                @click.prevent="redirectBack"
                :key="index1"
                class="guide-nav-item"
                :href="'#' + item1.link"
              >
                <div
                  v-scroll-to="{
                    el: '#' + item1.link,
                    container: '.content-container'
                  }"
                >
                  {{ item1.name }}
                </div>
              </a>
            </template>
          </div>
        </template>
      </template>
      <!-- nav -->
      <!-- <div
        class="guide-nav-item"
      >
        <div
          v-scroll-to="{
            el: '#introduction',
            container: '.content-container'
          }"
        >
          Introduction
        </div>
      </div>

      <div
        class="guide-nav-item"
        data-section-selector="#employee_list"
      >
        <div
          v-scroll-to="{
            el: '#employee_list',
            container: '.content-container'
          }"
        >
          Employee List
        </div>
      </div>

      <div class="guide-nav-item" data-section-selector="#add_employee">
        <div
          style="text-indent:25px;"
          v-scroll-to="{
            el: '#add_employee',
            container: '.content-container'
          }"
        >
          Add Employee
        </div>
      </div>

      <div class="guide-nav-item">
        <div
          style="text-indent:25px;"
          v-scroll-to="{
            el: '#change_employee_status',
            container: '.content-container'
          }"
        >
          Change Employee Status
        </div>
      </div>

      <div class="guide-nav-item">
        <div
          style="text-indent:25px;"
          v-scroll-to="{
            el: '#export_template',
            container: '.content-container'
          }"
        >
          Import Employees
        </div>
      </div>

      <div class="guide-nav-item">
        <div
          style="text-indent:25px;"
          v-scroll-to="{
            el: '#export_employees',
            container: '.content-container'
          }"
        >
          Export Employees
        </div>
      </div>

      <div class="guide-nav-item">
        <div
          style="text-indent:25px;"
          v-scroll-to="{
            el: '#export_template',
            container: '.content-container'
          }"
        >
          Export Template
        </div>
      </div>

      <div class="guide-nav-item">
        Agent leave management
      </div> -->
    </navscroll>
  </div>
</template>

<script>
import { guide_obj } from "../permission.js";
export default {
  name: "GuideNavigation",
  data() {
    return {
      active: "",
      guide_obj: guide_obj
    };
  },
  methods: {
    redirectBack() {
      //   this.$router.push({ path: '/guide' })
    }
  }
};
</script>

<style lang="scss">
.guide-nav {
  min-height: 100vh;
  width: 100%;
  background-color: #ffecec;
  .navscroll-js {
    .guide-nav-item {
      font-size: 0.8em;
      cursor: pointer;

      &.active div {
        background-color: white;
        border-radius: 8px 0px 0px 8px;
        padding-left: 15px;
        padding-top: 5px;
        padding-bottom: 5px;
        font-weight: bold;
        color: crimson;
      }
    }
  }

  .sub-nav {
    padding-left: 20px;
  }
}
</style>
