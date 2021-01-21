<template>
  <div class="app-container">
    <div class="input-combination">
      <div>
        接口名:
        <el-input
          v-model="title"
          placeholder="请输入接口名"
        />
      </div>
      <div>
        操作人:
        <el-input
          v-model="operatorEmail"
          placeholder="请输入操作人"
        />
      </div>

      <div>
        时间:
        <el-date-picker
          v-model="time"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
          value-format="yyyy-MM-dd hh:mm:ss"
        />
      </div>
      <el-button type="primary" icon="el-icon-search" @click="searchLogs">搜索</el-button>
    </div>
    <el-table
      v-loading="logListLoading"
      :data="logList"
      element-loading-text="获取日志数据中"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="ip" align="center" prop="ip" />
      <el-table-column label="url" align="center" prop="url" />
      <el-table-column label="接口名" align="center" prop="title" />
      <el-table-column label="操作人" align="center" prop="operatorEmail" />
      <el-table-column label="请求方法" align="center" prop="method" />
      <el-table-column label="params" align="center" prop="params" />
      <el-table-column label="type" align="center" prop="type" />
      <el-table-column label="请求时间" align="center">
        <template slot-scope="scope">
          {{ formatDate(scope.row.createTime) }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="url" align="center" width="100">
        <template slot-scope="scope">
          <img :src="scope.row.createTime">
        </template>
      </el-table-column> -->
    </el-table>
    <el-pagination
      background
      layout="total,prev, pager, next"
      :total="total"
      :page-size="pageSize"
      :current-page.sync="pageNum"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { getLogList } from './service'

export default {
  data() {
    return {
      logList: null,
      logListLoading: true,
      pageSize: 8,
      pageNum: 1,
      total: 0,
      title: '',
      operatorEmail: '',
      time: '',
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  created() {
    this.getLogs()
  },
  methods: {
    getLogs() {
      this.logListLoading = true
      getLogList({ pageSize: this.pageSize, pageNum: this.pageNum, title: this.title, operatorEmail: this.operatorEmail, startTime: this.time[0], endTime: this.time[1] }).then(response => {
        this.logList = response.data.data
        this.logListLoading = false
        this.total = response.data.total
      })
    },
    formatDate(date) {
      return this.$moment(date).format('YYYY-MM-DD HH:mm:ss')
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.getLogs()
    },
    searchLogs() {
      this.getLogs()
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
  .input-combination{
    display: flex;
    align-items: center;
    justify-content:space-between;
    margin-bottom: 10px;
    font-size: 14px;
    width: 1050px;
  }
  .el-input{
    width: 200px;
  }
</style>
