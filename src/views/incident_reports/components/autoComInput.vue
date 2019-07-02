
<template>
  <div>
    <el-autocomplete
      v-model="state"
      popper-class="my-autocomplete"
      :size="size?size:'mini'"
      :fetch-suggestions="querySearch"
      :placeholder="placeholder? placeholder:'Autocomplete input'"
      style="width:100%"
      @select="handleSelect"
    >
      <i slot="suffix" class="el-icon-edit el-input__icon" @click="handleIconClick" />
      <template slot-scope="{ item }">
        <div class="value">{{ item.value }}</div>
        <span class="hint">{{ item.hint }}</span>
      </template>
    </el-autocomplete>
  </div>
</template>

<style lang="scss" scoped>
.my-autocomplete {
  li {
    line-height: normal;
    padding: 7px;

    .value {
      text-overflow: ellipsis;
      overflow: hidden;
      float: left;
    }
    .hint {
      font-size: 12px;
      color: #b4b4b4;
      float: right;
    }
  }
}
</style>

<script>
export default {
  name: 'AutoCompleteInput',
  props: ['options', 'placeholder', 'size', 'hint'],
  data() {
    return {
      state: null
    }
    l
  },
  methods: {
    querySearch(queryString, cb) {
      var data = this.options
      var results = queryString
        ? data.filter(this.createFilter(queryString))
        : data
      // call callback function to return suggestion objects
      cb(results)
    },
    createFilter(queryString) {
      return options => {
        return (
          options.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        )
      }
    },
    handleSelect(item) {
      this.state = item.value
      this.$emit('selected', item.id)
    },
    handleIconClick(ev) {
      console.log(ev)
    }
  }
}
</script>
