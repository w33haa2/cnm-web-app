<template>
  <div id="app">
    <time-logger v-if="$route.path!='/login' && position=='Representative - Order Placer'"></time-logger>
    <router-view />
  </div>
</template>

<script>
import {mapGetters} from "vuex"
import timeLogger from "@/components/right_side_bar";
export default {
  components:{timeLogger},
  name: 'App',
  computed:{
    ...mapGetters(["position"])
  }
}
</script>
