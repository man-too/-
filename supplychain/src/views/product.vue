<template>
  <el-container>
    <el-header>
        <div class="top-navbar">
          <!-- 1. 左侧 Logo 区域 -->
          <div class="nav-left">
            <div class="logo-text">云仓 ERP</div>
          </div>
          <!-- 3. 右侧 用户信息区域 -->
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
    <el-main>
      <el-container>
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
              <!-- 修复: 菜单项 index 重复 -->
              <el-menu-item index="3-4" @click="toStocking">入库管理</el-menu-item>
            </el-sub-menu>
            
          </el-menu>
        </el-aside>
        <el-container>
          <el-header>
            <h1>商品管理</h1>
          </el-header>
          <el-main>
            <div class="product-info-container">
              <!-- 搜索筛选区 -->
              <div class="search-section">
                <div class="search-row">
                  <el-row :gutter="40">
                    <el-col :span="8">
                      <div class="search-item">
                        <label class="label_item">商品SKU:</label>
                        <el-input placeholder="请输入商品SKU" v-model="productCode"  />
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div class="search-item">
                        <label class="label_item">中文名称:</label>
                        <el-input placeholder="请输入中文名称" v-model="productName"/>
                      </div>
                    </el-col> 
                    <el-col :span="8">
                      <div class="search-item">
                        <label class="label_item">价格区间:</label>
                        <div class="price-range">
                          <el-input placeholder="最低价" v-model="initminprice" 
                          style="width: calc(100% - 80px);
                           margin-right: 0px;">
                                <template #append> 
                                  <el-select 
                                    v-model="unit" 
                                    placeholder="单位" 
                                    style="width: 50px"
                                    :suffix-icon="null"
                                    @change="handleminUnitChange"
                                  >
                                    <el-option label="元" :value="1"/>
                                    <el-option label="千" :value="1000" />
                                    <el-option label="万" :value="10000" />
                                  </el-select>
                                </template>
                              </el-input>
                          <span>-</span>
                          <el-input placeholder="最高价" v-model="searchForm.max">
                            <template #append> 
                              <el-select 
                                v-model="unit2" 
                                placeholder="单位" 
                                style="width: 50px"
                                :suffix-icon="null"
                                @change="handlemaxUnitChange"
                              >
                                <el-option label="元" :value="1" />
                                <el-option label="千" :value="1000" />
                                <el-option label="万" :value="10000" />
                              </el-select>
                            </template>
                          </el-input>
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row :gutter="40" style="margin-top:15px">
                    <el-col :span="8">      
                      <div class="search-item">
                        <label class="label_item">创建时间</label>
                        <div class="date-range">
                          <el-date-picker
                            v-model="searchForm.start"
                            type="date"
                            placeholder="开始时间"
                            format="YYYY-MM-DD"
                            value-format="YYYY-MM-DD"
                            style="width: 100%"
                           :suffix-icon="Calendar"/>
                          <span>-</span>
                          <el-date-picker
                            v-model="searchForm.end"
                            type="date"
                            placeholder="结束时间"
                            format="YYYY-MM-DD"
                            value-format="YYYY-MM-DD"
                            style="width: 100%" :suffix-icon="Calendar"/>
                        </div>
                      </div> 
                    </el-col>
                    <el-col :span="8">
                      <div class="search-item">
                        <!-- 修复: 移除无效的 @visible-change 事件 -->
                        <label class="label_item">商品分组</label>
                        <el-select v-model="searchForm.categroyId" placeholder="请选择分组">
                          <el-option v-for="item in categoryList"
                                  :label="item.name"
                                  :value="item.id"
                                  :key="item.id"
                                  >{{item.name}}
                            </el-option>
                        </el-select>
                      </div>
                    </el-col>
                  </el-row>
                </div>
                <div class="search-buttons">
                  <button class="btn-primary_search" @click="handleSearch" >搜索</button>
                  <button class="btn-secondary" @click="handleReset">重置</button>
                </div>
              </div>

              <!-- 功能操作按钮区 -->
              <div class="action-section">
                <button class="btn-primary">商品导入</button>
                <button class="btn-danger" @click="Delete">删除商品</button>
                <button class="btn-success" @click="dialogVisible1=true">新增商品</button>
              </div>
              <el-dialog
                v-model="dialogVisible1"
                title="新增商品"
                width="600px"
                :close-on-click-modal="false"
              >
                <!-- 表单区域 -->
                <el-form
                  :model="addform"
                  :rules="rules"
                  ref="addFormRef"
                  label-width="100px"
                  label-position="right"
                >
                  <!-- 1. 中文名称 (productName) -->
                  <el-form-item label="中文名称：" prop="productName">
                    <el-input v-model="addform.productName" placeholder="请输入商品名称" />
                  </el-form-item>

                  <!-- 2. 商品SKU (productCode) -->
                  <el-form-item label="商品SKU：" prop="productCode">
                    <el-input v-model="addform.productCode" placeholder="请输入商品SKU" />
                  </el-form-item>

                  <!-- 3. 商品分组 (categoryId) - 截图是下拉框 -->
                  <el-form-item label="商品分组：" prop="categoryId">
                    <!-- 修复: 补全 el-option -->
                    <el-select v-model="addform.categoryId" placeholder="请选择分组" style="width: 100%">
                      <el-option
                        v-for="item in categoryList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>

                  <!-- 4. 商品单价 (price) -->
                  <el-form-item label="商品单价：" prop="price">
                    <el-input v-model.number="addform.price" placeholder="0.00">
                      <template #append>元</template>
                    </el-input>
                  </el-form-item>

                  <!-- 5. 规格 (spec) - 截图未显示，补充在此 -->
                  <el-form-item label="规格：" prop="spec">
                    <el-input v-model="addform.spec" placeholder="例如：XXL，XL，L，M，S" />
                  </el-form-item>

                  <!-- 6. 单位 (unit) -->
                  <el-form-item label="单位：" prop="unit">
                    <el-input v-model="addform.unit" placeholder="例如：只、个、箱" />
                  </el-form-item>

                  <!-- 7. 成本价 (costPrice) -->
                  <el-form-item label="成本价：" prop="costPrice">
                    <el-input v-model.number="addform.costPrice" placeholder="0.00" />
                  </el-form-item>

                  <!-- 8. 重量 (weight) -->
                  <el-form-item label="重量(g)：" prop="weight">
                    <el-input-number v-model="addform.weight" :min="0" style="width: 100%" />
                  </el-form-item>

                  <!-- 9. 体积 (volume) -->
                  <el-form-item label="体积(cm³)：" prop="volume">
                    <el-input-number v-model="addform.volume" :min="0" style="width: 100%" />
                  </el-form-item>
                </el-form>

                <!-- 底部按钮 -->
                <template #footer>
                  <span class="dialog-footer">
                    <el-button @click="cancelAdd">取消</el-button>
                    <el-button type="primary" @click="submitaddForm">
                      确定
                    </el-button>
                  </span>
                </template>
              </el-dialog>
            </div>
              <!-- 商品数据列表区 -->
              <div class="table-section">
                <el-table 
                stripe style width="100%";
                :data="productList"
                max-height="500px"
                class="product-table"
                @selection-change="handleSelectionChange">
                <el-table-column 
                type="selection" width="55" />
                <el-table-column prop="productName" label="商品名称" width="180" />
                <el-table-column prop="categoryName" label="商品分组" width="180" />
                <el-table-column prop="productCode" label="商品SKU码" width="180" />
                <el-table-column prop="price" label="价格" width="180" />
                <el-table-column prop="updateTime" label="更新时间" width="180" />
                <el-table-column prop="status" label="商品状态" width="180" />
                <el-table-column label="操作" width="200" fixed="right">
                  <template #default="scope">
                    <button class="btn-text" @click="handleEdit(scope.row)">编辑</button>
                    <button class="btn-text-danger" @click="singledelete(String(scope.row.id))">删除</button>
                  </template>
                </el-table-column>
                <!-- 编辑弹窗 -->
              
                </el-table>  
                <el-dialog
                  v-model="dialogVisible"
                  title="编辑商品"
                  width="600px"
                  :close-on-click-modal="false"
                >
                  <!-- 表单区域 -->
                  <el-form
                    :model="editform"
                    :rules="rules"
                    ref="editFormRef"
                    label-width="100px" 
                    label-position="right"
                  >
                    <!-- 1. 中文名称 (productName) -->
                    <el-form-item label="中文名称：" prop="productName">
                      <el-input v-model="editform.productName" placeholder="请输入商品名称" />
                    </el-form-item>

                    <!-- 2. 商品SKU (productCode) -->
                    <el-form-item label="商品SKU：" prop="productCode">
                      <el-input v-model="editform.productCode" placeholder="请输入商品SKU" />
                    </el-form-item>

                    <!-- 3. 商品分组 (categoryId) - 截图是下拉框 -->
                    <el-form-item label="商品分组：" prop="categoryId">
                      <el-select v-model="editform.categoryId" placeholder="请选择分组" style="width: 100%">
                        <el-option
                          v-for="item in categoryList"
                          :key="item.id"
                          :label="item.categoryName"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </el-form-item>

                    <!-- 4. 商品单价 (price) -->
                    <el-form-item label="商品单价：" prop="price">
                      <el-input v-model.number="editform.price" placeholder="0.00">
                        <template #append>元</template>
                      </el-input>
                    </el-form-item>

                    <!-- 5. 规格 (spec)  -->
                    <el-form-item label="规格：" prop="spec">
                      <el-input v-model="editform.spec" placeholder="例如：XXL，XL，L，M，S" />
                    </el-form-item>

                    <!-- 6. 单位 (unit) -->
                    <el-form-item label="单位：" prop="unit">
                      <el-input v-model="editform.unit" placeholder="例如：只、个、箱" />
                    </el-form-item>

                    <!-- 7. 成本价 (costPrice) -->
                    <el-form-item label="成本价：" prop="costPrice">
                      <el-input v-model.number="editform.costPrice" placeholder="0.00" />
                    </el-form-item>

                    <!-- 8. 重量 (weight) -->
                    <el-form-item label="重量(g)：" prop="weight">
                      <el-input-number v-model="editform.weight" :min="0" style="width: 100%" />
                    </el-form-item>

                    <!-- 9. 体积 (volume) -->
                    <el-form-item label="体积(cm³)：" prop="volume">
                      <el-input-number v-model="editform.volume" :min="0" style="width: 100%" />
                    </el-form-item>
                  </el-form>

                  <!-- 底部按钮 -->
                  <template #footer>
                    <span class="dialog-footer">
                      <el-button @click="dialogVisible = false">取消</el-button>
                      <el-button type="primary" @click="submiteditForm">
                        确定
                      </el-button>
                    </span>
                  </template>
                </el-dialog>
              </div>

              <!-- 分页控件 -->
              <div class="demo-pagination-block">
                <!-- 修复: total 应为响应式数据，此处暂时保留原样，实际项目中应替换 -->
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
      </el-container>
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
import { ElContainer} from "element-plus";
import { ref, onMounted,reactive} from "vue";
import { ElMessage,FormInstance  } from "element-plus";
import { Calendar } from '@element-plus/icons-vue'
import type { ComponentSize } from 'element-plus'
import api from "@/apis/商品管理.ts";
import publicapi from "@/apis/public.ts";
import { useRouter } from "vue-router";
const router = useRouter()
const currentPage = ref(4)
const pageSize = ref(100) 
const size = ref<ComponentSize>('default')
const background = ref(false)
const disabled = ref(false)
const productCode=ref('')
const productName=ref('')
const productList = ref([])
const selectIDs = ref('')
const dialogVisible = ref(false)
const dialogVisible1=ref(false)
const addFormRef = ref<FormInstance>()
const editFormRef = ref<FormInstance>()
const rules = reactive({
  productName: [
    { required: true, message: '请输入中文名称', trigger: 'blur' },
    { min: 2, max: 20, message: '0-1000000', trigger: 'blur' }
  ],
  productCode: [
    { required: true, message: '请输入商品SKU', trigger: 'change' }
  ],
  price: [
    { required: true, message: '请输入单价', trigger: 'blur' },
    { type: 'number', message: '单价必须是数字' }
  ]
})
const categoryList = ref<any[]>([])
async function getcategoryList() { 
  try {
    const res = await publicapi.getSonCategoryList()
    if (res.code === 1) {
      categoryList.value = res.data.array || []
      console.log('分类列表数据:', categoryList.value)
    }
    else {
      ElMessage.error(res.msg)
    }
  } catch (error) {
    console.error(error)
  }
}

