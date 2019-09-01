<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import adminDashboard from "./admin";
import hrDashboard from "./hr";
import agentDashboard from "./agent";

export default {
  name: "Dashboard",
  components: { adminDashboard, agentDashboard, hrDashboard },
  data() {
    return {
      currentRole: "hrDashboard"
    };
  },
  computed: {
    ...mapGetters(["position"])
  },
  created() {
    switch (this.position) {
      case "Representative - Order Placer":
        this.currentRole = "agentDashboard";
        break;
      default:
        this.currentRole = "adminDashboard";
        break;
    }
  }
};
</script>

