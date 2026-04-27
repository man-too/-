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
              <el-menu-item index="3-3" @click="toLocation">仓库信息</el-menu-item>
              <el-menu-item index="3-3" @click="toStocking">入库管理</el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-aside>

        <!-- 2.2 右侧展示区 -->
        <el-main>
          <!-- 2.2.1 页面标题 -->
          <el-container>
            <el-header>
              <h1 class="title">库位管理</h1>
            </el-header>

            <el-main>
              <!-- 2.2.2 核心内容区 -->
              <div class="product-info-container">
                
                <!-- 顶部：仓库筛选区 -->
                <!-- 模板中要求：点击发送请求，下拉或直接输入 -->
                <div class="warehouse-filter">
                  <label class="label_item">切换仓库：</label>
                  <el-select 
                    v-model="warehouseValue" 
                    filterable 
                    placeholder="请选择或输入仓库" 
                    style="width: 240px;"
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

                <!-- 中部：库位筛选区 -->
                <div class="search-section">
                  <div class="search-row">
                    <el-row :gutter="20" style="align-items: center;">
                      
                      <!-- 库位编码 (Input) -->
                      <el-col :span="6">
                        <div class="search-item">
                          <label class="label_item">库位编码：</label>
                          <el-input v-model="queryParams.code" placeholder="请输入库位编码" clearable />
                        </div>
                      </el-col>
                      
                      <!-- 类型 (Select) -->
                      <el-col :span="6">
                        <div class="search-item">
                          <label class="label_item">类&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型：</label>
                          <el-select v-model="queryParams.type" placeholder="全部类型" clearable style="width: 100%">
                            <el-option label="普通区" value="1" />
                            <el-option label="冷冻区" value="2" />
                            <el-option label="贵重品区" value="3" />
                          </el-select>
                        </div>
                      </el-col>
                      
                      <!-- 状态 (Select) -->
                      <el-col :span="6">
                        <div class="search-item">
                          <label class="label_item">状&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;态：</label>
                          <el-select v-model="queryParams.status" placeholder="全部" clearable style="width: 100%">
                            <el-option label="启用" value="1" />
                            <el-option label="禁用" value="0" />
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
                  
                  <!-- 新增库位按钮 (复用模板里的样式) -->
                  <el-button 
                    type="primary" 
                    @click="handleAdd"
                    class="add-btn-section"
                  >
                    新增库位
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

                    <!-- 库位编码 -->
                    <el-table-column prop="code" label="库位编码" min-width="140" />
                    
                    <!-- 总容量 -->
                    <el-table-column prop="totalCapacity" label="总容量" min-width="100" />
                    
                    <!-- 已使用 -->
                    <el-table-column prop="usedCapacity" label="已使用" min-width="100" />
                    
                    <!-- 状态 -->
                    <el-table-column prop="status" label="状态" min-width="100">
                      <template #default="scope">
                        <el-tag :type="scope.row.status === '启用' ? 'success' : 'info'">
                          {{ scope.row.status }}
                        </el-tag>
                      </template>
                    </el-table-column>
                    
                    <!-- 操作 (插槽插入编辑/删除) -->
                    <el-table-column label="操作" width="200" align="center" fixed="right">
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
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/apis/Warehouse Manager'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()

// --- 状态定义 ---
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0) 
const searchForm = reactive({
  warehouseName: '',
  adress: '',
  managerId: 0,
})

const tableData = ref<any[]>([])
const multipleSelection = ref<any[]>([])

// --- 核心逻辑 ---

const fetchData = async () => {
  try {
    const res = await api.getPage({
      page: currentPage.value,
      pageSize: pageSize.value,
      warehouseName: searchForm.warehouseName,
      adress: searchForm.adress,
      managerId:searchForm.managerId
    })

    if (res.code === 1 && res.data) {
      tableData.value = res.data.array.map((item: any) => ({
        id: item.id,
        name: item.warehouseName,
        address: item.address,
        capacity: item.capacity,
        status: item.status === 1 ? '启用' : '禁用',
        manager: item.managerName,
        updateTime: item.updateTime
      }))
      total.value = res.data.array.length
    }
  } catch (error) {
    ElMessage.error('数据加载失败')
    tableData.value = []
  }
}

const handleSearch = () => {
  currentPage.value = 1
  fetchData()
}

const resetForm = () => {
  searchForm.warehouseName = ''
  searchForm.adress = ''
  handleSearch()
}

const handleSelectionChange = (val: any[]) => {
  multipleSelection.value = val
}

// 状态切换
const toggleStatus = async (row: any) => {
  const targetStatus = row.status === '启用' ? 0 : 1
  try {
    await api.changeStatus(targetStatus, row.id)
    row.status = targetStatus === 1 ? '启用' : '禁用'
    ElMessage.success('操作成功')
  } catch (error) {
    ElMessage.error('操作失败')
    row.status = row.status === '启用' ? '禁用' : '启用'
  }
}

// 删除
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定删除 "${row.name}" 吗？`, '提示', { type: 'warning' })
    .then(async () => {
      await api.delete(row.id.toString())
      ElMessage.success('删除成功')
      fetchData()
    })
    .catch(() => {})
}

// 批量删除
const handleBatchDelete = () => {
  if (multipleSelection.value.length === 0) {
    ElMessage.warning('请先选择数据')
    return
  }
  ElMessageBox.confirm(`确定删除选中的 ${multipleSelection.value.length} 项吗？`, '提示', { type: 'warning' })
    .then(async () => {
      const ids = multipleSelection.value.map(item => item.id).join(',')
      await api.delete(ids)
      ElMessage.success('批量删除成功')
      fetchData()
    })
    .catch(() => {})
}

// 路由跳转 (严格匹配 index.ts 中的 name)
const toProduct = () => router.push({ name: 'product' })
const toCategroy = () => router.push({ name: 'categroy' })
const towarehouse = () => router.push({ name: 'warehouse' })
const toDetails = () => router.push({ name: 'details' })
const toLocation = () => router.push({ name: 'location' })
const toStocking = () => router.push({ name: 'stocking' })

onMounted(() => {
  fetchData()
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
  margin-bottom: 20px;
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
  background-color: #66b1ff;}
  
</style>