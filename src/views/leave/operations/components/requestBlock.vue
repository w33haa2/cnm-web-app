<template>
  <div>
    <el-popover width="220" v-if="leave">
      <el-row>
        <el-col>
          <el-tag style="width:100%;text-align:center">
            {{
            requestedBy
            }}
          </el-tag>
        </el-col>
        <el-col style="margin-top:15px;text-align:center">
          <small>REQUESTED DATE/S:</small>
        </el-col>
        <el-col style="margin-top:5px;text-align:center;font-size:.8em;font-weight:bold;">
          {{
          leave.leave_days > 1
          ? formatDate(leave.start_event, "", "ddd, MMM Do") +
          " to " +
          formatDate(leave.end_event, "", "ddd, MMM Do")
          : formatDate(leave.start_event, "", "ddd, MMM Do")
          }}
        </el-col>
        <template v-if="leave.status == 'pending'">
          <el-col style="margin-top:20px">
            <el-button style="width:100%" type="success" @click="approveLeave">Approve</el-button>
            <!-- <template v-if="leave.status == 'approved'">
            <el-button style="width:100%" type="danger" @click="rejectLeave">
              Undo approve
            </el-button>
            </template>-->
          </el-col>
          <el-col style="margin-top:4px">
            <el-button style="width:100%" type="danger" @click="rejectLeave">Reject</el-button>
          </el-col>
        </template>
      </el-row>
      <div
        slot="reference"
        class="container"
        :class="style.container"
        @mouseover="hover = true"
        @mouseleave="hover = false"
      >
        <div class="content" :class="style.content">
          {{
          hover
          ? style.label
          : leave.leave_days > 1
          ? formatDate(leave.start_event, "", "ddd, MMM Do") +
          " (" +
          leave.leave_days +
          "d)"
          : formatDate(leave.start_event, "", "ddd, MMM Do")
          }}
        </div>
      </div>
    </el-popover>
    <div v-else class="container bg-null">
      <div class="content">No request</div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  props: ["slots", "leave", "requestedBy", "cluster_id"],
  data() {
    return {
      hover: false
    };
  },
  computed: {
    style() {
      let result = {};
      if (this.leave) {
        if (this.leave.status == "approved") {
          result.container = "bg-approved cur-p";
          result.content = "c-white";
          result.label = "APPROVED";
        } else if (this.leave.status == "pending") {
          result.container = "bg-pending cur-p";
          result.content = "c-white";
          result.label = "PENDING";
          if (!this.leave.has_schedule_tag) {
            result.container = "bg-no-sched cur-p";
            result.content = "c-white";
            result.label = "NO AFFECTED SCHEDULE";
          }
        } else if (this.leave.status == "rejected") {
          result.container = "bg-reject cur-p";
          result.content = "c-white";
          result.label = "REJECTED";
        } else if (this.leave.status == "cancelled") {
          result.container = "bg-cancel cur-p";
          result.content = "c-white";
          result.label = "CANCELLED";
        }
      } else {
        result.container = "bg-null";
        result.content = "c-white";
        result.label = "No request";
      }
      return result;
    }
  },
  methods: {
    approveLeave() {
      if (confirm("Please confirm.")) {
        axios
          .post("api/v1/leaves/approve/" + this.leave.id, {
            om_id: this.cluster_id
          })
          .then(res => {
            if (res.data.code == 200) {
              this.$message({
                type: "success",
                message: res.data.title
              });
              this.$emit("fetch", true);
            } else {
              this.$message({
                type: "error",
                message: res.data.title
              });
            }
          });
      }
    },
    rejectLeave() {
      if (confirm("Please confirm.")) {
        axios
          .post("api/v1/leaves/reject/" + this.leave.id, {
            om_id: this.cluster_id
          })
          .then(res => {
            if (res.data.code == 200) {
              this.$message({
                type: "success",
                message: res.data.title
              });
              this.$emit("fetch", true);
            } else {
              this.$message({
                type: "error",
                message: res.data.title
              });
            }
          });
      }
    }
  }
};
</script>

<style scoped>
.container {
  height: 45px;
  display: flex;
}
.cur-p {
  cursor: pointer;
}
.content {
  align-self: center;
  width: 100%;
  text-align: center;
}

.bg-approved {
  background-color: #01c66d;
}
.bg-pending {
  background-color: #f69c35;
}
.bg-reject {
  background-color: #e53d55;
}
.bg-cancel {
  background-color: #fb0b2f;
}
.bg-no-sched {
  background-color: maroon;
}
.bg-approved:hover {
  background-color: #00df7a;
}
.bg-pending:hover {
  background-color: #ffa641;
}
.bg-reject:hover {
  background-color: #f14862;
}
.bg-cancel:hover {
  background-color: #ff1d3f;
}
.bg-no-sched:hover {
  background-color: rgb(148, 9, 9);
}

.bg-null {
  background-color: #bfbfbf;
}
.c-white {
  color: white;
}
</style>
