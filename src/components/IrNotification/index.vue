<template>
  <div>
    <div style="position:relative">
      <el-tooltip content="Open IR notification">
        <div class="container">
          <!-- <div style="color:white;background-color:red;font-size:.6em;position:fixed;height:10px;">30dsa</div> -->
          <template v-if="value > 0 ">
            <el-badge :value="value" style="position:absolute;top:15px;right:0px;">
              <el-button style="display:none"></el-button>
            </el-badge>
            <svg-icon icon-class="documentation" @click.stop="click" />
          </template>
          <template v-else>
            <svg-icon icon-class="documentation" @click.stop="click" />
          </template>
          <!-- </svg-icon> -->
        </div>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";
export default {
  name: 'IRNotif',
  data() {
    return {
      value:0,
    }
  },
  computed: {
    ...mapGetters(["token","user_id"])
  },
  watch: {
  },
  mounted() {
    this.initialize()
  },
  methods: {
    initialize(){
      let options = {
        headers:{
          Authorization: "Bearer " + this.token,
        }
      }, url="api/v1/reports/issued_to/"+this.user_id;
      axios.get(url,options).then(res => {
        this.value = res.data.meta.reports.filter(i=> i.report_details.status == "open").length;
      }).catch(err=>console.log(err.response.data));
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
