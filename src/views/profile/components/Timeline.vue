<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item v-for="(item,index) in timeline" :key="index" :timestamp="item.date" placement="top">
        <el-card>
          <h4>{{ item.description }}</h4>
          <p>{{ item.content }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
export default {
  props: ['timeline'],
  data() {
    return {
    }
  }
}
</script>
