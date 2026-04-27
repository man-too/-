<template>
  <div class="inventory-container">
    <h1 class="title">库存列表</h1>
    <div class="inventory-grid">
      <div class="inventory-card" v-for="item in inventoryList" :key="item.id">
        <div class="card-header">
          <h3>{{ item.name }}</h3>
          <span :class="['stock-badge', item.stock <= item.warning ? 'warning' : '']">
            库存：{{ item.stock }} {{ item.unit }}
          </span>
        </div>
        <p class="sku">SKU：{{ item.sku }}</p>
        <p>单价：¥{{ item.price }}</p>
        <p>位置：{{ item.location }}</p>
        <p v-if="item.stock <= item.warning" class="warning-text">
          ⚠️ 低于安全库存（{{ item.warning }}{{ item.unit }}），请及时补货
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const inventoryList = ref([
  {
    id: 1,
    name: '五常大米',
    sku: 'FOOD-001',
    stock: 320,
    unit: 'kg',
    price: 25,
    location: 'A区-01货架',
    warning: 200
  },
  {
    id: 2,
    name: '电容电阻包',
    sku: 'ELEC-045',
    stock: 85,
    unit: '套',
    price: 17,
    location: 'B区-03货架',
    warning: 100
  },
  {
    id: 3,
    name: '环保涂料',
    sku: 'MAT-022',
    stock: 45,
    unit: '桶',
    price: 87.5,
    location: 'C区-02货架',
    warning: 50
  },
  {
    id: 4,
    name: '办公椅',
    sku: 'FUR-011',
    stock: 12,
    unit: '把',
    price: 299,
    location: 'D区-01货架',
    warning: 15
  }
])
</script>

<style scoped>
.inventory-container {
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

.inventory-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.inventory-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 20px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.inventory-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 12px;
}

.card-header h3 {
  margin: 0;
  font-size: 20px;
  color: #42b983;
}

.stock-badge {
  font-size: 14px;
  padding: 4px 10px;
  border-radius: 20px;
  background: #e8f5e9;
  color: #2e7d32;
}

.stock-badge.warning {
  background: #ffebee;
  color: #c62828;
}

.sku {
  font-size: 12px;
  color: #888;
  margin-bottom: 8px;
}

.inventory-card p {
  margin: 8px 0;
  color: #5a5a5a;
}

.warning-text {
  margin-top: 12px;
  color: #c62828;
  font-size: 13px;
  background: #ffebee;
  padding: 6px 10px;
  border-radius: 6px;
}
</style>