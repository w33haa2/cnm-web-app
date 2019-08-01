<template>
  <div class="user-activity">
    <!-- <el-row>
      <el-col :md="{span:12}">
        <el-input size="mini" placeholder="Search..."/>
      </el-col>
      <el-col :md="{span:12}">
      <el-pagination
        style="float:right"
        small
        background
        :page-sizes="[10, 25, 50]"
        :current-page.sync="table_config.page"
        :page-size="table_config.display_size"
        layout="total, sizes, prev, next"
        :total="table_config.total"
        @size-change="tableSizeChange"
        @current-change="tablePageChange"
      />
      </el-col>
    </el-row>-->
    <el-table :data="tableData" style="width: 100%;margin-top:10px;">
      <el-table-column label="Employee" min-width="450" prop="full_name" fixed>
        <template slot="header">
          <span style="float:left">
            <h4 class="text-muted">Name</h4>
          </span>
        </template>
        <template slot-scope="scope">
          <div class="user-block">
            <img v-if="scope.row.image_url" class="img-circle" :src="scope.row.image_url" />
            <div v-else class="img-circle text-muted" style="background-color:#d9d9d9;display:flex">
              <div
                style="align-self:center;width:100%;text-align:center;"
                class="text-point-eight-em"
              >{{ getAvatarLetters(scope.row.firstname,scope.row.lastname) }}</div>
            </div>
            <div style="float:left;height:100%;">
              <div style="display:flex;height:100%;">
                <router-link :to="'/profile/index/'+scope.row.id">
                  <div
                    style="align-self:center; margin-left:15px;font-size:14px;color:grey;font-weight:600;"
                  >{{ scope.row.full_name }}</div>
                </router-link>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Position" width="150" align="center">
        <template slot-scope="{row}">
          <span class>{{ row.position }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Status" width="200" align="center">
        <template slot-scope="{row}">
          <el-tag
            :type="row.status.toLowerCase() == 'active'?'success':'danger'"
          >{{ row.status.toUpperCase() }}</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import axios from "axios";
export default {
  props: ["user"],
  data() {
    return {
      tableData: [],
      table_config: {
        page: 1,
        display_size: 10,
        total: 0
      },
      query: {
        id: this.$route.params.id
      }
    };
  },
  watch: {
    comrades(v) {
      this.tableData = v;
    },
    comradesTotal(v) {
      this.table_config.total = v;
    }
  },
  computed: {
    ...mapGetters(["token", "comrades", "comradesTotal"])
  },
  mounted() {
    this.fetchComrades({ id: this.$route.params.id });
  },
  methods: {
    ...mapActions(["fetchComrades"]),
    tableSizeChange(value) {
      this.query.limit = value;
      const data = this.query;
      this.fetchComrades(data);
    },
    tablePageChange(value) {
      this.query.offset = (value - 1) * this.query.limit;
      const data = this.query;
      this.fetchComrades(data);
    }
  }
};
</script>

<style lang="scss" scoped>
.user-activity {
  .user-block {
    .username,
    .description {
      display: block;
      padding: 2px 0;
    }

    .username {
      font-size: 16px;
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
}

.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}
</style>
