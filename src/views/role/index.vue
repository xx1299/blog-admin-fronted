<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRole">新增</el-button>
    <el-table
      v-loading="roleListLoading"
      :data="roleList"
      element-loading-text="获取角色数据中"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="角色名" align="center" prop="name" />
      <el-table-column label="描述" align="center" prop="desc" />
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEditRole(scope)">编辑{{ scope.row.name }}</el-button>
          <el-button type="danger" size="small" @click="delRole(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑角色':'新增角色'" :close-on-click-modal="false">
      <el-form ref="roleForm" :model="role" label-width="80px" label-position="left" :rules="rules">
        <el-form-item label="角色名" prop="name">
          <el-input v-model="role.name" placeholder="请输入角色名" />
        </el-form-item>
        <el-form-item label="角色描述" prop="desc">
          <el-input
            v-model="role.desc"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="请输入角色描述"
          />
        </el-form-item>
        <el-form-item label="权限菜单" prop="authorityIds">
          <el-tree
            ref="tree"
            :data="authorityTree"
            show-checkbox
            node-key="id"
            :check-strictly="false"
            :props="{label: 'name'}"
            default-expand-all
            class="authority-tree"
            :expand-on-click-node="false"
          >
            <span slot-scope="{ node }" class="custom-tree-node">
              <span>{{ node.label }}</span>
            </span>
          </el-tree>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmRole">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRoles, getAuthorities, addRole, editRole, delRole } from './service'
import { deepClone } from '@/utils'

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
    var checkAuthorityIds = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('请分配权限'))
      } else {
        callback()
      }
    }
    return {
      roleList: null,
      roleListLoading: true,
      dialogType: '',
      dialogVisible: false,
      role: {},
      authorityTree: [],
      rules: {
        name: [{ required: true, message: '请输入角色名', trigger: 'blur' }],
        desc: [{ required: true, message: '请输入角色描述', trigger: 'blur' }],
        authorityIds: [{ validator: checkAuthorityIds, trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getRoles()
    this.getAuthorityTree()
  },
  methods: {
    getRoles() {
      this.roleListLoading = true
      getRoles().then(response => {
        this.roleList = response.data
        this.roleListLoading = false
      })
    },
    getAuthorityTree() {
      getAuthorities()
        .then((response) => {
          this.authorityTree = response.data
        })
    },
    handleAddRole() {
      this.role = {}
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogType = 'add'
      this.dialogVisible = true
    },
    handleEditRole(scope) {
      this.dialogType = 'edit'
      this.role = deepClone(scope.row)
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(this.role.authorityIds)
      })
    },
    confirmRole() {
      this.role.authorityIds = this.$refs.tree.getCheckedKeys()
      this.$refs['roleForm'].validate((valid) => {
        if (valid) {
          if (this.dialogType === 'edit') {
            editRole(this.role)
          } else {
            addRole(this.role)
          }
          this.dialogVisible = false
          this.getRoles()
        } else {
          return false
        }
      })
    },
    delRole(scope) {
      delRole(scope.row.id).then((response) => {
        this.getRoles()
      })
    }
  }
}
</script>

<style scoped>
  .el-table{
    margin-top: 10px;
  }
</style>
