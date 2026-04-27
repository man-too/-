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
        <el-aside width="150px">
          <el-menu default-active="3" class="el-menu-vertical-demo">
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
              <el-menu-item index="3-3" @click="toLocation">库位信息</el-menu-item>
              <el-menu-item index="3-3" @click="toStocking">入库管理</el-menu-item>
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
                          <el-input
                            v-model="queryParams.warehouseName" 
                            filterable 
                            placeholder="请选择或输入仓库" 
                            style="width: 100%;"
                          >
                          </el-input>
                        </div>
                      </el-col>

                      <!-- 管理员字段 (输入框) -->
                      <el-col :span="6">
                        <div class="search-item">
                          <label class="label_item">管理员id:</label>
                          <el-input v-model="queryParams.managerId" placeholder="请输入管理员id" clearable />
                        </div>
                      </el-col>
                      <el-col :span="6">
                        <div class="search-item">
                          <label class="label_item">地址:</label>
                          <el-input v-model="queryParams.address" placeholder="请输入仓库地址" clearable />
                        </div>
                      </el-col>

                      <!-- 搜索按钮占位 (为了保持布局对齐) -->
                      <el-col :span="6">
                        <div class="search-buttons" style="margin-left: auto;">
                          <el-button type="primary" @click="handleSearch">搜索</el-button>
                          <el-button @click="resetForm">重置</el-button>
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
                  <el-table stripe style="width: 100%" :data="warehouseList" max-height="500px" class="product-table"
                  @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" />
                    <el-table-column prop="warehouseName" label="仓库名称" min-width="180" />
                    <el-table-column prop="address" label="仓库地址" min-width="300" />
                    <el-table-column prop="capacity" label="容量" min-width="180" />
                    <el-table-column prop="status" label="状态" min-width="180">
                        <template #default="scope">
                            <el-switch
                            v-model="scope.row.status"
                            :active-value=1
                            :inactive-value=0
                            @change="toggleStatus(scope.row)"
                            />
                        </template>
                    </el-table-column>
                    <el-table-column prop="managerName" label="管理员" min-width="180" />
                    <el-table-column prop="createTime" label="创建时间" min-width="180" />
                    <el-table-column prop="updateTime" label="更新时间" min-width="180" />
                    <el-table-column label="操作" width="200" align="center" fixed="right">
                      <template #default="scope">
                        <button class="btn-text" @click="handleEdit(scope.row)">编辑</button>
                        <button class="btn-text-danger" @click="handleDelete(scope.row)">删除</button>
                      </template>
                    </el-table-column>
                  </el-table>
                        <!-- 新增仓库 Dialog 弹窗 -->
                  <el-dialog
                    v-model="dialogVisible"
                    title="新增仓库"
                    width="500px"
                    :close-on-click-modal="false"
                    destroy-on-close
                  >
                    <el-form
                      :model="createForm"
                      :rules="rules"
                      ref="createFormRef"
                      label-width="90px"
                      style="padding-right: 40px;"
                    >
                      <!-- 仓库名称 -->
                      <el-form-item label="仓库名称" prop="warehouseName">
                        <el-input v-model="createForm.warehouseName" placeholder="请输入仓库名称" />
                      </el-form-item>

                      <!-- 仓库地址 -->
                      <el-form-item label="仓库地址" prop="address">
                        <el-input v-model="createForm.address" placeholder="请输入仓库地址" />
                      </el-form-item>

                      <!-- 管理员 -->
                      <el-form-item label="管理员" prop="managerId">
                        <el-select v-model="createForm.managerId" placeholder="请选择管理员" @visible-change="getManagerList">
                          <el-option v-for="item in managerList"
                           :key="item.id" 
                           :label="item.name" 
                           :value="item.id" />
                        </el-select>
                      </el-form-item>

                      <!-- 仓库体积 -->
                      <el-form-item label="仓库体积" prop="capacity">
                        <el-input v-model.number="createForm.capacity" placeholder="请输入仓库体积" type="number">
                          <template #append> m³ </template>
                        </el-input>
                      </el-form-item>
                    </el-form>

                    <template #footer>
                      <span class="dialog-footer">
                        <el-button @click="cancelcreate">取消</el-button>
                        <el-button type="primary" @click="submitForm">确定新增</el-button>
                      </span>
                    </template>
                  </el-dialog>
                  <el-dialog
                    v-model="dialogVisible1"
                    title="编辑仓库"
                    width="500px"
                    :close-on-click-modal="false"
                    destroy-on-close
                  >
                    <el-form
                      :model="editForm"
                      :rules="rules"
                      ref="createFormRef"
                      label-width="90px"
                      style="padding-right: 40px;"
                    >
                      <!-- 仓库名称 -->
                      <el-form-item label="仓库名称" prop="warehouseName">
                        <el-input v-model="editForm.warehouseName" placeholder="请输入仓库名称" />
                      </el-form-item>

                      <!-- 仓库地址 -->
                      <el-form-item label="仓库地址" prop="address">
                        <el-input v-model="editForm.address" placeholder="请输入仓库地址" />
                      </el-form-item>

                      <!-- 管理员ID -->
                      <el-form-item label="管理员" prop="managerId">
                        <el-select v-model="createForm.managerId" placeholder="请选择管理员" @visible-change="getManagerList">
                          <el-option v-for="item in managerList"
                           :key="item.id" 
                           :label="item.name" 
                           :value="item.id" />
                        </el-select>
                      </el-form-item>
                      <!-- 仓库体积 -->
                      <el-form-item label="仓库体积" prop="capacity">
                        <el-input v-model.number="editForm.capacity" placeholder="请输入仓库体积" type="number">
                          <template #append> m³ </template>
                        </el-input>
                      </el-form-item>
                    </el-form>

                    <template #footer>
                      <span class="dialog-footer">
                        <el-button @click=canceledit>取消</el-button>
                        <el-button type="primary" @click="submiteditForm">确定</el-button>
                      </span>
                    </template>
                  </el-dialog>

                  <!-- 2.2.5 分页组件 -->
                  <div class="demo-pagination-block" style="margin-top: 20px; padding: 10px; background: #fff;">
                    <el-pagination
                      @current-change="handleSearch"
                      v-model:current-page="currentPage"
                      v-model:page-size="pageSize"
                      :page-sizes="[10, 20, 50, 100]"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="total"
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
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage,ElMessageBox} from 'element-plus'
import api from '@/apis/Warehouse Manager.ts'
import { Warehouse, WarehouseQueryParams, WarehouseForm } from '@/apis/Warehouse Manager.ts'
const currentPage = ref(1)
const pageSize = ref(10)
const router = useRouter()
const dialogVisible = ref(false)
const total=ref(0)
const queryParams = reactive<WarehouseQueryParams>({
  warehouseName: '',
  address: '',
  managerId: null,
  page:currentPage.value,
  pageSize:pageSize.value,
})
const rules = reactive({
  // 1. 仓库名称：必填，失去焦点时触发
  warehouseName: [
    { required: true, message: '请输入仓库名称', trigger: 'blur' }
  ],
  
  // 2. 仓库地址：必填，失去焦点时触发
  address: [
    { required: true, message: '请输入仓库地址', trigger: 'blur' }
  ],
  
  // 3. 管理员ID：必填，失去焦点时触发
  managerId: [
    { required: true, message: '请输入管理员ID', trigger: 'blur' }
  ],
  
  // 4. 仓库体积：必填，且必须是数字
  capacity: [
    { required: true, message: '请输入仓库体积', trigger: 'blur' },
    { 
      type: 'number', 
      min: 0.01, 
      message: '仓库体积必须大于 0', 
      trigger: 'blur' 
    }
  ]
})
onMounted(() => { getWarehouseList() })
// 添加表单
const createForm = reactive({
  warehouseName: '',
  address: '',
  managerId: null,
  capacity:null
})
const createFormRef = ref()
const handleCreate = () => {
  dialogVisible.value = true
}
const cancelcreate = () => {
  createForm.warehouseName = ''
  createForm.address = ''
  createForm.managerId = null
  createForm.capacity = null
  dialogVisible.value = false
}
const submitForm = async () => {
  if (!createFormRef.value) return
  await createFormRef.value.validate(async (valid:any) => {
    if (valid) {
      try {
        const res = await api.add(createForm)
        if(res.code === 1){
          ElMessage.success('仓库创建成功！')
          cancelcreate()          
        } else {
          ElMessage.error('仓库创建失败！')
        }
      } catch (error) {
        ElMessage.error('网络请求失败！')
        console.error(error)
      }
    }
    else {
      ElMessage.error('请检查表单数据！')
      return false
    }
  })
}
// 获取数据
const warehouseList = ref<Warehouse[]>([
  {
    id: 0,                    // 仓库ID
    warehouseName: '',        // 仓库名称
    address: '',              // 仓库地址
    capacity:null,              // 仓库容量 (立方米)
    usedCapacity:null,          // 已使用容量
    status: 1,                // 状态 (1: 启用, 0: 禁用)
    updateTime: '',           // 更新时间
    managerName: ''           // 管理员名称
  }
])
async function getWarehouseList() {
  try {
    const res = await api.getPage(queryParams)
    if (res.code === 1) {
      warehouseList.value = res.data.array?.map((item: any) => ({
        id: item.id || 0,
        warehouseName: item.warehouseName || '',
        address: item.address || item.address || '',
        capacity: item.capacity || null,
        usedCapacity: item.usedCapacity || null,
        status: item.status !== undefined ? item.status : 1,
        updateTime: item.updateTime || '',
        managerName: item.managerName || ''
      })) || []
      total.value = res.data.array.length || 0
    }
    else {
      ElMessage.error(res.msg)
    }
  } catch (error) {
    ElMessage.error('获取仓库列表失败')
  }
}
// 获取管理员数据
const managerList = ref([
  {
    id: null,
    name: ''
  }
])
async function getManagerList() {
  try {
    const res = await api.getManagerList()
    if (res.code === 1) {
      managerList.value = res.data.array.map((item: any) => ({
        id: item.id || null,
        name: item.name || ''
      })) || []
    }
    else {
      ElMessage.error(res.msg)
    }
  }
  catch (error) {
    ElMessage.error('获取管理员列表失败')
  }
}
// 搜索表单数据
const multipleSelection = ref<any[]>([])

