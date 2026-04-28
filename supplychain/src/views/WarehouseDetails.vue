<template>
  <el-container>
    <!-- 1. 顶部导航栏 (完全复用模板) -->
    <el-header>
      <div class="top-navbar">
        <!-- 1.1 左侧 Logo 区域 -->
        <div class="nav-left">
          <div class="logo-text">云仓 ERP</div>
        </div>
        <!-- 1.2 右侧 用户信息区域 -->
        <div class="nav-right">
          <div class="user-info">
            <!-- 头像 -->
            <el-avatar :size="32" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
            <!-- 用户名 -->
            <span class="username">hzh123</span>
          </div>
        </div>
      </div>
    </el-header>

    <!-- 2. 主体内容 -->
    <el-main>
      <el-container>
        <!-- 2.1 左侧菜单 (完全复用模板) -->
        <el-aside width="150px">
          <el-menu default-active="2" class="el-menu-vertical-demo">
            <el-sub-menu index="1">
              <template #title>
                <span>商品</span>
              </template>
              <el-menu-item index="1-1" @click="toProduct">商品信息</el-menu-item>
              <el-menu-item index="1-2" @click="toCategroy">分页管理</el-menu-item>
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
              <el-menu-item index="3-1" @click="towarehouse">仓库信息</el-menu-item>
              <el-menu-item index="3-2" @click="toDetails">仓库明细</el-menu-item>
              <el-menu-item index="3-2" @click="toLocation">库位信息</el-menu-item>
              <el-menu-item index="3-3" @click="toStocking">入库管理</el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-aside>

        <!-- 2.2 右侧展示区 -->
        <el-main>
          <!-- 2.2.1 页面标题 -->
          <el-container>
            <el-header>
              <h1 class="title">仓库明细</h1>
            </el-header>

            <el-main>
              <!-- 2.2.2 核心内容区 -->
              <div class="product-info-container">
                
                <!-- 顶部：仓库筛选区 -->
                <div class="warehouse-filter">
                  <label class="label_item">切换仓库：</label>
                  <el-select 
                    v-model="warehouseValue" 
                    filterable
                    placeholder="请选择仓库" 
                    style="width: 200px; margin-right: 20px;"
                    @change="handleWarehouseChange"
                  >
                    <el-option
                      v-for="item in warehouseOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </div>

                <!-- 中部：商品筛选区 -->
                <div class="search-section">
                  <div class="search-row">
                    <el-row :gutter="20" style="align-items: center;">
                      
                      <!-- 商品名称 -->
                      <el-col :span="6">
                        <div class="search-item">
                          <label class="label_item">商品名称：</label>
                          <el-input v-model="queryParams.name" placeholder="请输入名称" clearable />
                        </div>
                      </el-col>
                      
                      <!-- 商品编码 -->
                      <el-col :span="6">
                        <div class="search-item">
                          <label class="label_item">商品编码：</label>
                          <el-input v-model="queryParams.code" placeholder="请输入编码" clearable />
                        </div>
                      </el-col>
                      
                      <!-- 状态 -->
                      <el-col :span="6">
                        <div class="search-item">
                          <label class="label_item">状态：</label>
                          <el-select v-model="queryParams.status" placeholder="全部" clearable style="width: 120px">
                            <el-option label="上架" value="1" />
                            <el-option label="下架" value="0" />
                          </el-select>
                        </div>
                      </el-col>

                      <!-- 右侧：搜索与重置按钮 -->
                      <el-col :span="6">
                        <div class="search-buttons" style="margin-left: auto;">
                          <el-button type="primary" @click="handleSearch">搜索</el-button>
                          <el-button @click="resetForm">重置</el-button>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                </div>

                <!-- 下端：操作按钮区 -->
                <div class="action-section">
                  <!-- 批量删除按钮 -->
                  <el-button 
                    type="danger" 
                    @click="handleBatchDelete"
                    :disabled="multipleSelection.length === 0"
                    class="add-btn-section"
                  >
                    批量删除
                  </el-button>
                  
                  <!-- 新增商品按钮 (复用模板里的样式) -->
                  <el-button 
                    type="primary" 
                    @click="handleAdd"
                    class="add-btn-section"
                  >
                    新增商品
                  </el-button>
                  <el-button 
                    type="primary" 
                    @click="handleAdd"
                    class="add-btn-section"
                  >
                    设置预警
                  </el-button>
                </div>

                <!-- 表格展示区 -->
                <div class="table-section">
                  <el-table
                    :data="tableData"
                    stripe
                    style="width: 100%"
                    @selection-change="handleSelectionChange"
                  >
                    <!-- 多选框 -->
                    <el-table-column type="selection" width="55" align="center" />

                    <!-- 商品名称 -->
                    <el-table-column prop="name" label="商品名称" min-width="120" />
                    
                    <!-- 商品编码 -->
                    <el-table-column prop="code" label="商品编码" min-width="120" />
                    
                    <!-- 商品总数 -->
                    <el-table-column prop="total" label="商品总数" min-width="100" />
                    
                    <!-- 总量锁定数量 -->
                    <el-table-column prop="locked" label="锁定数量" min-width="100" />
                    
                    <!-- 在途数量 -->
                    <el-table-column prop="transit" label="在途数量" min-width="100" />
                    
                    <!-- 可用数量 -->
                    <el-table-column prop="available" label="可用数量" min-width="100" />
                    
                    <!-- 状态 (演示插槽用法) -->
                    <el-table-column prop="status" label="状态" min-width="100">
                      <template #default="scope">
                        <el-tag :type="scope.row.status === '上架' ? 'success' : 'info'">
                          {{ scope.row.status }}
                        </el-tag>
                      </template>
                    </el-table-column>
                    
                    <!-- 库存成本 -->
                    <el-table-column prop="cost" label="库存成本" min-width="100" />
                    
                    <!-- 操作 (插槽插入编辑/删除) -->
                    <el-table-column label="操作" width="150" align="center" fixed="right">
                      <template #default="scope">
                        <el-button type="text" class="btn-text" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button type="text" class="btn-text-danger" @click="handleDelete(scope.row)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>

                <!-- 分页按钮 (完全复用模板样式) -->
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
            </el-main>
          </el-container>
        </el-main>
      </el-container>
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from "element-plus"
import { useRouter } from 'vue-router'

