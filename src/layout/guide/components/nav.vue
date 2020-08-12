<template>
  <div style="width:100%; padding:10px 0px 15px 30px;">
    <navscroll
      container=".content-container"
      item-selector=".guide-nav-item"
      active-class="active"
      :anchor="false"
    >
      <template v-for="(item, index) in guide_obj">
        <template
          v-if="item.roles.length === 0 || item.roles.includes(position)"
        >
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
            <div :key="'sub' + index" class="sub-nav">
              <template v-for="(item1, index1) in item.features">
                <template v-if="item1.roles.length === 0 || item1.roles.includes(position)">
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
              </template>
            </div>
          </template>
        </template>
      </template>
    </navscroll>
  </div>
</template>

<script>
import { guide_obj } from "../permission.js";
import {mapGetters} from "vuex";
export default {
  name: "GuideNavigation",
  data() {
    return {
      active: "",
      guide_obj: guide_obj
    };
  },
  computed:{
      ...mapGetters(["position"])
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
