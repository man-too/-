<template>
  <el-container>
    <!-- 1. 顶部导航栏 -->
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
        <!-- 2.1 左侧菜单 -->
        <el-aside width="150px">
          <el-menu default-active="2" class="el-menu-vertical-demo">
            <el-sub-menu index="1">
              <template #title> <span>商品</span> </template>
              <el-menu-item index="1-1" @click="toProduct">商品信息</el-menu-item>
              <el-menu-item index="1-2" @click="toCategroy">分页管理</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="2">
              <template #title> <span>订单</span> </template>
              <el-menu-item index="2-1">订单信息</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="3">
              <template #title> <span>仓库</span> </template>
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
              <h1 class="title">分类管理</h1>
            </el-header>
            <el-main>
              <!-- 2.2.2 搜索筛选区 (优化版) -->
              <div class="product-info-container">
                <div class="search-section">
                  <el-row :gutter="20" style="align-items: center; margin-bottom: 20px;">
                    
                    <!-- 1. 搜索输入框 -->
                    <el-col :span="6">
                      <div class="search-item">
                        <label class="label_item">分类搜索:</label>
                        <el-input
                          v-model="searchKeyword"
                          placeholder="输入关键词搜索分类"
                        />
                      </div>
                    </el-col>

                    <!-- 2. 搜索和重置按钮 -->
                    <el-col :span="6">
                      <div class="search-buttons">
                        <el-button type="primary" @click="handleSearch">搜索</el-button>
                        <el-button @click="resetForm">重置</el-button>
                      </div>
                    </el-col>

                    <!-- 3. 操作按钮组 -->
                    <el-col :span="12" style="display: flex; justify-content: flex-end; gap: 10px;">
                      <!-- 新增分类按钮 -->
                      <el-button 
                        type="primary" 
                        @click="openAddDialog"
                        class="btn-secondary"
                      >
                        新增分类
                      </el-button>
                      
                      <!-- 批量删除按钮 -->
                      <el-button 
                        type="danger" 
                        @click="handleBatchDelete"
                        :disabled="multipleSelection.length === 0"
                        class="btn-secondary"
                      >
                        批量删除
                      </el-button>
                    </el-col>
                  </el-row>
                </div>

                <!-- 父类子类切换按钮 (放在表格上方) -->
                <div class="action-section">
                  <button class="add-btn-section" @click="switchTab('parent')">上级分类</button>
                  <button class="add-btn-section" @click="switchTab('child')">分类名称</button>
                </div>

                <!-- 2.2.4 表格区域 (优化版) -->
                <div class="table-section">
                  
                  <!-- 父类表格 -->
                  <el-table
                    v-if="activeTab === 'parent'"
                    :data="parentTableData"
                    style="width: 100%"
                    max-height="500"
                    @selection-change="handleSelectionChange"
                    :row-class-name="tableRowClassName"
                  >
                    <!-- 多选框 -->
                    <el-table-column type="selection" width="55" />
                    <el-table-column prop="categoryName" label="分类名称" min-width="180" />
                    
                    <!-- 状态列 (使用 Switch) -->
                    <el-table-column label="状态" min-width="180">
                      <template #default="scope">
                        <el-switch
                            v-model="scope.row.status"
                            active-value="启用"
                            inactive-value="禁用"
                            @change="(val:any) => toggleStatus(scope.row, val === '启用' ? 1 : 0)"
                          />
                      </template>
                    </el-table-column>
                    
                    <el-table-column prop="updateTime" label="更新时间" min-width="180" />
                    
                    <!-- 操作列 -->
                    <el-table-column label="操作" width="220">
                      <template #default="scope">
                        <el-button class="btn-text" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button class="btn-text-danger" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>

                  <!-- 子类表格 -->
                  <el-table
                    v-if="activeTab === 'child'"
                    :data="childTableData"
                    style="width: 100%"
                    max-height="500"
                    @selection-change="handleSelectionChange"
                    :row-class-name="tableRowClassName"
                  >
                    <!-- 多选框 -->
                    <el-table-column type="selection" width="55" />
                    <el-table-column prop="parentCategoryName" label="上级分类" min-width="180" />
                    <el-table-column prop="categoryName" label="分类名称" min-width="180" />
                    
                    <!-- 状态列 -->
                    <el-table-column label="状态" min-width="180">
                      <template #default="scope">
                        <el-switch
                          v-model="scope.row.status"
                          active-value="启用"
                          inactive-value="禁用"
                          @change="(val:any) => toggleStatus(scope.row, val === '启用' ? 1 : 0)"
                        />

                      </template>
                    </el-table-column>
                    
                    <el-table-column prop="updateTime" label="更新时间" min-width="180" />
                    
                    <!-- 操作列 -->
                    <el-table-column label="操作" width="220" fixed="right">
                      <template #default="scope">
                        <el-button class="btn-text" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button class="btn-text-danger" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>

                  <!-- 分页组件 -->
                  <div class="demo-pagination-block">
                    <el-pagination
                      v-model:current-page="currentPage"
                      v-model:page-size="pageSize"
                      :page-sizes="[10, 20, 50, 100]"
                      :size="size"
                      :disabled="disabled"
                      :background="background"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="totalRecords"
                      @current-change="loadCategoryData"
                      @size-change="handleSizeChange"
                    />
                  </div>
                </div>

                <!-- 2.2.6 弹窗 (保留原样) -->
                <el-dialog v-model="dialogVisible" :title="isEditing ? '编辑分类' : '添加分类'" width="500">
                  <el-form :model="categoryForm" label-width="auto">
                    <el-form-item label="分类名称">
                      <el-input v-model="categoryForm.categoryName" placeholder="请输入分类名称" />
                    </el-form-item>
                    <el-form-item label="上级分类" v-if="!isEditing || activeTab === 'child'">
                      <el-select v-model="categoryForm.parentId" placeholder="请选择上级分类" style="width: 100%;">
                        <el-option 
                          v-for="item in parentcategorylist" 
                          :key="item.id" 
                          :label="item.categoryName" 
                          :value="item.id" 
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="状态">
                      <el-select v-model="categoryForm.status" placeholder="请选择状态">
                        <el-option label="启用" :value="1"></el-option>
                        <el-option label="禁用" :value="0"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-form>
                  <template #footer>
                    <div class="dialog-footer">
                      <el-button @click="dialogVisible = false">取消</el-button>
                      <el-button type="primary" @click="saveCategory">确定</el-button>
                    </div>
                  </template>
                </el-dialog>
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
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from "element-plus"
import type { ComponentSize } from 'element-plus'
import api from '../apis/分类管理'