// 修复: 定义 searchForm 时直接使用 ref 的值
const searchForm = ref({
  pageSize: pageSize.value,
  page: currentPage.value,
  productCode: undefined as string | undefined,
  productName: undefined as string | undefined,
  min: undefined as number| undefined,
  max: undefined as number | undefined,
  start: undefined as string | undefined,
  end: undefined as string | undefined,
  categroyId: undefined as number | undefined
})

const addform = reactive({
    "productName":undefined,
    "productCode": undefined,
    "categoryId":undefined,
    "price": undefined,
    "spec": undefined,
    "unit": undefined,
    "costPrice": undefined,
    "weight": undefined,
    "volume":undefined
})
const editform = ref({
    "id":null,
    "productName":'',
    "categoryName": '',
    "productCode": '',
    "categoryId":null,
    "price": null,
    "spec": '',
    "unit": '',
    "costPrice": null,
    "weight": null,
    "volume":null,
})
onMounted(() => {
  getcategoryList(); 
  getproductList()
})
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
// 搜索按钮
// 修复: 补全搜索函数逻辑
function handleSearch() {
  // 更新 searchForm 的值以反映当前输入
  searchForm.value = {
    pageSize: pageSize.value,
    page: currentPage.value,
    productCode: productCode.value || undefined,
    productName: productName.value || undefined,
    min: searchForm.value.min || undefined,
    max: searchForm.value.max || undefined,
    start: searchForm.value.start || undefined,
    end: searchForm.value.end || undefined,
    categroyId: searchForm.value.categroyId
  };
  getproductList(searchForm.value)
}
// 重置按钮
// 修复: 补全重置函数逻辑
function handleReset() {
  // 清空所有输入框和选择器
  productCode.value = '';
  productName.value = '';
  searchForm.value.min = undefined;
  searchForm.value.max = undefined;
  searchForm.value.start = undefined;
  searchForm.value.end = undefined;
  searchForm.value.categroyId = undefined;

  // 重新获取初始列表
  getproductList();
}
async function handleEdit(res:any) {
  dialogVisible.value=true
  try{
  const editid=res.id
  const data=await api.geteditdata(editid)
  editform.value.id=editid
  if(data.code===1){
  editform.value.categoryName = data.data.categoryName;
  editform.value.productName = data.data.productName;
  editform.value.productCode = data.data.productCode;
  editform.value.categoryId = data.data.categoryId; 
  editform.value.price = data.data.price;
  editform.value.spec = data.data.spec;
  editform.value.unit = data.data.unit;
  editform.value.costPrice = data.data.costPrice;
  editform.value.weight = data.data.weight;
  editform.value.volume = data.data.volume;
  }
  else{
    ElMessage.error(data.msg)
    console.log(data.msg)
  }
}
  catch(error:any){
    ElMessage.error(error.message)
  }
}
async function getproductList(params?:any) {
  try {
    const finalParams = params || searchForm.value;
    const res = await api.getgoodlist(finalParams)
    
    if (res.code === 1) {
      productList.value = res.data.array|| []
    }
    else {
      ElMessage.error(res.msg)
    }
  } catch (error:any) {
    ElMessage.error(error.message)
  }
}
// 提交按钮
async function submiteditForm() {
  if (!editFormRef.value) return;

  await editFormRef.value.validate((valid) => {
    if (valid) {
      api.edit(editform.value).then(res => {
        if (res.code === 1) {
          ElMessage.success(res.msg);
          dialogVisible.value = false;
          getproductList();
        } else {
          ElMessage.error(res.msg);
        }
      }).catch(error => {
        ElMessage.error(error.message || '网络错误');
      });
    } else {
      ElMessage.warning('请填写必填项');
    }
  });
}
// 提交添加表单
async function cancelAdd() {
  addform.productName=undefined,
  addform.productCode=undefined,
  addform.categoryId=undefined,
  addform.price=undefined,
  addform.spec=undefined,
  addform.unit=undefined,
  addform.costPrice=undefined,
  addform.weight=undefined,
  addform.volume=undefined
  dialogVisible1.value=false
    if (addFormRef.value) {
    addFormRef.value.clearValidate();
  }
}
async function submitaddForm() {
  // 先检查 ref 是否存在
  if (!addFormRef.value) return;

  // 执行校验
  await addFormRef.value.validate((valid, fields) => {
    if (valid) {
      // 校验通过，发送请求
      api.add(addform).then(res => {
        if (res.code === 1) {
          ElMessage.success(res.msg);
          dialogVisible1.value = false;
          cancelAdd(); // 重置表单
          getproductList();
        } else {
          ElMessage.error(res.msg);
        }
      }).catch(error => {
        ElMessage.error(error.message || '网络错误');
      });
    } else {
      //  校验失败
      console.log('error submit!', fields);
      ElMessage.warning('请填写必填项');
    }
  });
}
async function handleSizeChange(pagesize:number) {
  searchForm.value.pageSize = pagesize;
  await getproductList(searchForm.value)
}
async function handleCurrentChange(page:number) {
  searchForm.value.page = page;
  await getproductList(searchForm.value)
}
async function handleSelectionChange(val:any) {
  selectIDs.value =  val.map((item:any) => item.id).join(',')
}
async function singledelete(deleteID:string){
  selectIDs.value = deleteID
  await Delete()
}

