<template>
  <div class="layout">
    <!-- 导航栏 -->
    <nav class="navbar">
      <div class="nav-container">
        <router-link to="/firstpage" class="nav-link" active-class="active">首页</router-link>
        <router-link :to="{path:'/supply'}" class="nav-link" active-class="active">供货</router-link>
        <router-link to="/purchase" class="nav-link" active-class="active">采购</router-link>
        <router-link to="/home" class="nav-link" active-class="active">库存</router-link>
      </div>
    </nav>

    <!-- 路由展示区 -->
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
// 无需额外逻辑
</script>

<style scoped>
.layout {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.navbar {
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 32px;
  padding: 0 24px;
}

.nav-link {
  display: inline-block;
  padding: 16px 0;
  font-size: 16px;
  font-weight: 500;
  color: #5a5a5a;
  text-decoration: none;
  transition: color 0.2s, border-bottom 0.2s;
  border-bottom: 2px solid transparent;
}

.nav-link:hover {
  color: #42b983;
}

.nav-link.active {
  color: #42b983;
  border-bottom-color: #42b983;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}
</style>