// --- 数据定义 ---
const currentPage = ref(1)
const pageSize = ref(10)
const router = useRouter()
// 1. 仓库筛选数据
const warehouseValue = ref('')
const warehouseOptions = [
  { value: 'WH001', label: '上海中心仓' },
  { value: 'WH002', label: '北京华北仓' },
  { value: 'WH003', label: '广州华南仓' }
]

// 2. 商品筛选表单
const queryParams = reactive({
  name: '',
  code: '',
  status: ''
})

// 3. 表格数据与多选
const multipleSelection = ref([])
const tableData = ref([
  { id: 1, name: 'iPhone 15', code: 'P001', total: 100, locked: 10, transit: 20, available: 70, status: '上架', cost: '¥5999' },
  { id: 2, name: 'MacBook Pro', code: 'P002', total: 50, locked: 5, transit: 0, available: 45, status: '上架', cost: '¥12999' },
  { id: 3, name: 'AirPods', code: 'P003', total: 200, locked: 0, transit: 50, available: 150, status: '下架', cost: '¥1299' }
])

function toProduct() {
  router.push({ name: 'product' })
}

function toCategroy() {
  router.push({ name: 'categroy' })
}
function towarehouse() {
  router.push({ name: 'warehouse' })
}function toDetails(){
router.push({name:'details'})
}
function toLocation(){
router.push({name:'location'})
}
function toStocking(){
router.push({name:'stocking'})
}
// 仓库切换
const handleWarehouseChange = (val: string) => {
  console.log('切换仓库ID:', val)
  // 这里发送请求跳转或刷新数据
}

// 搜索
const handleSearch = () => {
  console.log('搜索条件:', queryParams)
  // 调用接口刷新表格
}

// 重置
const resetForm = () => {
  queryParams.name = ''
  queryParams.code = ''
  queryParams.status = ''
  // 重新加载数据
}

// 多选变化
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val
}

// 批量删除
const handleBatchDelete = () => {
  ElMessageBox.confirm(`确定要删除选中的 ${multipleSelection.value.length} 项吗？`, '警告', {
    type: 'warning'
  }).then(() => {
    // 执行删除逻辑
    ElMessage.success('删除成功')
  })
}

// 新增
const handleAdd = () => {
  ElMessage.info('点击了新增商品')
}

// 编辑
const handleEdit = (row: any) => {
  ElMessage.info(`编辑商品: ${row.name}`)
}

// 删除单行
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定删除商品 ${row.name} 吗？`, '警告', {
    type: 'warning'
  }).then(() => {
    // 执行删除逻辑
    ElMessage.success('删除成功')
  })
}
onMounted(() => {
  // 获取仓库列表数据
  // 获取商品列表数据
})
</script>

<style scoped>
/* 以下样式均严格保留模板中的定义 */

/* 顶部导航样式 */
.top-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  background-color: #409EFF;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 筛选区样式 */
.product-info-container {
  padding: 20px;
  background-color: #f5f7fa;
  font-family: Arial, sans-serif;
}

/* 按钮区样式 */
.action-section {
  display: flex;
  gap: 10px;
  margin-top: 50px;
}

/* 导航栏文字样式 */
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
h1 {
  margin: 20px 0;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}

/* 搜索区域样式 */
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

/* 表格样式 */
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

/* 按钮文本样式 */
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

.btn-text-danger {
  background: none;
  border: none;
  color: #f56c6c;
  cursor: pointer;
  padding: 4px 8px;
  font-size: 14px;
}

.btn-text-danger:hover {
  color: #f78989;
}

.demo-pagination-block {
  margin-top: 20px;
  padding: 10px;
  background: #fff;
  display: flex;
  justify-content: center;
}

/* 新增按钮样式 (复用模板) */
.add-btn-section {
  padding: 10px 20px;
  background-color: white;
  color: #606266;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
  Display: flex;
  margin-bottom: 30px;
}

.add-btn-section:hover {
  color: #409eff;
  border-color: #c6e2ff;
  background-color: #ecf5ff;
}

.title {
  display: flex;
  font-size: 33px;
  margin-bottom: 100px;
}

/* 仓库筛选区的特殊样式 */
.warehouse-filter {
  display: flex;
  align-items: center;
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-top: -20px; /* 微调位置，使其紧贴下方卡片 */
}
.el-menu-item:hover {
  background-color: #66b1ff;
}
</style>