<template>
  <div class="url-list-title text" style="font-size:1.2em;" :id="'#' + url">
    {{ title }}
    <template v-if="url">
      <span>
        <router-link :to="url" target="_blank">
          <el-tooltip content="Click to open page on new tab." placement="top">
            <open-in-new-icon />
          </el-tooltip>
        </router-link>
      </span>
    </template>
    <template v-if="description">
      <div class="indent" style="font-size:.8em;color:gray">{{ description }}</div>
    </template>
  </div>
</template>
<script>
export default {
  name: "pageTitleGuide",
  props: ["title", "url", "description"]
};
</script>
