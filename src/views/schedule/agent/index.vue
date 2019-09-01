<template>
  <div>
    <logger></logger>
    <div class="app-container">
      <h4 style="color:#646464">Schedule</h4>
      <calendar />
    </div>
  </div>
</template>

<script>
import logger from "../../time_logger";
import calendar from "./components/schedule";
import { mapActions, mapGetters } from "vuex";
import Moment from "moment/moment";
import { extendMoment } from "moment-range";
const moment = extendMoment(Moment);
import cellContent from "./components/cellContent";
export default {
  components: { calendar, logger },
  computed: {
    ...mapGetters([])
  },
  watch: {},
  mounted() {}
};
</script>

<style lang="scss" scoped>
</style>
