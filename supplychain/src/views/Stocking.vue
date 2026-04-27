<template>
  <el-container>
    <!-- 1. 顶部导航栏 (复刻模板) -->
    <el-header>
      <div class="top-navbar">
        <div class="nav-left">
          <div class="logo-text">云仓 ERP</div>
        </div>
        <div class="nav-right">
          <div class="user-info">
            <el-avatar :size="32" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
            <span class="username">admin</span>
          </div>
        </div>
      </div>
    </el-header>

    <el-main>
      <el-container>
        <!-- 2. 左侧菜单 (复刻模板) -->
        <el-aside width="150px">
          <el-menu
            default-active="2"   
            class="el-menu-vertical-demo"
          >
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

        <el-main>
        <!-- 3. 右侧内容区 -->
          <el-container>
            <el-header>
              <h1 class="title">入库管理</h1>
            </el-header>
            <el-main>
              <!-- 搜索筛选区 -->
              <div class="search-section">
                <div class="search-row">
                  <el-row :gutter="40" margin-top="15px">
                    <!-- 第一行：入库类型、状态、入库单号、仓库名 -->
                    <el-col :span="6">
                      <div class="search-item">
                        <label class="label_item">入库类型:</label>
                        <el-select v-model="searchForm.type" placeholder="请选择" style="width: 100%">
                          <el-option label="采购入库" value="1"></el-option>
                          <el-option label="退货入库" value="2"></el-option>
                          <el-option label="调拨入库" value="3"></el-option>
                        </el-select>
                      </div>
                    </el-col>
                    <el-col :span="6">
                      <div class="search-item">
                        <label class="label_item">状态:</label>
                        <el-select v-model="searchForm.status" placeholder="请选择" style="width: 100%">
                          <el-option label="草稿" value="1"></el-option>
                          <el-option label="已提交" value="2"></el-option>
                          <el-option label="已完成" value="3"></el-option>
                        </el-select>
                      </div>
                    </el-col>
                    <el-col :span="6">
                      <div class="search-item">
                        <label class="label_item">入库单号:</label>
                        <el-input v-model="searchForm.inNo" placeholder="请输入单号"></el-input>
                      </div>
                    </el-col>
                    <el-col :span="6">
                      <div class="search-item">
                        <label class="label_item">仓库名:</label>
                        <el-input v-model="searchForm.warehouse" placeholder="请输入仓库"></el-input>
                      </div>
                    </el-col>
                  </el-row>
                </div>

                <div class="search-row" style="margin-top:20px">
                  <el-row :gutter="40">
                    <!-- 第二行：供应商名、来源单据号、制单时间、入库时间 -->
                    <el-col :span="6">
                      <div class="search-item">
                        <label class="label_item">供应商:</label>
                        <el-input v-model="searchForm.supplier" placeholder="请输入供应商"></el-input>
                      </div>
                    </el-col>
                    <el-col :span="6">
                      <div class="search-item">
                        <label class="label_item">来源单据:</label>
                        <el-input v-model="searchForm.source" placeholder="请输入来源"></el-input>
                      </div>
                    </el-col>
                    <el-col :span="6">
                      <div class="search-item">
                        <label class="label_item">制单时间:</label>
                        <el-date-picker
                          v-model="searchForm.createTime"
                          type="date"
                          placeholder="选择日期"
                          style="width: 100%"
                        />
                      </div>
                    </el-col>
                    <el-col :span="6">
                      <div class="search-item">
                        <label class="label_item">入库时间:</label>
                        <el-date-picker
                          v-model="searchForm.inTime"
                          type="date"
                          placeholder="选择日期"
                          style="width: 100%"
                        />
                      </div>
                    </el-col>
                  </el-row>
                </div>

                <div class="search-buttons">
                  <button class="btn-primary_search" @click="handleSearch">搜索</button>
                  <button class="btn-secondary" @click="handleReset">重置</button>
                </div>
              </div>

              <!-- 功能操作按钮区 (样式与模板新增商品一致) -->
              <div class="action-section">
                <button class="add-btn-section" @click="handleExport">导出 Excel</button>
                <button class="add-btn-section" @click="handleAdd">添加入库单</button>
                <button class="add-btn-section" @click="handleDelete">批量删除</button>
                <button class="add-btn-section" @click="handleSubmit">提交</button>
                <button class="add-btn-section" @click="handleInStock">入库</button>
              </div>

              <!-- 表格展示区 -->
              <div class="table-section">
                <el-table
                  stripe
                  style="width: 100%"
                  :data="tableData"
                  max-height="500px"
                  class="product-table"
                >
                  <!-- 展开行：商品明细 -->
                  <el-table-column type="expand">
                    <template #default="props">
                      <el-table
                        :data="props.row.items"
                        :show-header="false"
                        style="width: 100%"
                      >
                        <el-table-column label="商品编码" prop="productCode" width="120"></el-table-column>
                        <el-table-column label="商品名称" prop="productName" width="150"></el-table-column>
                        <el-table-column label="应收数量" prop="planQty" width="100"></el-table-column>
                        <el-table-column label="实收数量" prop="realQty" width="100"></el-table-column>
                        <el-table-column label="单位入库费用" prop="fee" width="120"></el-table-column>
                        <el-table-column label="目标" prop="target" width="100"></el-table-column>
                        <el-table-column label="库位编码" prop="location" width="120"></el-table-column>
                      </el-table>
                    </template>
                  </el-table-column>

                  <!-- 主表列 -->
                  <el-table-column prop="inNo" label="入库单号" width="180" />
                  <el-table-column prop="type" label="入库类型" width="180" />
                  <el-table-column prop="createTime" label="制单时间" width="180" />
                  <el-table-column prop="warehouse" label="仓库名" width="180" />
                  <el-table-column prop="planTotal" label="应收数量" width="180" />
                  <el-table-column prop="realTotal" label="实收数量" width="180" />
                  <el-table-column prop="creator" label="制单人" width="180" />
                  <el-table-column prop="auditor" label="审核人" width="180" />
                  <el-table-column prop="remark" label="备注" width="180" show-overflow-tooltip />
                  <el-table-column prop="status" label="状态" width="180">
                    <template #default="scope">
                      <el-tag :type="scope.row.status === '已完成' ? 'success' : scope.row.status === '已提交' ? 'warning' : 'info'">
                        {{ scope.row.status }}
                      </el-tag>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div class="demo-pagination-block">
                <el-pagination
                  v-model:current-page="currentPage"
                  v-model:page-size="pageSize"
                  :page-sizes="[10, 20, 50,100]"
                  :size="size"
                  :disabled="disabled"
                  :background="background"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="400"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                />
              </div>
            </el-main>
          </el-container>
        </el-main>
      </el-container>
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import type { ComponentSize } from 'element-plus'
const currentPage = ref(1)
const pageSize = ref(10)
const disabled = ref(false)
const background = ref(false)
const size = ref<ComponentSize>('default')
const router = useRouter();
// 搜索表单数据
const searchForm = reactive({
  type: '',
  status: '',
  inNo: '',
  warehouse: '',
  supplier: '',
  source: '',
  createTime: '',
  inTime: ''
});

