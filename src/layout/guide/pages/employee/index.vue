<template>
    <div class="divider">
        <page-title title="Employee List" url="/employee"></page-title>
        <div class="divider text">
           <div class="d-flex">
            <div style="width:50px;"> 
                <div
                class="button-icon round active"
                style="display:flex;justify-content:center;margin-right:5px;"
                @click="(form.toggle = true),(form.action_data = { action: 'Create', data: null })"
                >
                <el-tooltip placement="top" content="Add Employee">
                    <plus-icon></plus-icon>
                </el-tooltip>
                </div>
            </div>
            <div>
             Add Employee (InApp) -> Add New Employee using the Web Application.
            </div>
           </div>
        </div>
        <div class="divider">
            <el-row>
                <el-col :md="{offset:3,span:21}">
                <div class="divider text">
                    <span class="step-badge">STEP 1</span> Click the <i>Add Employee</i> button to enable form visibility. 
                </div>
                <div class="divider text">
                    <span class="step-badge">STEP 2</span> Fill up all the required form fields. 
                </div>
                <div class="divider text">
                    <span class="step-badge">STEP 3</span> Click confirm to save. 
                </div>
                <div class="divider text">
                    <span class="hint-badge">HINT 1</span> To upload an existing image to the form, Click the avatar image on the form to trigger image upload. 
                </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import pageTitle from "../../components/page_title"
export default {
    name:"employeePageGuide",
    components:{pageTitle},
}
</script>