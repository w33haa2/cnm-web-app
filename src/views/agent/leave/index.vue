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
      currentRole: "agentView"
    };
  },
  computed: {
    ...mapGetters(["position"])
  },
  created() {
    let group = this.positionPageGroup(this.position);
    // alert(group);
    /**
     * @mixin function
     * positionPageGroup @ main.js
     * @param position
     */
    switch (group) {
      case "operations":
        this.currentRole = operationsView;
        break;
      case "agent":
        this.currentRole = agentView;
        break;
      default:
        this.currentRole = agentView;
        break;
    }
  }
};
</script>
