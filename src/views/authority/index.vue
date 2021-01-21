<template>
  <div>
    <el-card class="box-card">
      <span style="margin-left: 20px">
        <el-button type="text" size="mini" @click="handleAddAuthority(0)">
          添加
        </el-button>
      </span>
      <div
        class="custom-tree-container"
        style="margin-top: 10px; overflow: hidden; min-height: 500px"
      >
        <div class="block">
          <el-tree
            v-loading="authorityListLoading"
            element-loading-text="获取权限数据中"
            :data="authorityList"
            node-key="id"
            :check-strictly="false"
            :props="{ label: 'name' }"
            default-expand-all
            :expand-on-click-node="false"
          >
            <span slot-scope="{ node }" class="custom-tree-node">
              <span>{{ node.label }} {{ node.data.identifier }}</span>
              <span>
                <el-button type="text" size="mini" @click="handleAddAuthority(node.data.id)"> 添加 </el-button>
                <el-button type="text" size="mini" @click="delAuthority(node)"> 删除 </el-button>
              </span>
            </span>
          </el-tree>
        </div>
      </div>
    </el-card>
    <el-dialog
      title="添加权限"
      :visible.sync="dialogVisible"
      width="30%"
      :close-on-click-modal="false"
    >
      <el-form
        ref="authorityForm"
        :label-position="labelPosition"
        :rules="rules"
        label-width="80px"
        :model="authority"
      >
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="authority.name" />
        </el-form-item>
        <el-form-item label="权限值" prop="identifier">
          <el-input v-model="authority.identifier" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getAuthorities, addAuthority, delAuthority } from './service'
export default {
  data() {
    return {
      authorityList: [],
      authorityListLoading: true,
      dialogVisible: false,
      labelPosition: 'left',
      authority: {
        name: '',
        identifier: '',
        parentId: ''
      },
      rules: {
        name: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
        identifier: [
          { required: true, message: '请输入权限值', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getAuthorities()
  },
  methods: {
    getAuthorities() {
      this.authorityListLoading = true
      getAuthorities()
        .then((response) => {
          this.authorityList = response.data
          this.authorityListLoading = false
        })
    },
    handleAddAuthority(id) {
      this.dialogVisible = true
      this.authority = {}
      if (id !== undefined) {
        this.authority.parentId = id
      }
    },
    init() {
      this.authority = {
        name: '',
        permission: '',
        parentId: ''
      }
      this.getAuthorities()
    },
    addSubmit() {
      this.$refs['authorityForm'].validate((valid) => {
        if (valid) {
          addAuthority(this.authority).then((response) => {
            this.dialogVisible = false
            this.init()
          })
        } else {
          return false
        }
      })
    },
    delAuthority(node) {
      delAuthority(node.data.id).then((response) => {
        this.init()
      })
    }
  }
}
</script>

<style>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.box-card {
  width: 1000px;
}
</style>
