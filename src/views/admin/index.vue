<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="获取用户数据中"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="用户名" align="center" prop="name" />
      <el-table-column label="头像" align="center" width="100">
        <template slot-scope="scope">
          <img :src="scope.row.createTime">
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          {{ formatDate(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label="最后登陆时间" align="center">
        <template slot-scope="scope">
          {{ formatDate(scope.row.lastLoginTime) }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="正常"
            inactive-text="冻结"
            @change="switchChange($event, scope.row.id)"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            @click="{
              admin.id = scope.row.id
              admin.roleIds = scope.row.roles.map(function(value){
                return value.id
              })
              assginRoleVisible=true
            }"
          >分配角色{{ scope.row.name }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total,prev, pager, next"
      :total="total"
      :page-size="pageSize"
      :current-page.sync="pageNum"
      @current-change="handleCurrentChange"
    />
    <el-dialog :visible.sync="assginRoleVisible" title="分配角色" width="280px" :close-on-click-modal="false">
      <el-form ref="assginRoleForm" :model="admin" label-width="50px" label-position="left" :rules="rules">
        <el-form-item label="id" prop="id" hidden="false">
          <el-input v-model="admin.id" />
        </el-form-item>
        <el-form-item label="角色" prop="roleIds">
          <el-select v-model="admin.roleIds" multiple placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="assginRoleVisible=false">取消</el-button>
        <el-button type="primary" @click="assginRole">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAdminList, changeStatus, getRoleList, assginRole } from './service'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    var checkAssginRoles = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('至少分配一种角色'))
      } else {
        callback()
      }
    }
    return {
      list: null,
      listLoading: true,
      pageSize: 8,
      pageNum: 1,
      total: 0,
      assginRoleVisible: false,
      roleList: null,
      value1: null,
      admin: {
        id: '',
        roleIds: []
      },
      rules: {
        roleIds: [{ validator: checkAssginRoles, trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getAdmins()
    this.initRoleList()
  },
  methods: {
    getAdmins() {
      this.listLoading = true
      getAdminList({ pageSize: this.pageSize, pageNum: this.pageNum }).then(response => {
        this.list = response.data.data
        this.listLoading = false
        this.total = response.data.total
      })
    },
    initRoleList() {
      getRoleList().then(response => {
        this.roleList = response.data
      })
    },
    formatDate(date) {
      return this.$moment(date).format('YYYY-MM-DD HH:mm:ss')
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.getAdmins()
    },
    switchChange(status, id) {
      changeStatus({ status, id })
    },
    assginRole() {
      this.$refs['assginRoleForm'].validate((valid) => {
        if (valid) {
          assginRole(this.admin).then((response) => {
            this.assginRoleVisible = false
            this.initAdminTable()
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
  .el-pagination{
    justify-content: flex-end;
    display: flex;
    margin-top: 10px;
  }
</style>
