<template>
  <el-table :data="tableData" style="width: 100%;">
    <!-- <el-table-column type="selection" width="55" fixed /> -->
    <el-table-column label="CNM ID" fixed>
      <template slot-scope="{row}">
        <span class>{{ row.company_id }}</span>
      </template>
    </el-table-column>
    <el-table-column label="Employee" min-width="500" prop="full_name" fixed>
      <template slot="header">
        <span style="float:left">
          <h4 class="text-muted">Employee</h4>
        </span>
        <!-- <span style="float:left;padding:15px;">
          <i class="el-icon-sort text-point-eight-em cur-p" @click="columnSort('email')" />
        </span>-->
      </template>
      <template slot-scope="scope">
        <div class="user-block">
          <img v-if="scope.row.image" class="img-circle" :src="scope.row.image">
          <div v-else class="img-circle text-muted" style="background-color:#d9d9d9;display:flex">
            <div
              style="align-self:center;width:100%;text-align:center;"
              class="text-point-eight-em"
            >{{ getAvatarLetters(scope.row.lastname,scope.row.firstname) }}</div>
          </div>
          <span>
            <el-tag :type="scope.row.status.toLowerCase()=='active'?'success':'danger'">
              <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link">
                  {{ scope.row.full_name }}
                  <i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="'edit:'+scope.row.id">Update</el-dropdown-item>
                  <!-- <el-dropdown-item>Delete</el-dropdown-item> -->
                </el-dropdown-menu>
              </el-dropdown>
            </el-tag>
          </span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="Position" width="200">
      <template slot-scope="{row}">
        <span class>{{ row.position }}</span>
      </template>
    </el-table-column>
    <el-table-column label="Head" width="200">
      <template slot-scope="{row}">
        <span class>{{ row.head_name }}</span>
      </template>
    </el-table-column>
    <el-table-column label="Email" width="200">
      <template slot-scope="{row}">
        <span class>{{ row.email }}</span>
      </template>
    </el-table-column>
    <el-table-column label="Status" width="200">
      <template slot-scope="{row}">
        <span class>{{ row.status.toUpperCase() }}</span>
      </template>
    </el-table-column>
    <el-table-column label="type" width="200">
      <template slot-scope="{row}">
        <el-tag
          :type="row.status.toLowerCase()=='active'?'success':'danger'"
        >{{ row.type != '' ? row.type.toUpperCase() : 'N/A' }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="Contract" width="200">
      <template slot-scope="{row}">
        <span class>{{ row.contract }}</span>
      </template>
    </el-table-column>
    <el-table-column label="Gender" width="200">
      <template slot-scope="{row}">
        <span class>{{ row.gender }}</span>
      </template>
    </el-table-column>
    <el-table-column label="Birthdate" width="200">
      <template slot-scope="{row}">
        <span class>{{ row.birthdate }}</span>
      </template>
    </el-table-column>
    <el-table-column label="Address" width="200">
      <template slot-scope="{row}">
        <span class>{{ row.address }}</span>
      </template>
    </el-table-column>
    <el-table-column label="Hired Date" width="200">
      <template slot-scope="{row}">
        <span class>{{ row.hired_date }}</span>
      </template>
    </el-table-column>
    <el-table-column label="Separation Date" width="200">
      <template slot-scope="{row}">
        <span class>{{ row.separation_date }}</span>
      </template>
    </el-table-column>-->
    <el-table-column label="SSS #" width="200">
      <template slot-scope="{row}">
        <span class>{{ row.benefits?row.benefits[0].id_number:"" }}</span>
      </template>
    </el-table-column>
    <el-table-column label="Philhealth #" width="200">
      <template slot-scope="{row}">
        <span class>{{ row.benefits?row.benefits[1].id_number:"" }}</span>
      </template>
    </el-table-column>
    <el-table-column label="PagIbig #" width="200">
      <template slot-scope="{row}">
        <span class>{{ row.benefits?row.benefits[2].id_number:"" }}</span>
      </template>
    </el-table-column>
    <el-table-column label="TIN #" width="200">
      <template slot-scope="{row}">
        <span class>{{ row.benefits?row.benefits[3].id_number:"" }}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
const avatarPrefix = '?imageView2/1/w/80/h/80'
import TableExpansion from './TableExpansion'
import moment from 'moment'
import { mapGetters, mapActions } from 'vuex'
export default {
  components: { TableExpansion },
  props: ['tableData'],
  computed: {
    ...mapGetters(['allPosition', 'employeeFetchState'])
  },
  data() {
    return {
      list: {
        data: [],
        filters: {
          status: [],
          head: []
        }
      },
      multiSelect: [],
      avatarPrefix,
      sort: {
        field: 'full_name',
        order: true
      }
    }
  },
  created() {
    this.fetchUsers()
    // this.fetchAccessLevels();
  },
  methods: {
    ...mapActions(['fetchAccessLevels', 'fetchUsers']),
    // local component functions
    fetchData() {
      transactionList().then(response => {
        this.list = response.data.items.slice(0, 8)
      })
    },
    onSelect(param) {
      this.selectedOption = param
    },
    handleCommand(command) {
      this.$emit('dropdownCommand', {
        action: command.split(':')[0],
        id: command.split(':')[1]
      })
    },
    // table filter callback {Element UI} functions
    // filterHeads(value, row) {
    //   return row.company_details.head === value
    // },
    // filterStatus(value, row) {
    //   return row.info.status === value
    // },
    // multiple filterhandler
    filterHandler(value, row, column) {
      const property = column['property']
      return row[property] === value
    },
    handleSelectionChange(val) {
      this.multiSelect = val
      this.$emit('table-select', this.multiSelect)
    },
    columnSort(column) {
      if (this.sort.field != column) {
        this.sort.field = column
        this.sort.order = true
      } else {
        this.sort.order = !this.sort.order
      }
      this.$emit('sort', { sort: this.sort.field, order: this.sort.order })
    }
  }
}
</script>

<style lang="scss" scoped>
.user-block {
  .username,
  .description {
    display: block;
    margin-left: 50px;
    padding: 2px 0;
  }
  .username {
    // font-size: 0.8em;
    color: #777;
  }
  :after {
    clear: both;
  }
  .img-circle {
    border-radius: 50%;
    width: 30px;
    height: 30px;
    float: left;
  }
  span {
    font-weight: 500;
    margin-left: 10px;
    // font-size: 0.8em;
  }
}
.post {
  font-size: 14px;
  border-bottom: 1px solid #d2d6de;
  margin-bottom: 15px;
  padding-bottom: 15px;
  color: #666;
  .image {
    width: 100%;
    height: 100%;
  }
  .user-images {
    padding-top: 20px;
  }
}
.list-inline {
  padding-left: 0;
  margin-left: -5px;
  list-style: none;
  li {
    display: inline-block;
    padding-right: 5px;
    padding-left: 5px;
    font-size: 13px;
  }
  .link-black {
    &:hover,
    &:focus {
      color: #999;
    }
  }
}
.box-center {
  margin: 0 auto;
  display: table;
}
.text-muted {
  color: #777;
}
.text-point-eight-em {
  font-size: 0.8em;
}
</style>
