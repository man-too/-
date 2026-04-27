<template>
  <div class="purchase-container">
    <h1 class="title">采购订单列表</h1>
    <div class="order-list">
      <div class="order-card" v-for="order in purchaseOrders" :key="order.id">
        <div class="order-header">
          <h3>订单号：{{ order.orderNo }}</h3>
          <span :class="['status', order.status]">{{ order.statusText }}</span>
        </div>
        <p>供应商：{{ order.supplier }}</p>
        <p>产品：{{ order.product }}</p>
        <p>数量：{{ order.quantity }} {{ order.unit }}</p>
        <p>金额：¥{{ order.amount.toFixed(2) }}</p>
        <p>下单时间：{{ order.date }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const purchaseOrders = ref([
  {
    id: 1,
    orderNo: 'PO-20250321-001',
    supplier: '鑫源食品有限公司',
    product: '五常大米',
    quantity: 500,
    unit: 'kg',
    amount: 12500,
    date: '2025-03-21',
    status: 'pending',
    statusText: '待审核'
  },
  {
    id: 2,
    orderNo: 'PO-20250320-045',
    supplier: '华丰电子科技',
    product: '电容电阻包',
    quantity: 200,
    unit: '套',
    amount: 3400,
    date: '2025-03-20',
    status: 'approved',
    statusText: '已通过'
  },
  {
    id: 3,
    orderNo: 'PO-20250319-122',
    supplier: '宏达建材集团',
    product: '环保涂料',
    quantity: 100,
    unit: '桶',
    amount: 8750,
    date: '2025-03-19',
    status: 'shipped',
    statusText: '已发货'
  }
])
</script>

<style scoped>
.purchase-container {
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

.order-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 20px;
  transition: all 0.2s;
}

.order-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.order-header h3 {
  margin: 0;
  font-size: 18px;
  color: #2c3e50;
}

.status {
  font-size: 14px;
  padding: 4px 12px;
  border-radius: 20px;
  background: #f0f2f5;
  color: #5a5a5a;
}

.status.pending {
  background: #fff7e6;
  color: #d48f0b;
}

.status.approved {
  background: #e6f7e6;
  color: #2e7d32;
}

.status.shipped {
  background: #e3f2fd;
  color: #1565c0;
}

.order-card p {
  margin: 8px 0;
  color: #5a5a5a;
  line-height: 1.5;
}
</style>