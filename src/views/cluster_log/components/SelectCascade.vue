<template>
  <div>
    <el-select
      v-model="select"
      class="form-input"
      style="width:100%;padding-bottom:2px"
      size="mini"
      multiple
      filterable
      remote
      reserve-keyword
      :placeholder="list+'...'"
    >
      <!-- :remote-method="remoteAgent" -->
      <!-- :loading="form.remote_loader" -->
      <!-- <el-option
        v-for="item in agents.agents"
        :key="item.id"
        :label="item.full_name"
        :value="item.id"
      /> -->
    </el-select>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";

const filter_by ={
  Head:"parent_id",
  Subordinate:"child_id"
}
export default {
  props:["list","date"],
  data(){
    return{
      select:null,
      options:[]
    }
  },
  mounted(){
    this.getOptions()
  },
  computed:{
    ...mapGetters(["token"])
  },
  watch:{
    date(v){
      this.getOptions();
    }
  },
  methods:{
    getOptions(){
      // settng variables
      let url="api/v1/hierarchy_log?date="+this.date,
      options={
        headers:{
          Authorization: "Bearer "+ this.token
        }
      };
      // axios request
      axios.get(url,options)
      .then(res=>{
        this.options = this.res.data.meta.hierarchy_log
      })
      .catch(err=>{
        console.log(err.response.data)
      })

    }
  }
}
</script>
