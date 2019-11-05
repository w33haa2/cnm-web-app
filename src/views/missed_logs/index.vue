<template>
  <div class="missed-logs-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import agentView from "./agent";
import omView from "./om";
import rtaView from "./rta";

export default {
  name: "MissedLogs",
  components: { rtaView, omView, agentView },
  data() {
    return {
      currentRole: null
    };
  },
  computed: {
    ...mapGetters(["position"])
  },
  created() {
    switch (this.position) {
      case "Representative - Order Placer":
        this.currentRole = "agentView";
        break;
      case "Operations Manager":
      case "Team Leader":
        this.currentRole = "omView";
        break;
      case "RTA Manager":
      case "RTA Supervisor":
      case "RTA Analyst":
        this.currentRole = "rtaView";
        break;
    }
  }
};
</script>

