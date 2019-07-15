<template>
  <el-table :data="tableData" style="width: 100%;" @selection-change="handleSelectionChange">
    <el-table-column
      type="selection"
      width="55"
      fixed
    />
    <el-table-column label="Employee" min-width="250" prop="full_name" fixed>
      <template slot="header">
        <span style="float:left">
          <h4 class="text-muted"> Employee</h4>
        </span>
        <span style="float:left;padding:15px;">
          <i class="el-icon-sort text-point-eight-em cur-p" @click="columnSort('full_name')" />
        </span>
      </template>
      <template slot-scope="scope">
        <div class="user-block">
          <img v-if="scope.row.info.image_url" class="img-circle" :src="scope.row.info.image_url">
          <div v-else class="img-circle text-muted" style="background-color:#d9d9d9;display:flex">
            <div style="align-self:center;width:100%;text-align:center;" class="text-point-eight-em">
              {{ getAvatarLetters(scope.row.info.firstname,scope.row.info.lastname) }}
            </div>
          </div>
          <span class="username text-muted">
            {{ scope.row.full_name }}
          </span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="Edit" fixed>

      <template slot="header">
        <span style="float:left">
          <h4 class="text-muted">Action</h4>
        </span>
      </template>
      <template>
        <el-button
          size="mini"
        ><i class="el-icon-edit" /></el-button>
      </template>
    </el-table-column>
    <!-- <el-table-column label="Supervisor" width="200" >
      <template slot-scope="{row}">
          <span  class="text-point-eight-em">
            {{ row.info.accesslevelhierarchy.parent.full_name }}
          </span>
      </template>
    </el-table-column> -->
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
    ...mapGetters(['allPosition'])
  },
  data() {
    return {
      list:
        {
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

    .username{
      font-size: .8em;
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
      font-size: .8em;
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

.text-point-eight-em{
  font-size:.8em;
}
</style>