const currentPage = ref(1)
const pageSize = ref(10)
const totalRecords = ref(0)
const dialogVisible = ref(false)
const searchKeyword = ref('')
const isEditing = ref(false)
const size = ref<ComponentSize>('default')
const background = ref(false)
const disabled = ref(false)

const parentcategorylist = ref<any[]>([])
const soncategorylist = ref<any[]>([])

const activeTab = ref('parent')
const parentTableData = ref<any[]>([])
const childTableData = ref<any[]>([])
const multipleSelection = ref<any[]>([])

const categoryForm = reactive({
  id: '',
  categoryName: '',
  parentId: '',
  status: 1,
})

onMounted(async () => {
  await loadCategoryData()
})

const router = useRouter()

function toProduct() {
  router.push({ name: 'product' })
}

function toCategroy() {
  router.push({ name: 'categroy' })
}
function towarehouse() {
  router.push({ name: 'warehouse' })
}
function toDetails(){
router.push({name:'details'})
}
function toLocation(){
router.push({name:'location'})
}
function toStocking(){
router.push({name:'stocking'})
}
async function loadCategoryData() {
  if (activeTab.value === 'parent') {
    await fetchParentCategories()
  } else {
    await fetchSonCategories()
  }
}

async function fetchParentCategories() {
  try {
    console.log('正在请求父级分类数据...');
    const res = await api.getparentcategory({
      page: currentPage.value,
      pageSize: pageSize.value,
      categoryName: searchKeyword.value || undefined
    })
    console.log('API响应:', res);
    
    const dataArray = res.data.array || []
    parentcategorylist.value = dataArray
    parentTableData.value = dataArray.map((item: any) => ({
      ...item,
      status: item.status === 1 ? '启用' : '禁用',
      updateTime: item.updateTime
    }))
    totalRecords.value = dataArray.length
    ElMessage.success('父级分类数据加载成功');
  } catch (error: any) {
    console.error('获取父级分类数据失败:', error);
  }
}

async function fetchSonCategories() {
  try {
    console.log('正在请求子级分类数据...');
    const res = await api.getsoncategory({
      page: currentPage.value,
      pageSize: pageSize.value,
      categoryName: searchKeyword.value || undefined
    })
    console.log('API响应:', res);
    
    const dataArray = res.data.array || []
    soncategorylist.value = dataArray
    childTableData.value = dataArray.map((item: any) => ({
      ...item,
      status: item.status === 1 ? '启用' : '禁用',
      parentCategoryName: item.parentName || '无',
      updateTime: item.updateTime
    }))
    totalRecords.value = dataArray.length
    ElMessage.success('子级分类数据加载成功');
  } catch (error: any) {
    console.error('获取子级分类数据失败:', error);
  }
}

