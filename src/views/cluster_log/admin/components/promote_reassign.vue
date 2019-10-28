<template>
  <div>
    <el-button
      size="mini"
      style="float:right "
      :plain="true"
      @click="dialog=true"
    >Create cluster instance</el-button>

    <el-dialog
      width="60%"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :visible.sync="dialog"
      title="Reassign Form"
    >
      <el-row gutter="20">
        <!-- the form -->
        <el-col :md="{span:12}">
          <el-row>
            <el-col style="margin-bottom:10px;">
              <label>Action</label>
              <el-radio-group size="mini" v-model="action" style="width:100%;margin-top:5px;">
                <el-radio-button label="reassign">Reassign</el-radio-button>
                <el-radio-button label="promote">Promote</el-radio-button>
              </el-radio-group>
            </el-col>
            <el-col style="margin-bottom:10px;">
              <label>Position</label>
              <el-input
                size="mini"
                style="width:100%;margin-top:5px;"
                :disabled="action=='reassign'"
              ></el-input>
            </el-col>
            <el-col style="margin-bottom:10px;">
              <label>Head</label>
              <el-input size="mini" style="width:100%;margin-top:5px;"></el-input>
            </el-col>
            <el-col style="margin-bottom:10px;">
              <label>{{ action=='reassign' ? 'Subordinates' : 'Employees' }}</label>
              <template v-if="action=='reassign'">
                <el-input
                  size="mini"
                  style="width:100%;margin-top:5px;"
                  v-model="form.reassign.field.subordinates"
                ></el-input>
              </template>
              <template v-else>
                <el-input
                  size="mini"
                  style="width:100%;margin-top:5px;"
                  v-model="form.promote.field.employees"
                ></el-input>
              </template>
            </el-col>
            <el-col style="margin-bottom:10px;">
              <label>Start Date</label>
              <el-date-picker
                size="mini"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                :clearable="false"
                style="width:100%;margin-top:5px;"
              />
            </el-col>
            <el-col style="margin-top:20px;">
              <div style="float:right">
                <el-button size="mini">Close</el-button>
                <el-button size="mini" type="danger">Submit</el-button>
              </div>
            </el-col>
          </el-row>
        </el-col>
        <!-- the list view -->
        <el-col :md="{span:12}">
          <el-table height="350px">
            <el-table-column label="Full Name">
              <!-- <template scope="scope">{{scope.row.full_name}}</template> -->
            </el-table-column>
            <el-table-column label="Status">
              <!--  <template scope="scope">
                  <template v-if="scope.row.status_code==200">
                    <el-tag size="mini" type="success">UPLOADED</el-tag>
                  </template>
                  <template v-else>
                    <el-tag size="mini" type="danger">{{ scope.row.title }}</el-tag>
                  </template>
              </template>-->
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import moment from "moment";
export default {
  data() {
    return {
      dialog: false,
      action: "reassign",
      form: {
        reassign: {
          model: [],
          field: {
            head: null,
            subordinates: [],
            start_date: null
          }
        },
        promote: {
          model: [],
          field: {
            head: null,
            employees: [],
            start_date: null
          }
        }
      }
    };
  }
};
</script>