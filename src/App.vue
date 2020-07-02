<template>
  <div id="app">
    <time-logger v-if="$route.path!='/login'"></time-logger>
    <router-view />
  </div>
</template>

<script>
import timeLogger from "@/components/right_side_bar";
export default {
  components:{timeLogger},
  name: 'App'
}
</script>
