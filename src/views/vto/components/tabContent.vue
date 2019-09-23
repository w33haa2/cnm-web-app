<template>
  <div class="tab-content-container">
    <div class="header">
      <el-row style="margin-bottom:10px;">
        <el-col :md="{span:4}">
          <el-input size="mini" placeholder="Search..."></el-input>
        </el-col>
        <el-col :md="{span:20}">
          <el-pagination
            style="float:right"
            pager-count="4"
            :page-sizes="[10,25,50]"
            :page-size="table_config.display_size"
            layout="total, sizes, prev, pager, next"
            :total="table_config.count"
            :current-page.sync="table_config.page"
            @size-change="tableSizeChange"
            @current-change="tablePageChange"
            background
            small
          />
        </el-col>
      </el-row>
    </div>
    <div class="body" style="padding-left:20px;padding-right:20px;">
      <el-table :data="dummy" style="width:100%;" height="500px;" v-loading="table_config.loader">
        <el-table-column label="Agent" >
          <template slot-scope="scope">
            <div class="user-block">
              <img v-if="scope.row.info.image_url" class="img-circle" :src="scope.row.info.image_url" />
              <div v-else class="img-circle text-muted" style="background-color:#d9d9d9;display:flex">
                <div
                  style="align-self:center;width:100%;text-align:center;"
                  class="text-point-eight-em"
                >{{ getAvatarLetters(scope.row.info.firstname,scope.row.info.lastname) }}</div>
              </div>
              <span>
                  {{ scope.row.info.full_name }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="VTO Hours" width="200px" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.vto.hours}}</span>
          </template>
        </el-table-column>
        <el-table-column label="Credit spent" width="200px" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.vto.spent_credits}}</span>
          </template>
        </el-table-column>
        <el-table-column label="Remove" width="200px">
          <template slot-scope="scope">
            <el-button size="mini" type="danger">Remove</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import axios from "axios"
import moment from "moment"
export default {
  props:["vtoat"],
  data(){
    return{
      table_config:{
        page:1,
        display_size:10,
        count:1
      },
    dummy:[
        {
          info:{
            image_url:"default.gif",
            full_name:"Emmanuel James E. Lajom",
            firstname:"Emmanuel James",
            lastname:"Lajom"
          },
          vto:{
            hours: "3",
            spent_credits: "3"
          }
        },
        {
          info:{
            image_url:null,
            full_name:"Allen B. Lamparas",
            firstname:"Allen",
            lastname:"Lamparas"
          },
          vto:{
            hours: "3",
            spent_credits: "3"
          }
        }
      ]
    }
  },
  mounted(){
    this.init();
  },
  methods:{
    init(){

    }
  }
}
</script>

<style lang="scss" scoped>
.tab-content-container{
  border: 1px solid #ccc;
  height:500px;
  .header{
    border-bottom: 1px solid #ccc;
    padding:20px;
    background-color:#e9e9e9;
  }
  .body{
    padding-top:10px;
  }
}

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
</style>
