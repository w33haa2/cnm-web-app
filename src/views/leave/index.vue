<template>
  <div class="leave-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import agentView from "./agent";
import operationsView from "./operations";

export default {
  name: "Leave",
  components: { agentView, operationsView },
  data() {
    return {
      currentRole: null
    };
  },
  computed: {
    ...mapGetters(["position"])
  },
  mounted() {
    // alert(this.position)
    switch (this.position.toLowerCase()) {
      case "operations manager":
      case "team leader":
        this.currentRole = "operationsView";
        break;
      case "representative - order placer":
        this.currentRole = "agentView";
        break;
      case "admin":
        this.currentRole = "operationsView";
        break;
    }
  }
};
</script>
