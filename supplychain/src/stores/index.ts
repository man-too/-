import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

export const useProductStore = defineStore('product', () => {
  const router = useRouter()
  // 表单验证规则
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
  
  // 搜索表单
  const searchForm = ref({
    pageSize: 100,
    page: 4,
    productCode: undefined as string | undefined,
    productName: undefined as string | undefined,
    min: undefined as number | undefined,
    max: undefined as number | undefined,
    start: undefined as string | undefined,
    end: undefined as string | undefined,
    categroyId: undefined as number | undefined
  })
  
  // 新增表单
  const addform = reactive({
    productName: undefined as string | undefined,
    productCode: undefined as string | undefined,
    categoryId: undefined as number | undefined,
    price: undefined as number | undefined,
    spec: undefined as string | undefined,
    unit: undefined as string | undefined,
    costPrice: undefined as number | undefined,
    weight: undefined as number | undefined,
    volume: undefined as number | undefined
  })
  
  // 编辑表单
  const editform = reactive({
    productName: undefined as string | undefined,
    productCode: undefined as string | undefined,
    categoryId: undefined as number | undefined,
    price: undefined as number | undefined,
    spec: undefined as string | undefined,
    unit: undefined as string | undefined,
    costPrice: undefined as number | undefined,
    weight: undefined as number | undefined,
    volume: undefined as number | undefined,
    id: undefined as number | undefined
  })
  
  // 路由跳转
  function toProduct() {
    router.push({ name: 'product' })
  }
  
  function toCategroy() {
    router.push({ name: 'categroy' })
  }
  
  // 搜索按钮
  async function handleSearch() {
    await getproductList(searchForm.value)
  }
  
  // 重置按钮
  function handleReset() {
    searchForm.value = {
      pageSize: pageSize.value,
      page: currentPage.value,
      productCode: productCode.value || undefined,
      productName: productName.value || undefined,
      min: undefined,
      max: undefined,
      start: undefined,
      end: undefined,
      categroyId: undefined
    }
    getproductList()
  }
  
  // 编辑按钮
  function handleEdit(res: any) {
    Object.assign(editform, res)
    dialogVisible.value = true
  }
  
  // 获取商品列表
  async function getproductList(params?: pagequery) {
    try {
      const requestParams = params || searchForm.value
      const res = await api.getgoodlist(requestParams)
      
      if (res.code === 1) {
        productList.value = res.data.array || []
      } else {
        ElMessage.error(res.msg)
      }
    } catch (error: any) {
      ElMessage.error(error.message)
    }
  }
  
  // 提交编辑表单
  async function submiteditForm() {
    try {
      const res = await api.edit(editform)
      if (res.code === 1) {
        ElMessage.success(res.msg)
        dialogVisible.value = false
        getproductList()
      } else {
        ElMessage.error(res.msg)
      }
    } catch (error: any) {
      ElMessage.error(error.message)
    }
  }
  
  // 提交添加表单
  async function submitaddForm() {
    try {
      const res = await api.add(addform)
      if (res.code === 1) {
        ElMessage.success(res.msg)
        dialogVisible1.value = false
        getproductList()
      } else {
        ElMessage.error(res.msg)
      }
    } catch (error: any) {
      ElMessage.error(error.message)
    }
  }
  
  // 分页大小改变
  async function handleSizeChange(pagesize: number) {
    searchForm.value.pageSize = pagesize
    await getproductList(searchForm.value)
  }
  
  // 页码改变
  async function handleCurrentChange(page: number) {
    searchForm.value.page = page
    await getproductList(searchForm.value)
  }
  
  // 选择改变
  function handleSelectionChange(val: any) {
    selectIDs.value = val.map((item: any) => item.id).join(',')
  }
  
  // 单个删除
  async function singledelete(deleteID: string) {
    selectIDs.value = deleteID
    await Delete()
  }
  
  // 删除商品
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
      } else {
        ElMessage.error(res.msg)
      }
    } catch (error: any) {
      ElMessage.error(error.message)
    }
  }
  
  // 重置新增表单
  function resetAddForm() {
    Object.assign(addform, {
      productName: undefined,
      productCode: undefined,
      categoryId: undefined,
      price: undefined,
      spec: undefined,
      unit: undefined,
      costPrice: undefined,
      weight: undefined,
      volume: undefined
    })
  }
  
  // 重置编辑表单
  function resetEditForm() {
    Object.assign(editform, {
      productName: undefined,
      productCode: undefined,
      categoryId: undefined,
      price: undefined,
      spec: undefined,
      unit: undefined,
      costPrice: undefined,
      weight: undefined,
      volume: undefined,
      id: undefined
    })
  }
  
  return {
    // 状态
    currentPage,
    pageSize,
    productCode,
    productName,
    selectedProductIds,
    productList,
    selectIDs,
    dialogVisible,
    dialogVisible1,
    rules,
    searchForm,
    addform,
    editform,
    
    // 方法
    toProduct,
    toCategroy,
    handleSearch,
    handleReset,
    handleEdit,
    getproductList,
    submiteditForm,
    submitaddForm,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange,
    singledelete,
    Delete,
    resetAddForm,
    resetEditForm
  }
})