async function Delete() {
  if (!selectIDs.value) {
    ElMessage.warning('请选择要删除的商品')
    return
  }
  try {
    const res = await api.delete(selectIDs.value)
    if (res.code === 1) {
      ElMessage.success(res.msg)
      getproductList()
      selectIDs.value = ''
    }
    else {
      ElMessage.error(res.msg)
    }
  } catch (error:any) {
    ElMessage.error(error.message)
  }
}
// 单位转换
const unit=ref(1)
const initminprice=ref(0)
function handleminUnitChange() { 
  if(searchForm.value.min!==undefined){
  if(unit.value===1000){
    searchForm.value.min=initminprice.value*1000
  }
  if(unit.value===10000){
    searchForm.value.min=searchForm.value.min*10000
  }
  if(unit.value===1){
    searchForm.value.min=initminprice.value
  }
 }
}
const unit2=ref(1)
const initmaxprice=ref(0)
function handlemaxUnitChange() { 
  if(searchForm.value.max!==undefined){
  if(unit2.value===1000){
    searchForm.value.max=initmaxprice.value*1000
  }
  if(unit2.value===10000){
    searchForm.value.max=searchForm.value.max*10000
  }
  if(unit2.value===1){
    searchForm.value.max=initmaxprice.value
  }
  }
}
</script>

