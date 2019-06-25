<template>
  <el-row>
    <el-col style="background-color:white;padding:20px;" :xs="{span:24}" :sm="{span:24}" :md="{span:24}" :lg="{span:24}" :xl="{span:24}">
      <h6 style="margin-top:0px;">Company Details</h6>
      <el-row>
        <el-col :xs="{span:24}" :sm="{span:24}" :md="{span:24}" :lg="{span:4}" :xl="{span:4}">
          <camera @image="captured" />
        </el-col>
        <el-col :xs="{span:24}" :sm="{span:24}" :md="{span:24}" :lg="{span:20}" :xl="{span:20}">
          <el-row>
            <el-col :xs="{span:24}" :sm="{span:24}" :md="{span:24}" :lg="{span:12}" :xl="{span:12}" style="padding:5px">
              <span>Position</span>
              <el-select v-model="form.employee.access_id" size="mini" style="width:100%;margin-top:3px;" placeholder="Select...">
                <el-option
                  v-for="item in options.position"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <!-- <select-search style="width:100%"  @filter="deym" :filterable="true" :remote="true" :size="'mini'" placeholder="Search and select..." :data="position"></select-search> -->
            </el-col>
            <el-col :xs="{span:24}" :sm="{span:24}" :md="{span:24}" :lg="{span:12}" :xl="{span:12}" style="padding:5px" :class="{'validation-has-error':form.required.parent_id}">
              <span>Head</span>
              <el-select v-model="form.employee.parent_id" size="mini" style="width:100%;margin-top:3px;" placeholder="Select...">
                <el-option
                  v-for="item in options.head"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <span v-if="form.required.parent_id" class="error">Please assign employee head.</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :xs="{span:24}" :sm="{span:24}" :md="{span:24}" :lg="{span:12}" :xl="{span:12}" style="padding:5px" :class="{'validation-has-error':form.required.email}">
              <span>Email</span>
              <el-input v-model="form.employee.email" size="mini" style="width:100%;margin-top:3px;" placeholder="sample@cnmsolutions.net..." />
              <span v-if="form.required.email" class="error">Must be unique and a valid Email.</span>
            </el-col>
            <el-col :xs="{span:24}" :sm="{span:24}" :md="{span:24}" :lg="{span:12}" :xl="{span:12}" style="padding:5px">
              <span>Date Hired</span>
              <el-date-picker
                v-model="form.employee.hired_date"
                type="date"
                size="mini"
                format="MM/dd/yyyy"
                style="width:100%;margin-top:3px;"
                placeholder="Select date.."
              />
            </el-col>
          </el-row>
          <el-row>
            <el-col :xs="{span:24}" :sm="{span:24}" :md="{span:24}" :lg="{span:4}" :xl="{span:4}" style="padding:5px" :class="{'validation-has-error':form.required.company_id}">
              <span>CNM ID</span>
              <el-input v-model="form.employee.company_id" size="mini" style="width:100%;margin-top:3px;" placeholder="CNM ID..." />
              <span v-if="form.required.parent_id" class="error">ID must be provided.</span>
            </el-col>
            <el-col :xs="{span:24}" :sm="{span:24}" :md="{span:24}" :lg="{span:4}" :xl="{span:4}" style="padding:5px">
              <span>System Status</span>
              <el-input v-model="form.employee.status" size="mini" style="width:100%;margin-top:3px;" placeholder="Status..." />
            </el-col>
            <el-col :xs="{span:24}" :sm="{span:24}" :md="{span:24}" :lg="{span:8}" :xl="{span:8}" style="padding:5px" :class="{'validation-has-error':form.required.type}">
              <span>Type</span>
              <el-input v-model="form.employee.type" size="mini" style="width:100%;margin-top:3px;" placeholder="Type..." />
              <span v-if="form.required.parent_id" class="error">Please define employee type.</span>
            </el-col>
            <el-col :xs="{span:24}" :sm="{span:24}" :md="{span:24}" :lg="{span:8}" :xl="{span:8}" style="padding:5px">
              <span>Contract</span>
              <el-input v-model="form.employee.contract" size="mini" style="width:100%;margin-top:3px;" placeholder="Contract1/Contract2/..." />
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <h6 style="margin-top:10px;">Personal Details</h6>
      <el-row>
        <el-col :xs="{span:24}" :sm="{span:24}" :md="{span:24}" :lg="{span:24}" :xl="{span:24}">
          <el-row>
            <el-col :xs="{span:24}" :sm="{span:24}" :md="{span:24}" :lg="{span:6}" :xl="{span:6}" style="padding:5px" :class="{'validation-has-error':form.required.firstname}">
              <span>First Name</span>
              <el-input v-model="form.employee.firstname" size="mini" style="width:100%;margin-top:3px;" placeholder="First Name..." />
              <span v-if="form.required.parent_id" class="error">First Name must be provided.</span>
            </el-col>
            <el-col :xs="{span:24}" :sm="{span:24}" :md="{span:24}" :lg="{span:6}" :xl="{span:6}" style="padding:5px" :class="{'validation-has-error':form.required.middlename}">
              <span>Middle Name</span>
              <el-input v-model="form.employee.middlename" size="mini" style="width:100%;margin-top:3px;" placeholder="Middle Name..." />
              <span v-if="form.required.parent_id" class="error">Middle Name must be provided.</span>
            </el-col>
            <el-col :xs="{span:24}" :sm="{span:24}" :md="{span:24}" :lg="{span:6}" :xl="{span:6}" style="padding:5px" :class="{'validation-has-error':form.required.lastname}">
              <span>Last Name</span>
              <el-input v-model="form.employee.lastname" size="mini" style="width:100%;margin-top:3px;" placeholder="Last Name..." />
              <span v-if="form.required.parent_id" class="error">Last Name must be provided.</span>
            </el-col>
            <el-col :xs="{span:24}" :sm="{span:24}" :md="{span:24}" :lg="{span:6}" :xl="{span:6}" style="padding:5px">
              <span>Suffix</span>
              <el-input v-model="form.employee.suffix" size="mini" style="width:100%;margin-top:3px;" placeholder="Suffix..." />
            </el-col>
          </el-row>
          <el-row>
            <el-col :xs="{span:24}" :sm="{span:24}" :md="{span:24}" :lg="{span:24}" :xl="{span:24}" style="padding:5px" :class="{'validation-has-error':form.required.address}">
              <span>Address</span>
              <el-input v-model="form.employee.address" size="mini" style="width:100%;margin-top:3px;" placeholder="Address..." />
              <span v-if="form.required.parent_id" class="error">Address must be provided.</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :xs="{span:24}" :sm="{span:24}" :md="{span:24}" :lg="{span:6}" :xl="{span:6}" style="padding:5px">
              <span>Mobile</span>
              <el-input v-model="form.employee.contact_number" size="mini" style="width:100%;margin-top:3px;" placeholder="Mobile..." />
            </el-col>
            <el-col :xs="{span:24}" :sm="{span:24}" :md="{span:24}" :lg="{span:6}" :xl="{span:6}" style="padding:5px" :class="{'validation-has-error':form.required.p_email}">
              <span>Personal Email</span>
              <el-input v-model="form.employee.p_email" size="mini" style="width:100%;margin-top:3px;" placeholder="sample@other.domain..." />
              <span v-if="form.required.p_email" class="error">Must be unique and a valid Email.</span>
            </el-col>
            <el-col :xs="{span:24}" :sm="{span:24}" :md="{span:24}" :lg="{span:6}" :xl="{span:6}" style="padding:5px" :class="{'validation-has-error':form.required.birthdate}">
              <span>Birth Date</span>
              <el-date-picker
                v-model="form.employee.birthdate"
                type="date"
                format="MM/dd/yyyy"
                size="mini"
                style="width:100%;margin-top:3px;"
                placeholder="Select date.."
              />
              <span v-if="form.required.parent_id" class="error">Birth Date must be provided.</span>
            </el-col>
            <el-col :xs="{span:24}" :sm="{span:24}" :md="{span:24}" :lg="{span:6}" :xl="{span:6}" style="padding:5px">
              <span>Gender</span>
              <el-select v-model="form.employee.gender" size="mini" style="width:100%;margin-top:3px;" placeholder="Select...">
                <el-option
                  v-for="item in options.gender"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <h6 style="margin-top:10px;">Benefit IDs</h6>
      <el-row>
        <el-col :xs="{span:24}" :sm="{span:24}" :md="{span:24}" :lg="{span:24}" :xl="{span:24}">
          <el-row>
            <el-col :xs="{span:24}" :sm="{span:24}" :md="{span:24}" :lg="{span:6}" :xl="{span:6}" style="padding:5px">
              <span>SSS</span>
              <el-input v-model="form.employee.benefits[0]" size="mini" style="width:100%;margin-top:3px;" placeholder="SSS..." />
            </el-col>
            <el-col :xs="{span:24}" :sm="{span:24}" :md="{span:24}" :lg="{span:6}" :xl="{span:6}" style="padding:5px">
              <span>PhilHealth</span>
              <el-input v-model="form.employee.benefits[1]" size="mini" style="width:100%;margin-top:3px;" placeholder="PhilHealth..." />
            </el-col>
            <el-col :xs="{span:24}" :sm="{span:24}" :md="{span:24}" :lg="{span:6}" :xl="{span:6}" style="padding:5px">
              <span>PagIbig</span>
              <el-input v-model="form.employee.benefits[2]" size="mini" style="width:100%;margin-top:3px;" placeholder="PagIbig..." />
            </el-col>
            <el-col :xs="{span:24}" :sm="{span:24}" :md="{span:24}" :lg="{span:6}" :xl="{span:6}" style="padding:5px">
              <span>TIN</span>
              <el-input v-model="form.employee.benefits[3]" size="mini" style="width:100%;margin-top:3px;" placeholder="TIN..." />
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row style="margin-top:20px;">
        <el-col :xs="{span:24}" :sm="{span:12}" :md="{span:3}" :lg="{span:3}" :xl="{span:3}" style="padding:5px">
          <el-button size="mini" style="width:100%" @click="clearForm">Clear</el-button>
        </el-col>
        <el-col :xs="{span:24}" :sm="{span:12}" :md="{span:3,offset:18}" :lg="{span:3,offset:18}" :xl="{span:3,offset:18}" style="padding:5px">
          <el-button size="mini" type="danger" style="width:100%" :loading="form.loading" @click="storeEmployee">Submit</el-button>
        </el-col>
      </el-row>
    </el-col>
    <!-- <el-col :xs="{span:24}" :sm="{span:24}" :md="{span:24}" :lg="{span:6}" :xl="{span:6}" style="padding:20px;">
      <h6 style="margin-top:0px;">Recent</h6>
      <el-row>
        <el-col :xs="{span:24}" :sm="{span:24}" :md="{span:24}" :lg="{span:24}" :xl="{span:24}" style="height:500px;overflow-y:scroll">
          <el-row v-for="datum in allUser" :key="datum.id">
            <el-col :xs="{span:24}" :sm="{span:24}" :md="{span:24}" :lg="{span:24}" :xl="{span:24}" style="background-color:white;padding:10px 10px 10px 10px;margin-bottom:3px;">
              <div class="user-block">
                <img v-if="datum.info.image_url" class="img-circle" :src="datum.info.image_url">
                <div v-else class="img-circle" style="background-color:#d9d9d9;display:flex">
                  <div style="align-self:center;width:100%;text-align:center;font-weight:600">
                    {{ getAvatarLetters(datum.info.firstname,datum.info.lastname) }}
                  </div>
                </div>
                <span class="username text-muted">
                  {{ datum.full_name }}
                </span>
                <span class="description">{{ datum.access.name + " | " + formatDate(datum.info.hired_date,'MM/DD/YYYY','DD MMMM YYYY') }}</span>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-col> -->
  </el-row>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import axios from 'axios'