function toProduct(){
  router.push({name:'product'
  })
}
function toCategroy(){
  router.push({name:'categroy'
  })
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
// 删除
const selectedRows = ref<Warehouse[]>([])
const handleSelectionChange = (val: any) => {
  selectedRows.value = val
}
const ids =selectedRows.value.map((item: any) => item.id).join(',')
async function handleBatchDelete() {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先勾选数据')
    return
  }
  await ElMessageBox.confirm(`确定删除选中的 ${selectedRows.value.length} 条数据？`, '提示', { type: 'warning' })
  const ids = selectedRows.value.map(row => row.id)

  await api.delete(String(ids))
  ElMessage.success('批量删除成功')
  getWarehouseList()
}
async function handleDelete(row: any){
 await ElMessageBox.confirm(`确定删除 "${row.warehouseName}" 吗？`, '提示', { type: 'warning' })
  try{
  const res=await api.delete(String(row.id))
  if(res.code === 1){
    ElMessage.success('删除成功！')  
    getWarehouseList()
  } else {
    ElMessage.error('删除失败！')
  }

}
catch(error:any){
  ElMessage.error(error.msg || '网络请求失败！')
}
}
// 状态开关按钮
async function toggleStatus(row: any) {
  const currentStatus = row.status
  const newStatusText = currentStatus === 1 ?  '启用': '禁用'
  try {
  const res = await api.changeStatus(currentStatus, row.id)
  if(res.code === 1){
    ElMessage.success(`仓库 "${row.warehouseName}" 状态已更新为 ${newStatusText}`)
  } else {
    ElMessage.error('状态更新失败！')
  }
}
catch(error:any){
  ElMessage.error(error.msg || '状态更新失败！')
}
}
// 编辑
const editFormRef = ref() 
const dialogVisible1 = ref(false)
const editForm = reactive<WarehouseForm>({
  id:null,
  warehouseName: '',
  address: '',
  managerId: null,
  capacity: null
})
const canceledit = () => {
  editForm.warehouseName = ''
  editForm.address = ''
  editForm.managerId = null
  editForm.capacity = null
  dialogVisible1.value = false
}
async function submiteditForm(){
  if (!editFormRef.value) return
  await editFormRef.value.validate(async (valid:any) => {
    if (valid) {
      try {
        const res = await api.edit(editForm)
        if(res.code === 1){
          ElMessage.success('仓库编辑成功！')
          canceledit()
        } else {
          ElMessage.error(res.msg || '仓库编辑失败！')
        }
      } catch (error) {
        ElMessage.error('网络请求失败！')
        console.error(error)
      }
    }
    else {
      ElMessage.error('请检查表单数据！')
      return false
    }
  })
}
async function handleEdit(row: any) {
  try {
    const res = await api.getInfo(row.id)
    dialogVisible1.value = true
    if (res.code === 1) {
      editForm.warehouseName = res.data.warehouseName
      editForm.address = res.data.address
      editForm.managerId = res.data.managerId
      editForm.capacity = res.data.capacity
    }
    else {
      ElMessage.error(res.msg || '获取仓库信息失败！')
    }
  }
  catch (error) {
    ElMessage.error('网络请求失败！')
  }
}
const handleSearch = () => {
queryParams.page = 1
queryParams.pageSize = pageSize.value
getWarehouseList()
}

// 重置
const resetForm = () => {
  queryParams.warehouseName= ''
  queryParams.address = ''
  queryParams.managerId=null
  queryParams.page = currentPage.value
  queryParams.pageSize = pageSize.value
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

/* 新增按钮样式 (沿用模板) */
.add-btn-section {
    display: flex;
    margin-bottom: 20px;
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
.demo-pagination-block {
  margin-top: 20px;
  padding: 10px;
  background: #fff;
  display: flex;
  justify-content: center;
}
.el-menu-item:hover {
  background-color: #66b1ff;}
</style>