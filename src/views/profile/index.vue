<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">
        <el-col :span="6" :xs="24">
          <user-card :user="userDetails" />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="About" name="about">
                <about :user="userDetails" />
              </el-tab-pane>
              <el-tab-pane label="Company Details" name="company_details">
                <company-details :user="userDetails" />
              </el-tab-pane>
              <el-tab-pane label="Benefit IDs" name="benefit_ids">
                <benefit-ids :user="userDetails" />
              </el-tab-pane>
              <el-tab-pane label="Timeline" name="timeline">
                <timeline :timeline="user.status_logs" />
              </el-tab-pane>
              <el-tab-pane label="Subordinates" name="subordinates">
                <!-- <account :user="{name: user.info.full_name,email:user.company_details.email}" /> -->
                <subordinates :user="user" />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
import Activity from './components/Activity'
import Timeline from './components/Timeline'
import Account from './components/Account'
import About from './components/About'
import CompanyDetails from './components/CompanyDetails'
import BenefitIDs from './components/BenefitIDs'
import Subordinates from './components/Subordinates'
import axios from 'axios'
import store from '../../store'

export default {
  name: 'Profile',
  components: {
    UserCard,
    Activity,
    Timeline,
    About,
    Account,
    CompanyDetails,
    'benefit-ids': BenefitIDs,
    Subordinates
  },
  data() {
    return {
      user: {},
      activeTab: 'about',
      userDetails: {},
      token: store.state.user.token,
      subordinates: []
    }
  },
  computed: {
    ...mapGetters(['name', 'avatar', 'roles'])
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      alert(this.token)
      const token = this.token
      axios
        .get('api/v1/users/fetch/' + this.$route.params.id, {
          headers: {
            Authorization: 'Bearer ' + this.token,
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        })
        .then(res => {
          alert('success')
          console.log(res.data.meta.metadata[0])
          this.userDetails = res.data.meta.metadata[0]
        })
        .catch(err => {
          alert('failed')
          console.log(err)
        })
    }
  }
}
</script>
