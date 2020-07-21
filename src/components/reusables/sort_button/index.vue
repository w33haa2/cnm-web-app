<template>
    <div
        class="button-icon round"
        style="display:flex;justify-content:center;margin-right:10px;"
        :style="(sort_order > 0 ? 'background-color:#ccc' : '') + (disabled?'cursor:not-allowed':'')"
        @click="disabled?null:columnSort()"
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
</template>

<script>
export default {
    name:"sortButton",
    props:{
        disabled:{
            type:Boolean,
            default:false,
        }
    },
    data(){
        return {
            sort_order:0
        }
    },
    computed:{
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
    methods:{
        columnSort() {
        ++this.sort_order;
        if (this.sort_order == 3) {
            this.sort_order = 0;
        }
        this.$emit("sort_data",this.sort.order)
        },
    }
}
</script>