async function handleSearch() {
  currentPage.value = 1
  await loadCategoryData()
}

function resetForm() {
  searchKeyword.value = ''
  currentPage.value = 1
  multipleSelection.value = []
  loadCategoryData()
}

async function switchTab(tab: string) {
  activeTab.value = tab
  currentPage.value = 1
  multipleSelection.value = []
  await loadCategoryData()
}

async function handleBatchDelete() {
  if (multipleSelection.value.length === 0) {
    ElMessage.warning('请先选择要删除的分类')
    return
  }

  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${multipleSelection.value.length} 个分类吗?`,
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    const ids = multipleSelection.value.map(item => item.id).join(',')
    await api.deletecategory(ids)
    
    ElMessage.success('删除成功')
    await loadCategoryData()
    multipleSelection.value = []
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('删除操作失败')
    }
  }
}

async function handleDelete(row: any) {
  try {
    await ElMessageBox.confirm(
      `确定要删除分类 "${row.categoryName}" 吗?`,
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    await api.deletecategory(row.id.toString())
    ElMessage.success('删除成功')
    await loadCategoryData()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('删除操作失败')
    }
  }
}

function handleSelectionChange(val: any[]) {
  multipleSelection.value = val
}

async function toggleStatus(row: any, newStatusValue: number) {
  const currentStatus = row.status
  const newStatusText = newStatusValue === 1 ? '启用' : '禁用'
  
  try {
    await api.editstatus(newStatusValue, Number(row.id))
    row.status = newStatusText
    ElMessage.success(`分类 "${row.categoryName}" 状态已更新为 ${newStatusText}`)
  } catch (error: any) {
    row.status = currentStatus
    ElMessage.error(error.message || '状态更新失败')
  }
}

async function handleEdit(row: any) {
  isEditing.value = true
  dialogVisible.value = true
  Object.assign(categoryForm, {
    id: row.id,
    categoryName: row.categoryName,
    parentId: row.parentId || '',
    status: row.status === '启用' ? 1 : 0
  })
}

function openAddDialog() {
  isEditing.value = false
  dialogVisible.value = true
  Object.assign(categoryForm, {
    id: '',
    categoryName: '',
    parentId: activeTab.value === 'child' ? '' : undefined,
    status: 1
  })
}

async function saveCategory() {
  if (!categoryForm.categoryName) {
    ElMessage.warning('请输入分类名称')
    return
  }

  if (activeTab.value === 'child' && !categoryForm.parentId) {
    ElMessage.warning('请选择上级分类')
    return
  }

  try {
    const submitData: any = {
      categoryName: categoryForm.categoryName,
    }

    if (isEditing.value) {
      submitData.id = Number(categoryForm.id)
      submitData.status = categoryForm.status
    }

    if (activeTab.value === 'child' || categoryForm.parentId) {
      submitData.parentId = Number(categoryForm.parentId)
    }

    if (isEditing.value) {
      await api.editcategory(submitData)
      ElMessage.success('编辑成功')
    } else {
      await api.addcategory(submitData)
      ElMessage.success('添加成功')
    }
    
    dialogVisible.value = false
    Object.assign(categoryForm, {
      id: '',
      categoryName: '',
      parentId: '',
      status: 1
    })
    await loadCategoryData()
  } catch (error: any) {
    console.error('保存分类失败:', error);
    ElMessage.error(error.message || '操作失败')
  }
}

function tableRowClassName({ row }: { row: any }) {
  if (row.status === '禁用') {
    return 'disabled-row'
  }
  return ''
}

function handleSizeChange() {
  currentPage.value = 1
  loadCategoryData()
}
</script>

<style scoped>
.top-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  background-color: #409EFF;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.product-info-container {
  padding: 20px;
  background-color: #f5f7fa;
  font-family: Arial, sans-serif;
}

.action-section {
  display: flex;
  gap: 10px;
  margin-top: 50px;
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

h1 {
  margin: 20px 0;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
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

.add-btn-section {
  padding: 7px 20px;
  background-color: white;
  color: #606266;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
  display: flex;
  margin-bottom: 5px;
  margin-right: -5px;
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

.disabled-row {
  opacity: 0.6;
}
.btn-secondary {
  padding: 10px 20px;
  background-color: white;
  color: #606266;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.btn-secondary:hover {
  color: #409eff;
  border-color: #c6e2ff;
  background-color: #ecf5ff;
}
.el-menu-item:hover {
  background-color: #66b1ff;}

</style>