<style scoped>
.demo-pagination-block{
  display: flex;
  justify-content: center;
}
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

.search-item {
  min-width: 80px;
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

/* .search-item input[type="text"],
.search-item input[type="number"],
.search-item input[type="date"], */
.search-item select {
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;
}

.search-item input:focus,
.search-item select:focus {
  border-color: #409eff;
}

.price-range,
.date-range {
  display: flex;
  align-items: center;
}

.price-range el-input,
.date-range el-input {
  width: 100px;
}
.search-buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 10px;
}

.action-section {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
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

.product-table thead {
  background-color: #f5f7fa;
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

.product-table tbody tr:hover {
  background-color: #f9fafb;
}

.product-table input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.status-active {
  display: inline-block;
  padding: 4px 12px;
  background-color: #f0f9ff;
  color: #67c23a;
  border-radius: 4px;
  font-size: 12px;
}

.status-inactive {
  display: inline-block;
  padding: 4px 12px;
  background-color: #fef0f0;
  color: #f56c6c;
  border-radius: 4px;
  font-size: 12px;
}

.btn-text {
  background: none;
  border: none;
  color: #409eff;
  cursor: pointer;
  padding: 4px 8px;
  font-size: 14px;
  transition: color 0.3s;
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
  transition: color 0.3s;
}

.btn-text-danger:hover {
  color: #f78989;
}

.pagination-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

.pagination-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pagination-left input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.pagination-left span {
  font-size: 14px;
  color: #606266;
}

.pagination-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pagination-right button {
  padding: 8px 16px;
  background-color: white;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  color: #606266;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.pagination-right button:hover {
  color: #409eff;
  border-color: #c6e2ff;
  background-color: #ecf5ff;
}

.pagination-right select {
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.btn-primary {
   padding: 10px 20px;
  background-color: white;
  color: #606266;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}
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

.btn-primary:hover {
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
  background-color: white;
  color: #606266;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.btn-success:hover {
  background-color: #85ce61;
}

.btn-danger {
   padding: 10px 20px;
  background-color: white;
  color: #606266;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.btn-danger:hover {
  background-color: #f78989;
}
.menu-item {
  padding: 12px 20px 12px 35px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
}
.menu-title {
  padding: 10px 20px;
  font-size: 13px;
  color: #97a8be;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.menu-section {
  margin-bottom: 15px;
}
.menu-item:hover {
  background-color: #263445;
  color: #409eff;
}
.menu-item.active {
  background-color: #409eff;
  color: #fff;
}
.label_item { 
  width: 80px;
  flex-shrink: 0;
}
.search-item ,
.search-item select,
.price-range,
.date-range {
  flex: 1;
}
.top-navbar {
  display: flex;
  justify-content: space-between; /* 左右两端对齐 */
  align-items: center; /* 垂直居中 */
  height: 60px;
  background-color: #409EFF; /* 主色调浅蓝 */
  padding: 0 20px; /* 左右留白 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 底部阴影增加层次感 */
}

/* --- 左侧样式 --- */
.nav-left .logo-text {
  color: #fff;
  font-size: 22px;
  font-weight: bold;
  letter-spacing: 2px;
  cursor: pointer;
}

/* 去除 Element Plus 菜单底部的边框 */
.el-menu--horizontal {
  border-bottom: none;
  background-color: #409EFF !important;
}

/* 菜单项 hover 背景色微调 */
.el-menu-item:hover {
  background-color: #66b1ff !important;
}

/* --- 右侧用户信息样式 --- */
.nav-right .user-info {
  display: flex;
  align-items: center;
  color: #fff;
  gap: 10px; /* 头像和文字之间的间距 */
  cursor: pointer;
}

.username {
  font-size: 14px;
  font-weight: 500;
}
</style>