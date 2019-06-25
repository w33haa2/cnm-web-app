<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import hrDashboard from './hr'
import editorDashboard from './editor'

export default {
  name: 'Dashboard',
  components: { adminDashboard, editorDashboard, hrDashboard },
  data() {
    return {
      currentRole: 'hrDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  }
  // created() {
  //   if (!this.roles.includes('admin')) {
  //     this.currentRole = 'editorDashboard'
  //   }
  // }
}
</script>

