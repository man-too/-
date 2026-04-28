<template>
  <el-container>
    <!-- 1. 顶部导航栏 -->
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

    <el-main>
      <el-container>
        <!-- 2.1 左侧菜单 -->
        <el-aside width="150px">
          <el-menu default-active="3-3" class="el-menu-vertical-demo">
            <el-sub-menu index="1">
              <template #title><span>商品</span></template>
              <el-menu-item index="1-1" @click="toProduct">商品信息</el-menu-item>
              <el-menu-item index="1-2" @click="toCategroy">分页管理</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="2">
              <template #title><span>订单</span></template>
              <el-menu-item index="2-1">订单信息</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="3">
              <template #title><span>仓库</span></template>
              <el-menu-item index="3-1" @click="towarehouse">仓库信息</el-menu-item>
              <el-menu-item index="3-2" @click="toDetails">仓库明细</el-menu-item>
              <el-menu-item index="3-3" @click="toLocation">库位信息</el-menu-item>
              <el-menu-item index="3-4" @click="toStocking">入库管理</el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-aside>

        <!-- 2.2 右侧展示区 -->
        <el-main>
          <el-container>
            <el-header>
              <h1 class="title">库位管理</h1>
            </el-header>

            <el-main>
              <div class="product-info-container">
                
                <!-- 顶部：仓库筛选区 (支持远程搜索) -->
                <div class="warehouse-filter">
                  <label class="label_item">切换仓库：</label>
                  <el-select 
                    v-model="queryParams.warehouseId" 
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请输入仓库名称搜索"
                    :remote-method="remoteSearchWarehouse"
                    :loading="warehouseLoading"
                    style="width: 240px;"
                    @change="handleWarehouseChange"
                  >
                    <el-option
                      v-for="item in warehouseOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </div>

                <!-- 中部：库位筛选区 -->
                <div class="search-section">
                  <div class="search-row">
                    <el-row :gutter="20" style="align-items: center;">
                      <el-col :span="6">
                        <div class="search-item">
                          <label class="label_item">库位编码：</label>
                          <el-input v-model="queryParams.code" placeholder="请输入库位编码" clearable />
                        </div>
                      </el-col>
                      
                      <el-col :span="6">
                        <div class="search-item">
                          <label class="label_item">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;类型：</label>
                          <el-select v-model="queryParams.type" placeholder="全部类型" clearable style="width: 100%">
                            <el-option label="普通区" value="1" />
                            <el-option label="冷冻区" value="2" />
                            <el-option label="贵重品区" value="3" />
                          </el-select>
                        </div>
                      </el-col>
                      
                      <el-col :span="6">
                        <div class="search-item">
                          <label class="label_item">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;状态：</label>
                          <el-select v-model="queryParams.status" placeholder="全部" clearable style="width: 100%">
                            <el-option label="启用" :value="1" />
                            <el-option label="禁用" :value="0" />
                          </el-select>
                        </div>
                      </el-col>

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
                  <el-button 
                    type="danger" 
                    @click="handleBatchDelete"
                    :disabled="multipleSelection.length === 0"
                    class="add-btn-section"
                  >
                    批量删除
                  </el-button>
                  
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
                    <el-table-column type="selection" width="55" align="center" />
                    <el-table-column prop="code" label="库位编码" min-width="140" />
                    <el-table-column prop="totalCapacity" label="总容量" min-width="100" />
                    <el-table-column prop="usedCapacity" label="已使用" min-width="100" />
                    <el-table-column prop="status" label="状态" min-width="100">
                      <template #default="scope">
                        <el-tag :type="scope.row.status === 1 ? 'success' : 'info'">
                          {{ scope.row.status === 1 ? '启用' : '禁用' }}
                        </el-tag>
                      </template>
                    </el-table-column>
                    
                    <el-table-column label="操作" width="200" align="center" fixed="right">
                      <template #default="scope">
                        <el-button type="text" class="btn-text" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button type="text" class="btn-text-danger" @click="handleDelete(scope.row)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>

                <!-- 新增表单弹窗 -->
                <el-dialog
                  v-model="dialogVisible"
                  title="新增库位"
                  width="500px"
                  @close="cancelCreate"
                >
                  <el-form
                    ref="createFormRef"
                    :model="createForm"
                    :rules="rules"
                    label-width="100px"
                    style="padding-right: 20px;"
                  >
                    <!-- ✅ 新增表单也使用远程搜索 -->
                    <el-form-item label="所属仓库" prop="warehouseId">
                      <el-select
                        v-model="createForm.warehouseId"
                        placeholder="请输入仓库名称搜索"
                        style="width: 100%;"
                        filterable
                        remote
                        reserve-keyword
                        :remote-method="remoteSearchWarehouse"
                        :loading="warehouseLoading"
                      >
                        <el-option
                          v-for="item in warehouseOptions"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        />
                      </el-select>
                    </el-form-item>

                    <el-form-item label="库位编码" prop="locationCode">
                      <el-input v-model="createForm.locationCode" placeholder="请输入库位编码" />
                    </el-form-item>

                    <el-form-item label="库位容量" prop="capacity">
                      <el-input-number
                        v-model="createForm.capacity"
                        :min="0.01"
                        :precision="2"
                        style="width: 100%"
                        placeholder="请输入库位容量"
                      />
                    </el-form-item>
                  </el-form>

                  <template #footer>
                    <div class="dialog-footer">
                      <el-button @click="cancelCreate">取 消</el-button>
                      <el-button type="primary" @click="submitCreateForm">确 定</el-button>
                    </div>
                  </template>
                </el-dialog>

                <!-- 编辑库位弹窗 -->
                <el-dialog
                  v-model="dialogVisible1"
                  title="编辑库位"
                  width="500px"
                  @close="cancelEdit"
                >
                  <el-form
                    ref="editFormRef"
                    :model="editForm"
                    :rules="rules"
                    label-width="100px"
                    style="padding-right: 20px;"
                  >
                    <el-form-item label="库位编码" prop="locationCode">
                      <el-input 
                        v-model="editForm.locationCode" 
                        placeholder="请输入库位编码" 
                        disabled
                      />
                    </el-form-item>

                    <el-form-item label="库位容量" prop="capacity">
                      <el-input-number
                        v-model="editForm.capacity"
                        :min="0.01"
                        :precision="2"
                        style="width: 100%"
                        placeholder="请输入库位容量"
                      />
                    </el-form-item>
                  </el-form>

                  <template #footer>
                    <div class="dialog-footer">
                      <el-button @click="cancelEdit">取 消</el-button>
                      <el-button type="primary" @click="submitEditForm">确 定</el-button>
                    </div>
                  </template>
                </el-dialog>

                <!-- 分页 -->
                <div class="demo-pagination-block" style="margin-top: 20px; padding: 10px; background: #fff;">
                  <el-pagination
                    v-model:current-page="currentPage"
                    v-model:page-size="pageSize"
                    :page-sizes="[10, 20, 50, 100]"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
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
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/apis/StorageLocation'
import publicapi from '@/apis/public'
import { ElMessage, ElMessageBox, FormInstance } from 'element-plus'