import Camera from './CameraComponent'
import SelectSearch from './select_search'
import moment from 'moment'

export default {
  name: 'EmployeeForm',
  components: {
    Camera,
    SelectSearch
  },
  watch: {
    allPosition: function() {
      this.options.position = this.allPosition.map(function(pos) { return { value: pos.id, label: pos.name } })
      this.cascadeSelectHead()
    },
    'form.employee.access_id': function() {
      this.form.employee.parent_id = null
      this.cascadeSelectHead()
    },
    'form.employee.firstname': function() { this.form.employee.excel_hash = (this.form.employee.firstname + this.form.employee.middlename + this.form.employee.lastname + this.form.employee.suffix).replace(' ', '').toLowerCase() },
    'form.employee.middlename': function() { this.form.employee.excel_hash = (this.form.employee.firstname + this.form.employee.middlename + this.form.employee.lastname + this.form.employee.suffix).replace(' ', '').toLowerCase() },
    'form.employee.lastname': function() { this.form.employee.excel_hash = (this.form.employee.firstname + this.form.employee.middlename + this.form.employee.lastname + this.form.employee.suffix).replace(' ', '').toLowerCase() },
    'form.employee.suffix': function() { this.form.employee.excel_hash = (this.form.employee.firstname + this.form.employee.middlename + this.form.employee.lastname + this.form.employee.suffix).replace(' ', '').toLowerCase() },
    formResponse: function() {
      console.log(this.formResponse)
      const response = this.formResponse
      if (response.status == 422) {
        const errors = Object.keys(response.data.errors)
        console.log(errors)
        errors.forEach((v, i) => {
          this.form.required[v] = true
        })
        if (errors.indexOf('excel_hash') >= 0) {
          this.$message({
            message: 'This is a duplicate record.',
            type: 'warning',
            duration: 1000 * 5
          })
        } else {
          this.$message({
            message: 'Please correct all the hihglighted field',
            duration: 1000 * 5
          })
        }
      } else if (response.status == 500) {
        this.$message({
          message: 'Oops.. Nothing is saved, something is wrong.',
          type: 'error',
          duration: 1000 * 5
        })
      } else if (response.status == 200) {
        this.$message({
          message: 'You have succussfuly added an Employee',
          type: 'success',
          duration: 1000 * 5
        })
      }
    }
    // captured:
  },
  created() {
    var position = this.allPosition.map(function(pos) { return { value: pos.id, label: pos.name } })
    position.splice(0, 1)
    this.options.position = position
    this.form.employee.access_id = position[0].value
    this.cascadeSelectHead()
  },
  methods: {
    ...mapActions(['fetchUsers', 'addUser']),
    captured: function(value) {
      this.form.employee.image = value
      console.log(value)
    },
    storeEmployee: async function() {
      this.clearFormErrors()
      const data = this.toFormData(this.form.employee)
      // console.log(data.values)
      this.form.employee.firstname = 'Emman ' + Math.random().toString(36).substr(2, 5)
      this.form.employee.email = 'jeng@ssws.' + Math.random().toString(36).substr(2, 5)
      this.form.employee.excel_hash = 'jeng' + Math.random().toString(36).substr(2, 5)
      // this.form.employee.firstname = 'Emman '+Math.random().toString(36).substr(2, 5);
      this.addUser(data)
    },
    cascadeSelectHead() {
      const parent = this.allPosition.filter(function(i) { return i.id == this.form.employee.access_id }.bind(this))[0].parent
      this.options.head = this.allUser.filter(function(i) { return i.access_id == parent }).map(function(i) { return { value: i.id, label: i.full_name } })
      this.form.employee.parent_id = this.options.head[0].value
    },
    isHR(access_id) {
      return !!((access_id == 2 || access_id == 3))
    },
    clearForm() {
      const keys = Object.keys(this.form.employee)
      keys.forEach((v, i) => {
        this.form.employee[v] = null
      })
      this.form.employee.gender = 'male'
      this.form.employee.status = 'active'
      this.form.employee.type = 'new'
      this.form.employee.benefits = []
    },
    clearFormErrors() {
      const keys = Object.keys(this.form.required)
      keys.forEach((v, i) => {
        this.form.required[v] = false
      })
    },
    toFormData(obj) {
      // alert("form data created")
      const fd = new FormData()
      const tmp = Object.keys(obj)
      console.log(tmp)
      tmp.forEach((v, i) => {
        if (obj[v]) {
          if (v != 'benefits') {
            fd.append(v, obj[v])
          } else {
            fd.append(v, JSON.stringify(obj[v]))
          }
        }
      })
      return fd
    }
  },
  computed: {
    ...mapGetters(['allUser', 'allPosition', 'formResponse'])
  },
  data() {
    return {
      user_access_id: 2,
      options: {
        gender: [
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' }
        ],
        position: null,
        head: []
      },
      dialog: {
        camera: false
      },
      form: {
        employee: {
          // ----------------------------------
          // test data
          // ----------------------------------
          image: null,
          firstname: 'Emmanuel James',
          middlename: 'Eng',
          lastname: 'Lajom',
          suffix: 'Unyot',
          address: 'Toril, Davao City',
          contact_number: '09099999999',
          // p_email: "jamesenglajom@gmail.com"+Math.random().toString(36).substr(2, 5),
          excel_hash: 'emmanueljamesenglajomunyot',
          status_date: '4/20/2015',
          birthdate: '12/25/1991',
          gender: 'male',
          benefits: [
            '099999902',
            '099999902',
            '099999902',
            '099999902'
          ],
          access_id: 2,
          parent_id: 1,
          email: 'jeng@ssws.dev' + Math.random().toString(36).substr(2, 5),
          hired_date: '4/20/2015',
          company_id: '105',
          status: 'active',
          contract: null,
          type: 'new',
          // ----------------------------------
          // init data
          // ----------------------------------
          // image:null,
          // firstname: null,
          // middlename: null,
          // lastname: null,
          // suffix: null,
          // address: null,
          // contact_number: null,
          p_email: null
          // excel_hash:null,
          // status_date:null,
          // birthdate: null,
          // gender: 'male',
          // benefits: [],
          // access_id:1,
          // parent_id: null,
          // email: null,
          // hired_date: null,
          // company_id: null,
          // status: 'active',
          // contract: null,
          // type:'new',

        },
        required: {
          email: false,
          company_id: false,
          p_email: false,
          excel_hash: false,
          hired_date: false,
          birthdate: false,
          address: false,
          firstname: false,
          middlename: false,
          lastname: false,
          parent_id: false,
          type: false
        },
        has_errors: false,
        loading: false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
span {
    font-size:.8em;
}
.user-block {
  .username,
  .description {
    display: block;
    margin-left: 50px;
    padding: 2px 0;
    font-size:10px;
  }

  .username{
    font-size: 12px;
    color: #000;
  }

  :after {
    clear: both;
  }

  .img-circle {
    border-radius: 50%;
    width: 40px;
    height: 40px;
    float: left;
  }

  span {
    font-weight: 500;
    font-size: 12px;
  }

}

</style>
