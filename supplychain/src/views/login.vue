<template>
  <div class="login-container">
    <el-card class="login-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>用户登录</span>
        </div>
      </template>
      
      <el-form label-position="top" size="large">
        <el-form-item label="账号">
          <el-input
            v-model="zhanghao"
            placeholder="请输入账号"
            clearable
          />
        </el-form-item>
        
        <el-form-item label="密码">
          <el-input
            v-model="mima"
            type="password"
            placeholder="请输入密码"
            show-password
            clearable
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" style="width: 100%" size="large" :loading="loading" @click="handleLogin">
            登 录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import {ElMessage }from 'element-plus'
import { useRouter } from 'vue-router'
import login from '@/apis/登录页面'
const loading = ref(false)
const zhanghao = ref('')
const mima = ref('')
const router=useRouter()
async function handleLogin() {
  loading.value = true
  const form = await login({
    username: zhanghao.value,
    password: mima.value
  })
 try{
  if(form.code==200){
    ElMessage.success('登录成功')
    localStorage.setItem('token',form.data.token)
    localStorage.setItem('username',form.data.username)
    localStorage.setItem('userid',form.data.userid)
    router.push('/')
  }else{
    ElMessage.error(form.msg)
  }
 }catch(error:any){ 
  ElMessage.error(error.message)
 }``
}

</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.login-card {
  width: 400px;
}

.card-header {
  text-align: center;
  font-size: 18px;
  font-weight: 600;
}
</style>