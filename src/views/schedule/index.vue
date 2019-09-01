<template>
  <div class="schedule-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import agentView from "./agent";
import adminView from "./admin";

export default {
  name: "Schedule",
  components: { agentView, adminView },
  data() {
    return {
      currentRole: null
    };
  },
  computed: {
    ...mapGetters(["position"])
  },
  created() {
    switch (this.position.toLowerCase()) {
      case "representative - order placer":
        this.currentRole = "agentView";
        break;
      default:
        this.currentRole = "adminView";
        break;
    }
  }
};
</script>
