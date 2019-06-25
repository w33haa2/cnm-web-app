<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <user-card :user="user" />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="About" name="about">
                <about :user="user" />
              </el-tab-pane>
              <el-tab-pane label="Company Details" name="company_details">
                <company-details :user="user" />
              </el-tab-pane>
              <el-tab-pane label="Benefit IDs" name="benefit_ids">
                <benefit-ids :user="user" />
              </el-tab-pane>
              <el-tab-pane label="Timeline" name="timeline">
                <timeline :timeline="user.status_logs" />
              </el-tab-pane>
              <el-tab-pane label="Account" name="account">
                <!-- <account :user="{name: user.info.full_name,email:user.company_details.email}" /> -->
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

export default {
  name: 'Profile',
  components: { UserCard, Activity, Timeline, About, Account, CompanyDetails, 'benefit-ids': BenefitIDs },
  data() {
    return {
      user: {},
      activeTab: 'about'
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles'
    ])
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      // this.user = {
      //   name: this.name,
      //   role: this.roles.join(' | '),
      //   email: 'admin@test.com',
      //   avatar: this.avatar
      // }

      this.user = {
        info: {
          full_name: 'Emmanuel James Eng Lajom',
          firstname: 'Emmanuel James',
          middlename: 'Eng',
          lastname: 'Lajom',
          suffix: null,
          birthdate: '12/25/1991',
          gender: 'Male',
          address: 'Lower Binugao, Toril, Davao City',
          shortened_name: 'Emmanuel Lajom',
          p_mail: 'jamesenglajom@gmail.com',
          contact_number: '0900-0000-000'
        },
        company_details: {
          company_id: '16',
          email: 'jeng@cnmsolutions.net',
          contract: 'Signed',
          position: 'Developer',
          hired_date: '11/30/2018',
          head: 'Maricel Obsiana'
        },
        benefit_ids: {
          sss: 'SSS-0000',
          philhealth: 'PhilHealth-0000',
          pagibig: 'PagIbig-0000',
          tin: 'TIN-0000'
        },
        status_logs: [
          {
            description: 'You\'re Promoted!',
            type: 'Acive',
            content: 'Changed employee Status to Active 12/25/2018',
            date: '12/25/2018'
          },
          {
            description: 'Officially Hired',
            type: 'New',
            content: 'Activated CNM WebApp Account with employee status of New 11/30/2018',
            date: '11/30/2018'
          }
        ]
      }
    }
  }
}
</script>
