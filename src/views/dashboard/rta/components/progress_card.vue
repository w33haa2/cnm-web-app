<template>
    <div>
        <el-card shadow="hover" body-style="padding:0px" class="dim">
            <!-- component -->
                <div style="padding-left:10px;padding-right:10px;padding-top:10px;">
                    <el-row>
                        <el-col :md="{span:6}" :xs="{span:6}">
                            <svg-icon style="color:#ccc;font-size:3.5em" icon-class="calendar" />
                        </el-col>
                        <el-col :md="{span:18}" :xs="{span:18}">
                            <div style="padding:10px;">
                                <el-row :gutter="10">
                                    <el-col>
                                        <h5>{{config.label}}</h5>
                                    </el-col>
                                    <el-col >
                                        <div style="width:100%;text-align:right">
                                            <h2>{{config.count}}</h2>
                                        </div>
                                    </el-col>
                                </el-row>
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <el-progress :show-text="false" :status="config.progress_status" :percentage="config.percent" :stroke-linecap="'square'"></el-progress>
            <!-- end component -->
        </el-card>
    </div>
</template>

<script>
export default {
    name:"progressCard",
    props:["config"],
}
</script>