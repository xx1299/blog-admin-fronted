<template>
  <div class="app-container">
    <el-table
      v-loading="articleListLoading"
      :data="articleList"
      element-loading-text="获取文章数据中"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="内容" align="center" prop="content" />
      <el-table-column label="作者" align="center" prop="userId" />
      <el-table-column label="发表时间" align="center">
        <template slot-scope="scope">
          {{ formatDate(scope.row.releaseTime) }}
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
  </div>
</template>

<script>
import { getArticleList } from './service'

export default {
  data() {
    return {
      articleList: null,
      articleListLoading: true,
      pageSize: 8,
      pageNum: 1,
      total: 0
    }
  },
  created() {
    this.getArticles()
  },
  methods: {
    getArticles() {
      this.articleListLoading = true
      getArticleList({ pageSize: this.pageSize, pageNum: this.pageNum }).then(response => {
        this.articleList = response.data.data
        this.articleListLoading = false
        this.total = response.data.total
      })
    },
    formatDate(date) {
      return this.$moment(date).format('YYYY-MM-DD HH:mm:ss')
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
