<template>
  <div class="supply-container">
    <h1 class="title">供货商列表</h1>
    <div class="card-list">
      <div class="card" v-for="supplier in suppliers" :key="supplier.id">
        <h3>{{ supplier.name }}</h3>
        <p>联系人：{{ supplier.contact }}</p>
        <p>电话：{{ supplier.phone }}</p>
        <p>地址：{{ supplier.address }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive} from 'vue'

// 模拟供货商数据
const suppliers =reactive ([
  {
    id: 1,
    name: '鑫源食品有限公司',
    contact: '张经理',
    phone: '13800000001',
    address: '北京市朝阳区XX路18号'
  },
  {
    id: 2,
    name: '华丰电子科技',
    contact: '李经理',
    phone: '13800000002',
    address: '上海市浦东新区XX园区'
  },
  {
    id: 3,
    name: '宏达建材集团',
    contact: '王经理',
    phone: '13800000003',
    address: '广州市天河区XX路22号' 
  }
])
</script>

<style scoped>
.supply-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #2c3e50;
  border-left: 4px solid #42b983;
  padding-left: 16px;
}

.card-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 20px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.card h3 {
  margin: 0 0 12px 0;
  font-size: 20px;
  color: #42b983;
  font-weight: 600;
}

.card p {
  margin: 8px 0;
  color: #5a5a5a;
  line-height: 1.5;
}
</style>