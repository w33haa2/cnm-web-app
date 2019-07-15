<template>
  <div class="app-container">
    <h4 style="color:#646464">Positions</h4>
    <!--
    <el-alert
      title="This list is uneditable, Please contact service provider."
      type="info"
      show-icon
    ></el-alert>-->

    <!-- Search and Pagination -->
    <!-- <el-row>
      <el-col :xs="{ span:12 }" :sm="{ span:24 }" :md="{ span:12 }">
        <el-pagination
          :page-sizes="[100, 200, 300, 400]"
          :page-size="100"
          layout="total, sizes, prev, pager, next"
          :total="400"
          background
          small
        />
      </el-col>
      <el-col :xs="{ span:12 }" :sm="{ span:24 }" :md="{ span:12 }">
        <el-input placeholder="Search..." size="mini">
          <el-select slot="prepend" placeholder="Select" style="width:150px;">
            <el-option />
          </el-select>
          <el-button slot="append">
            <i class="el-icon-search" />
          </el-button>
        </el-input>
      </el-col>
    </el-row>-->

    <!-- Table -->
    <el-table :data="accesslevels" style="width: 100%;margin-top:30px;">
      <el-table-column align="center" label="Code">
        <template slot-scope="scope">{{ scope.row.code }}</template>
      </el-table-column>
      <el-table-column align="center" label="Description">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column align="center" label="Head">
        <template slot-scope="scope">{{ filterHeadName(scope.row.parent) }}</template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      accesslevels: [
        {
          id: 1,
          code: 'superadmin',
          name: 'Admin',
          parent: null
        },
        {
          id: 2,
          code: 'hrm',
          name: 'HR Manager',
          parent: 1
        },
        {
          id: 3,
          code: 'hrmassistant',
          name: 'HR Assistant',
          parent: 2
        },
        {
          id: 4,
          code: 'itsupervisor',
          name: 'IT Supervisor',
          parent: 1
        },
        {
          id: 5,
          code: 'itspecialist',
          name: 'IT Specialist',
          parent: 4
        },
        {
          id: 6,
          code: 'itsupport',
          name: 'IT Support',
          parent: 4
        },
        {
          id: 7,
          code: 'maintenancestaff',
          name: 'Maintenance Staff',
          parent: 2
        },
        {
          id: 8,
          code: 'tqmanager',
          name: 'T & Q Manager',
          parent: 1
        },
        {
          id: 9,
          code: 'producttrainer',
          name: 'Product Trainer',
          parent: 8
        },
        {
          id: 10,
          code: 'qasupervisor',
          name: 'QA Supervisor',
          parent: 8
        },
        {
          id: 11,
          code: 'qaanalyst',
          name: 'Quality Assurance Analyst',
          parent: 10
        },
        {
          id: 12, // 12
          code: 'rtamanager',
          name: 'RTA Manager',
          parent: 1
        },
        {
          id: 13, // 13
          code: 'rtasupervisor',
          name: 'RTA Supervisor',
          parent: 12
        },
        {
          id: 14, // 14
          code: 'rtaanalyst',
          name: 'RTA Analyst',
          parent: 13
        },
        {
          id: 15, // 15
          code: 'operationsmanager',
          name: 'Operations Manager',
          parent: 1
        },
        {
          id: 16, // 16
          code: 'teamleader',
          name: 'Team Leader',
          parent: 15
        },
        {
          id: 17, // 17
          code: 'representative_op',
          name: 'Representative - Order Placer',
          parent: 16
        },
        {
          id: 18, // 18
          code: 'accountant',
          name: 'Accountant',
          parent: 2
        },
        {
          id: 19, // 19
          code: 'financeofficer',
          name: 'Finance Officer',
          parent: 1
        },
        {
          id: 20, // 20
          code: 'payrollassistant',
          name: 'Payroll Assistant',
          parent: 19
        }
      ]
    }
  },
  computed: {},
  created() {},
  methods: {
    filterHeadName(head_id) {
      const result = this.accesslevels.filter(i => i.id == head_id)
      if (result.length > 0) {
        return result[0].name
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
