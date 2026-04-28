<template>
  <el-container>
    <!-- 1. 顶部导航栏 (已修改为与模板一致) -->
    <el-header>
      <div class="top-navbar">
        <div class="nav-left">
          <!-- Logo 文字样式已调整 -->
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
        <!-- 2.1 左侧菜单 (已修改为与模板一致) -->
        <el-aside>
          <el-menu 
            default-active="3" 
            class="el-menu-vertical-demo"
            background-color="#ffffff" 
            text-color="#606266" 
            active-text-color="#409EFF"
          >
            <el-sub-menu index="1">
              <template #title><span>商品</span></template>
              <el-menu-item index="1-1" @click="toProduct">商品信息</el-menu-item>
              <el-menu-item index="1-2" @click="toCategroy">分类管理</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="2">
              <template #title><span>订单</span></template>
              <el-menu-item index="2-1">订单信息</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="3">
              <template #title><span>仓库</span></template>
              <el-menu-item index="3-1" @click="towarehouse">库位管理</el-menu-item>
              <el-menu-item index="3-2" @click="toDetails">仓库明细</el-menu-item>
              <el-menu-item index="3-3" @click="toLocation">库位管理</el-menu-item>
              <el-menu-item index="3-4" @click="">库位管理</el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-aside>

        <!-- 2.2 右侧展示区 (保持不变) -->
        <el-main>
          <el-button type="default" @click="$router.back()" class="back-button" plain>
            返回
          </el-button>
          <el-container>
            <el-header>
              <h1 class="title">新增入库单</h1>
            </el-header>
            <el-main>
              
              <!-- 表单区域 -->
              <div class="product-info-container" style="padding: 20px;">
                <el-form :model="form" label-width="100px" style="max-width: 1200px;">
                  <!-- 第一行：仓库、类型、供应商 -->
                  <el-row :gutter="20">
                    <!-- 入库仓库名 (输入/下拉双重) -->
                    <el-col :span="8">
                      <el-form-item label="入库仓库：" prop="warehouse">
                        <el-select v-model="form.warehouse" filterable placeholder="请选择或输入仓库" style="width: 100%;" >
                          <el-option v-for="item in warehouseOptions" :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <!-- 入库类型 (下拉框) -->
                    <el-col :span="8">
                      <el-form-item label="入库类型：" prop="type">
                        <el-select v-model="form.type" placeholder="请选择类型" style="width: 100%;">
                          <el-option label="采购入库" value="purchase" />
                          <el-option label="退货入库" value="return" />
                          <el-option label="调拨入库" value="transfer" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <!-- 供应商名 (输入/下拉双重) -->
                    <el-col :span="8">
                      <el-form-item label="供应商：" prop="supplier">
                        <el-select v-model="form.supplier" filterable placeholder="请选择或输入供应商" style="width: 100%;" >
                          <el-option v-for="item in supplierOptions" :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <!-- 第二行：费用与单号 -->
                  <el-row :gutter="20">
                    <!-- 运费 -->
                    <el-col :span="6">
                      <el-form-item label="运&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;费：" prop="freight">
                        <el-input v-model.number="form.freight" type="number" placeholder="请输入运费" />
                      </el-form-item>
                    </el-col>
                    <!-- 其他费用 -->
                    <el-col :span="6">
                      <el-form-item label="其他费用：" prop="otherFee">
                        <el-input v-model.number="form.otherFee" type="number" placeholder="请输入费用" />
                      </el-form-item>
                    </el-col>
                    <!-- 来源单号 -->
                    <el-col :span="6">
                      <el-form-item label="来源单号：" prop="sourceNo">
                        <el-input v-model="form.sourceNo" placeholder="请输入来源单号" />
                      </el-form-item>
                    </el-col>
                    <!-- 入库时间 (日期) -->
                    <el-col :span="6">
                      <el-form-item label="入库时间：" prop="inTime">
                        <el-date-picker v-model="form.inTime" type="date" placeholder="选择日期" style="width: 100%;" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <!-- 第三行：备注 (整行) -->
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注：" prop="remark">
                        <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入备注信息..." style="width: 100%;" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>

                <!-- 功能按钮区 (添加产品、导入产品) -->
                <div class="action-section" style="margin: 20px 0;">
                  <el-button type="primary" class="add-btn-section" @click="handleAddProduct"> 添加产品 </el-button>
                  <el-button type="success" class="add-btn-section" @click="handleImport"> 导入产品 </el-button>
                  <!-- 右侧留空或放置保存草稿等按钮 -->
                  <div style="margin-left: auto;"></div>
                </div>

                <!-- 表格展示区 -->
                <div class="table-section">
                  <el-table :data="tableData" stripe style="width: 100%" max-height="400" border >
                    <!-- 商品编码 -->
                    <el-table-column prop="code" label="商品编码" width="160" />
                    <!-- 商品名称 -->
                    <el-table-column prop="name" label="商品名称" width="160" />
                    <!-- 应收数量 -->
                    <el-table-column prop="planQty" label="应收数量" width="160" />
                    <!-- 实收数量 -->
                    <el-table-column prop="realQty" label="实收数量" width="160" />
                    <!-- 单位存储成本 -->
                    <el-table-column prop="storageCost" label="单位存储成本" width="160" />
                    <!-- 次品率 -->
                    <el-table-column prop="defectRate" label="次品率(%)" width="160" />
                    <!-- 入库成本目标 -->
                    <el-table-column prop="targetCost" label="入库成本目标" width="160" />
                    <!-- 库位编码 -->
                    <el-table-column prop="location" label="库位编码" width="160" />
                    <!-- 操作 -->
                    <el-table-column label="操作" width="200" fixed="right">
                      <template #default="scope">
                        <el-button size="small" type="text" class="btn-text" @click="handleEdit(scope.$index)"> 编辑 </el-button>
                        <el-button size="small" type="text" class="btn-text-danger" @click="handleDelete(scope.$index)"> 删除 </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
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
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";