const router = useRouter()

// --- 状态定义 ---
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const tableData = ref<any[]>([])
const multipleSelection = ref<any[]>([])

// --- 仓库远程搜索相关状态 ---
const warehouseOptions = ref<Array<{ id: number; name: string }>>([]);
const warehouseLoading = ref(false)

// 查询参数
const queryParams = reactive({
  page: 1,
  pageSize: 10,
  warehouseId: null as number | null,
  code: '',
  type: '',
  status: null as number | null,
})

// --- 弹窗相关 ---
const dialogVisible = ref(false)
const dialogVisible1 = ref(false)
const createFormRef = ref<FormInstance>()
const editFormRef = ref<FormInstance>()

const createForm = reactive({
  warehouseId: null as number | null,
  locationCode: '',
  capacity: null as number | null
})

const editForm = reactive({
  id: null as number | null,
  locationCode: '',
  capacity: null as number | null
})

const rules = reactive({
  warehouseId: [{ required: true, message: '请选择所属仓库', trigger: 'change' }],
  locationCode: [{ required: true, message: '请输入库位编码', trigger: 'blur' }],
  capacity: [
    { required: true, message: '请输入库位容量', trigger: 'blur' },
    { type: 'number', min: 0.01, message: '库位容量必须大于 0', trigger: 'blur' }
  ]
})

// --- ✅ 核心逻辑：远程搜索仓库方法 ---
const remoteSearchWarehouse = async (query: string) => {
  if (query !== '') {
    warehouseLoading.value = true
    try {
      const res = await publicapi.getwarehousename(query);
      
      if (res.code === 1 && res.data) {
        warehouseOptions.value = res.data.array.map((item: any) => ({
          id: item.id,
          name: item.warehouseName
        }));
      } else {
        warehouseOptions.value = []
      }
    } catch (error) {
      console.error(error)
      warehouseOptions.value = []
    } finally {
      warehouseLoading.value = false
    }
  } else {
    // 如果输入为空，可以选择不显示，或者显示最近使用的/默认的
    warehouseOptions.value = []
  }
}

