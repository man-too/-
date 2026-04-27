<template>
  <el-container>
    <!-- 1. 顶部导航栏 (沿用模板) -->
    <el-header>
      <div class="top-navbar">
        <div class="nav-left">
          <div class="logo-text">云仓 ERP</div>
        </div>
        <div class="nav-right">
          <div class="user-info">
            <el-avatar :size="32" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
            <span class="username">hzh123</span>
          </div>
        </div>
      </div>
    </el-header>

    <!-- 2. 主体内容 -->
    <el-main>
      <el-container>
        <!-- 2.1 左侧菜单 (沿用模板) -->
        <el-aside>
          <el-menu default-active="3" class="el-menu-vertical-demo">
            <el-sub-menu index="1">
              <template #title>
                <span>商品</span>
              </template>
              <el-menu-item index="1-1">商品信息</el-menu-item>
              <el-menu-item index="1-2">分页管理</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="2">
              <template #title>
                <span>订单</span>
              </template>
              <el-menu-item index="2-1">订单信息</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="3">
              <template #title>
                <span>仓库</span>
              </template>
              <el-menu-item index="3-1">仓库信息</el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-aside>

        <!-- 2.2 右侧展示区 -->
        <el-main>
          <el-container>
            <!-- 2.2.1 页面标题 -->
            <el-header>
              <h1 class="title">仓库管理</h1>
            </el-header>

            <!-- 2.2.2 搜索筛选区 -->
            <el-main>
              <div class="product-info-container">
                <div class="search-section">
                  <div class="search-row">
                    <el-row :gutter="20" style="align-items: center;">
                      <!-- 仓库字段 (下拉框+输入双重) -->
                      <el-col :span="6">
                        <div class="search-item">
                          <label class="label_item">仓库:</label>
                          <el-select 
                            v-model="searchForm.warehouse" 
                            filterable 
                            placeholder="请选择或输入仓库" 
                            style="width: 100%;"
                          >
                            <el-option label="华东仓" value="hd" />
                            <el-option label="华南仓" value="hn" />
                            <el-option label="华北仓" value="hb" />
                          </el-select>
                        </div>
                      </el-col>

                      <!-- 管理员字段 (输入框) -->
                      <el-col :span="6">
                        <div class="search-item">
                          <label class="label_item">管理员:</label>
                          <el-input v-model="searchForm.manager" placeholder="请输入管理员" clearable />
                        </div>
                      </el-col>

                      <!-- 搜索按钮占位 (为了保持布局对齐) -->
                      <el-col :span="6">
                        <div class="search-buttons">
                          <!-- 这里留空或放置其他按钮，主要操作在下方 action-section -->
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                </div>

                <!-- 2.2.3 功能按钮区 (新建/批量删除) -->
                <div class="action-section">
                  <el-button class="add-btn-section" type="primary" @click="handleCreate">
                    新建仓库
                  </el-button>
                  <el-button class="add-btn-section" type="primary" @click="handleBatchDelete">
                    批量删除
                  </el-button>
                </div>

                <!-- 2.2.4 表格展示区 -->
                <div class="table-section">
                  <el-table stripe style="width: 100%" :data="tableData" max-height="500px" class="product-table">
                    <el-table-column prop="name" label="仓库名称" min-width="180" />
                    <el-table-column prop="address" label="仓库地址" min-width="180" />
                    <el-table-column prop="capacity" label="容量" min-width="180" />
                    <el-table-column prop="status" label="状态" min-width="180" />
                    <el-table-column prop="manager" label="管理员" min-width="180" />
                    <el-table-column prop="createTime" label="创建时间" min-width="180" />
                    <el-table-column prop="updateTime" label="更新时间" min-width="180" />
                    <el-table-column label="操作" width="180">
                      <template #default="scope">
                        <button class="btn-text" @click="handleView(scope.row)">操作</button>
                        <button class="btn-text" @click="handleEdit(scope.row)">编辑</button>
                      </template>
                    </el-table-column>
                  </el-table>

                  <!-- 2.2.5 分页组件 -->
                  <div class="demo-pagination-block" style="margin-top: 20px; padding: 10px; background: #fff;">
                    <el-pagination
                      v-model:current-page="currentPage"
                      v-model:page-size="pageSize"
                      :page-sizes="[10, 20, 50, 100]"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="100"
                    />
                  </div>
                </div>
              </div>
            </el-main>
          </el-container>
        </el-main>
      </el-container>
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'

// --- 数据定义 (模拟数据) ---
const currentPage = ref(1)
const pageSize = ref(10)

// 搜索表单数据
const searchForm = reactive({
  warehouse: '',
  manager: ''
})

// 表格模拟数据
const tableData = ref([
  {
    name: '华东中心仓',
    address: '上海市浦东新区XX路100号',
    capacity: '50000',
    status: '启用',
    manager: '张三',
    createTime: '2023-01-10 12:00:00',
    updateTime: '2023-05-20 15:30:00'
  },
  {
    name: '华南分拨仓',
    address: '广州市天河区YY路88号',
    capacity: '30000',
    status: '启用',
    manager: '李四',
    createTime: '2023-02-15 09:00:00',
    updateTime: '2023-06-01 10:00:00'
  }
])

// --- 方法定义 (仅保留基础定义) ---
const handleCreate = () => {
  console.log('新建仓库')
}
const handleBatchDelete = () => {
  console.log('批量删除')
}
const handleView = (row: any) => {
  console.log('操作:', row)
}
const handleEdit = (row: any) => {
  console.log('编辑:', row)
}
</script>

<style scoped>
/* 顶部导航样式 (沿用模板) */
.top-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  background-color: #409EFF;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.nav-left .logo-text {
  color: #fff;
  font-size: 22px;
  font-weight: bold;
  letter-spacing: 2px;
  cursor: pointer;
}
.nav-right .user-info {
  display: flex;
  align-items: center;
  color: #fff;
  gap: 10px;
  cursor: pointer;
}
.username {
  font-size: 14px;
  font-weight: 500;
}

/* 标题样式 */
.title {
  display: flex;
  font-size: 33px;
  margin-bottom: 100px;
}

/* 筛选区样式 (沿用模板) */
.product-info-container {
  padding: 20px;
  background-color: #f5f7fa;
  font-family: Arial, sans-serif;
}
.search-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.search-item {
  display: flex;
  align-items: center;
}
.label_item {
  width: 80px;
  flex-shrink: 0;
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}
.search-buttons {
  display: flex;
  gap: 10px;
}

/* 按钮区样式 (沿用模板) */
.action-section {
  display: flex;
  gap: 10px;
  margin-top: 50px;
}

/* 表格样式 (沿用模板) */
.table-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.product-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
.product-table th,
.product-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #ebeef5;
}
.product-table th {
  font-weight: 600;
  color: #303133;
}
.btn-text {
  background: none;
  border: none;
  color: #409eff;
  cursor: pointer;
  padding: 4px 8px;
  font-size: 14px;
}
.btn-text:hover {
  color: #66b1ff;
}

/* 新增按钮样式 (沿用模板) */
.add-btn-section {
  padding: 10px 20px;
  background-color: white;
  color: #606266;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}
.add-btn-section:hover {
  color: #409eff;
  border-color: #c6e2ff;
  background-color: #ecf5ff;
}
</style>





<template #default="scope">
  <el-tooltip :content="'Switch value: ' + value" placement="top">
    <el-switch
      v-model="value"
      style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
      active-value="100"
      inactive-value="0"
    />
  </el-tooltip>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value = ref('100')
</script>
