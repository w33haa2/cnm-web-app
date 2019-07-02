<template>
  <div class="app-container">
    <!-- <el-radio-group v-model="action.type" size="mini">
      <el-radio-button type="primary" label="Create"></el-radio-button>
      <el-radio-button type="primary" label="Update"></el-radio-button>
      <el-radio-button type="primary" label="Delete"></el-radio-button>
    </el-radio-group>-->
    <h4>Agent Leave</h4>
    <el-container style="height: 500px; border: 1px solid #eee;margin-top:30px;">
      <el-aside width="300px" style="background-color: white;padding:0;overflow:hidden;height:100%">
        <div class="w-100" style="background:#ccc;padding:4px;">
          <el-pagination
            small
            background
            :current-page.sync="currentPage4"
            :page-sizes="[100, 200, 300, 400]"
            :page-size="100"
            layout="total, prev, next"
            :total="400"
            style="float:right"
          />
          <el-input placeholder="Search..." size="mini" />
        </div>
        <div class="w-100 list">
          <ul>
            <li>Agent Name</li>
            <li>Agent Name</li>
            <li>Agent Name</li>
            <li>Agent Name</li>
            <li>Agent Name</li>
            <li>Agent Name</li>
            <li>Agent Name</li>
            <li>Agent Name</li>
            <li>Agent Name</li>
            <li>Agent Name</li>
            <li>Agent Name</li>
            <li>Agent Name</li>
            <li>Agent Name</li>
            <li>Agent Name</li>
            <li>Agent Name</li>
          </ul>
        </div>
      </el-aside>

      <el-container style="background-color:#eee">
        <el-header style="border:#eee 1px solid;height:auto; padding:10px;background-color:white">
          <el-row>
            <el-col :xs="{span:16}" :sm="{span:16}" :md="{span:16}" :lg="{span:16}" :xl="{span:16}">
              <div class="td-image-name-container" style="padding-top:4px;">
                <div class="td-name-avatar-md">
                  <span>AI</span>
                </div>
                <div class="td-name">
                  <div class="text-truncate">Agent Name</div>
                  <div>
                    <span class="text-muted" style="font-size:12px;">Positon</span> ||
                    <span class="text-muted" style="font-size:12px;">email@cnmsolutions.net</span>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form :inline="true" class="demo-form-inline">
                <el-form-item>
                  <!-- leave types according to user department -->
                  <el-select class="w-100" size="mini">
                    <el-option value="1">Select...</el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <!-- range date for leave dates -->
                  <el-date-picker
                    type="daterange"
                    start-placeholder="Start Date"
                    end-placeholder="End Date"
                    size="mini"
                    class="w-100"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button :plain="true" size="mini" class="w-100">Add</el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </el-header>
        <el-main style="padding-left:20px;padding-right:20px">
          <div style="padding:10px;background-color:white;border-radius:3px;margin-bottom:4px;">
            <!-- Search and Pagination -->
            <el-row>
              <el-col :xs="{ span:12 }" :sm="{ span:24 }" :md="{ span:12 }">
                <el-pagination
                  :page-sizes="[100, 200, 300, 400]"
                  :page-size="100"
                  layout="total, sizes, prev, pager, next"
                  :total="400"
                  background
                  small
                />
              </el-col>
              <el-col :xs="{ span:12 }" :sm="{ span:24 }" :md="{ span:12 }">
                <el-input placeholder="Search..." size="mini">
                  <el-select slot="prepend" placeholder="Select" style="width:150px;">
                    <el-option />
                  </el-select>
                  <el-button slot="append">
                    <i class="el-icon-search" />
                  </el-button>
                </el-input>
              </el-col>
            </el-row>

            <!-- Table -->
            <el-table :data="leave" style="width: 100%;margin-top:10px;">
              <el-table-column align="center" label="Action" fixed>
                <template slot-scope="scope">
                  <el-dropdown>
                    <span class="el-dropdown-link">
                      <i class="el-icon-more" />
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item icon="el-icon-edit">Update</el-dropdown-item>
                      <!-- <el-dropdown-item icon="el-icon-printer" divided>Print</el-dropdown-item> -->
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </el-table-column>
              <el-table-column align="header-center" label="Description" width="350">
                <template slot-scope="scope">{{ scope.row.description }}</template>
              </el-table-column>
              <el-table-column align="header-center" label="Inclusion Dates" width="350">
                <template slot-scope="scope">
                  <el-date-picker
                    :ref="'picker'+scope.row.id"
                    v-model="scope.row.included_dates"
                    class="hide-picker-input"
                    type="dates"
                    placeholder="Click to see dates"
                    :clearable="false"
                    :picker-options="{
                      disabledDate(time){
                        return true;
                      },
                    }"
                  />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      radio1: null,
      value: new Date(),
      calendar: {
        data: [
          {
            id: 1,
            start_date: '2019-06-28 10:10:00',
            end_date: '2019-06-28 10:10:00',
            title: 'regularWork'
          }
        ]
      },
      leave: [
        {
          id: 1,
          description: 'Paternity',
          included_dates: ['2019-07-05', '2019-07-07']
        }
      ],
      action: {
        type: 'Create',
        selections: []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.hide-picker-input {
}
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
.is-selected {
  color: #1989fa;
}
.list {
  height: 85%;
  overflow-y: scroll;

  ul {
    margin: 0;
    padding: 0;
    li {
      padding: 10px;
      border-bottom: #eeeeee solid 1px;
      font-size: 12px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>
