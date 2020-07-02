<template>
  <div>
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import adminDashboard from "./admin";
import hrDashboard from "./hr";
import rtaDashboard from "./rta";
import agentDashboard from "./agent";

export default {
  name: "Dashboard",
  components: { adminDashboard, agentDashboard, hrDashboard, rtaDashboard },
  data() {
    return {
      currentRole: "hrDashboard"
    };
  },
  computed: {
    ...mapGetters(["position"])
  },
  created() {
    switch (this.position.toLowerCase()) {
      case "representative - order placer":
        this.currentRole = "agentDashboard";
      break;
      case "rta manager":
        this.currentRole = "adminDashboard";
      break;
      default:
        this.currentRole = "adminDashboard";
        break;
    }
  }
};
</script>

