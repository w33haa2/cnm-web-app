<template>
    <div class="app-container">
        <h4 style="color:#646464">Work Force</h4>
        <div>
            <el-row>
                <el-col :md="{span:6}">
                    <div style="display:flex;">
                        <div style="display:flex;">
                            <div>
                                <el-avatar></el-avatar>
                            </div>
                            <div>
                                <el-select class="avatar-select" v-model="selected">
                                    <el-option :value="1">
                                        <div style="display:flex;justify-content:space-between">
                                            <div>
                                                <el-avatar></el-avatar>
                                            </div>
                                            <div style='padding-left:20px;'>
                                                <div>
                                                    <div style="font-weight:700;color:black;">Lajom, Emmanuel James</div>
                                                    <div style="font-size:.8em;color:#999;">Admin</div>
                                                </div>
                                            </div>
                                            <!-- <div>
                                            </div> -->
                                        </div>
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                        <div>
                            <div style="font-weight:700;color:black;font-size:1.2em">Lajom, Emmanuel James</div>
                            <div style="font-size:.9em;color:#999;margin-top:4px;font-weight:bold">Admin</div>
                            <div style="font-size:.9em;color:#999;margin-top:4px;">jamesenglajom@gmail.com</div>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            selected:1,
        }
    }
}
</script>

<style lang="css">
.avatar-select .el-input__inner{
    border:none !important;
    width:0px;

}

.el-select-dropdown__item{
    height:auto !important;
    padding:5px 20px;
    width:auto;
    line-height:22px !important;
}

</style>