// --- 模拟数据与响应式变量 ---
const form = reactive({
  warehouse: '',
  type: '',
  supplier: '',
  freight: 0,
  otherFee: 0,
  sourceNo: '',
  inTime: '',
  remark: ''
})

// 下拉框选项模拟
const warehouseOptions = ref([
  { value: 'WH001', label: '合肥中心仓' },
  { value: 'WH002', label: '上海前置仓' },
  { value: 'WH003', label: '北京保税仓' }
])

const supplierOptions = ref([
  { value: 'SUP001', label: '华为技术有限公司' },
  { value: 'SUP002', label: '小米科技有限责任公司' },
  { value: 'SUP003', label: '供应商三' }
])

// 表格数据模拟
const tableData = ref([
  { code: 'P1001', name: '华为手机 Mate 60', planQty: 100, realQty: 98, storageCost: 0.5, defectRate: 2, targetCost: 5000, location: 'A-01-02' },
  { code: 'P1002', name: '小米手环 8', planQty: 500, realQty: 500, storageCost: 0.2, defectRate: 1, targetCost: 200, location: 'B-03-05' }
])

function toProduct(){ router.push({name:'product' }) }
function toCategroy(){ router.push({name:'categroy' }) }
function towarehouse() { router.push({ name: 'warehouse' }) }
function toDetails(){ router.push({name:'details'}) }
function toLocation(){ router.push({name:'location'}) }

// --- 逻辑方法 (仅模拟) ---
const handleAddProduct = () => { ElMessage.info('点击了添加产品') }
const handleImport = () => { ElMessage.info('点击了导入产品') }
const handleEdit = (index: number) => { ElMessage.success(`编辑第 ${index + 1} 行`) }
const handleDelete = (index: number) => { tableData.value.splice(index, 1); ElMessage.success('删除成功') }

// --- 路由返回逻辑 ---
const router = useRouter()
</script>

<style scoped>
/* 1. 顶部导航栏样式 (已修改为与模板一致) */、
.back-button {
  /* 直接在这里设置定位 */
  position: absolute;
  top: 100px;
  right: 50px;
  z-index: 10;

  /* 按钮内部的样式 */
  padding: 8px 16px;
  background-color: #fff;
  border-color: #dcdfe6;
  color: #606266;
}

/* 悬停效果 */
.back-button:hover {
  background-color: #f5f7fa;
  border-color: #c6e2ff;
  color: #409eff;
}
.el-header {
  padding: 0;
  height: 60px;
}
.top-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  background-color: #409EFF; /* 蓝色背景 */
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,.1);
}
.nav-left {
  display: flex;
  align-items: center;
}
.logo-text {
  font-size: 20px;
  font-weight: 600;
  color: #ffffff; /* 白色文字 */
  letter-spacing: 1px;
}
.nav-right {
  display: flex;
  align-items: center;
}
.user-info {
  display: flex;
  align-items: center;
  color: #ffffff;
}
.username {
  margin-left: 10px;
  color: #ffffff;
}

/* 2. 左侧菜单样式 (已修改为与模板一致) */
.el-aside {
  width: 200px;
  background-color: #ffffff;
  border-right: 1px solid #e6e6e6;
}
.el-menu {
  border-right: none;
  height: calc(100vh - 60px);
}
.el-sub-menu__title {
  font-size: 14px;
  font-weight: 500;
}
.el-menu-item {
  font-size: 14px;
  padding-left: 40px !important;
}

/* 3. 右侧内容区样式 (保持不变) */
.title {
  margin: 20px 0;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}
.product-info-container {
  padding: 20px;
  background-color: #f5f7fa;
  font-family: Arial, sans-serif;
}
.action-section {
  display: flex;
  gap: 10px;
  margin-top: 20px;
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
}
.add-btn-section:hover {
  color: #409eff;
  border-color: #c6e2ff;
  background-color: #ecf5ff;
}
.table-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.btn-text {
  color: #409eff;
  padding: 4px 8px;
  font-size: 14px;
}
.btn-text:hover {
  color: #66b1ff;
}
.btn-text-danger {
  color: #f56c6c;
  padding: 4px 8px;
  font-size: 14px;
}
.btn-text-danger:hover {
  color: #f78989;
}
</style>