// 获取表格数据
const fetchData = async () => {
  try {
    const finalParams = {
      page: queryParams.page,
      pageSize: queryParams.pageSize,
      warehouseId: queryParams.warehouseId || 0,
      code: queryParams.code,
      type: queryParams.type,
      status: queryParams.status
    };
    
    const res = await api.getPage(finalParams)
    if (res.code === 1 && res.data) {
      tableData.value = res.data.array || []
      total.value = res.data.total || 0
    }
  } catch (error) {
    ElMessage.error('数据加载失败')
    tableData.value = []
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  queryParams.page = 1
  fetchData()
}

// 重置
const resetForm = () => {
  queryParams.warehouseId = null;
  queryParams.code = '';
  queryParams.type = '';
  queryParams.status = null;
  handleSearch()
}

const handleWarehouseChange = () => {
  currentPage.value = 1;
  queryParams.page = 1;
  fetchData();
}

const handleSelectionChange = (val: any[]) => {
  multipleSelection.value = val
}

const handleDelete = (row: any) => {
  const code = row.code || row.locationCode;
  ElMessageBox.confirm(`确定删除库位 "${code}" 吗？`, '提示', { type: 'warning' })
    .then(async () => {
      await api.delete(row.id.toString())
      ElMessage.success('删除成功')
      fetchData()
    })
    .catch(() => {})
}

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

const initCreateForm = () => {
  createForm.warehouseId = queryParams.warehouseId || null;
  createForm.locationCode = '';
  createForm.capacity = null;
  
  // 如果当前有选中的仓库ID，且不在选项中，可能需要单独处理显示名称
  // 这里简化处理：打开弹窗时，如果已有ID，尝试重新搜索一下以显示名称
  if (createForm.warehouseId) {
     // 可选：这里可以调用一次 remoteSearchWarehouse 确保名字显示正确
  }
  
  nextTick(() => {
    createFormRef.value?.clearValidate();
  });
};

const handleAdd = () => {
  dialogVisible.value = true;
  initCreateForm();
};

const cancelCreate = () => {
  dialogVisible.value = false;
};

const submitCreateForm = async () => {
  if (!createFormRef.value) return
  await createFormRef.value.validate(async (valid) => {
    if (valid) {
      if (!createForm.warehouseId) {
         ElMessage.warning('请选择有效的仓库');
         return;
      }
      try {
        const res = await api.add(createForm)
        if (res.code === 1) {
          ElMessage.success('库位创建成功！')
          cancelCreate()
          fetchData()
        } else {
          ElMessage.error(res.msg || '库位创建失败！')
        }
      } catch (error) {
        ElMessage.error('网络请求失败！')
      }
    }
  })
}

const handleEdit = async (row: any) => {
  try {
    const res = await api.getInfo(row.id)
    if (res.code === 1) {
      dialogVisible1.value = true
      editForm.id = row.id
      editForm.locationCode = res.data.code || res.data.locationCode;
      editForm.capacity = res.data.totalCapacity || res.data.capacity;
      
      nextTick(() => {
        editFormRef.value?.clearValidate()
      })
    } else {
      ElMessage.error(res.msg || '获取库位信息失败！')
    }
  } catch (error) {
    ElMessage.error('网络请求失败！')
  }
}

const cancelEdit = () => {
  dialogVisible1.value = false
}

const submitEditForm = async () => {
  if (!editFormRef.value) return
  await editFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const payload = {
          id: editForm.id,
          locationCode: editForm.locationCode,
          capacity: editForm.capacity
        };
        const res = await api.edit(payload)
        if (res.code === 1) {
          ElMessage.success('库位编辑成功！')
          cancelEdit()
          fetchData()
        } else {
          ElMessage.error(res.msg || '库位编辑失败！')
        }
      } catch (error) {
        ElMessage.error('网络请求失败！')
      }
    }
  })
}

const handleSizeChange = (val: number) => {
  queryParams.pageSize = val
  fetchData()
}
const handleCurrentChange = (val: number) => {
  queryParams.page = val
  fetchData()
}

const toProduct = () => router.push({ name: 'product' })
const toCategroy = () => router.push({ name: 'categroy' })
const towarehouse = () => router.push({ name: 'warehouse' })
const toDetails = () => router.push({ name: 'details' })
const toLocation = () => router.push({ name: 'location' })
const toStocking = () => router.push({ name: 'stocking' })

onMounted(() => {
  // 初始加载时，可以不加载任何仓库，或者加载热门仓库
  // 这里留空，等用户输入时再触发 remoteSearchWarehouse
  fetchData()
})
</script>

<style scoped>
/* 样式保持不变 */
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
.warehouse-filter {
  display: flex;
  align-items: center;
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-top: -20px;
}
.el-menu-item:hover {
  background-color: #66b1ff;
}
</style>