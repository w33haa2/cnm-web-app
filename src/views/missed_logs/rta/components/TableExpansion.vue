<template>
  <el-row>
    <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 8}" :lg="{span: 8}" :xl="{span: 8}" style="padding-right:8px;margin-bottom:30px;">
      <h4>Personal</h4>
      <el-row style="padding-top:4px;padding-bottom:4px">
        <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 6}" :lg="{span: 6}" :xl="{span: 6}" class="data-label">Birth Date</el-col>
        <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 16}" :lg="{span: 16}" :xl="{span: 16}" class="data-content">{{ data.row.info.birthdate }}</el-col>
      </el-row>
      <el-row style="padding-top:4px;padding-bottom:4px">
        <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 6}" :lg="{span: 6}" :xl="{span: 6}" class="data-label">Gender</el-col>
        <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 16}" :lg="{span: 16}" :xl="{span: 16}" class="data-content">{{ data.row.info.gender }}</el-col>
      </el-row>
      <el-row style="padding-top:4px;padding-bottom:4px">
        <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 6}" :lg="{span: 6}" :xl="{span: 6}" class="data-label">Address</el-col>
        <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 16}" :lg="{span: 16}" :xl="{span: 16}" class="data-content">{{ data.row.info.address }}</el-col>
      </el-row>
      <el-row style="padding-top:4px;padding-bottom:4px">
        <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 6}" :lg="{span: 6}" :xl="{span: 6}" class="data-label">Mobile</el-col>
        <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 16}" :lg="{span: 16}" :xl="{span: 16}" class="data-content">{{ data.row.info.contact_number }}</el-col>
      </el-row>
      <el-row style="padding-top:4px;padding-bottom:4px">
        <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 6}" :lg="{span: 6}" :xl="{span: 6}" class="data-label">Email</el-col>
        <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 16}" :lg="{span: 16}" :xl="{span: 16}" class="data-content">{{ data.row.info.p_mail }}</el-col>
      </el-row>
    </el-col>
    <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 8}" :lg="{span: 8}" :xl="{span: 8}" style="padding-right:8px;margin-bottom:30px;">
      <h4>Company Details</h4>
      <el-row style="padding-top:4px;padding-bottom:4px">
        <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 6}" :lg="{span: 6}" :xl="{span: 6}" class="data-label">CNM ID</el-col>
        <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 16}" :lg="{span: 16}" :xl="{span: 16}" class="data-content">{{ data.row.company_id }}</el-col>
      </el-row>
      <el-row style="padding-top:4px;padding-bottom:4px">
        <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 6}" :lg="{span: 6}" :xl="{span: 6}" class="data-label">Email</el-col>
        <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 16}" :lg="{span: 16}" :xl="{span: 16}" class="data-content">{{ data.row.email }}</el-col>
      </el-row>
      <el-row style="padding-top:4px;padding-bottom:4px">
        <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 6}" :lg="{span: 6}" :xl="{span: 6}" class="data-label">Contract</el-col>
        <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 16}" :lg="{span: 16}" :xl="{span: 16}" class="data-content">{{ data.row.contract }}</el-col>
      </el-row>
    </el-col>
    <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 8}" :lg="{span: 8}" :xl="{span: 8}" style="padding-right:8px;margin-bottom:30px;">
      <h4>IDs</h4>
      <el-row style="padding-top:4px;padding-bottom:4px">
        <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 6}" :lg="{span: 6}" :xl="{span: 6}" class="data-label">SSS</el-col>
        <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 16}" :lg="{span: 16}" :xl="{span: 16}" class="data-content">{{ data.row.info.benefits[0].id_number }}</el-col>
      </el-row>
      <el-row style="padding-top:4px;padding-bottom:4px">
        <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 6}" :lg="{span: 6}" :xl="{span: 6}" class="data-label">PhilHealth</el-col>
        <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 16}" :lg="{span: 16}" :xl="{span: 16}" class="data-content">{{ data.row.info.benefits[1].id_number }}</el-col>
      </el-row>
      <el-row style="padding-top:4px;padding-bottom:4px">
        <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 6}" :lg="{span: 6}" :xl="{span: 6}" class="data-label">PagIbig</el-col>
        <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 16}" :lg="{span: 16}" :xl="{span: 16}" class="data-content">{{ data.row.info.benefits[2].id_number }}</el-col>
      </el-row>
      <el-row style="padding-top:4px;padding-bottom:4px">
        <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 6}" :lg="{span: 6}" :xl="{span: 6}" class="data-label">TIN</el-col>
        <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 16}" :lg="{span: 16}" :xl="{span: 16}" class="data-content">{{ data.row.info.benefits[3].id_number }}</el-col>
      </el-row>
    </el-col>
    <!-- <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 6}" :lg="{span: 6}" :xl="{span: 6}" style="padding-right:8px;margin-bottom:30px;">
            <h4>Timeline</h4>
            <el-row style="padding-top:4px;padding-bottom:4px">
              <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 6}" :lg="{span: 6}" :xl="{span: 6}" class="data-label">Full name</el-col>
              <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 16}" :lg="{span: 16}" :xl="{span: 16}" class="data-content">{{ data.row.info.full_name }}</el-col>
            </el-row>
          </el-col> -->
  </el-row>
</template>

<script>
export default {
  name: 'TableExpansion',
  props: ['data']
}
</script>

<style lang="scss" scoped>
.data-label{
  color:grey;
  font-size:.8em;
  font-weight:600;
}
.data-content{
  color:#808080;
  font-size:.8em;
}
el-col{
  font-size:.5em;
}
</style>
