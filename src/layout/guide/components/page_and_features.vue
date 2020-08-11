<template>
  <div>
      <template v-for="(item,index) in guide_obj">
          <div :key="index" v-if="item.name!='Introduction'">
              <page-title :title="item.name" :url="item.url" style="margin-bottom:30px;"></page-title>
                <!-- features -->
                <template v-if="item.features.length>0">
                    <template v-for="(feature,index1) in item.features">
                        <div :key="index1" style="margin-bottom:30px;">
                            <div class="divider text" :id="feature.link">
                                <div class="d-flex">
                                    <div class="guide-action-button-wrapper">
                                        <div
                                        class="button-icon round excel"
                                        style="display:flex;justify-content:center;margin-right:5px;"
                                        >
                                        <el-tooltip placement="top" content="Import Employee">
                                            <file-import-icon></file-import-icon>
                                        </el-tooltip>
                                        </div>
                                    </div>
                                    <div class="feature-name">
                                        {{feature.name}}
                                    </div>
                                </div>
                            </div>
                            <div style="padding-left:50px;">
                                <!-- steps -->
                                <template v-for="(step,step_index) in feature.steps">
                                    <div :key="step_index" class="divider text">
                                        <span class="step-badge">STEP {{step_index+1}}</span> {{step.step}} 
                                        <template v-if="step.link">
                                            <a
                                                href="#"
                                                v-scroll-to="{
                                                el: '#'+step.link,
                                                container: '.content-container'
                                                }"
                                                style="color:blue"
                                                >here</a
                                            >.
                                        </template> 
                                    </div>
                                </template>
                                <!-- hints -->
                                <template v-for="(hint,hint_index) in feature.hints">
                                    <div :key="hint_index" class="divider text">
                                        <span class="hint-badge">HINT {{hint_index+1}}</span> {{hint.hint}} 
                                        <template v-if="hint.link">
                                            <a
                                                href="#"
                                                v-scroll-to="{
                                                el: '#'+hint.link,
                                                container: '.content-container'
                                                }"
                                                style="color:blue"
                                                >here</a
                                            >.
                                        </template> 
                                    </div>
                                </template>
                            </div>
                        </div>
                    </template>
                </template>
          </div>
      </template>
  </div>
</template>
<script>
import pageTitle from "./page_title";
import { guide_obj } from "../permission.js";

export default {
    name:"PageAndFeatures",
    components:{pageTitle},
    data(){
        return {
            guide_obj:guide_obj
        }
    }
}
</script>

<style lang="scss">
.guide-action-button-wrapper{
    width:50px;
}
.feature-name{

}
</style>