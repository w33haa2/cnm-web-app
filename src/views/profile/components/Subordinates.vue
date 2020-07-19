<template>
  <div>
    <div class="custom-card shadow" style="padding:15px;">
      <el-row>
        <el-col :md="{ span: 8 }">
          <div style="font-size:1.3em;">Subordinates</div>
        </el-col>
        <el-col :md="{ span: 1, offset: 15 }"> </el-col>
      </el-row>

      <el-row>
        <el-col :md="{ span: 12 }" style="margin-top:5px;">
          <div class="d-flex">
            <div
              class="button-icon round"
              style="display:flex;justify-content:center;margin-right:10px;"
              :style="sort_order > 0 ? 'background-color:#ccc' : ''"
              @click="columnSort()"
            >
              <el-tooltip placement="top" :content="sort.tooltip">
                <template v-if="sort_order < 2">
                  <sort-alpha-asc-icon></sort-alpha-asc-icon>
                </template>
                <template v-else>
                  <sort-alpha-desc-icon></sort-alpha-desc-icon>
                </template>
              </el-tooltip>
            </div>
            <div>
              <el-input type="text" placeholder="Search..." v-model="table_config.query.query" @input="debounceInput" style="width:calc(100%-60px)"></el-input>
            </div>
          </div>
        </el-col>
        <el-col :md="{ span: 12 }" style="margin-top:5px;">
          <el-pagination
            style="float:right"
            :pager-count="5"
            :page-sizes="[10, 25, 50]"
            :page-size="table_config.query.limit"
            layout="total, sizes, prev, pager, next"
            :total="table_config.count"
            :current-page.sync="table_config.page"
            background
            small
            @current-change="tablePageChange"
            @size-change="tableSizeChange"
          />
        </el-col>
      </el-row>
    </div>
    <!-- Table -->
    <!-- <el-table
      :data="table_config.data"
      style="width: 100%;margin-top:30px;"
      v-loading="fetchSubordinatesState.initial"
    >
      <el-table-column label="Name">
        <template slot-scope="scope">
          <router-link :to="'/profile/index/'+scope.row.child_id">{{ scope.row.child_details.full_name }}</router-link>
        </template>
      </el-table-column>
      <el-table-column label="Email">
        <template slot-scope="scope">{{ scope.row.child_user_details.email }}</template>
      </el-table-column>
      <el-table-column label="Position">
        <template slot-scope="scope">{{ scope.row.child_user_details.access.name }}</template>
      </el-table-column>
    </el-table> -->
    <div
      class="subordinates-wrapper"
      style="height:200px;"
      v-loading="true"
      v-if="fetchSubordinatesState.initial"
    ></div>
    <div class="subordinates-wrapper" v-else>
      <el-row :gutter="20">
        <template v-for="(datum, index) in table_config.data">
          <el-col :key="index" :md="{ span: 12 }" style="margin-bottom:20px;">
            <div
              style="background-color:white;border-radius:10px;padding:10px;"
              class="shadow"
            >
              <div style="width:100%;display:flex;">
                <div style="width:60px;">
                  <el-avatar :size="50" src="default.gif"></el-avatar>
                </div>
                <div style="height:50px;display:flex;">
                  <div style="align-self:center">
                    <div style="font-size:.9em">
                      <router-link :to="'/profile/index/'+datum.child_details.id">
                        {{ datum.child_details.full_name }}
                      </router-link>
                    </div>
                    <div style="color:gray;font-size:.8em">
                      {{ datum.child_user_details.access.name }}
                    </div>
                    <div style="color:gray;font-size:.8em">
                      {{ datum.child_user_details.email }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </template>
      </el-row>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import { mapActions, mapGetters } from "vuex";
import {debounce} from "debounce";

const ymdHms = "YYYY-MM-DD HH:mm:ss";

export default {
  data() {
    return {
      sort_order: 0,
      table_config: {
        page: 1,
        data: [],
        dummy: [],
        count: 0,
        loader: false,
        query: {
          date: moment().format(ymdHms),
          parent_id: this.$route.params.id,
          offset: null,
          limit: 10,
          query: "",
          sort_order: null,
          sort: "child_details.full_name",
          target:["child_details.firstname"]
        },
        remoteFilter: {
          select: null,
          options: [],
          by: "all",
          loader: false
        }
      }
    };
  },
  computed: {
    ...mapGetters([
      "token",
      "fetchSubordinatesState",
      "fetchSubordinatesData",
      "fetchSubordinatesTitle"
    ]),
    offset() {
      return (this.table_config.page - 1) * this.table_config.query.limit;
    },
    sort(){
      let tooltip = "No sort",order=null;
      switch(this.sort_order){
        case 0:
          tooltip = "No sort"
          order = null;
          break;
        case 1:
          tooltip= "Ascending";
          order = "asc";
          break;
        case 2:
          tooltip= "Descending";
          order = "desc";
          break;
      }
      return {tooltip:tooltip,order:order};
    }
  },
  watch: {
    "table_config.query.query":function(v){
      this.table_config.query.offset=0;
    },
    "table_config.query.parent_id": function() {
      this.fetchSubordinates(this.table_config.query);
    },
    fetchSubordinatesState({ initial, success, fail }) {
      if (success) {
        this.table_config.data = this.fetchSubordinatesData.subordinates;
        this.table_config.count = this.fetchSubordinatesData.count;
        this.table_config.page = this.fetchSubordinatesData.hierarchy_log.current_page;
      }
    }
  },
  created() {
    this.fetchSubordinates(this.table_config.query);
  },
  methods: {
    ...mapActions(["fetchSubordinates"]),
    debounceInput:debounce(function(e){
      this.fetchSubordinates(this.table_config.query);
    },1000),
    columnSort() {
      ++this.sort_order;
      if (this.sort_order == 3) {
        this.sort_order = 0;
      }
      this.table_config.query.sort_order = this.sort.order;
      if(this.sort.order==null){
        this.table_config.query.sort=null;
      }
      this.fetchSubordinates(this.table_config.query);
    },
    tableSizeChange(v) {
      this.table_config.page = 1;
      this.table_config.query.offset = 0;
      this.table_config.query.limit = v;
      this.fetchSubordinates(this.table_config.query);
    },
    tablePageChange(v) {
      this.table_config.page = v;
      this.table_config.query.offset = this.offset;
      this.fetchSubordinates(this.table_config.query);
    }
  }
};
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