// 表格模拟数据
const tableData = ref([
  {
    inNo: 'IN20231001001',
    type: '采购入库',
    createTime: '2023-10-01 09:15:22',
    warehouse: '合肥中心仓',
    planTotal: 500,
    realTotal: 498,
    creator: '张三',
    auditor: '李四',
    remark: '首批货物验收',
    status: '已完成',
    items: [
      { productCode: 'P001', productName: 'iPhone 15', planQty: 200, realQty: 199, fee: 0.5, target: 'A区', location: 'A-01-01' },
      { productCode: 'P002', productName: 'MacBook Pro', planQty: 100, realQty: 100, fee: 1.0, target: 'A区', location: 'A-01-02' },
      { productCode: 'P003', productName: 'AirPods', planQty: 200, realQty: 199, fee: 0.3, target: 'B区', location: 'B-02-01' }
    ]
  },
  {
    inNo: 'IN20231002002',
    type: '退货入库',
    createTime: '2023-10-02 14:30:45',
    warehouse: '上海前置仓',
    planTotal: 100,
    realTotal: 100,
    creator: '王五',
    auditor: '赵六',
    remark: '客户退货',
    status: '已提交',
    items: [
      { productCode: 'P004', productName: 'iPad', planQty: 50, realQty: 50, fee: 0.4, target: 'C区', location: 'C-01-01' },
      { productCode: 'P005', productName: 'Watch', planQty: 50, realQty: 50, fee: 0.2, target: 'C区', location: 'C-01-02' }
    ]
  }
]);
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
// 空函数占位 (模拟交互)
const handleSearch = () => {};
const handleReset = () => {};
const handleExport = () => {};
function handleAdd(){
  router.push({name:'addstocking'})
};
const handleDelete = () => {};
const handleSubmit = () => {};
const handleInStock = () => {};
</script>

<style scoped>
/* 1. 顶部导航栏样式 (复刻模板) */
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
}
.nav-right .user-info {
  display: flex;
  align-items: center;
  color: #fff;
  gap: 10px;
}
.username {
  font-size: 14px;
  font-weight: 500;
}

/* 2. 左侧菜单样式 (复刻模板) */
.el-aside {
  background-color: #ffffff;
  border-right: 1px solid #e6e6e6;
}
.el-menu {
  border-right: none;
  height: calc(100vh - 60px);
  background-color: #ffffff !important;
}
.el-sub-menu__title {
  font-size: 14px;
  font-weight: 500;
}
.el-menu-item {
  font-size: 14px;
  padding-left: 40px !important;
}

/* 3. 页面通用样式 (复刻模板) */
.el-container {
  background-color: #f5f7fa;
}
.el-header {
  padding: 0;
  height: 60px;
  background-color: #ffffff;
}
.el-main {
  padding: 20px;
}
h1 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}

/* 4. 搜索筛选区样式 (复刻模板) */
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
  width: 90px;
  flex-shrink: 0;
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}
.search-item .el-input,
.search-item .el-select {
  flex: 1;
}
.search-buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}

/* 5. 功能按钮区样式 (复刻模板) */
.action-section {
  display: flex;
  gap: 10px;
  margin-bottom: 20px; /* 底端边距20px */
}

/* 6. 表格样式 (复刻模板) */
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
  background-color: #f5f7fa;
}

/* 7. 按钮样式 (复刻模板) */
.btn-primary_search {
  padding: 10px 20px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}
.btn-primary_search:hover {
  background-color: #66b1ff;
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
.btn-success {
  padding: 10px 20px;
  background-color: #67c23a;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}
.btn-success:hover {
  background-color: #85ce61;
}
.btn-primary {
  padding: 10px 20px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}
.btn-primary:hover {
  background-color: #66b1ff;
}
.btn-danger {
  padding: 10px 20px;
  background-color: #f56c6c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}
.btn-danger:hover {
  background-color: #f78989;
}
.btn-warning {
  padding: 10px 20px;
  background-color: #e6a23c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}
.btn-warning:hover {
  background-color: #ebb563;
}
.btn-info {
  padding: 10px 20px;
  background-color: #909399;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}
.btn-info:hover {
  background-color: #a6a9ad;
}
.title {
  display: flex;
  font-size: 33px;
  margin-bottom: 100px;
}
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
  background-color: #66b1ff;
}
</style>