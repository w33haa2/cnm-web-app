<template>
  <div class="missed-logs-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";

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

