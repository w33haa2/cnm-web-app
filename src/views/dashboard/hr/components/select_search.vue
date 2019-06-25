<template>
  <el-select
    v-model="selected"
    :multiple="multiple || false"
    :filterable="filterable || false"
    :remote="remote || false"
    :size="size || mini"
    :placeholder="placeholder || false"
    :remote-method="remoteMethod"
    :loading="loading"
    :autocomplete="autocomplete || 'off'"
    :automatic-dropdown="true"
    :default-first-option="true"
    @input="filterUpdate"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<script>
export default {
  name: 'SelectSearch',
  props: ['placeholder', 'multiple', 'filterable', 'remote', 'size', 'data', 'autocomplete'],
  data() {
    return {
      options: [],
      selected: [],
      list: [],
      loading: false
    }
  },
  watch: {
    data: function() { this.list = this.data }
  },
  created() {
    this.list = this.data
  },
  methods: {
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.options = this.list.filter(item => {
            return item.label.toLowerCase()
              .indexOf(query.toLowerCase()) > -1
          })
        }, 200)
      } else {
        if (this.autodrop == true) {
          this.options = this.data
        } else {
          this.options = []
        }
      }
    },
    filterUpdate() {
      this.$emit('filter', this.selected)
    }
  }
}
</script>
