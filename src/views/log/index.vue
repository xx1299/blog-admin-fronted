<template>
  <div class="app-container">
    <div class="input-combination">
      <div>
        内容:
        <el-input
          v-model="title"
          placeholder="请输入内容"
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
      <div>
        类型:
        <el-select v-model="type" placeholder="请选择类型">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
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
      <el-table-column label="内容" align="center" prop="title" />
      <el-table-column label="操作人" align="center" prop="operatorEmail" />
      <el-table-column label="请求方法" align="center" prop="method" />
      <el-table-column label="请求参数" align="center" prop="params" />
      <el-table-column label="请求时间" align="center">
        <template slot-scope="scope">
          {{ formatDate(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button v-if="scope.row.error!==''" type="warning" @click="getErrorLog(scope)">异常日志</el-button>
          <el-button type="danger" @click="delLog(scope)">删除</el-button>
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
    <el-dialog
      title="错误日志"
      :visible.sync="errorLogVisible"
      :close-on-click-modal="false"
    >
      <p class="text" v-html="errorLog" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="errorLogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getLogList, delLog } from './service'
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
      errorLog: '',
      errorLogVisible: false,
      type: '',
      typeOptions: [{
        value: '1',
        label: '正常'
      }, {
        value: '0',
        label: '异常'
      }
      ],
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
      getLogList({ pageSize: this.pageSize, pageNum: this.pageNum, title: this.title, operatorEmail: this.operatorEmail, type: this.type, startTime: this.time[0], endTime: this.time[1] }).then(response => {
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
    },
    delLog(scope) {
      delLog(scope.row.id).then((response) => {
        this.getLogs()
      })
    },
    getErrorLog(scope) {
      this.errorLog = scope.row.error.replaceAll(/\r\n/g, '<br/>')
      console.log(this.errorLog)
      this.errorLogVisible = true
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
    width: 1300px;
  }
  .el-input{
    width: 200px;
  }
  .text{
    white-space: pre-wrap;
  }
</style>
